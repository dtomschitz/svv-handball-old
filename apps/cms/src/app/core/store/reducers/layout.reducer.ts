import { createReducer, on } from '@ngrx/store';
import { LayoutActions } from '@svv/cms/core/store/actions';

/**
 * The global feature key of the `Layout` state.
 */
export const featureKey = 'layout';

/**
 * Interface used to describe the `Layout` state.
 */
export interface State {
  showSidenav: boolean;
}

export const reducer = createReducer(
  {
    showSidenav: true,
  },
  on(LayoutActions.closeSidenav, () => ({ showSidenav: false })),
  on(LayoutActions.openSidenav, () => ({ showSidenav: true })),
  on(LayoutActions.toggleSidenav, state => ({
    showSidenav: !state.showSidenav,
  })),
);
/**
 * Selects the current state of the `Sidenav`
 */
export const selectShowSidenav = (state: State) => state.showSidenav;
