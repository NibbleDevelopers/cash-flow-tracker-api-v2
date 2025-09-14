import winston from 'winston';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import config from './config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define log format
const logFormat = winston.format.combine(
  winston.format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss'
  }),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

// Define console format for development
const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({
    format: 'HH:mm:ss'
  }),
  winston.format.printf(({ timestamp, level, message, stack }) => {
    if (stack) {
      return `${timestamp} ${level}: ${message}\n${stack}`;
    }
    return `${timestamp} ${level}: ${message}`;
  })
);

// Determine whether to use file transports (disabled on Vercel)
const isRunningOnVercel = Boolean(process.env.VERCEL);
const isProduction = config.nodeEnv === 'production';
const shouldUseFileTransports = process.env.LOG_TO_FILE === 'true' && !isRunningOnVercel && !isProduction;

// Build transports list
const transports = [];

// Always log to console; pretty in non-production
transports.push(
  new winston.transports.Console({
    format: config.nodeEnv === 'production' ? logFormat : consoleFormat
  })
);

// Optionally log to files when explicitly enabled and not on Vercel/production
if (shouldUseFileTransports) {
  const logsDir = path.join(__dirname, '../../logs');
  try {
    // Ensure directory exists (may fail on read-only FS like Vercel)
    fs.mkdirSync(logsDir, { recursive: true });

    transports.push(
      new winston.transports.File({
        filename: path.join(logsDir, 'app.log'),
        format: logFormat
      })
    );
    transports.push(
      new winston.transports.File({
        filename: path.join(logsDir, 'error.log'),
        level: 'error',
        format: logFormat
      })
    );
  } catch (err) {
    // Fallback: if we cannot write to disk, skip file transports
    // eslint-disable-next-line no-console
    console.warn('File logging disabled: unable to create logs directory.', err);
  }
}

// Create logger instance
const logger = winston.createLogger({
  level: config.logLevel,
  format: logFormat,
  defaultMeta: { service: 'cash-flow-tracker-api' },
  transports
});

// Extra console transport in development is no longer necessary because it's already included above

// Create a stream object for Morgan
logger.stream = {
  write: (message) => {
    logger.info(message.trim());
  }
};

export default logger;
