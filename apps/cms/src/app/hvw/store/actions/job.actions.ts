import { Update } from '@ngrx/entity';
import { createAction, props } from '@ngrx/store';
import { HvwJob } from '@svv/core/models';

export const CREATE_JOB = '[Job] Create Job';
export const CREATE_JOB_SUCCESS = '[Job] Create Job Success';
export const CREATE_JOB_FAILURE = '[Job] Create Job Failure';

export const UPDATE_JOB = '[Job] Update Job';
export const UPDATE_JOB_SUCCESS = '[Job] Update Job Success';
export const UPDATE_JOB_FAILURE = '[Job] Update Job Failure';

export const DELETE_JOB = '[Job] Delete Job';
export const DELETE_JOB_SUCCESS = '[Job] Delete Job Success';
export const DELETE_JOB_FAILURE = '[Job] Delete Job Failure';

export const createJob = createAction(
  CREATE_JOB,
  props<{ job: Partial<HvwJob> }>(),
);
export const createJobSuccess = createAction(
  CREATE_JOB_SUCCESS,
  props<{ job: HvwJob }>(),
);
export const createJobFailure = createAction(CREATE_JOB_FAILURE);

export const updateJob = createAction(
  UPDATE_JOB,
  props<{ update: Update<HvwJob> }>(),
);
export const updateJobSuccess = createAction(
  UPDATE_JOB_SUCCESS,
  props<{ update: Update<HvwJob> }>(),
);
export const updateJobFailure = createAction(UPDATE_JOB_FAILURE);

export const deleteJob = createAction(DELETE_JOB, props<{ id: string }>());
export const deleteJobSuccess = createAction(
  DELETE_JOB_SUCCESS,
  props<{ id: string }>(),
);
export const deleteJobFailure = createAction(DELETE_JOB_FAILURE);
