import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Service, DashboardInfo } from '@svv/core/models';
import { DashboardService } from '@svv/cms/dashboard/services';
import { RouterActions } from '@svv/cms/core/store/actions';
import * as fromRoot from '@svv/cms/reducers';

interface QuickLinkCard {
  title: string;
  subtitle: string;
  label?: string;
  link: string;
}

@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {
  services$: Observable<Service[]>;
  info$: Observable<DashboardInfo>;

  cards: QuickLinkCard[] = [
    {
      title: 'Benutzer',
      subtitle:
        'Erstelle und verwalte Benutzer, die als Autoren oder Trainer genutzt werden können',
      label: 'Erstellte Benutzer:',
      link: 'users',
    },
    {
      title: 'Ansprechpartner',
      subtitle:
        'Erstelle und verwalte Berichte, die auf der Webseite angezeigt werden sollen',
      label: 'Erstellte Ansprechpartner:',
      link: 'contact-persons',
    },
    {
      title: 'Berichte',
      subtitle:
        'Erstelle und verwalte Berichte, die auf der Webseite angezeigt werden sollen',
      label: 'Erstellte Berichte:',
      link: 'articles',
    },
    {
      title: 'Mannschaften',
      subtitle:
        'Erstelle und verwalte Mannschaften sowie deren Bilder, Trainer und HVW-Einstellungen',
      label: 'Erstellte Mannschaften:',
      link: 'teams',
    },
    {
      title: 'Sponsoren',
      subtitle: 'Erstelle und verwalte Sponsoren',
      label: 'Erstellte Sponsoren:',
      link: 'sponsors',
    },
    {
      title: 'HVW',
      subtitle:
        'Verwalte teile des Spielbetriebs für erstellen Mannschaften, sowie die dazugehörigen CronJobs',
      link: 'hvw',
    },
  ];

  constructor(
    private dashboardService: DashboardService,
    private store: Store<fromRoot.State>,
  ) {
    //this.services$ = this.dashboardService.getServices();
    this.info$ = this.dashboardService.getDashboardInfo();
  }

  navigateTo(url: string) {
    this.store.dispatch(RouterActions.navigate({ path: [url] }));
  }

  refreshStatus() {}

  emptyArray(length: number) {
    return Array(length);
  }
}
