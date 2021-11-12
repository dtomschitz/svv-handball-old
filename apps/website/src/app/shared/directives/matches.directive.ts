import { BreakpointObserver } from '@angular/cdk/layout';
import {
  Directive,
  Input,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { Subject } from 'rxjs';
import { startWith, takeUntil } from 'rxjs/operators';

export const breakpoints = {
  desktop: '(min-width: 1024px)',
  mobile: '(max-width: 1023px)',
};

@Directive({
  selector: '[matches]',
})
export class MatchesDirective implements OnInit, OnDestroy {
  private readonly destroy$: Subject<void> = new Subject<void>();

  @Input() matches: keyof typeof breakpoints;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private templateRef: TemplateRef<any>,
    private viewContainerRef: ViewContainerRef,
  ) {}

  ngOnInit() {
    const breakpoint = breakpoints[this.matches];
    this.breakpointObserver
      .observe(breakpoint)
      .pipe(startWith(), takeUntil(this.destroy$))
      .subscribe(matches => {
        matches.breakpoints[breakpoint]
          ? this.viewContainerRef.createEmbeddedView(this.templateRef)
          : this.viewContainerRef.clear();
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
