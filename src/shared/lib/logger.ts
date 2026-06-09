type LogMetadata = Record<string, boolean | number | string | null | undefined>;

type LogLevel = 'debug' | 'error' | 'info' | 'warn';

type ScopedLogger = {
  debug: (message: string, metadata?: LogMetadata) => void;
  error: (message: string, metadata?: LogMetadata) => void;
  info: (message: string, metadata?: LogMetadata) => void;
  warn: (message: string, metadata?: LogMetadata) => void;
};

const APP_LOG_PREFIX = 'PostsApp';

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
    console[level](prefix);
    return;
  }

  console[level](prefix, metadata);
}

function isLoggerEnabled(): boolean {
  return typeof __DEV__ === 'undefined' ? true : __DEV__;
}
