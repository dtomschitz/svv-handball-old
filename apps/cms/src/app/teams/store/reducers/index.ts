import {
  createFeatureSelector,
  createReducer,
  createSelector,
  on,
} from '@ngrx/store';
import { createEntityAdapter, Dictionary, EntityState } from '@ngrx/entity';
import { Team, TeamType } from '@svv/core/models';
import { TeamActions, TeamsActions } from '@svv/cms/teams/store/actions';
import * as fromRoot from '@svv/cms/reducers';

/**
 * The global feature key of the `Teams` state.
 */
export const featureKey = 'teams';

export const adapter = createEntityAdapter<Team>({
  selectId: team => team._id,
});

/**
 * Interface used to describe the `Teams` state.
 */
export interface TeamsState extends EntityState<Team> {
  loading: boolean;
  loaded: boolean;
  imageUploading: boolean;
}

export interface State extends fromRoot.State {
  [featureKey]: TeamsState;
}

/**
 * Creates the reducer function for managing the `Teams` feature slice of
 * the root state.
 */
export const reducer = createReducer(
  adapter.getInitialState({
    loading: false,
    loaded: false,
    imageUploading: false,
  }),
  on(TeamsActions.refreshTeams, state => ({
    ...state,
    loading: true,
    loaded: false,
  })),
  on(TeamsActions.loadTeams, state => ({ ...state, loading: true })),
  on(TeamsActions.loadTeamsSuccess, (state, { teams }) =>
    adapter.setAll(teams, { ...state, loading: false, loaded: true }),
  ),
  on(TeamActions.createTeamSuccess, (state, { team }) =>
    adapter.addOne(team, state),
  ),
  on(
    TeamActions.updateTeamSuccess,
    TeamActions.uploadTeamImageSuccess,
    TeamActions.deleteTeamImageSuccess,
    (state, { update }) => adapter.updateOne(update, state),
  ),
  on(TeamsActions.sortTeamsSuccess, (state, { updates }) =>
    adapter.updateMany(updates, state),
  ),
  on(TeamActions.deleteTeamSuccess, (state, { id }) =>
    adapter.removeOne(id, state),
  ),
  on(TeamsActions.loadTeamsCache, TeamsActions.loadTeamsFailure, state => ({
    ...state,
    loading: false,
  })),
);

/**
 * Selects the `Teams` state.
 */
export const selectTeamsState = createFeatureSelector<State, TeamsState>(
  featureKey,
);

/**
 * Default selectors for the `Teams` state.
 */
export const {
  selectIds: selectTeamIds,
  selectEntities: selectTeamEntities,
  selectAll: selectAllTeams,
  selectTotal: selectTeamsTotal,
} = adapter.getSelectors(selectTeamsState);

/**
 * Selects a `Team` by the given id.
 */
export const selectTeamById = createSelector(
  selectTeamEntities,
  (teams: Dictionary<Team>, teamId: string) => teams[teamId],
);

/**
 * Selects a the `teamId` from the URL.
 */
export const selectCurrentTeamId = createSelector(
  fromRoot.selectRouteParam('teamId'),
  teamId => teamId,
);

/**
 * Selects a `Team` based on the id from the URL.
 */
export const selectCurrentTeam = createSelector(
  selectTeamEntities,
  selectCurrentTeamId,
  (entities, id) => entities[id],
);

const sortTeamsByPosition = (a: Team, b: Team) => {
  return a.position - b.position;
};

/**
 * Selects all `Teams` of the type `ACTIVE`.
 */
export const selectActiveTeams = createSelector(selectAllTeams, teams =>
  teams.filter(team => team.type !== TeamType.YOUTH).sort(sortTeamsByPosition),
);

/**
 * Selects all `Teams` of the type `YOUTH`.
 */
export const selectYouthTeams = createSelector(selectAllTeams, teams =>
  teams.filter(team => team.type !== TeamType.ACTIVE).sort(sortTeamsByPosition),
);

/**
 * Selects all names of the stored `Teams`.
 */
export const selectTeamNames = createSelector(selectAllTeams, teams =>
  teams.map(team => team.name),
);

/**
 * Selects all names of the stored `Teams`.
 */
export const selectTeamAbbreviations = createSelector(selectAllTeams, teams =>
  teams.map(team => team.abbreviation),
);

/**
 * Selects the loading property of the `Teams` state which shows if an loading
 * process is ongoing or not.
 */
export const selectIsLoading = createSelector(
  selectTeamsState,
  state => state.loading,
);

/**
 * Selects the loaded property of the `Teams` state which shows if the `Teams`
 * have been loaded or not.
 */
export const selectIsLoaded = createSelector(
  selectTeamsState,
  state => state.loaded,
);
