import { createReducer, createSelector, on } from '@ngrx/store';
import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { ContactPerson } from '@svv/core/models';
import { ContactPersonActions, ContactPersonsActions } from '../actions';

/**
 * The global feature key of the `Contact Persons` state.
 */
export const featureKey = 'contact-persons';

export const adapter = createEntityAdapter<ContactPerson>({
  selectId: contactPerson => contactPerson._id,
});

/**
 * Interface used to describe the `Contact Persons` state.
 */
export interface State extends EntityState<ContactPerson> {
  loading: boolean;
  loaded: boolean;
}

/**
 * Creates the reducer function for managing the `Contact Persons` feature slice
 * of the root state.
 */
export const reducer = createReducer(
  adapter.getInitialState({
    loading: false,
    loaded: false,
  }),
  on(ContactPersonsActions.refreshContactPersons, state => ({
    ...state,
    loading: true,
    loaded: false,
  })),
  on(ContactPersonsActions.loadContactPersons, state => ({
    ...state,
    loading: true,
  })),
  on(
    ContactPersonsActions.loadContactPersonsSuccess,
    (state, { contactPersons }) =>
      adapter.setAll(contactPersons, { ...state, loading: false }),
  ),
  on(
    ContactPersonActions.createContactPersonSuccess,
    (state, { contactPerson }) =>
      adapter.addOne(contactPerson, { ...state, loading: false }),
  ),
  on(ContactPersonActions.updateContactPersonSuccess, (state, { update }) =>
    adapter.updateOne(update, state),
  ),
  on(ContactPersonsActions.sortContactPersonsSuccess, (state, { updates }) =>
    adapter.updateMany(updates, state),
  ),
  on(ContactPersonActions.deleteContactPersonSuccess, (state, { id }) =>
    adapter.removeOne(id, state),
  ),
  on(
    ContactPersonsActions.loadContactPersonsCache,
    ContactPersonsActions.loadContactPersonsFailure,
    state => ({
      ...state,
      loading: false,
    }),
  ),
);

/**
 * Default selectors for the `Contact Persons` state.
 */
export const {
  selectEntities: selectContactPersonEntities,
  selectAll,
} = adapter.getSelectors();

/**
 * Selects all `Contact Persons` and sorts them by their position.
 */
export const selectAllContactPersons = createSelector(
  selectAll,
  contactPersons =>
    contactPersons.sort((a, b) => {
      return a.position - b.position;
    }),
);

/**
 * Selects all names of the stored `Contact Persons`.
 */
export const selectAllContactPersonNames = createSelector(
  selectAll,
  contactPersons => contactPersons.map(contactPerson => contactPerson.name),
);

/**
 * Selects the loading property of the `Contact Persons` state which shows if an
 * loading process is ongoing or not.
 */
export const selectIsLoading = (state: State) => state.loading;

/**
 * Selects the loaded property of the `Contact Persons` state which shows if the
 * `Contact Persons` have been loaded or not.
 */
export const selectIsLoaded = (state: State) => state.loaded;
