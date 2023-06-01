import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

export type Channels =
  | 'open-file'
  | 'delete-file'
  | 'run-python-script-output'
  | 'run-python-script';

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
  },
};

contextBridge.exposeInMainWorld('electron', electronHandler);

export type ElectronHandler = typeof electronHandler;
