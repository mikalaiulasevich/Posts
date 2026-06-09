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
  const response = await fetch(url, init);

  if (!response.ok) {
    throw new HttpError(url, response.status, response.statusText);
  }

  return response.json();
}
