type LogMetadata = Record<string, boolean | number | string | null | undefined>;

type LogLevel = 'debug' | 'error' | 'info' | 'warn';

type ScopedLogger = {
  debug: (message: string, metadata?: LogMetadata) => void;
  error: (message: string, metadata?: LogMetadata) => void;
  info: (message: string, metadata?: LogMetadata) => void;
  warn: (message: string, metadata?: LogMetadata) => void;
};

const APP_LOG_PREFIX = 'PostsApp';
const LOGGER_DISABLED_FLAG = 'POSTS_APP_LOGS_DISABLED';

export function createLogger(scope: string): ScopedLogger {
  return {
    debug(message, metadata): void {
      writeLog('debug', scope, message, metadata);
    },
    error(message, metadata): void {
      writeLog('error', scope, message, metadata);
    },
    info(message, metadata): void {
      writeLog('info', scope, message, metadata);
    },
    warn(message, metadata): void {
      writeLog('warn', scope, message, metadata);
    },
  };
}

function writeLog(
  level: LogLevel,
  scope: string,
  message: string,
  metadata?: LogMetadata,
): void {
  if (!isLoggerEnabled()) {
    return;
  }

  const prefix = `[${APP_LOG_PREFIX}:${scope}] ${message}`;

  if (metadata == null) {
    writeToConsole(level, prefix);
    return;
  }

  writeToConsole(level, prefix, metadata);
}

function isLoggerEnabled(): boolean {
  const globalFlags = globalThis as Record<string, unknown>;

  if (globalFlags[LOGGER_DISABLED_FLAG] === true) {
    return false;
  }

  return globalFlags.__DEV__ !== false;
}

function writeToConsole(
  level: LogLevel,
  prefix: string,
  metadata?: LogMetadata,
): void {
  if (level === 'error') {
    console.error(prefix, metadata);
    return;
  }

  if (level === 'warn') {
    console.warn(prefix, metadata);
    return;
  }

  console.log(prefix, metadata);
}
