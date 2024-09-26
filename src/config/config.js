import dotenv from 'dotenv';
dotenv.config();

export const config = {
  TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN,
  CHAT_ID: process.env.CHAT_ID,
  PROXY_URL: process.env.PROXY_URL,
  PORT: 3001,
  MONGODB_URI: process.env.MONGODB_URI
};
