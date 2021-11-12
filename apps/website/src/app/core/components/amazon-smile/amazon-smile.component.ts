import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'amazon-smile',
  templateUrl: './amazon-smile.component.html',
  styleUrls: ['./amazon-smile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AmazonSmileComponent {}
