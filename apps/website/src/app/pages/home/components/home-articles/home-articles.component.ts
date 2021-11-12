import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'home-articles',
  templateUrl: './home-articles.component.html',
  styleUrls: ['./home-articles.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  
})
export class HomeArticlesComponent {}
