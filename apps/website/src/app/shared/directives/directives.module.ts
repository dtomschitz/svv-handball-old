import { NgModule } from '@angular/core';
import { LetDirective } from './let.directive';
import { MatchesDirective } from './matches.directive';

@NgModule({
  declarations: [MatchesDirective, LetDirective],
  exports: [MatchesDirective, LetDirective],
})
export class DirectivesModule {}
