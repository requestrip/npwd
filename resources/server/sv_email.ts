import events from '../utils/events';
import { mainLogger } from './sv_logger';
import { getSource } from './functions';
import { IEmail, IEmailMessage } from '../../phone/src/common/typings/email';
import { pool } from './db';

const emailLogger = mainLogger.child({ module: 'contact' });

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

async function fetchInbox(identifier: string): Promise<UnformattedEmailMessage[]> {
  const query = `
    SELECT
      npwd_emails.subject,
      npwd_emails_messages.parent_id,
      npwd_emails_messages.email_id,
      npwd_emails_messages.sender,
      npwd_emails_messages.sender_identifier,
      npwd_emails_messages.send_date,
      npwd_emails_messages.body,
      npwd_emails_receivers.id,
      npwd_emails_receivers.receiver,
      npwd_emails_receivers.receiver_identifier
    FROM (
      SELECT id, read_at, message_id FROM npwd_emails_receivers WHERE npwd_emails_receivers.receiver_identifier = ?
    ) as er
    LEFT OUTER JOIN npwd_emails_messages ON npwd_emails_messages.id = er.message_id
    LEFT OUTER JOIN npwd_emails_receivers ON npwd_emails_receivers.message_id = npwd_emails_messages.id
    LEFT OUTER JOIN npwd_emails ON npwd_emails.id = npwd_emails_messages.email_id
    ORDER BY npwd_emails_messages.send_date DESC
  `;

  const result = await pool.query(query, [identifier]);

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
    isRead: !!message.read_at,
  };
}

function getEmailsFromMessages(messages: UnformattedEmailMessage[], myEmail: string): IEmail[] {
  const map = messages.reduce((emails, message) => {
    if (emails.has(message.email_id)) {
      const email = emails.get(message.email_id);
      if (email.messagesMap.has(message.message_id)) {
        const currentMessage = email.messagesMap.get(message.message_id);
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

onNet(events.EMAIL_FETCH_INBOX, async () => {
  const _source = getSource();
  try {
    const email = 'kidz@projecterror.dev';
    const messages = await fetchInbox(email);
    const inbox = getEmailsFromMessages(messages, email);
    emitNet(events.EMAIL_FETCH_INBOX_SUCCESS, inbox);
  } catch (e) {
    emailLogger.error(`Failed to fetch email inbox, ${e.message}`, {
      source: _source,
    });
    emitNet(events.EMAIL_FETCH_INBOX_ERROR, e);
  }
});
