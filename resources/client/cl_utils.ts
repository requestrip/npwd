import { uuidv4 } from '../utils/fivem';
import { sendMessage } from '../utils/messages';

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

  registerNuiCallback<D = unknown>(event: string, cb: (error: any, result?: D) => void): boolean {
    if (this._callbacks.has(event)) {
      cb(new Error(`Nui Server Callback with name "${event}" is already waiting for server!`));
      return false;
    }
    this._callbacks.set(event, {
      cb,
      timeout: setTimeout(() => {
        if (this._callbacks.has(event)) {
          this._callbacks
            .get(event)
            .cb(new Error(`Nui Server Callback with name "${event}" timed out`));
          this._callbacks.delete(event);
        }
      }, this._settings.promiseTimeout),
    });
    return true;
  }

  registerNuiCallbackSuccess<R = unknown>(event: string, response?: R) {
    if (this._callbacks.has(event)) {
      const callback = this._callbacks.get(event);
      clearTimeout(callback.timeout);
      callback.cb(null, response);
      this._callbacks.delete(event);
      return true;
    }
    return false;
  }

  registerNuiCallbackError(event: string, error?: any) {
    if (this._callbacks.has(event)) {
      const callback = this._callbacks.get(event);
      clearTimeout(callback.timeout);
      callback.cb(error);
      this._callbacks.delete(event);
      return true;
    }
    return false;
  }
}

export const NuiCallback = (event: string, callback: Function) => {
  RegisterRawNuiCallback(event, (data: any) => {
    const parsed = JSON.parse(data?.body);
    callback(parsed);
  });
};
