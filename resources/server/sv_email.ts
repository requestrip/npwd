import { EmailEvents, EmailMessageInput, IEmail, IEmailMessage } from '../../typings/email';
import { mainLogger } from './sv_logger';
import { getIdentifierByEmail, getPlayer, getSource } from './functions';
import { pool } from './db';

const emailLogger = mainLogger.child({ module: 'email' });

export interface UnformattedEmailMessage {
  message_id: number;
  parent_id?: number | null;
  email_id: number;
  read_at: number | null;
  subject: string;
  sender: string;
  sender_identifier: string;
  receiver: string;
  receiver_identifier: string;
  send_date: number;
  body: string;
}

/***
 * 
SELECT 
      npwd_emails_external_actions.label as action_ext_label,
      npwd_emails_external_actions.close_phone as action_ext_close_phone,
      npwd_emails_external_actions.delete_email as action_ext_delete_email,
      npwd_emails_external_actions.event_name as action_ext_event_name,
      npwd_emails_external_actions.event_arg as action_ext_event_arg,
FROM npwd_emails_external_actions;

SELECT
      npwd_emails_phone_actions.label as action_phone_label,
      npwd_emails_phone_actions.close_phone as action_phone_close_phone,
      npwd_emails_phone_actions.delete_email as action_phone_delete_email,
      npwd_emails_phone_actions.href as action_phone_href
FROM npwd_emails_phone_actions;
 */

async function fetchInbox(identifier: string): Promise<UnformattedEmailMessage[]> {
  const query = `
    SELECT
      npwd_emails_messages.parent_id,
      npwd_emails_messages.email_id,
      npwd_emails_messages.sender,
      npwd_emails_messages.sender_identifier,
      npwd_emails_messages.send_date,
      npwd_emails_messages.body,
      npwd_emails_receivers.message_id,
      npwd_emails_receivers.receiver,
      npwd_emails_receivers.receiver_identifier,
      npwd_emails_receivers.read_at,
      subject
    FROM (
      SELECT id, subject FROM npwd_emails
    ) as e
    LEFT OUTER JOIN npwd_emails_messages ON npwd_emails_messages.email_id = e.id
    LEFT OUTER JOIN npwd_emails_receivers ON npwd_emails_receivers.message_id = npwd_emails_messages.id
    WHERE npwd_emails_receivers.receiver_identifier = ? OR npwd_emails_messages.sender_identifier = ?
    ORDER BY npwd_emails_messages.send_date DESC
  `;

  const result = await pool.query(query, [identifier, identifier]);

  return result[0] as UnformattedEmailMessage[];
}

function formatMessage(message: UnformattedEmailMessage, myEmail: string): IEmailMessage {
  return {
    body: message.body,
    emailId: message.email_id,
    id: message.message_id,
    receivers: [message.receiver],
    sendDate: message.send_date,
    sender: message.sender,
    isMine: message.sender === myEmail,
    isRead: message.receiver === myEmail ? !!message.read_at : null,
  };
}

function getEmailsFromMessages(messages: UnformattedEmailMessage[], myEmail: string): IEmail[] {
  const map = messages.reduce((emails, message) => {
    if (emails.has(message.email_id)) {
      const email = emails.get(message.email_id);
      if (email.messagesMap.has(message.message_id)) {
        const currentMessage = email.messagesMap.get(message.message_id);
        if (message.receiver === myEmail && !currentMessage.isRead) {
          currentMessage.isRead === !!message.read_at;
        }
        email.messagesMap.set(message.message_id, {
          ...currentMessage,
          receivers: [...currentMessage.receivers, message.receiver_identifier],
        });
      } else {
        email.messagesMap.set(message.message_id, formatMessage(message, myEmail));
      }
      emails.set(message.email_id, {
        ...email,
        messages: Array.from(email.messagesMap.values()),
      });
      return emails;
    }
    const messagesMap = new Map<number, IEmailMessage>();
    messagesMap.set(message.message_id, formatMessage(message, myEmail));
    emails.set(message.email_id, {
      id: message.email_id,
      messagesMap,
      messages: Array.from(messagesMap.values()),
      subject: message.subject,
    });
    return emails;
  }, new Map<number, IEmail & { messagesMap: Map<number, IEmailMessage> }>());

  return Array.from(map.values()).map((m) => ({ ...m, messagesMap: undefined }));
}

async function sendEmail(
  sender_identifier: string,
  sender: string,
  receivers: { email: string; identifier: string }[],
  body: string,
  email_id_or_subject: number | string,
  parent_id?: number,
) {
  let email_id = typeof email_id_or_subject === 'number' ? email_id_or_subject : undefined;
  if (typeof email_id_or_subject === 'string') {
    const emailQuery = `INSERT INTO npwd_emails (subject) VALUES (?)`;
    const [emailResult] = await pool.query(emailQuery, [email_id_or_subject]);
    email_id = (emailResult as any).insertId;
  }
  const messageQuery = `INSERT INTO npwd_emails_messages (email_id, parent_id, send_date, body, sender, sender_identifier) VALUES (?, ?, ?, ?, ?, ?)`;
  const [messageResult] = await pool.query(messageQuery, [
    email_id,
    parent_id || null,
    Math.floor(Date.now() / 1000),
    body,
    sender,
    sender_identifier,
  ]);

  const message_id = (messageResult as any).insertId;

  const receiverQuery = `INSERT INTO npwd_emails_receivers (message_id, receiver, receiver_identifier, read_at) VALUES (?, ?, ?, ?)`;
  const receiverPromises = receivers.map((r) =>
    pool.query(receiverQuery, [message_id, r.email, r.identifier, null]),
  );

  await Promise.all(receiverPromises);

  return messageResult;
}

onNet(EmailEvents.FETCH_INBOX, async () => {
  const _source = getSource();
  try {
    const player = getPlayer(_source);
    if (!player) {
      throw new Error('Couldnt find player');
    }
    const playerEmail = player.getEmail();
    const messages = await fetchInbox(player.identifier);
    const inbox = getEmailsFromMessages(messages, playerEmail);
    emitNet(EmailEvents.FETCH_INBOX_SUCCESS, _source, inbox);
  } catch (e) {
    emailLogger.error(`Failed to fetch email inbox, ${e.message}`, {
      source: _source,
    });
    emitNet(EmailEvents.SEND_EMAIL_ERROR, _source, 'APPS_EMAIL_FETCH_INBOX_ERROR');
  }
});

onNet(
  EmailEvents.SEND_EMAIL,
  async ({ email_id, subject, parent_id, body, receivers }: EmailMessageInput) => {
    const _source = getSource();

    if (!body || !receivers) {
      emitNet(EmailEvents.SEND_EMAIL_ERROR, _source, 'APPS_EMAIL_SEND_EMAIL_BAD_INPUT');
      return;
    }

    try {
      const player = getPlayer(_source);
      if (!player) {
        throw new Error('Couldnt find player');
      }

      const parsedReceivers = receivers
        .split(',')
        .map((email: string) => email.trim().toLowerCase());

      const mappedReceivers = await Promise.all(
        parsedReceivers.map(async (email: string) => {
          const identifier = await getIdentifierByEmail(email);
          return { email, identifier };
        }),
      );

      const email = await sendEmail(
        player.identifier,
        player.getEmail(),
        mappedReceivers.filter((r) => !!r.identifier),
        body,
        email_id || subject,
        parent_id || null,
      );

      const failedReceivers = mappedReceivers.filter((r) => !r.identifier);

      if (failedReceivers.length) {
        failedReceivers.map((r) =>
          emailLogger.debug(`Email receiver not found in DB: "${r.email}"`, {
            source: _source,
          }),
        );

        if (failedReceivers.length === mappedReceivers.length) {
          emitNet(EmailEvents.SEND_EMAIL_ERROR, _source, 'APPS_EMAIL_SEND_EMAIL_ERROR_NOT_FOUND');
          return;
        }
      }

      emitNet(EmailEvents.SEND_EMAIL_SUCCESS, _source, email);
    } catch (e) {
      emailLogger.error(`Failed to send email, ${e.message}`, {
        source: _source,
      });
      emitNet(EmailEvents.SEND_EMAIL_ERROR, _source, 'GENERIC_UNEXPECTED_ERROR');
    }
  },
);
