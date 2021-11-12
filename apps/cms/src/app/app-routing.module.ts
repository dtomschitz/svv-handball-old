import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { AuthGuard } from '@svv/cms/auth/services';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('@svv/cms/dashboard/dashboard.module').then(
        m => m.DashboardModule,
      ),
    canActivate: [AuthGuard],
    data: {
      feature: {
        title: 'Dashboard',
        path: '',
      },
    },
  },
  {
    path: 'teams',
    loadChildren: () =>
      import('@svv/cms/teams/teams.module').then(m => m.TeamsModule),
    canActivate: [AuthGuard],
    data: {
      feature: {
        title: 'Mannschaften',
        path: 'teams',
        tabs: [
          {
            name: 'Aktive',
            routerLink: 'active',
          },
          {
            name: 'Jugend',
            routerLink: 'youth',
          },
          {
            name: 'Fotos',
            routerLink: 'images',
          },
        ],
      },
    },
  },
  {
    path: 'users',
    loadChildren: () =>
      import('@svv/cms/users/users.module').then(m => m.UsersModule),
    canActivate: [AuthGuard],
    data: {
      feature: {
        title: 'Benutzer',
        path: 'users',
        tabs: [
          {
            name: 'Administratoren',
            routerLink: 'admins',
          },
          {
            name: 'Autoren',
            routerLink: 'authors',
          },
          {
            name: 'Trainer',
            routerLink: 'coaches',
          },
        ],
      },
    },
  },
  {
    path: 'sponsors',
    loadChildren: () =>
      import('@svv/cms/sponsors/sponsors.module').then(m => m.SponsorsModule),
    canActivate: [AuthGuard],
    data: {
      feature: {
        title: 'Sponsoren',
        path: 'sponsors',
      },
    },
  },
  {
    path: 'contact-persons',
    loadChildren: () =>
      import('@svv/cms/contact-persons/contact-persons.module').then(
        m => m.ContactPersonsModule,
      ),
    canActivate: [AuthGuard],
    data: {
      feature: {
        title: 'Ansprechpartner',
        path: 'contact-persons',
        tabs: [
          {
            name: 'Übersicht',
            routerLink: '',
          },
          {
            name: 'Kategorien',
            routerLink: 'categories',
          },
        ],
      },
    },
  },
  {
    path: 'images',
    loadChildren: () =>
      import('@svv/cms/images/images.module').then(m => m.ImagesModule),
    canActivate: [AuthGuard],
    data: {
      feature: {
        title: 'Bilder',
        path: 'images',
        tabs: [
          {
            name: 'Mannschaften',
            routerLink: '',
          },
          {
            name: 'Sponsoren',
            routerLink: 'sponsors',
          },
          {
            name: 'Tags',
            routerLink: 'tags',
          },
        ],
      },
    },
  },
  {
    path: 'hvw',
    loadChildren: () =>
      import('@svv/cms/hvw/hvw.module').then(m => m.HvwModule),
    canActivate: [AuthGuard],
    data: {
      feature: {
        title: 'HVW Spielbetrieb',
        path: 'hvw',
        tabs: [
          {
            name: 'Begegnungen',
            routerLink: 'games',
          },
          {
            name: 'Spielklassen',
            routerLink: 'classes',
          },
          {
            name: 'Spielwochen',
            routerLink: 'weeks',
          },
          {
            name: 'Tabellen',
            routerLink: 'tables',
          },
          {
            name: 'CronJobs',
            routerLink: 'jobs',
          },
        ],
      },
    },
  },
  {
    path: 'articles',
    loadChildren: () =>
      import('@svv/cms/articles/articles.module').then(m => m.ArticlesModule),
    canActivate: [AuthGuard],
    data: {
      feature: {
        title: 'Berichte',
        path: 'articles',
        tabs: [
          {
            name: 'Angeheftet Berichte',
            routerLink: '',
          },
          {
            name: 'Alle Berichte',
            routerLink: 'any',
          },
          {
            name: 'Kategorien',
            routerLink: 'categories',
          },
        ],
      },
    },
  },
  {
    path: '**',
    redirectTo: '',
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      useHash: true,
      relativeLinkResolution: 'legacy',
      preloadingStrategy: PreloadAllModules,
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
