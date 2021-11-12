import {
  createFeatureSelector,
  createReducer,
  createSelector,
  on,
} from '@ngrx/store';
import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { User, UserRole } from '@svv/core/models';
import { UserActions, UsersActions } from '@svv/cms/users/store/actions';
import * as fromRoot from '@svv/cms/reducers';

/**
 * The global feature key of the `Users` state.
 */
export const featureKey = 'users';

export const adapter = createEntityAdapter<User>({
  selectId: team => team._id,
});

/**
 * Interface used to describe the `Users` state.
 */
export interface UsersState extends EntityState<User> {
  loading: boolean;
  loaded: boolean;
}

export interface State extends fromRoot.State {
  [featureKey]: UsersState;
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
  on(UsersActions.refreshUsers, state => ({
    ...state,
    loading: true,
    loaded: false,
  })),
  on(UsersActions.loadUsers, state => ({ ...state, loading: true })),
  on(
    UsersActions.loadUsersSuccess,
    UsersActions.refreshUsersSuccess,
    (state, { users }) =>
      adapter.setAll(users, { ...state, loading: false, loaded: true }),
  ),
  on(UserActions.createUserSuccess, (state, { user }) =>
    adapter.addOne(user, { ...state, loading: false }),
  ),
  on(UserActions.updateUserSuccess, (state, { update }) =>
    adapter.updateOne(update, state),
  ),
  on(UserActions.deleteUserSuccess, (state, { id }) =>
    adapter.removeOne(id, state),
  ),
  on(
    UsersActions.loadUsersCache,
    UserActions.createUserFailure,
    UsersActions.loadUsersFailure,
    UsersActions.refreshUsersFailure,
    state => ({ ...state, loading: false }),
  ),
);

/**
 * Selects the `Users` state.
 */
export const selectUsersState = createFeatureSelector<State, UsersState>(
  featureKey,
);

/**
 * Default selectors for the `Users` state.
 */
export const {
  selectIds: selectUserIds,
  selectEntities: selectUserEntities,
  selectAll: selectAllUsers,
  selectTotal: selectUsersTotal,
} = adapter.getSelectors(selectUsersState);

/**
 * Selects all `Users` of the type `Admin`.
 */
export const selectAllAdmins = createSelector(
  selectAllUsers,
  users => users.filter(user => user.role === UserRole.ADMIN) || [],
);

/**
 * Selects all `Users` of the type `Author`.
 */
export const selectAllAuthors = createSelector(
  selectAllUsers,
  users => users.filter(user => user.role === UserRole.AUTHOR) || [],
);

/**
 * Selects all `Users` of the type `TRAINER`.
 */
export const selectAllCoaches = createSelector(
  selectAllUsers,
  users => users.filter(user => user.role === UserRole.TRAINER) || [],
);

/**
 * Selects all `User` emails and returns them.
 */
export const selectAllUserEmails = createSelector(selectAllUsers, users =>
  users.filter(user => user.email).map(user => user.email),
);

/**
 * Filters all `Users` of the type `TRAINER` by the given ids.
 */
export const selectCoachesByIds = createSelector(
  selectAllUsers,
  (users: User[], ids: string[]) =>
    users.filter(user => ids.includes(user._id)) || [],
);

/**
 * Selects the loading property of the `Users` state which shows if an loading
 * process is ongoing or not.
 */
export const selectIsLoading = createSelector(
  selectUsersState,
  state => state.loading,
);

/**
 * Selects the loaded property of the `Users` state which shows if the `Users`
 * have been loaded or not.
 */
export const selectIsLoaded = createSelector(
  selectUsersState,
  state => state.loaded,
);
