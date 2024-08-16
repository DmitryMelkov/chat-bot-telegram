import dotenv from 'dotenv';
dotenv.config(); // Загружаем переменные из .env


export const config = {
  TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN,
  PROXY_URL: 'http://169.254.0.51:3274',
};