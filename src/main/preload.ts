import {
  contextBridge,
  ipcRenderer,
  ipcMain,
  IpcRendererEvent,
} from 'electron';

export type Channels =
  | 'open-file'
  | 'delete-file'
  | 'run-python-script-output'
  | 'run-python-script'
  | 'get-proxys'
  | 'update-progress'
  | 'update-input-accounts'
  | 'get-cart-accounts'
  | 'update-proxy';

export type ConfigOrder = {
  countWorks: number;
  countThreads: number;
  useProxy: boolean;
};

const electronHandler = {
  ipcRenderer: {
    actionFile(channel: Channels, path: string) {
      ipcRenderer.send(channel, path);
    },
    on(channel: Channels, func: (...args: unknown[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
        func(...args);
      ipcRenderer.on(channel, subscription);

      return () => {
        ipcRenderer.removeListener(channel, subscription);
      };
    },
    sendCommandRun(channel: Channels, config: ConfigOrder) {
      return ipcRenderer
        .invoke(channel, config)
        .then((response) => {
          return response;
        })
        .catch((error) => {
          throw error;
        });
    },
    invokePost(channel: Channels, payload: string) {
      return ipcRenderer
        .invoke(channel, payload)
        .then(() => {
          return true;
        })
        .catch((error) => {
          throw error;
        });
    },
    invokeGet(channel: Channels) {
      return ipcRenderer
        .invoke(channel)
        .then((response) => {
          return response;
        })
        .catch((error) => {
          throw error;
        });
    },
    sendMessage(channel: Channels, callback: (...args: unknown[]) => void) {
      ipcRenderer.on(
        channel,
        (_event: IpcRendererEvent, ...args: unknown[]) => {
          callback(...args);
        }
      );
    },
    removeListener(channel: Channels, callback: (...args: unknown[]) => void) {
      ipcRenderer.removeListener(channel, callback);
    },
  },
};

contextBridge.exposeInMainWorld('electron', electronHandler);

export type ElectronHandler = typeof electronHandler;
