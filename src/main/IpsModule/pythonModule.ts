import { IpcMain } from 'electron';
import { spawn } from 'child_process';
import { ConfigOrder } from 'main/preload';
const pythonScriptPath = 'C:\\Users\\kiril\\Desktop\\SM\\Auto_Cart\\main.py';
const pythonExe =
  'C:\\Users\\kiril\\Desktop\\SM\\Auto_Cart\\venv\\Scripts\\python.exe';

// Запуск скрипта Python
const runPythonScript = (config: ConfigOrder) => {
  return new Promise((resolve, reject) => {
    const configString = JSON.stringify(config);
    const pythonProcess = spawn(pythonExe, [pythonScriptPath, configString]);

    let output: string[];

    pythonProcess.stdout.on('data', (data) => {
      //   let dataLines = data.toString().split('\r\n');
      output = data.toString();

      // console.log(dataLines);
      // const parsedData = JSON.parse(dataLines);
      //   console.log(parsedData);
      // output = dataLines.slice(1, dataLines.length - 1);
    });

    pythonProcess.stderr.on('data', (data) => {
      let errorMessage = data.toString();
      console.log('errorMessage', errorMessage);
      errorMessage = new Error(errorMessage);
      reject(errorMessage);
    });

    pythonProcess.on('close', (code) => {
      if (code === 0) {
        resolve(output);
      }
    });
  });
};

export const pythonModule = (ipcMain: IpcMain) => {
  ipcMain.handle('run-python-script', async (_event, config) => {
    try {
      const response = await runPythonScript(config);
      return response;
    } catch (error) {
      if (error instanceof Error) {
        throw error.message;
      } else {
        throw error;
      }
    }
  });
};
