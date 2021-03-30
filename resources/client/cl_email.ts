import { uuidv4 } from 'fivem-js';
import { sendEmailEvent } from '../utils/messages';
import { EmailEvents, EmailMessageInput, IEmailMessage } from '../../typings/email';
import { ClUtils } from './client';

/**
 * Fetch Inbox
 */
RegisterNuiCallbackType(EmailEvents.FETCH_INBOX);
on(`__cfx_nui:${EmailEvents.FETCH_INBOX}`, (data: any, cb: (err: any, data?: any) => void) => {
  if (ClUtils.registerNuiCallback(EmailEvents.FETCH_INBOX, cb)) {
    emitNet(EmailEvents.FETCH_INBOX, data);
  }
});

onNet(EmailEvents.FETCH_INBOX_SUCCESS, (response: any) => {
  if (ClUtils.registerNuiCallbackSuccess(EmailEvents.FETCH_INBOX, response)) {
    sendEmailEvent(EmailEvents.FETCH_INBOX_SUCCESS, response);
  }
});

onNet(EmailEvents.FETCH_INBOX_ERROR, (err: any) => {
  if (ClUtils.registerNuiCallbackError(EmailEvents.FETCH_INBOX, err)) {
    sendEmailEvent(EmailEvents.FETCH_INBOX_ERROR, err);
  }
});

/**
 * Send Email
 */
RegisterNuiCallbackType(EmailEvents.SEND_EMAIL);
on(
  `__cfx_nui:${EmailEvents.SEND_EMAIL}`,
  (data: EmailMessageInput, cb: (err: any, data?: IEmailMessage) => void) => {
    if (ClUtils.registerNuiCallback(EmailEvents.SEND_EMAIL, cb)) {
      emitNet(EmailEvents.SEND_EMAIL, data);
    }
  },
);

onNet(EmailEvents.SEND_EMAIL_SUCCESS, (response: any) => {
  if (ClUtils.registerNuiCallbackSuccess(EmailEvents.SEND_EMAIL, response)) {
    sendEmailEvent(EmailEvents.SEND_EMAIL_SUCCESS, response);
  }
});

onNet(EmailEvents.SEND_EMAIL_ERROR, (err: any) => {
  if (ClUtils.registerNuiCallbackError(EmailEvents.SEND_EMAIL, err)) {
    sendEmailEvent(EmailEvents.SEND_EMAIL_ERROR, err);
  }
});

/**
 * Fetch Email Message Actions
 */
RegisterNuiCallbackType(EmailEvents.FETCH_MESSAGE_ACTIONS);
on(
  `__cfx_nui:${EmailEvents.FETCH_MESSAGE_ACTIONS}`,
  (data: EmailMessageInput, cb: (err: any, data?: IEmailMessage) => void) => {
    if (ClUtils.registerNuiCallback(EmailEvents.FETCH_MESSAGE_ACTIONS, cb)) {
      emitNet(EmailEvents.FETCH_MESSAGE_ACTIONS, data);
    }
  },
);

onNet(EmailEvents.FETCH_MESSAGE_ACTIONS_SUCCESS, (response: any) => {
  if (ClUtils.registerNuiCallbackSuccess(EmailEvents.FETCH_MESSAGE_ACTIONS, response)) {
    sendEmailEvent(EmailEvents.FETCH_MESSAGE_ACTIONS_SUCCESS, response);
  }
});

onNet(EmailEvents.FETCH_MESSAGE_ACTIONS_ERROR, (err: any) => {
  if (ClUtils.registerNuiCallbackError(EmailEvents.FETCH_MESSAGE_ACTIONS, err)) {
    sendEmailEvent(EmailEvents.FETCH_MESSAGE_ACTIONS_ERROR, err);
  }
});
