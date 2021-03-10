import { uuidv4 } from '../utils/fivem';

interface ISettings {
  promiseTimeout: number;
}

interface ISettingsParams {
  promiseTimeout?: number;
}

interface ICallback {
  cb: (err: any, data?: unknown) => void;
  timeout: NodeJS.Timeout;
}

export default class ClientUtils {
  private readonly _callbacks = new Map<string, ICallback>();

  private _settings: ISettings;
  private _defaultSettings: ISettings = {
    promiseTimeout: 5000,
  };

  constructor(settings?: ISettingsParams) {
    this.setSettings(settings);
  }

  public setSettings(settings: ISettingsParams) {
    this._settings = {
      ...this._defaultSettings,
      ...settings,
    };
  }

  public emitNetPromise<T = any>(eventName: string, ...args: any[]): Promise<T> {
    return new Promise((resolve, reject) => {
      let hasTimedOut = false;

      setTimeout(() => {
        hasTimedOut = true;
        reject(`${eventName} has timed out after ${this._settings.promiseTimeout} ms`);
      }, this._settings.promiseTimeout);

      // Have to use this as the regular uuid refused to work here for some
      // fun reason
      const uniqId = uuidv4();

      const listenEventName = `${eventName}:${uniqId}`;

      emitNet(eventName, listenEventName, ...args);

      const handleListenEvent = (data: T, err: unknown) => {
        removeEventListener(listenEventName, handleListenEvent);
        if (hasTimedOut) return;
        if (err) reject(err);
        resolve(data);
      };
      onNet(listenEventName, handleListenEvent);
    });
  }

  public registerNuiServerCallback<I = any, R = any>(event: string) {
    RegisterNuiCallbackType(event);

    const uid = uuidv4();
    const callbackId = `${event}:${uid}`;

    on(`__cfx_nui:${event}`, (data: I, cb: (err: any, data?: R) => void) => {
      if (this._callbacks.has(callbackId)) {
        cb(new Error(`Nui Server Callback with name "${event}" is already waiting for server!`));
        return;
      }
      emitNet(event, data);

      this._callbacks.set(callbackId, {
        cb,
        timeout: setTimeout(() => {
          if (this._callbacks.has(callbackId)) {
            this._callbacks
              .get(callbackId)
              .cb(
                new Error(
                  `Nui Server Callback with name "${event}" timed out after ${this._settings.promiseTimeout}ms`,
                ),
              );
            this._callbacks.delete(callbackId);
          }
        }, this._settings.promiseTimeout),
      });
    });

    onNet(`${event}Success`, (response: R) => {
      if (this._callbacks.has(callbackId)) {
        const callback = this._callbacks.get(callbackId);
        clearTimeout(callback.timeout);
        callback.cb(null, response);
        this._callbacks.delete(callbackId);
      }
    });

    onNet(`${event}Error`, (err: any) => {
      if (this._callbacks.has(callbackId)) {
        const callback = this._callbacks.get(callbackId);
        clearTimeout(callback.timeout);
        callback.cb(err);
        this._callbacks.delete(callbackId);
      }
    });
  }
}

export const NuiCallback = (event: string, callback: Function) => {
  RegisterRawNuiCallback(event, (data: any) => {
    const parsed = JSON.parse(data?.body);
    callback(parsed);
  });
};
