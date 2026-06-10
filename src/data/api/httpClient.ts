import { createLogger } from '../../shared/lib/logger';

const logger = createLogger('HttpClient');

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

export async function requestJson(
  url: string,
  init?: RequestInit,
): Promise<unknown> {
  logger.info('request:start', { url });

  const response = await fetch(url, init);

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
