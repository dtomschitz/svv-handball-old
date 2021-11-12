import { Injectable, Injector } from '@angular/core';
import { DialogService } from '@svv/cms/core/services';
import { LogoutDialog } from '@svv/cms/auth/components';

@Injectable()
export class AuthDialogService extends DialogService {
  constructor(injector: Injector) {
    super(injector);
  }

  /**
   * Opens the `Logout Dialog` containing a loading indicator.
   */
  showLogoutDialog() {
    return this.showDialog<LogoutDialog, any, any>(LogoutDialog, {
      disableClose: true,
      height: '312px',
      width: '312px',
    });
  }
}
