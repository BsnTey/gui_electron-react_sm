import { IpcMain } from 'electron';
import {
  getProxy,
  updateAllProxies,
  updateInputAccounts,
  getCartAccounts,
} from '../database/queries/cartQueries';
import fs from 'fs';

export const databaseModule = (ipcMain: IpcMain) => {
  ipcMain.handle('get-proxys', async (_event) => {
    getProxy();
  });

  ipcMain.handle('get-cart-accounts', async (_event) => {
    return getCartAccounts();
  });

  ipcMain.handle('update-proxy', async (_event, path) => {
    try {
      const fileContent = fs.readFileSync(path, 'utf-8');
      await updateAllProxies(fileContent);
      return true;
    } catch (error) {
      console.error('Error while updating proxies:', error);
      throw error;
    }
  });
  ipcMain.handle('update-input-accounts', async (_event, accounts) => {
    try {
      const resp = await updateInputAccounts(accounts);
      return resp;
    } catch (error) {
      console.error('Error while updating accounts:', error);
      throw error;
    }
  });
};
