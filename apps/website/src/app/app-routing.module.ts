import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { environment } from '@svv/website/environments/environment';
import { PageNotFoundComponent } from '@svv/website/core/containers';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'startseite',
  },
  {
    path: 'startseite',
    loadChildren: () =>
      import('@svv/website/pages/home/home.module').then(m => m.HomeModule),
  },
  {
    path: 'ansprechpartner',
    loadChildren: () =>
      import('@svv/website/pages/contact-persons/contact-persons.module').then(
        m => m.ContactPersonsModule,
      ),
  },
  {
    path: 'datenschutz',
    loadChildren: () =>
      import('@svv/website/pages/data-protection/data-protection.module').then(
        m => m.DataProtectionModule,
      ),
  },
  {
    path: 'downloads',
    loadChildren: () =>
      import('@svv/website/pages/downloads/downloads.module').then(
        m => m.DownloadsModule,
      ),
  },
  {
    path: 'impressum',
    loadChildren: () =>
      import('@svv/website/pages/imprint/imprint.module').then(
        m => m.ImprintModule,
      ),
  },
  {
    path: 'orga-team',
    loadChildren: () =>
      import('@svv/website/pages/orga/orga.module').then(m => m.OrgaModule),
  },
  {
    path: 'sponsoren',
    loadChildren: () =>
      import('@svv/website/pages/sponsors/sponsors.module').then(
        m => m.SponsorsModule,
      ),
  },
  {
    path: 'mannschaften',
    loadChildren: () =>
      import('@svv/website/pages/teams/teams.module').then(m => m.TeamsModule),
  },
  {
    path: '404',
    component: PageNotFoundComponent,
  },
  {
    path: '**',
    redirectTo: '404',
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      initialNavigation: 'enabled',
      scrollPositionRestoration: 'top',
      useHash: !environment.production,
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
