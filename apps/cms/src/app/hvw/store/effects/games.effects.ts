import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { catchError, delay, map, switchMap } from 'rxjs/operators';
import { select, Store } from '@ngrx/store';
import { HvwCachingType } from '@svv/core/models';
import { createGenericEffect } from '@svv/cms/core/store/effects';
import { GamesActions } from '@svv/cms/hvw/store/actions';
import { HvwGamesService } from '@svv/cms/hvw//services';
import { createDefaultCachingEffect } from './default-caching-effect';
import * as fromHvw from '@svv/cms/hvw/store/reducers';
import * as fromAuth from '@svv/cms/auth/store/reducers';
import { HotToastService } from '@ngneat/hot-toast';

const defaultDelay = 500;

@Injectable()
export class GamesEffects {
  /**
   * This effect listens to the `loadGames` action and will try to fetch all
   * `Games` from the API. In case the `Games` have been already loaded and
   * stored in the state, the effect will use the cached `Games` instead of
   * loading the data from the database each time.
   *
   * In case the `Games` have been fetched successfully from the respective
   * endpoint in the API, the action `loadGamesSuccess` containg the received
   * `Games` will be dispatched. Otherwise if an error occured while loading,
   * the `loadGamesFailure` action gets dispatched.
   */
  loadGames$ = createGenericEffect(
    this.actions$,
    GamesActions.loadGames,
    () => this.gamesService.getGames(),
    () => ({
      success: games => GamesActions.loadGamesSuccess({ games }),
      failure: () => GamesActions.loadGamesFailure(),
      cache: () => GamesActions.loadCachedGames(),
    }),
    {
      cachingSelector: this.store.pipe(select(fromHvw.selectIsGamesLoaded)),
    },
  )();

  /**
   * This effect listens to the `loadGamesCachingResults` action and will try to
   * fetch all `Caching Results` from the API.
   *
   * In case the `Caching Results` have been fetched successfully from the
   * respective endpoint in the API, the action `loadGamesCachingResultsSuccess`
   * containg the received `Caching Results` will be dispatched. Otherwise if an
   * error occured while loading, the `loadGamesCachingResultsFailure` action
   * gets dispatched.
   */
  loadGamesCachingResults$ = createGenericEffect(
    this.actions$,
    GamesActions.loadGamesCachingResults,
    () => this.gamesService.getCachingResults(HvwCachingType.GAMES),
    () => ({
      success: cachingResults =>
        GamesActions.loadGamesCachingResultsSuccess({ cachingResults }),
      failure: () => GamesActions.loadGamesCachingResultsFailure(),
    }),
  )();

  /**
   * This effect listens to the `refreshGames` or `cacheGamesSuccess` action
   * and will try to fetch all `Games` from the API. In contrast to the
   * `loadGames` effect, this one will not try to look up into the cache to
   * check if the `Games` have been loaded already.
   *
   * In case the `Games` have been fetched successfully from the respective
   * endpoint in the API, the action `loadGamesSuccess` containg the received
   * `Games` will be dispatched. Otherwise if an error occured while loading,
   * the `loadGamesFailure` action gets dispatched.
   */
  refreshGames$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GamesActions.refreshGames, GamesActions.cacheGamesSuccess),
      switchMap(() =>
        this.gamesService.getGames().pipe(
          delay(defaultDelay),
          map(games => GamesActions.loadGamesSuccess({ games })),
          catchError(() => of(GamesActions.loadGamesFailure())),
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
  deleteGames$ = createGenericEffect(
    this.actions$,
    GamesActions.deleteGames,
    () => this.gamesService.deleteGames(),
    () => ({
      success: () => GamesActions.deleteGamesSuccess(),
      failure: () => GamesActions.deleteGamesFailure(),
    }),
  )(this.toastService);

  /**
   * This effect listens to the `cacheGames` action and will try to start the
   * process of caching all `Games` from the `HVW API`.
   *
   * In case the `Games` have been cached successfully from the `HVW API` by
   * the respective endpoint in the API, the action `cacheGamesSuccess`
   * containg the received `Caching Result` will be dispatched. Otherwise if an
   * error occured while caching, the `cacheGamesFailure` action will be dispatched.
   */
  cacheGames$ = createDefaultCachingEffect(
    this.actions$,
    GamesActions.cacheGames,
    this.store.pipe(select(fromAuth.selectUser)),
    (_, user) => this.gamesService.cache(HvwCachingType.GAMES, user._id),
    () => ({
      success: cachingResult =>
        GamesActions.cacheGamesSuccess({ cachingResult }),
      failure: () => GamesActions.cacheGamesFailure(),
    }),
  );

  constructor(
    private actions$: Actions,
    private store: Store<fromAuth.State & fromHvw.State>,
    private gamesService: HvwGamesService,
    private toastService: HotToastService,
  ) {}
}
