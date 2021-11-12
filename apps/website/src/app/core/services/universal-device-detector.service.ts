import { Inject, Injectable, Optional, PLATFORM_ID } from '@angular/core';
import { isPlatformServer } from '@angular/common';
import { REQUEST } from '@nguniversal/express-engine/tokens';
import { Request } from 'express';
import { DeviceDetectorService } from 'ngx-device-detector';

@Injectable()
export class UniversalDeviceDetectorService extends DeviceDetectorService {
  constructor(
    @Inject(PLATFORM_ID) platformId: any,
    @Optional() @Inject(REQUEST) request: Request,
  ) {
    super(platformId);
    if (isPlatformServer(platformId) && request) {
      super.setDeviceInfo((request.headers['user-agent'] as string) || '');
    }
  }
}
