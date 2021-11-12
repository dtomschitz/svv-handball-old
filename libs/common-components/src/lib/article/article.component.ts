import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import {
  Component,
  EventEmitter,
  HostBinding,
  Input,
  Output,
  Pipe,
  PipeTransform,
  ViewEncapsulation,
} from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Article, ArticleCategory } from '@svv/core/models';

type State = 'collapsed' | 'expanded';

@Pipe({
  name: 'sanitizeHtml',
})
export class SanitizeHtmlPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(value: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(value);
  }
}

@Component({
  selector: 'article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss'],
  animations: [
    trigger('expansion', [
      state('collapsed, void', style({ height: '115px' })),
      state('expanded', style({ height: '*', visibility: 'visible' })),
      transition(
        'expanded <=> collapsed, void => collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)'),
      ),
    ]),
  ],
  encapsulation: ViewEncapsulation.None,
})
export class ArticleComponent {
  state: State = 'collapsed';

  @Input() article: Article;
  @Input() loading: boolean;
  @Input() displayCategories: boolean = true;
  @Output() navigte: EventEmitter<string> = new EventEmitter<string>();

  @HostBinding('class') articleClass = 'article mat-elevation-z3';

  onCategoryClicked(category: ArticleCategory) {
    if (category.link) {
      this.navigte.emit(category.link);
    }
  }

  toggle() {
    this.state = this.state === 'collapsed' ? 'expanded' : 'collapsed';
  }

  get authors() {
    return this.article.authors.map(
      author => `${author.firstName} ${author.lastName}`,
    );
  }

  get isCollapsed() {
    return this.state === 'collapsed';
  }
}
