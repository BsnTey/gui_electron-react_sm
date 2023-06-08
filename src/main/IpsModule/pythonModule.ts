import { IpcMain } from 'electron';
import { spawn } from 'child_process';
import { getRandomProxy } from '../database/queries/cartQueries';

const pythonScriptPath = 'C:\\Users\\kiril\\Desktop\\SM\\Auto_Cart\\main.py';
const pythonExe =
  'C:\\Users\\kiril\\Desktop\\SM\\Auto_Cart\\venv\\Scripts\\python.exe';

const getProxy = async () => {
  const rawProxy = await getRandomProxy();
  const proxy = rawProxy?.dataValues.proxy;
  return proxy;
};

const runPythonScript = (proxy: string, event: any) => {
  return new Promise((resolve, reject) => {
    const pythonProcess = spawn(pythonExe, [pythonScriptPath, proxy]);

    let output: string[];

    pythonProcess.stdout.on('data', (data) => {
      output = data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      let errorMessage = data.toString();
      errorMessage = new Error(errorMessage);
      reject(errorMessage);
    });

    pythonProcess.on('close', (code) => {
      if (code === 0) {
        event.sender.send('update-progress', { data: 'good' });
        resolve(output);
      } else {
        event.sender.send('update-progress', { data: 'error pythonProcess' });
      }
    });
  });
};

export const pythonModule = (ipcMain: IpcMain) => {
  ipcMain.handle('run-python-script', async (event, config) => {
    try {
      let worksCompleted = 0;
      const tasks: Promise<unknown>[] = [];

      while (worksCompleted < config.countWorks) {
        while (
          tasks.length < config.countThreads &&
          worksCompleted + tasks.length < config.countWorks
        ) {
          let proxy = config.useProxy ? await getProxy() : '';
          const task = runPythonScript(proxy, event).finally(() => {
            worksCompleted++;
            const index = tasks.indexOf(task);
            if (index > -1) {
              tasks.splice(index, 1);
            }
          });
          tasks.push(task);
        }

        // Ждем завершения любой из задач перед запуском новых
        if (tasks.length > 0) {
          await Promise.race(tasks);
        }
      }

      // Если остались незавершенные задачи, ждем их завершения
      if (tasks.length > 0) {
        await Promise.all(tasks);
      }

      return {
        result: true,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw error.message;
      } else {
        throw error;
      }
    }
  });
};
