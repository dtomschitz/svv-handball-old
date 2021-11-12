import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostBinding,
  Output,
} from '@angular/core';

@Component({
  selector: 'footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent {
  @Output() navigate: EventEmitter<string> = new EventEmitter<string>();
  @HostBinding('class') appFooterClass = 'app-footer';
}
