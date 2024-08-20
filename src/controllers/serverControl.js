import { exec } from 'child_process';

export function logErrorAndRestart(errorMessage, error = null) {
  const timeStamp = new Date().toLocaleString();
  console.error(`[${timeStamp}] ${errorMessage}`, error ? error.message : '');

  // Останавливаем текущий процесс
  exec('pkill -f "npm run dev"', (err, stdout, stderr) => {
    if (err) {
      console.error(`[${timeStamp}] Error stopping server:`, err.message);
      return;
    }
    console.log(`[${timeStamp}] Server stopped successfully`);

    // Перезапускаем сервер
    exec('npm run dev', (err, stdout, stderr) => {
      if (err) {
        console.error(`[${timeStamp}] Error restarting server:`, err.message);
        return;
      }
      console.log(`[${timeStamp}] Server restarted successfully`);
    });
  });
}
