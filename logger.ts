import { createLogger, format, transports } from 'winston';

const tz = new Date().toLocaleString('en-US', {
  timeZone: 'Asia/Hong_Kong',
});

export const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp({
      format: tz,
    }),
    format.printf(({ timestamp, level, message }) => {
      return `[${timestamp}] ${level}: ${message}`;
    }),
  ),
  transports: [
    new transports.File({ filename: './logs/info.log', level: 'info' }),
    new transports.File({ filename: './logs/error.log', level: 'error' }),
    new transports.File({ filename: './logs/combined.log' }),
  ],
});
