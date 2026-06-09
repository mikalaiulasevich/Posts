import { faker } from '@faker-js/faker';

import { createLogger } from './logger';

export const POST_LIST_IMAGE_SIZE = 32;
export const POST_DETAILS_IMAGE_SIZE = 300;

const logger = createLogger('FakerImages');

export function createListImageUrl(): string {
  logger.info('list-image:generate', {
    height: POST_LIST_IMAGE_SIZE,
    width: POST_LIST_IMAGE_SIZE,
  });

  return faker.image.url({
    width: POST_LIST_IMAGE_SIZE,
    height: POST_LIST_IMAGE_SIZE,
  });
}

export function createDetailsImageUrl(): string {
  logger.info('details-image:generate', {
    height: POST_DETAILS_IMAGE_SIZE,
    width: POST_DETAILS_IMAGE_SIZE,
  });

  return faker.image.url({
    width: POST_DETAILS_IMAGE_SIZE,
    height: POST_DETAILS_IMAGE_SIZE,
  });
}
