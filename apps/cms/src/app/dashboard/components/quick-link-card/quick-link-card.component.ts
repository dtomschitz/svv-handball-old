import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

@Component({
  selector: 'quick-link-card',
  templateUrl: './quick-link-card.component.html',
  styleUrls: ['./quick-link-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuickLinkCardComponent {
  @Input() title: string;
  @Input() subtitle: string;
  @Input() label: string;
  @Input() count: number;

  @Output() navigate: EventEmitter<void> = new EventEmitter();
}
