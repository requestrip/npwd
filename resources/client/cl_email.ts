import { ClUtils } from './client';
import events from '../utils/events';
import { uuidv4 } from 'fivem-js';
import { sendEmailEvent } from '../utils/messages';
import apps from '../utils/apps';

// ClUtils.registerNuiServerCallback(apps.EMAIL, events.EMAIL_FETCH_INBOX);

/* RegisterNuiCallbackType(events.EMAIL_FETCH_INBOX);
on(`__cfx_nui:${events.EMAIL_FETCH_INBOX}`, (data: any, cb: any) => {
  console.log('wtf', data);
  cb([]);
});
 */

interface ICallback {
  cb: (err: any, data?: unknown) => void;
  timeout: NodeJS.Timeout;
}

const event = events.EMAIL_FETCH_INBOX;
const _callbacks = new Map<string, ICallback>();

const uid = uuidv4();
const callbackId = `${event}:${uid}`;

RegisterNuiCallbackType(event);
on(`__cfx_nui:${event}`, (data: any, cb: (err: any, data?: any) => void) => {
  if (_callbacks.has(callbackId)) {
    cb(new Error(`Nui Server Callback with name "${event}" is already waiting for server!`));
    return;
  }
  emitNet(event, data);

  _callbacks.set(callbackId, {
    cb,
    timeout: setTimeout(() => {
      if (_callbacks.has(callbackId)) {
        _callbacks
          .get(callbackId)
          .cb(new Error(`Nui Server Callback with name "${event}" timed out`));
        _callbacks.delete(callbackId);
      }
    }, 20000),
  });
});

onNet(`${event}Success`, (response: any) => {
  if (_callbacks.has(callbackId)) {
    const callback = _callbacks.get(callbackId);
    clearTimeout(callback.timeout);
    callback.cb(null, response);
    _callbacks.delete(callbackId);
    sendEmailEvent(`${event}Success`, response);
  }
});

onNet(`${event}Error`, (err: any) => {
  if (_callbacks.has(callbackId)) {
    const callback = _callbacks.get(callbackId);
    clearTimeout(callback.timeout);
    callback.cb(err);
    _callbacks.delete(callbackId);
    sendEmailEvent(`${event}Error`, err);
  }
});
