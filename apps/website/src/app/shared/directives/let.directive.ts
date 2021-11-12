import {
  ChangeDetectorRef,
  Directive,
  Input,
  NgZone,
  OnDestroy,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import {
  EMPTY,
  NextObserver,
  Observable,
  ObservableInput,
  Observer,
  Subject,
  Subscribable,
  Unsubscribable,
} from 'rxjs';
import {
  catchError,
  distinctUntilChanged,
  switchMap,
  tap,
} from 'rxjs/operators';

export interface RenderConfig {
  ngZone: NgZone;
  cdRef: ChangeDetectorRef;
}

export interface CdAware<U> extends Subscribable<U> {
  nextPotentialObservable: (value: any) => void;
}

export interface LetViewContext<T> {
  $implicit?: T;
  ngxLet?: T;
  $error?: boolean;
  $complete?: boolean;
}

@Directive({ selector: '[ngxLet]' })
export class LetDirective<U> implements OnDestroy {
  private embeddedView: any;
  private readonly ViewContext: LetViewContext<U | undefined | null> = {
    $implicit: undefined,
    ngxLet: undefined,
    $error: false,
    $complete: false,
  };

  protected readonly subscription: Unsubscribable;
  private readonly cdAware: CdAware<U | null | undefined>;
  private readonly resetContextObserver: NextObserver<void> = {
    next: () => {
      if (this.embeddedView) {
        this.ViewContext.$implicit = undefined;
        this.ViewContext.ngxLet = undefined;
        this.ViewContext.$error = false;
        this.ViewContext.$complete = false;
      }
    },
  };
  private readonly updateViewContextObserver: Observer<U | null | undefined> = {
    next: (value: U | null | undefined) => {
      if (!this.embeddedView) {
        this.createEmbeddedView();
      }

      this.ViewContext.$implicit = value;
      this.ViewContext.ngxLet = value;
    },
    error: (error: Error) => {
      if (!this.embeddedView) {
        this.createEmbeddedView();
      }

      this.ViewContext.$error = true;
    },
    complete: () => {
      if (!this.embeddedView) {
        this.createEmbeddedView();
      }

      this.ViewContext.$complete = true;
    },
  };

  static ngTemplateContextGuard<U>(
    dir: LetDirective<U>,
    ctx: unknown | null | undefined,
  ) {
    return true;
  }

  static ngTemplateGuard_ngxLet: 'binding';

  @Input()
  set ngxLet(potentialObservable: ObservableInput<U> | null | undefined) {
    this.cdAware.nextPotentialObservable(potentialObservable);
  }

  constructor(
    cdRef: ChangeDetectorRef,
    ngZone: NgZone,
    private readonly templateRef: TemplateRef<LetViewContext<U>>,
    private readonly viewContainerRef: ViewContainerRef,
  ) {
    this.cdAware = createCdAware<U>({
      render: createRender({ cdRef, ngZone }),
      resetContextObserver: this.resetContextObserver,
      updateViewContextObserver: this.updateViewContextObserver,
    });
    this.subscription = this.cdAware.subscribe();
  }

  createEmbeddedView() {
    this.embeddedView = this.viewContainerRef.createEmbeddedView(
      this.templateRef,
      this.ViewContext,
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.viewContainerRef.clear();
  }
}

export function createRender(config: RenderConfig) {
  function render() {
    if (hasZone(config.ngZone)) {
      config.cdRef.markForCheck();
    } else {
      config.cdRef.detectChanges();
    }
  }

  return render;
}

export function createCdAware<U>(cfg: {
  render: () => void;
  resetContextObserver: NextObserver<void>;
  updateViewContextObserver: NextObserver<U | undefined | null>;
}) {
  const potentialObservablesSubject = new Subject<
    Observable<U> | undefined | null
  >();
  const observablesFromTemplate$ = potentialObservablesSubject.pipe(
    distinctUntilChanged(),
  );

  const rendering$ = observablesFromTemplate$.pipe(
    switchMap(observable$ => {
      if (observable$ == null) {
        cfg.updateViewContextObserver.next(observable$ as any);
        cfg.render();

        return EMPTY;
      }

      cfg.resetContextObserver.next();
      cfg.render();

      return observable$.pipe(
        distinctUntilChanged(),
        tap(cfg.updateViewContextObserver),
        tap(() => cfg.render()),
        catchError(e => {
          console.error(e);
          return EMPTY;
        }),
      );
    }),
  );

  return {
    nextPotentialObservable(value: Observable<U> | undefined | null) {
      potentialObservablesSubject.next(value);
    },
    subscribe() {
      return rendering$.subscribe();
    },
  } as CdAware<U | undefined | null>;
}

export function hasZone(z: NgZone) {
  return z instanceof NgZone;
}
