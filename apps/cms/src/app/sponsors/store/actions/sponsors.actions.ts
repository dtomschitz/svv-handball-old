import { Update } from '@ngrx/entity';
import { createAction, props } from '@ngrx/store';
import { Sponsor } from '@svv/core/models';

export const LOAD_SPONSORS = '[Sponsors] Load Sponsors';
export const LOAD_SPONSORS_SUCCESS = '[Sponsors] Load Sponsors Success';
export const LOAD_SPONSORS_FAILURE = '[Sponsors] Load Sponsors Failure';
export const LOAD_SPONSORS_CACHE = '[Sponsors] Load Sponsors Cache';

export const SORT_SPONSORS = '[Sponsors] Sort Sponsors';
export const SORT_SPONSORS_SUCCESS = '[Sponsors] Sort Sponsors Success';
export const SORT_SPONSORS_FAILURE = '[Sponsors] Sort Sponsors Failure';

export const REFRESH_SPONSORS = '[Sponsors] Refresh Sponsors';

export const loadSponsors = createAction(LOAD_SPONSORS);
export const loadSponsorsSuccess = createAction(
  LOAD_SPONSORS_SUCCESS,
  props<{ sponsors: Sponsor[] }>(),
);
export const loadSponsorsFailure = createAction(LOAD_SPONSORS_FAILURE);
export const loadSponsorsCache = createAction(LOAD_SPONSORS_CACHE);

export const sortSponsors = createAction(
  SORT_SPONSORS,
  props<{ updates: Update<Sponsor>[] }>(),
);
export const sortSponsorsSuccess = createAction(
  SORT_SPONSORS_SUCCESS,
  props<{ updates: Update<Sponsor>[] }>(),
);
export const sortSponsorsFailure = createAction(SORT_SPONSORS_FAILURE);

export const refreshSponsors = createAction(REFRESH_SPONSORS);
