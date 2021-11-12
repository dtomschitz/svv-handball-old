import {
  createFeatureSelector,
  createReducer,
  createSelector,
  on,
} from '@ngrx/store';
import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { Sponsor } from '@svv/core/models';
import {
  SponsorActions,
  SponsorsActions,
} from '@svv/cms/sponsors/store/actions';
import * as fromRoot from '@svv/cms/reducers';

/**
 * The global feature key of the `Sponsors` state.
 */
export const featureKey = 'sponsors';

export const adapter = createEntityAdapter<Sponsor>({
  selectId: sponsor => sponsor._id,
});

/**
 * Interface used to describe the `Sponsors` state.
 */
export interface SponsorsState extends EntityState<Sponsor> {
  loading: boolean;
  loaded: boolean;
}

export interface State extends fromRoot.State {
  [featureKey]: SponsorsState;
}

/**
 * Creates the reducer function for managing the `Sponsors` feature slice of
 * the root state.
 */
export const reducer = createReducer(
  adapter.getInitialState({
    loading: false,
    loaded: false,
  }),
  on(SponsorsActions.refreshSponsors, state => ({
    ...state,
    loading: true,
    loaded: false,
  })),
  on(SponsorsActions.loadSponsors, state => ({ ...state, loading: true })),
  on(SponsorsActions.loadSponsorsSuccess, (state, { sponsors }) =>
    adapter.setAll(sponsors, { ...state, loading: false }),
  ),
  on(SponsorActions.createSponsorSuccess, (state, { sponsor }) =>
    adapter.addOne(sponsor, { ...state, loading: false }),
  ),
  on(
    SponsorActions.updateSponsorSuccess,
    SponsorActions.uploadSponsorImageSuccess,
    SponsorActions.deleteSponsorImageSuccess,
    (state, { update }) => adapter.updateOne(update, state),
  ),
  on(SponsorsActions.sortSponsorsSuccess, (state, { updates }) =>
    adapter.updateMany(updates, state),
  ),
  on(SponsorActions.deleteSponsorSuccess, (state, { id }) =>
    adapter.removeOne(id, state),
  ),
  on(
    SponsorsActions.loadSponsorsCache,
    SponsorsActions.loadSponsorsFailure,
    state => ({
      ...state,
      loading: false,
    }),
  ),
);

/**
 * Selects the `Sponsors` state.
 */
export const selectSponsorsState = createFeatureSelector<State, SponsorsState>(
  featureKey,
);

/**
 * Default selectors for the `Sponsors` state.
 */
export const {
  selectIds: selectSponsorIds,
  selectEntities: selectSponsorEntities,
  selectAll,
  selectTotal: selectSponsorsTotal,
} = adapter.getSelectors(selectSponsorsState);

/**
 * Selects all `Sponsors` and sorts them by their position.
 */
export const selectAllSponsors = createSelector(selectAll, sponsors =>
  sponsors.sort((a, b) => {
    return a.position - b.position;
  }),
);

/**
 * Selects all names of the stored `Sponsors`.
 */
export const selectAllSponsorNames = createSelector(selectAll, sponsors =>
  sponsors.map(sponsor => sponsor.name),
);

/**
 * Selects the loading property of the `Sponsors` state which shows if an
 * loading process is ongoing or not.
 */
export const selectIsLoading = createSelector(
  selectSponsorsState,
  state => state.loading,
);

/**
 * Selects the loaded property of the `Sponsors` state which shows if the
 * `Sponsors` have been loaded or not.
 */
export const selectIsLoaded = createSelector(
  selectSponsorsState,
  state => state.loaded,
);
