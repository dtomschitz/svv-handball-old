import { NgModule } from '@angular/core';
import {
  ServerModule,
  ServerTransferStateModule,
} from '@angular/platform-server';
import { AppComponent } from '@svv/website/core/containers';
import { UniversalDeviceDetectorService } from '@svv/website/core/services';
import { DeviceDetectorService } from 'ngx-device-detector';
import { AppModule } from './app.module';

@NgModule({
  imports: [AppModule, ServerModule, ServerTransferStateModule],
  providers: [
    {
      provide: DeviceDetectorService,
      useClass: UniversalDeviceDetectorService,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppServerModule {}
