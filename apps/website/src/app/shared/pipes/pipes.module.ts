import { NgModule } from '@angular/core';
import { DateRangePipe } from './date-rang.pipe';
import { GamesFilterPipe } from './games-filter.pipe';
import { OxfordJoinPipe } from './oxford-join.pipe';

@NgModule({
  declarations: [DateRangePipe, GamesFilterPipe, OxfordJoinPipe],
  exports: [DateRangePipe, GamesFilterPipe, OxfordJoinPipe],
})
export class PipesModule {}
