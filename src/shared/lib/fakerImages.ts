import { faker } from '@faker-js/faker';

import { createLogger } from './logger';

export const POST_LIST_IMAGE_SIZE = 32;
export const POST_DETAILS_IMAGE_SIZE = 300;

const logger = createLogger('FakerImages');

export function createListImageUrl(): string {
  const cacheBust = createImageCacheBust();

  logger.info('list-image:generate', {
    cacheBust,
    height: POST_LIST_IMAGE_SIZE,
    width: POST_LIST_IMAGE_SIZE,
  });

  return withCacheBust(
    faker.image.personPortrait({
      size: POST_LIST_IMAGE_SIZE,
    }),
    cacheBust,
  );
}

export function createDetailsImageUrl(): string {
  const cacheBust = createImageCacheBust();

  logger.info('details-image:generate', {
    cacheBust,
    height: POST_DETAILS_IMAGE_SIZE,
    width: POST_DETAILS_IMAGE_SIZE,
  });

  return withCacheBust(
    faker.image.personPortrait({
      size: 512,
    }),
    cacheBust,
  );
}

function createImageCacheBust(): string {
  return faker.string.alphanumeric({ length: 12 });
}

function withCacheBust(url: string, cacheBust: string): string {
  const separator = url.includes('?') ? '&' : '?';

  return `${url}${separator}cacheBust=${cacheBust}`;
}
