import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveComponentModule } from '@ngrx/component';
import { MaterialModule } from '@svv/cms/material';
import { SharedModule } from '@svv/cms/shared';
import { DashboardComponent } from './containers';
import { QuickLinkCardComponent } from './components';
import { DashboardService } from './services';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { StatusCardComponent } from './components/status-card/status-card.component';

@NgModule({
  declarations: [
    DashboardComponent,
    QuickLinkCardComponent,
    StatusCardComponent,
  ],
  imports: [
    CommonModule,
    ReactiveComponentModule,
    MaterialModule,
    SharedModule,
    DashboardRoutingModule,
  ],
  providers: [DashboardService],
})
export class DashboardModule {}
