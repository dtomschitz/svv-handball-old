import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 *  This component is usedas an dialog for displaying a loading indicator in
 * order to visualize the logout process for ht `User`.
 */
@Component({
  selector: 'logout-dialog',
  templateUrl: './logout-dialog.component.html',
  styleUrls: ['./logout-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LogoutDialog {}
