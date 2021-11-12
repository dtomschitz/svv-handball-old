import { Update } from '@ngrx/entity';
import { createAction, props } from '@ngrx/store';
import { Team } from '@svv/core/models';

export const CREATE_TEAM = '[Team] Create Team';
export const CREATE_TEAM_SUCCESS = '[Team] Create Team Success';
export const CREATE_TEAM_FAILURE = '[Team] Create Team Failure';

export const UPDATE_TEAM = '[Team] Update Team';
export const UPDATE_TEAM_SUCCESS = '[Team] Update Team Success';
export const UPDATE_TEAM_FAILURE = '[Team] Update Team Failure';

export const UPLOAD_TEAM_IMAGE = '[Team] Upload Team Image';
export const UPLOAD_TEAM_IMAGE_SUCCESS = '[Team] Upload Team Image Success';
export const UPLOAD_TEAM_IMAGE_FAILURE = '[Team] Upload Team Image Failure';

export const DELETE_TEAM = '[Team] Delete Team';
export const DELETE_TEAM_SUCCESS = '[Team] Delete Team Success';
export const DELETE_TEAM_FAILURE = '[Team] Delete Team Failure';

export const DELETE_TEAM_IMAGE = '[Team] Delete Team Image';
export const DELETE_TEAM_IMAGE_SUCCESS = '[Team] Delete Team Image Success';
export const DELETE_TEAM_IMAGE_FAILURE = '[Team] Delete Team Image Failure';

export const createTeam = createAction(
  CREATE_TEAM,
  props<{ team: Partial<Team> }>(),
);
export const createTeamSuccess = createAction(
  CREATE_TEAM_SUCCESS,
  props<{ team: Team }>(),
);
export const createTeamFailure = createAction(CREATE_TEAM_FAILURE);

export const updateTeam = createAction(
  UPDATE_TEAM,
  props<{ update: Update<Team> }>(),
);
export const updateTeamSuccess = createAction(
  UPDATE_TEAM_SUCCESS,
  props<{ update: Update<Team> }>(),
);
export const updateTeamFailure = createAction(UPDATE_TEAM_FAILURE);

export const uploadTeamImage = createAction(
  UPLOAD_TEAM_IMAGE,
  props<{ id: string; image: File }>(),
);
export const uploadTeamImageSuccess = createAction(
  UPLOAD_TEAM_IMAGE_SUCCESS,
  props<{ update: Update<Team> }>(),
);
export const uploadTeamImageFailure = createAction(UPLOAD_TEAM_IMAGE_FAILURE);

export const deleteTeam = createAction(DELETE_TEAM, props<{ id: string }>());
export const deleteTeamSuccess = createAction(
  DELETE_TEAM_SUCCESS,
  props<{ id: string }>(),
);
export const deleteTeamFailure = createAction(DELETE_TEAM_FAILURE);

export const deleteTeamImage = createAction(
  DELETE_TEAM_IMAGE,
  props<{ id: string }>(),
);
export const deleteTeamImageSuccess = createAction(
  DELETE_TEAM_IMAGE_SUCCESS,
  props<{ update: Update<Team> }>(),
);
export const deleteTeamImageFailure = createAction(DELETE_TEAM_IMAGE_FAILURE);
