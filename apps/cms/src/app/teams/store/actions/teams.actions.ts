import { Update } from '@ngrx/entity';
import { createAction, props } from '@ngrx/store';
import { Team } from '@svv/core/models';

export const LOAD_TEAMS = '[Teams] Load Teams';
export const LOAD_TEAMS_SUCCESS = '[Teams] Load Teams Success';
export const LOAD_TEAMS_FAILURE = '[Teams] Load Teams Failure';
export const LOAD_TEAMS_CACHE = '[Teams] Load Teams Cache';

export const SORT_TEAMS = '[Teams] Sort Teams';
export const SORT_TEAMS_SUCCESS = '[Teams] Sort Teams Success';
export const SORT_TEAMS_FAILURE = '[Teams] Sort Teams Failure';

export const REMOVE_TEAMS_COACHE = '[Teams] Remove Coache';

export const REFRESH_TEAMS = '[Teams] Refresh Teams';

export const loadTeams = createAction(LOAD_TEAMS);
export const loadTeamsSuccess = createAction(
  LOAD_TEAMS_SUCCESS,
  props<{ teams: Team[] }>(),
);
export const loadTeamsFailure = createAction(LOAD_TEAMS_FAILURE);
export const loadTeamsCache = createAction(LOAD_TEAMS_CACHE);

export const sortTeams = createAction(
  SORT_TEAMS,
  props<{ updates: Update<Team>[] }>(),
);
export const sortTeamsSuccess = createAction(
  SORT_TEAMS_SUCCESS,
  props<{ updates: Update<Team>[] }>(),
);
export const sortTeamsFailure = createAction(SORT_TEAMS_FAILURE);

export const refreshTeams = createAction(REFRESH_TEAMS);
