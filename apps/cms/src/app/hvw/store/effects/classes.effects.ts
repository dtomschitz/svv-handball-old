import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { catchError, delay, map, switchMap } from 'rxjs/operators';
import { select, Store } from '@ngrx/store';
import { HotToastService } from '@ngneat/hot-toast';
import { HvwCachingType } from '@svv/core/models';
import { createGenericEffect } from '@svv/cms/core/store/effects';
import { ClassesActions } from '@svv/cms/hvw/store/actions';
import { HvwClassesService } from '@svv/cms/hvw/services';
import { createDefaultCachingEffect } from './default-caching-effect';
import * as fromAuth from '@svv/cms/auth/store/reducers';
import * as fromHvw from '@svv/cms/hvw/store/reducers';

const defaultDelay = 500;

@Injectable()
export class ClassesEffects {
  /**
   * This effect listens to the `loadClasses` action and will try to fetch all
   * `Classes` from the API. In case the `Classes` have been already loaded and
   * stored in the state, the effect will use the cached `Classes` instead of
   * loading the data from the database each time.
   *
   * In case the `Classes` have been fetched successfully from the respective
   * endpoint in the API, the action `loadClassesSuccess` containg the received
   * `Classes` will be dispatched. Otherwise if an error occured while loading,
   * the `loadClassesFailure` action gets dispatched.
   */
  loadClasses$ = createGenericEffect(
    this.actions$,
    ClassesActions.loadClasses,
    () => this.classesService.getClasses(),
    () => ({
      success: classes => ClassesActions.loadClassesSuccess({ classes }),
      failure: () => ClassesActions.loadClassesFailure(),
      cache: () => ClassesActions.loadCachedClasses(),
    }),
    {
      cachingSelector: this.store.pipe(select(fromHvw.selectIsClassesLoaded)),
    },
  )();

  /**
   * This effect listens to the `loadClassesCachingResults` action and will try
   * to fetch all `Caching Results` from the API.
   *
   * In case the `Caching Results` have been fetched successfully from the
   * respective endpoint in the API, the action `loadClassesCachingResultsSuccess`
   * containg the received `Caching Results` will be dispatched. Otherwise if an
   * error occured while loading, the `loadClassesCachingResultsFailure` action
   * gets dispatched.
   */
  loadClassesCachingResults$ = createGenericEffect(
    this.actions$,
    ClassesActions.loadClassesCachingResults,
    () => this.classesService.getCachingResults(HvwCachingType.CLASSES),
    () => ({
      success: cachingResults =>
        ClassesActions.loadClassesCachingResultsSuccess({ cachingResults }),
      failure: () => ClassesActions.loadClassesCachingResultsFailure(),
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
  refreshClasses$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ClassesActions.refreshClasses, ClassesActions.cacheClassesSuccess),
      switchMap(() =>
        this.classesService.getClasses().pipe(
          delay(defaultDelay),
          map(classes => ClassesActions.loadClassesSuccess({ classes })),
          catchError(() => of(ClassesActions.loadClassesFailure())),
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
  deleteClasses$ = createGenericEffect(
    this.actions$,
    ClassesActions.deleteClasses,
    () => this.classesService.deleteClasses(),
    () => ({
      success: () => ClassesActions.deleteClassesSuccess(),
      failure: () => ClassesActions.deleteClassesFailure(),
    }),
  )(this.toastService);

  /**
   * This effect listens to the `cacheClasses` action and will try to start the
   * process of caching all `Classes` from the `HVW API`.
   *
   * In case the `Classes` have been cached successfully from the `HVW API` by
   * the respective endpoint in the API, the action `cacheClassesSuccess`
   * containg the received `Caching Result` will be dispatched. Otherwise if an
   * error occured while caching, the `cacheClassesFailure` action
   *  will be dispatched.
   */
  cacheClasses$ = createDefaultCachingEffect(
    this.actions$,
    ClassesActions.cacheClasses,
    this.store.pipe(select(fromAuth.selectUser)),
    (_, user) => this.classesService.cache(HvwCachingType.CLASSES, user._id),
    () => ({
      success: cachingResult =>
        ClassesActions.cacheClassesSuccess({ cachingResult }),
      failure: () => ClassesActions.cacheClassesFailure(),
    }),
  );

  constructor(
    private actions$: Actions,
    private store: Store<fromAuth.State & fromHvw.State>,
    private classesService: HvwClassesService,
    private toastService: HotToastService,
  ) {}
}
