import { createLogger } from '../../shared/lib/logger';

const logger = createLogger('HttpClient');

const REQUEST_TIMEOUT_MS = 15000;

export class HttpError extends Error {
  constructor(
    public readonly url: string,
    public readonly status: number,
    public readonly statusText: string,
  ) {
    super(`HTTP ${status} ${statusText} for ${url}`);
    this.name = 'HttpError';
  }
}

export class HttpRequestTimeoutError extends Error {
  constructor(
    public readonly url: string,
    public readonly timeoutMs: number,
  ) {
    super(`Request timed out after ${timeoutMs}ms for ${url}`);
    this.name = 'HttpRequestTimeoutError';
  }
}

export async function requestJson(
  url: string,
  init?: RequestInit,
): Promise<unknown> {
  logger.info('request:start', { url });

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  let response: Response;

  try {
    response = await fetch(url, {
      ...init,
      signal: init?.signal ?? controller.signal,
    });
  } catch (error) {
    if (isAbortError(error)) {
      logger.warn('request:timeout', {
        timeoutMs: REQUEST_TIMEOUT_MS,
        url,
      });

      throw new HttpRequestTimeoutError(url, REQUEST_TIMEOUT_MS);
    }

    throw error;
  } finally {
    clearTimeout(timeoutId);
  }

  if (!response.ok) {
    logger.warn('request:failed-status', {
      status: response.status,
      statusText: response.statusText,
      url,
    });

    throw new HttpError(url, response.status, response.statusText);
  }

  const json = await response.json();

  logger.info('request:success', { status: response.status, url });

  return json;
}

function isAbortError(error: unknown): boolean {
  return error instanceof Error && error.name === 'AbortError';
}
