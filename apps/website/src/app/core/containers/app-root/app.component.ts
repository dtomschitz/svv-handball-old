import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { RouterService } from '@svv/website/core/services';
import { DeviceDetectorService } from 'ngx-device-detector';
import { BreakpointObserver } from '@angular/cdk/layout';
import { takeUntil } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';
import { TeamsService } from '@svv/website/state/teams';

type SidenavMode = 'over' | 'side';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit, OnDestroy {
  private readonly destroy$: Subject<void> = new Subject<void>();

  @HostBinding('class') class: string;

  showSidenav$ = new BehaviorSubject<boolean>(false);
  sidenavMode$ = new BehaviorSubject<SidenavMode>('side');
  showLeftSidenav$ = new BehaviorSubject<boolean>(false);

  isScrolling: boolean;
  isDesktop: boolean;

  constructor(
    private routerService: RouterService,
    private breakpointObserver: BreakpointObserver,
    private deviceService: DeviceDetectorService,
    private teamsService: TeamsService,
    @Inject(PLATFORM_ID) private platformId: string,
  ) {
    this.isDesktop = this.deviceService.isDesktop();
    this.class = this.isDesktop ? 'desktop' : 'mobile';
  }

  ngOnInit() {
    if (this.isBrowser) {
      this.teamsService.getTeams().pipe(takeUntil(this.destroy$)).subscribe();

      this.breakpointObserver
        .observe('(min-width: 1140px)')
        .pipe(takeUntil(this.destroy$))
        .subscribe(results => {
          this.showSidenav$.next(results.matches);
          this.sidenavMode$.next(results.matches ? 'side' : 'over');
        });
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onScroll(event: any) {
    this.isScrolling = event.target.scrollTop > 20;
  }

  navigateTo(path: string) {
    this.routerService.navigate(path);
    if (
      this.showSidenav$.getValue() &&
      this.sidenavMode$.getValue() === 'over'
    ) {
      this.showSidenav$.next(false);
    }
  }

  toggleSidenav() {
    this.showSidenav$.next(!this.showSidenav$.getValue());
  }

  get isBrowser() {
    return isPlatformBrowser(this.platformId);
  }
}
