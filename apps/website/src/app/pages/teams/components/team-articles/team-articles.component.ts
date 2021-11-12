import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'team-articles',
  templateUrl: './team-articles.component.html',
  styleUrls: ['./team-articles.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TeamArticlesComponent {
  @Input() articleCategoryId: string;

  emptyArray(n: number): any[] {
    return Array(n);
  }
}
