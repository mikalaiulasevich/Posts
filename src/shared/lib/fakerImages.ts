import { faker } from '@faker-js/faker';

export const POST_LIST_IMAGE_SIZE = 32;
export const POST_DETAILS_IMAGE_SIZE = 300;

export function createListImageUrl(): string {
  return faker.image.url({
    width: POST_LIST_IMAGE_SIZE,
    height: POST_LIST_IMAGE_SIZE,
  });
}

export function createDetailsImageUrl(): string {
  return faker.image.url({
    width: POST_DETAILS_IMAGE_SIZE,
    height: POST_DETAILS_IMAGE_SIZE,
  });
}
