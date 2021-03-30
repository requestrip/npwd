import { getEmailByIdentifier, getIdentifierByEmail, getPlayer, getSource } from './../functions';
import {
  EmailEvents,
  EmailMessageInput,
  GlobalEmailEvents,
  SendEmailToIdentifierInput,
} from '../../../typings/email';
import { mainLogger } from './../sv_logger';
import { fetchInbox, fetchMessageActions, sendEmail } from './sv_email';
import {
  mapUnformattedEmailExternalActions,
  mapUnformattedEmailMessages,
  mapUnformattedEmailPhoneActions,
} from './sv_email_mappers';

const emailLogger = mainLogger.child({ module: 'email' });

onNet(EmailEvents.FETCH_INBOX, async () => {
  const _source = getSource();
  try {
    const player = getPlayer(_source);
    if (!player) {
      throw new Error('Couldnt find player');
    }
    const playerEmail = player.getEmail();
    const messages = await fetchInbox(player.identifier);
    const inbox = mapUnformattedEmailMessages(messages, playerEmail);
    emitNet(EmailEvents.FETCH_INBOX_SUCCESS, _source, inbox);
  } catch (e) {
    emailLogger.error(`Failed to fetch email inbox, ${e.message}`, {
      source: _source,
    });
    emitNet(EmailEvents.SEND_EMAIL_ERROR, _source, 'APPS_EMAIL_FETCH_INBOX_ERROR');
  }
});

const onSendEmail = async ({
  email_id,
  subject,
  parent_id,
  body,
  receivers,
  phoneActions,
  externalActions,
}: EmailMessageInput) => {
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

    const parsedReceivers = receivers.split(',').map((email: string) => email.trim().toLowerCase());

    const mappedReceivers = await Promise.all(
      parsedReceivers.map(async (email: string) => {
        const identifier = await getIdentifierByEmail(email, true);
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
};

onNet(EmailEvents.FETCH_MESSAGE_ACTIONS, async ({ messageId }: { messageId: number }) => {
  const _source = getSource();
  try {
    const actions = await fetchMessageActions(messageId);
    const phoneActions = mapUnformattedEmailPhoneActions(actions.phoneActions);
    const externalActions = mapUnformattedEmailExternalActions(actions.externalActions);
    emitNet(EmailEvents.FETCH_MESSAGE_ACTIONS_SUCCESS, { phoneActions, externalActions });
  } catch (e) {
    emailLogger.error(`Failed to fetch email message actions, ${e.message}`, {
      source: _source,
    });
    emitNet(EmailEvents.FETCH_MESSAGE_ACTIONS_ERROR, _source, 'GENERIC_UNEXPECTED_ERROR');
  }
});

onNet(EmailEvents.SEND_EMAIL, onSendEmail);

onNet(
  GlobalEmailEvents.SEND_EMAIL_TO_IDENTIFIER,
  async ({
    identifier,
    provider,
    subject = '',
    body = '',
    externalActions = [],
    phoneActions = [],
  }: SendEmailToIdentifierInput) => {
    if (!provider || !identifier) {
      throw new Error('Tried to send npwd:sendEmailToIdentifier with missing parameters!');
    }
    let receivers = '';
    try {
      receivers = await getEmailByIdentifier(identifier, true);
    } catch (e) {
      throw new Error("Tried to send npwd:sendEmailToIdentifier but identifier doesn't exist!");
    }
    onSendEmail({ subject, body, receivers, externalActions, phoneActions });
  },
);
