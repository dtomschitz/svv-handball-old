import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { catchError, delay, map, switchMap } from 'rxjs/operators';
import { select, Store } from '@ngrx/store';
import { HotToastService } from '@ngneat/hot-toast';
import { HvwCachingType } from '@svv/core/models';
import { createGenericEffect } from '@svv/cms/core/store/effects';
import { WeeksActions } from '@svv/cms/hvw/store/actions';
import { HvwWeeksService } from '@svv/cms/hvw//services';
import { createDefaultCachingEffect } from './default-caching-effect';
import * as fromHvw from '@svv/cms/hvw/store/reducers';
import * as fromAuth from '@svv/cms/auth/store/reducers';

const defaultDelay = 500;

@Injectable()
export class WeeksEffects {
  /**
   * This effect listens to the `loadWeeks` action and will try to fetch all
   * `Weeks` from the API. In case the `Weeks` have been already loaded and
   * stored in the state, the effect will use the cached `Weeks` instead of
   * loading the data from the database each time.
   *
   * In case the `Weeks` have been fetched successfully from the respective
   * endpoint in the API, the action `loadWeeksSuccess` containg the received
   * `Weeks` will be dispatched. Otherwise if an error occured while loading,
   * the `loadWeeksFailure` action gets dispatched.
   */
  loadWeeks$ = createGenericEffect(
    this.actions$,
    WeeksActions.loadWeeks,
    () => this.weeksService.getWeeks(),
    () => ({
      success: weeks => WeeksActions.loadWeeksSuccess({ weeks }),
      failure: () => WeeksActions.loadWeeksFailure(),
      cache: () => WeeksActions.loadWeeksFailure(),
    }),
    {
      cachingSelector: this.store.pipe(select(fromHvw.selectIsWeeksLoaded)),
    },
  )();

  /**
   * This effect listens to the `loadWeeksCachingResults` action and will try
   * to fetch all `Caching Results` from the API.
   *
   * In case the `Caching Results` have been fetched successfully from the
   * respective endpoint in the API, the action `loadWeeksCachingResultsSuccess`
   * containg the received `Caching Results` will be dispatched. Otherwise if an
   * error occured while loading, the `loadWeeksCachingResultsFailure` action
   * gets dispatched.
   */
  loadWeeksCachingResults$ = createGenericEffect(
    this.actions$,
    WeeksActions.loadWeeksCachingResults,
    () => this.weeksService.getCachingResults(HvwCachingType.WEEKS),
    () => ({
      success: cachingResults =>
        WeeksActions.loadWeeksCachingResultsSuccess({ cachingResults }),
      failure: () => WeeksActions.loadWeeksCachingResultsFailure(),
    }),
  )();

  /**
   * This effect listens to the `refreshClasses` or `cacheClassesSuccess` action
   * and will try to fetch all `Classes` from the API. In contrast to the
   * `loadClasses` effect, this one will not try to look up into the cache to
   * check if the `Classes` have been loaded already.
   *
   * In case the `Classes` have been fetched successfully from the respective
   * endpoint in the API, the action `loadClassesSuccess` containg the received
   * `Classes` will be dispatched. Otherwise if an error occured while loading,
   * the `loadClassesFailure` action gets dispatched.
   */
  refreshWeeks$ = createEffect(() =>
    this.actions$.pipe(
      ofType(WeeksActions.loadWeeks, WeeksActions.cacheWeeksSuccess),
      switchMap(() =>
        this.weeksService.getWeeks().pipe(
          delay(defaultDelay),
          map(weeks => WeeksActions.loadWeeksSuccess({ weeks })),
          catchError(() => of(WeeksActions.loadWeeksFailure())),
        ),
      ),
    ),
  );

  /**
   * This effect listens to the `deleteGames` action and will try to start the
   * deletion process of all `Games` from the database.
   *
   * In case the `Games` have been deleted successfully from the `Database` by
   * the respective endpoint in the API, the action `deleteGamesSuccess` will be
   * dispatched. Otherwise if an error occured while caching, the
   * `deleteGamesFailure` action gets dispatched.
   */
  deleteWeeks$ = createGenericEffect(
    this.actions$,
    WeeksActions.deleteWeeks,
    () => this.weeksService.deleteWeeks(),
    () => ({
      success: () => WeeksActions.deleteWeeksSuccess(),
      failure: () => WeeksActions.deleteWeeksFailure(),
    }),
  )(this.toastService);

  /**
   * This effect listens to the `cacheWeeks` action and will try to start the
   * process of caching all `Weeks` from the `HVW API`.
   *
   * In case the `Weeks` have been cached successfully from the `HVW API` by
   * the respective endpoint in the API, the action `cacheWeeksSuccess`
   * containg the received `Caching Result` will be dispatched. Otherwise if an
   * error occured while caching, the `cacheWeeksFailure` action
   *  will be dispatched.
   */
  cacheWeeks$ = createDefaultCachingEffect(
    this.actions$,
    WeeksActions.cacheWeeks,
    this.store.pipe(select(fromAuth.selectUser)),
    (_, user) => this.weeksService.cache(HvwCachingType.WEEKS, user._id),
    () => ({
      success: cachingResult =>
        WeeksActions.cacheWeeksSuccess({ cachingResult }),
      failure: () => WeeksActions.cacheWeeksFailure(),
    }),
  );

  constructor(
    private actions$: Actions,
    private store: Store<fromAuth.State & fromHvw.State>,
    private weeksService: HvwWeeksService,
    private toastService: HotToastService,
  ) {}
}
