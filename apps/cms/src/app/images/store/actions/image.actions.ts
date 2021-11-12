import { Update } from '@ngrx/entity';
import { createAction, props } from '@ngrx/store';
import { Image } from '@svv/core/models';

export const CREATE_IMAGE = '[Image] Create Image';
export const CREATE_IMAGE_SUCCESS = '[Image] Create Image Success';
export const CREATE_IMAGE_FAILURE = '[Image] Create Image Failure';

export const UPDATE_IMAGE = '[Image] Update Image';
export const UPDATE_IMAGE_SUCCESS = '[Image] Update Image Success';
export const UPDATE_IMAGE_FAILURE = '[Image] Update Image Failure';

export const DELETE_IMAGE = '[Image] Delete Image';
export const DELETE_IMAGE_SUCCESS = '[Image] Delete Image Success';
export const DELETE_IMAGE_FAILURE = '[Image] Delete Image Failure';

export const createImage = createAction(
  CREATE_IMAGE,
  props<{ image: Partial<Image>; file: File }>(),
);
export const createImageSuccess = createAction(
  CREATE_IMAGE_SUCCESS,
  props<{ image: Image }>(),
);
export const createImageFailure = createAction(CREATE_IMAGE_FAILURE);

export const updateImage = createAction(
  UPDATE_IMAGE,
  props<{ update: Update<Image> }>(),
);
export const updateImageSuccess = createAction(
  UPDATE_IMAGE_SUCCESS,
  props<{ update: Update<Image> }>(),
);
export const updateImageFailure = createAction(UPDATE_IMAGE_FAILURE);

export const deleteImage = createAction(DELETE_IMAGE, props<{ id: string }>());
export const deleteImageSuccess = createAction(
  DELETE_IMAGE_SUCCESS,
  props<{ id: string }>(),
);
export const deleteImageFailure = createAction(DELETE_IMAGE_FAILURE);
