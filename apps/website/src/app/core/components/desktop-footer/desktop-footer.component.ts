import { ChangeDetectionStrategy, Component, HostBinding } from '@angular/core';

@Component({
  selector: 'desktop-footer',
  templateUrl: './desktop-footer.component.html',
  styleUrls: ['./desktop-footer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DesktopFooterComponent {
  @HostBinding('class') dekstopFooterClass = 'desktop-footer';
}
