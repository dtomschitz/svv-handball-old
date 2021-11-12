import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * This component is usedto display the `Verify` page where the `User` is waiting
 * for getting authenticated.
 */
@Component({
  selector: 'verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VerifyPageComponent {}
