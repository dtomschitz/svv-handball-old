import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FeatureBar, FeatureTab } from '@svv/cms/core/models';

@Component({
  selector: 'feature-bar',
  templateUrl: './feature-bar.component.html',
  styleUrls: ['./feature-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeatureBarComponent {
  @Input() featureBar: FeatureBar;
  @Output() navigate: EventEmitter<string> = new EventEmitter<string>();

  navigateTo(path: string, tab: FeatureTab) {
    this.navigate.emit(`${path}/${tab.routerLink}`);
  }
}
