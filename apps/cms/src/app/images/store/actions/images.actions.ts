import { createAction, props } from '@ngrx/store';
import { Image } from '@svv/core/models';

export const LOAD_IMAGES = '[Images] Load Images';
export const LOAD_IMAGES_SUCCESS = '[Images] Load Images Success';
export const LOAD_IMAGES_FAILURE = '[Images] Load Images Failure';
export const LOAD_IMAGES_CACHE = '[Images] Load Images Cache';

export const REFRESH_IMAGES = '[Images] Refresh Images';

export const loadImages = createAction(LOAD_IMAGES);
export const loadImagesSuccess = createAction(
  LOAD_IMAGES_SUCCESS,
  props<{ images: Image[] }>(),
);
export const loadImagesFailure = createAction(LOAD_IMAGES_FAILURE);
export const loadImagesCache = createAction(LOAD_IMAGES_CACHE);

export const refreshImages = createAction(REFRESH_IMAGES);
