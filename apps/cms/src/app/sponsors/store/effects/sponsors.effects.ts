import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Actions } from '@ngrx/effects';
import { HotToastService } from '@ngneat/hot-toast';
import { createGenericEffect } from '@svv/cms/core/store/effects';
import { SponsorsService } from '@svv/cms/sponsors/services';
import { SponsorsActions } from '@svv/cms/sponsors/store/actions';
import * as fromSponsors from '@svv/cms/sponsors/store/reducers';

@Injectable()
export class SponsorsEffects {
  /**
   * This effect listens to the `loadSponsors` action and will try to fetch all
   * `Sponsors` from the API. In case the `Sponsors` have been already loaded
   * and stored in the state, the effect will use the cached `Sponsors` instead
   * of loading the data from the database each time.
   *
   * In case the `Sponsors` have been fetched successfully from the respective
   * endpoint in the API, the action `loadSponsorsSuccess` containg the received
   * `Sponsors` will be dispatched. Otherwise if an error occured while loading,
   * the `loadSponsorsFailure` action gets dispatched.
   */
  loadSponsors$ = createGenericEffect(
    this.actions$,
    SponsorsActions.loadSponsors,
    () => this.sponsorsService.getSponsors(),
    () => ({
      success: sponsors => SponsorsActions.loadSponsorsSuccess({ sponsors }),
      failure: () => SponsorsActions.loadSponsorsFailure(),
      cache: () => SponsorsActions.loadSponsorsCache(),
    }),
    {
      cachingSelector: this.store.select(fromSponsors.selectIsLoaded),
    },
  )();

  /**
   * This effect listens to the `refreshSponsors` action and will try to fetch
   * all `Sponsors` from the API. In contrast to the `refreshSponsors` effect,
   * this one will not try to look up into the cache to check if the `Sponsors`
   * have been loaded already.
   *
   * In case the `Sponsors` have been fetched successfully from the respective
   * endpoint in the API, the action `loadSponsorsSuccess` containg the received
   * `Users` will be dispatched. Otherwise if an error occured while loading,
   * the `loadSponsorsFailure` action gets dispatched.
   */
  refreshSponsors$ = createGenericEffect(
    this.actions$,
    SponsorsActions.refreshSponsors,
    () => this.sponsorsService.getSponsors(),
    () => ({
      success: sponsors => SponsorsActions.loadSponsorsSuccess({ sponsors }),
      failure: () => SponsorsActions.loadSponsorsFailure(),
    }),
  )();

  /**
   * This effect listens to the `updateSponsors` action and will try to update a
   * a list of existing `Sponsors` with the updates stored inside the payload of
   * the action.
   *
   * In case the `Sponsors` have been updated successfully by the respective
   * endpoint in the API, the action `updateSponsorsSuccess` containg the
   * updates from the `updateSponsors` action will be dispatched. Otherwise if
   * an error occured while updating, the `updateSponsorsFailure` action
   * gets dispatched.
   */
  updateSponsors$ = createGenericEffect(
    this.actions$,
    SponsorsActions.sortSponsors,
    action => this.sponsorsService.updateSponsors(action.updates),
    action => ({
      success: () =>
        SponsorsActions.sortSponsorsSuccess({ updates: action.updates }),
      failure: () => SponsorsActions.sortSponsorsFailure(),
    }),
  )(this.toastService);

  constructor(
    private actions$: Actions,
    private store: Store<fromSponsors.State>,
    private sponsorsService: SponsorsService,
    private toastService: HotToastService,
  ) {}
}
