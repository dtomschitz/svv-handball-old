import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, createSelector, on } from '@ngrx/store';
import { HvwJob } from '@svv/core/models';
import { JobActions, JobsActions } from '@svv/cms/hvw/store/actions';

/**
 * The global feature key of the `Jobs` state.
 */
export const featureKey = 'jobs';

export const adapter = createEntityAdapter<HvwJob>({
  selectId: job => job._id,
});

/**
 * Interface used to describe the `Jobs` state.
 */
export interface State extends EntityState<HvwJob> {
  loading: boolean;
  loaded: boolean;
}

/**
 * Creates the reducer function for managing the `User` feature slice of
 * the root state.
 */
export const reducer = createReducer(
  adapter.getInitialState({
    loading: false,
    loaded: false,
  }),
  on(JobsActions.loadJobs, state => ({ ...state, loading: true })),
  on(JobsActions.loadJobsSuccess, (state, { jobs }) =>
    adapter.setAll(jobs, { ...state, loading: false, loaded: true }),
  ),
  on(JobsActions.loadJobsFailure, JobsActions.loadCachedJobs, state => ({
    ...state,
    loading: false,
  })),
  on(JobActions.createJobSuccess, (state, { job }) =>
    adapter.addOne(job, state),
  ),
  on(JobActions.updateJobSuccess, (state, { update }) =>
    adapter.updateOne(update, state),
  ),
  on(JobActions.deleteJobSuccess, (state, { id }) =>
    adapter.removeOne(id, state),
  ),
);

/**
 * Default selectors for the `Jobs` state.
 */
export const {
  selectEntities: selectJobEntites,
  selectAll: selectAllJobs,
} = adapter.getSelectors();

/**
 * Selects all names of the stored `Jobs`.
 */
export const selectJobNames = createSelector(selectAllJobs, jobs =>
  jobs.map(job => job.name),
);

/**
 * Selects the loading property of the `Jobs` state which shows if an loading
 * process is ongoing or not.
 *
 * @param state The `Jobs` state.
 */
export const selectIsLoading = (state: State) => state.loading;

/**
 * Selects the loading property of the `Jobs` state which shows if the `Jobs`
 * have been loaded or not.
 *
 * @param state The `Jobs` state.
 */
export const selectIsLoaded = (state: State) => state.loaded;
