import { Update } from '@ngrx/entity';
import { createAction, props } from '@ngrx/store';
import { ImageTag } from '@svv/core/models';

export const CREATE_IMAGE_TAG = '[Image Tag] Create Tag Image';
export const CREATE_IMAGE_TAG_SUCCESS = '[Image Tag] Create Tag Image Success';
export const CREATE_IMAGE_TAG_FAILURE = '[Image Tag] Create Tag Image Failure';

export const UPDATE_IMAGE_TAG = '[Image Tag] Update Tag Image';
export const UPDATE_IMAGE_TAG_SUCCESS = '[Image Tag] Update Tag Image  Success';
export const UPDATE_IMAGE_TAG_FAILURE = '[Image Tag] Update Tag Image Failure';

export const DELETE_IMAGE_TAG = '[Image Tag] Delete Tag Image';
export const DELETE_IMAGE_TAG_SUCCESS = '[Image Tag] Delete Tag Image Success';
export const DELETE_IMAGE_TAG_FAILURE = '[Image Tag] Delete Tag Image Failure';

export const createImageTag = createAction(
  CREATE_IMAGE_TAG,
  props<{ tag: Partial<ImageTag> }>(),
);
export const createImageTagSuccess = createAction(
  CREATE_IMAGE_TAG_SUCCESS,
  props<{ tag: ImageTag }>(),
);
export const createImageTagFailure = createAction(CREATE_IMAGE_TAG_FAILURE);

export const updateImageTag = createAction(
  UPDATE_IMAGE_TAG,
  props<{ update: Update<ImageTag> }>(),
);
export const updateImageTagSuccess = createAction(
  UPDATE_IMAGE_TAG_SUCCESS,
  props<{ update: Update<ImageTag> }>(),
);
export const updateImageTagFailure = createAction(UPDATE_IMAGE_TAG_FAILURE);

export const deleteImageTag = createAction(
  DELETE_IMAGE_TAG,
  props<{ id: string }>(),
);
export const deleteImageTagSuccess = createAction(
  DELETE_IMAGE_TAG_SUCCESS,
  props<{ id: string }>(),
);
export const deleteImageTagFailure = createAction(DELETE_IMAGE_TAG_FAILURE);
