import { InjectionToken } from '@angular/core';
import {
  createSelector,
  createFeatureSelector,
  Action,
  ActionReducerMap,
} from '@ngrx/store';
import { Data } from '@angular/router';
import { FeatureBar } from '@svv/cms/core/models';
import * as fromRouter from '@ngrx/router-store';
import * as fromLayout from '@svv/cms/core/store/reducers/layout.reducer';

export interface State {
  [fromLayout.featureKey]: fromLayout.State;
  router: fromRouter.RouterReducerState<any>;
}

/** Defines the root reducers. */
export const ROOT_REDUCERS = new InjectionToken<
  ActionReducerMap<State, Action>
>('ROOT_REDUCERS', {
  factory: () => ({
    [fromLayout.featureKey]: fromLayout.reducer,
    router: fromRouter.routerReducer,
  }),
});

/** Selects the route from the base state */
export const selectRouter = (state: State) => state && state.router;

/** Default router selectors. */
export const {
  selectCurrentRoute,
  selectQueryParams,
  selectQueryParam,
  selectRouteParams,
  selectRouteParam,
  selectRouteData,
  selectUrl,
} = fromRouter.getSelectors(selectRouter);

/** Selects the the layout state from the root state. */
export const selectLayoutState = createFeatureSelector<State, fromLayout.State>(
  fromLayout.featureKey,
);

/** Selects the current state of the sidenav from the store. */
export const selectShowSidenav = createSelector(
  selectLayoutState,
  fromLayout.selectShowSidenav,
);

export const selectFeatureBar = createSelector<State, Data, FeatureBar>(
  selectRouteData,
  data => {
    if (data?.feature && !data?.disableFeatureBar) {
      return {
        ...data.feature,
        currentTab: data.currentTab,
      };
    }
  },
);
