import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { catchError, delay, map, switchMap } from 'rxjs/operators';
import { select, Store } from '@ngrx/store';
import { HotToastService } from '@ngneat/hot-toast';
import { HvwCachingType } from '@svv/core/models';
import { createGenericEffect } from '@svv/cms/core/store/effects';
import { TablesActions } from '@svv/cms/hvw/store/actions';
import { HvwTablesService } from '@svv/cms/hvw//services';
import { createDefaultCachingEffect } from './default-caching-effect';
import * as fromHvw from '@svv/cms/hvw/store/reducers';
import * as fromAuth from '@svv/cms/auth/store/reducers';

const defaultDelay = 500;

@Injectable()
export class TablesEffects {
  /**
   * This effect listens to the `loadTables` action and will try to fetch all
   * `Tables` from the API. In case the `Tables` have been already loaded and
   * stored in the state, the effect will use the cached `Tables` instead of
   * loading the data from the database each time.
   *
   * In case the `Tables` have been fetched successfully from the respective
   * endpoint in the API, the action `loadTablesSuccess` containg the received
   * `Tables` will be dispatched. Otherwise if an error occured while loading,
   * the `loadCachedTables` action gets dispatched.
   */
  loadTables$ = createGenericEffect(
    this.actions$,
    TablesActions.loadTables,
    () => this.tablesService.getTables(),
    () => ({
      success: tables => TablesActions.loadTablesSuccess({ tables }),
      failure: () => TablesActions.loadTablesFailure(),
      cache: () => TablesActions.loadCachedTables(),
    }),
    {
      cachingSelector: this.store.pipe(select(fromHvw.selectIsTablesLoaded)),
    },
  )();

  /**
   * This effect listens to the `loadTablesCachingResults` action and will try
   * to fetch all `Caching Results` from the API.
   *
   * In case the `Caching Results` have been fetched successfully from the
   * respective endpoint in the API, the action `loadTablesCachingResultsSuccess`
   * containg the received `Caching Results` will be dispatched. Otherwise if an
   * error occured while loading, the `loadTablesCachingResultsFailure` action
   * gets dispatched.
   */
  loadTablesCachingResults$ = createGenericEffect(
    this.actions$,
    TablesActions.loadTablesCachingResults,
    () => this.tablesService.getCachingResults(HvwCachingType.CLASSES),
    () => ({
      success: cachingResults =>
        TablesActions.loadTablesCachingResultsSuccess({ cachingResults }),
      failure: () => TablesActions.loadTablesCachingResultsFailure(),
    }),
  )();

  /**
   * This effect listens to the `refreshTables` or `cacheTablesSuccess` action
   * and will try to fetch all `Tables` from the API. In contrast to the
   * `loadTables` effect, this one will not try to look up into the cache to
   * check if the `Tables` have been loaded already.
   *
   * In case the `Tables` have been fetched successfully from the respective
   * endpoint in the API, the action `loadTablesSuccess` containg the received
   * `Tables` will be dispatched. Otherwise if an error occured while loading,
   * the `loadTablesFailure` action gets dispatched.
   */
  refreshTables$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TablesActions.refreshTables, TablesActions.cacheTablesSuccess),
      switchMap(() =>
        this.tablesService.getTables().pipe(
          delay(defaultDelay),
          map(tables => TablesActions.loadTablesSuccess({ tables })),
          catchError(() => of(TablesActions.loadTablesFailure())),
        ),
      ),
    ),
  );

  /**
   * This effect listens to the `deleteTables` action and will try to start the
   * deletion process of all `Tables` from the database.
   *
   * In case the `Tables` have been deleted successfully from the `Database` by
   * the respective endpoint in the API, the action `deleteTablesSuccess` will
   * be dispatched. Otherwise if an error occured while caching, the
   * `deleteTablesFailure` action gets dispatched.
   */
  deleteTables$ = createGenericEffect(
    this.actions$,
    TablesActions.deleteTables,
    () => this.tablesService.deleteTables(),
    () => ({
      success: () => TablesActions.deleteTablesSuccess(),
      failure: () => TablesActions.deleteTablesFailure(),
    }),
  )(this.toastService);

  /**
   * This effect listens to the `cacheTables` action and will try to start the
   * process of caching all `Tables` from the `HVW API`.
   *
   * In case the `Tables` have been cached successfully from the `HVW API` by
   * the respective endpoint in the API, the action `cacheTablesSuccess`
   * containg the received `Caching Result` will be dispatched. Otherwise if an
   * error occured while caching, the `cacheTablesFailure` action
   *  will be dispatched.
   */
  cacheClasses$ = createDefaultCachingEffect(
    this.actions$,
    TablesActions.cacheTables,
    this.store.pipe(select(fromAuth.selectUser)),
    (_, user) => this.tablesService.cache(HvwCachingType.TABLES, user._id),
    () => ({
      success: cachingResult =>
        TablesActions.cacheTablesSuccess({ cachingResult }),
      failure: () => TablesActions.cacheTablesFailure(),
    }),
  );

  constructor(
    private actions$: Actions,
    private store: Store<fromAuth.State & fromHvw.State>,
    private tablesService: HvwTablesService,
    private toastService: HotToastService,
  ) {}
}
