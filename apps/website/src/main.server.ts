import { enableProdMode } from '@angular/core';
import { environment } from '@svv/website/environments/environment';

if (environment.production) {
  enableProdMode();
}

export { AppServerModule } from '@svv/website/app-server.module';
export { renderModule, renderModuleFactory } from '@angular/platform-server';
