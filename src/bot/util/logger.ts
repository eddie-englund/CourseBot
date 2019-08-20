import { createLogger, transports, format } from 'winston';

export enum TOPICS {
  UNHANDELED_REJECTION = 'UNHANDELED_REJECTION',
  DISCORD = 'DISCORD',
  DISCORD_AKAIRO = 'DISCORD_AKAIRO',
  RPC = 'RPC',
  METRICS = 'METRICS',
  DATABASE = 'DATABASE',
}

export enum EVENTS {
  INIT = 'INIT',
  DEBUG = 'DEBUG',
  ERROR = 'ERROR',
  WARN = 'WARN',
  GUILD = 'DB INSTANCE CREATED FOR GUILD',
  READY = 'READY',
  IDENTIFY = 'IDENTIFY',
  DESTROY = 'DESTROY',
  CONNECT = 'CONNECT',
  DISCONNECT = 'DISCONNECT',
  COMMAND_ERROR = 'COMMAND_ERROR',
  COMMAND_BLOCKED = 'COMMAND_BLOCKED',
  COMMAND_CANCELLED = 'COMMAND_CANCELLED',
  COMMAND_STARTED = 'COMMAND_STARTED',
  COMMAND_FINISHED = 'COMMAND_FINISHED',
  MESSAGE_BLOCKED = 'MESSAGE_BLOCKED',
}

export const logger = createLogger({
  format: format.combine(
    format.errors({ stack: true }),
    format.label({ label: 'BOT' }),
    format.timestamp({ format: 'YYYY/MM/DD HH:mm:ss' }),
    format.printf(
      (info: any): string => {
        const { timestamp, label, level, message, topic, event, ...rest } = info;
        return `[${timestamp}][${label}][${level.toUpperCase()}][${topic}]${
          event ? `[${event}]` : ''
        }: ${message}${Object.keys(rest).length ? `\n${JSON.stringify(rest, null, 2)}` : ''}`;
      }
    )
  ),
  transports: [
    new transports.Console({
      format: format.colorize({ level: true }),
      level: 'info',
    }),
    new transports.File({ filename: 'error.log', level: 'error' }),
  ],
});
