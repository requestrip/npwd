import { uuidv4 } from 'fivem-js';
import { sendEmailEvent } from '../utils/messages';
import { EmailEvents, EmailMessageInput, IEmailMessage } from '../../typings/email';

interface ICallback {
  cb: (err: any, data?: unknown) => void;
  timeout: NodeJS.Timeout;
}

const _timeout = 10000;
const _callbacks = new Map<string, ICallback>();

/**
 * Fetch Inbox
 */
RegisterNuiCallbackType(EmailEvents.FETCH_INBOX);
on(`__cfx_nui:${EmailEvents.FETCH_INBOX}`, (data: any, cb: (err: any, data?: any) => void) => {
  if (_callbacks.has(EmailEvents.FETCH_INBOX)) {
    cb(
      new Error(
        `Nui Server Callback with name "${EmailEvents.FETCH_INBOX}" is already waiting for server!`,
      ),
    );
    return;
  }
  emitNet(EmailEvents.FETCH_INBOX, data);

  _callbacks.set(EmailEvents.FETCH_INBOX, {
    cb,
    timeout: setTimeout(() => {
      if (_callbacks.has(EmailEvents.FETCH_INBOX)) {
        _callbacks
          .get(EmailEvents.FETCH_INBOX)
          .cb(new Error(`Nui Server Callback with name "${EmailEvents.FETCH_INBOX}" timed out`));
        _callbacks.delete(EmailEvents.FETCH_INBOX);
      }
    }, _timeout),
  });
});

onNet(EmailEvents.FETCH_INBOX_SUCCESS, (response: any) => {
  if (_callbacks.has(EmailEvents.FETCH_INBOX)) {
    const callback = _callbacks.get(EmailEvents.FETCH_INBOX);
    clearTimeout(callback.timeout);
    callback.cb(null, response);
    _callbacks.delete(EmailEvents.FETCH_INBOX);
    sendEmailEvent(EmailEvents.FETCH_INBOX_SUCCESS, response);
  }
});

onNet(EmailEvents.FETCH_INBOX_ERROR, (err: any) => {
  if (_callbacks.has(EmailEvents.FETCH_INBOX)) {
    const callback = _callbacks.get(EmailEvents.FETCH_INBOX);
    clearTimeout(callback.timeout);
    callback.cb(err);
    _callbacks.delete(EmailEvents.FETCH_INBOX);
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
    if (_callbacks.has(EmailEvents.SEND_EMAIL)) {
      cb(
        new Error(
          `Nui Server Callback with name "${EmailEvents.SEND_EMAIL}" is already waiting for server!`,
        ),
      );
      return;
    }
    emitNet(EmailEvents.SEND_EMAIL, data);

    _callbacks.set(EmailEvents.SEND_EMAIL, {
      cb,
      timeout: setTimeout(() => {
        if (_callbacks.has(EmailEvents.SEND_EMAIL)) {
          _callbacks
            .get(EmailEvents.SEND_EMAIL)
            .cb(new Error(`Nui Server Callback with name "${EmailEvents.SEND_EMAIL}" timed out`));
          _callbacks.delete(EmailEvents.SEND_EMAIL);
        }
      }, _timeout),
    });
  },
);

onNet(EmailEvents.SEND_EMAIL_SUCCESS, (response: any) => {
  if (_callbacks.has(EmailEvents.SEND_EMAIL)) {
    const callback = _callbacks.get(EmailEvents.SEND_EMAIL);
    clearTimeout(callback.timeout);
    callback.cb(null, response);
    _callbacks.delete(EmailEvents.SEND_EMAIL);
    sendEmailEvent(EmailEvents.SEND_EMAIL_SUCCESS, response);
  }
});

onNet(EmailEvents.SEND_EMAIL_ERROR, (err: any) => {
  if (_callbacks.has(EmailEvents.SEND_EMAIL)) {
    const callback = _callbacks.get(EmailEvents.SEND_EMAIL);
    clearTimeout(callback.timeout);
    callback.cb(err);
    _callbacks.delete(EmailEvents.SEND_EMAIL);
    sendEmailEvent(EmailEvents.SEND_EMAIL_ERROR, err);
  }
});
