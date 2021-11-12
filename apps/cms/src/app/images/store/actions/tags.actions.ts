import { createAction, props } from '@ngrx/store';
import { ImageTag } from '@svv/core/models';

export const LOAD_IMAGE_TAGS = '[Image Tags] Load Image Tags';
export const LOAD_IMAGE_TAGS_SUCCESS = '[Image Tags] Load Image Tags Success';
export const LOAD_IMAGE_TAGS_FAILURE = '[Image Tags] Load Image Tags Failure';
export const LOAD_CACHED_IMAGE_TAGS = '[Image Tags] Load Cached Image Tags';

export const REFRESH_TAGS = '[Image Tags] Refresh Image Tags';

export const loadImageTags = createAction(LOAD_IMAGE_TAGS);
export const loadImageTagsSuccess = createAction(
  LOAD_IMAGE_TAGS_SUCCESS,
  props<{ tags: ImageTag[] }>(),
);
export const loadImageTagsFailure = createAction(LOAD_IMAGE_TAGS_FAILURE);
export const loadCachedImageTags = createAction(LOAD_CACHED_IMAGE_TAGS);

export const refreshImageTags = createAction(REFRESH_TAGS);
