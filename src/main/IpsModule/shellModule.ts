import { shell, IpcMain } from 'electron';
import fs from 'fs';

export const shellModule = (ipcMain: IpcMain) => {
  ipcMain.on('open-file', async (_event, path) => {
    try {
      await shell.openPath(path);
    } catch (err) {
      console.error(`Ошибка открытия файла: ${err}`);
    }
  });
  ipcMain.on('delete-file', async (_event, path) => {
    fs.unlink(path, (err) => {
      if (err) {
        console.error(`Ошибка удаления файла: ${err}`);
      }
    });
    console.log('Файл успешно удален');
  });
};
