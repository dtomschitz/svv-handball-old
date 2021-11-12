import { ApplicationRef, Injectable, OnDestroy } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { concat, interval, NEVER, Observable, Subject } from 'rxjs';
import { first, map, takeUntil, tap } from 'rxjs/operators';

@Injectable()
export class SwUpdatesService implements OnDestroy {
  private readonly destroy$: Subject<void> = new Subject<void>();

  private checkInterval = 1000 * 60 * 60 * 6;
  updateActivated$: Observable<string>;

  constructor(applicationRef: ApplicationRef, private swUpdate: SwUpdate) {
    if (!swUpdate.isEnabled) {
      this.updateActivated$ = NEVER.pipe(takeUntil(this.destroy$));
      return;
    }

    const appIsStable = applicationRef.isStable.pipe(first(v => v));
    concat(appIsStable, interval(this.checkInterval))
      .pipe(
        tap(() => this.log('Checking for update...')),
        takeUntil(this.destroy$),
      )
      .subscribe(() => this.swUpdate.checkForUpdate());

    this.swUpdate.available
      .pipe(
        tap(evt => this.log(`Update available: ${JSON.stringify(evt)}`)),
        takeUntil(this.destroy$),
      )
      .subscribe(() => this.swUpdate.activateUpdate());

    this.updateActivated$ = this.swUpdate.activated.pipe(
      tap(evt => this.log(`Update activated: ${JSON.stringify(evt)}`)),
      map(evt => evt.current.hash),
      takeUntil(this.destroy$),
    );
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private log(message: string) {
    const timestamp = new Date().toISOString();
    console.log(`[SwUpdates - ${timestamp}]: ${message}`);
  }
}
