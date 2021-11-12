import { ChangeDetectionStrategy, Component } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { LayoutActions, RouterActions } from '@svv/cms/core/store/actions';
import { AuthActions } from '@svv/cms/auth/store/actions';
import { FeatureBar } from '@svv/cms/core/models/';
import * as fromRoot from '@svv/cms/reducers';
import * as fromAuth from '@svv/cms/auth/store/reducers';

/**
 * Root component which contains the app header, the sidenav container as well
 * as the router outlet which displays the different components based on current
 * navigation.
 */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  showSidenav$: Observable<boolean>;
  isLoggedIn$: Observable<boolean>;
  featureBar$: Observable<FeatureBar>;

  constructor(private store: Store<fromRoot.State & fromAuth.State>) {
    this.isLoggedIn$ = this.store.pipe(select(fromAuth.selectIsLoggedIn));
    this.showSidenav$ = this.store.pipe(select(fromRoot.selectShowSidenav));
    this.featureBar$ = this.store.pipe(select(fromRoot.selectFeatureBar));
  }

  /**
   * Dispatches the action for navigating to the given URL.
   * @param url The URL to be navigated to.
   */
  navigateTo(url: string) {
    this.store.dispatch(RouterActions.navigate({ path: [url] }));
  }

  /**
   * Dispatches the action for opening the Sidenav.
   */
  openSidenav() {
    this.store.dispatch(LayoutActions.openSidenav());
  }

  /**
   * Dispatches the action for closing the Sidenav.
   */
  closeSidenav() {
    this.store.dispatch(LayoutActions.closeSidenav());
  }

  /**
   * Dispatches the action for toggling the Sidenav.
   */
  toggleSidenav() {
    this.store.dispatch(LayoutActions.toggleSidenav());
  }

  /**
   * Dispatches the action for logging out the current `User`.
   */
  logout() {
    this.store.dispatch(AuthActions.logout());
  }
}
