import { Update } from '@ngrx/entity';
import { createAction, props } from '@ngrx/store';
import { Sponsor } from '@svv/core/models';

export const CREATE_SPONSOR = '[Sponsor] Create Sponsor';
export const CREATE_SPONSOR_SUCCESS = '[Sponsor] Create Sponsor Success';
export const CREATE_SPONSOR_FAILURE = '[Sponsor] Create Sponsor Failure';

export const UPDATE_SPONSOR = '[Sponsor] Update Sponsor';
export const UPDATE_SPONSOR_SUCCESS = '[Sponsor] Update Sponsor Success';
export const UPDATE_SPONSOR_FAILURE = '[Sponsor] Update Sponsor Failure';

export const UPLOAD_SPONSOR_IMAGE = '[Sponsor] Upload Sponsor Image';
export const UPLOAD_SPONSOR_IMAGE_SUCCESS =
  '[Sponsor] Upload Sponsor Image Success';
export const UPLOAD_SPONSOR_IMAGE_FAILURE =
  '[Sponsor] Upload Sponsor Image Failure';

export const DELETE_SPONSOR = '[Sponsor] Delete Sponsor';
export const DELETE_SPONSOR_SUCCESS = '[Sponsor] Delete Sponsor Success';
export const DELETE_SPONSOR_FAILURE = '[Sponsor] Delete Sponsor Failure';

export const DELETE_SPONSOR_IMAGE = '[Sponsor] Delete Sponsor Image';
export const DELETE_SPONSOR_IMAGE_SUCCESS =
  '[Sponsor] Delete Sponsor Image Success';
export const DELETE_SPONSOR_IMAGE_FAILURE =
  '[Sponsor] Delete Sponsor Image Failure';

export const createSponsor = createAction(
  CREATE_SPONSOR,
  props<{ sponsor: Partial<Sponsor> }>(),
);
export const createSponsorSuccess = createAction(
  CREATE_SPONSOR_SUCCESS,
  props<{ sponsor: Sponsor }>(),
);
export const createSponsorFailure = createAction(CREATE_SPONSOR_FAILURE);

export const updateSponsor = createAction(
  UPDATE_SPONSOR,
  props<{ update: Update<Sponsor> }>(),
);
export const updateSponsorSuccess = createAction(
  UPDATE_SPONSOR_SUCCESS,
  props<{ update: Update<Sponsor> }>(),
);
export const updateSponsorFailure = createAction(UPDATE_SPONSOR_FAILURE);

export const uploadSponsorImage = createAction(
  UPLOAD_SPONSOR_IMAGE,
  props<{ id: string; image: File }>(),
);
export const uploadSponsorImageSuccess = createAction(
  UPLOAD_SPONSOR_IMAGE_SUCCESS,
  props<{ update: Update<Sponsor> }>(),
);
export const uploadSponsorImageFailure = createAction(
  UPLOAD_SPONSOR_IMAGE_FAILURE,
);

export const deleteSponsor = createAction(
  DELETE_SPONSOR,
  props<{ id: string }>(),
);
export const deleteSponsorSuccess = createAction(
  DELETE_SPONSOR_SUCCESS,
  props<{ id: string }>(),
);
export const deleteSponsorFailure = createAction(DELETE_SPONSOR_FAILURE);

export const deleteSponsorImage = createAction(
  DELETE_SPONSOR_IMAGE,
  props<{ id: string }>(),
);
export const deleteSponsorImageSuccess = createAction(
  DELETE_SPONSOR_IMAGE_SUCCESS,
  props<{ update: Update<Sponsor> }>(),
);
export const deleteSponsorImageFailure = createAction(
  DELETE_SPONSOR_IMAGE_FAILURE,
);
