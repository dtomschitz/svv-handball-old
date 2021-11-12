import { ChangeDetectionStrategy, Component } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Image, ImageTag, ImageType } from '@svv/core/models';
import * as fromImages from '@svv/cms/images/store/reducers';

@Component({
  selector: 'team-images',
  templateUrl: './team-images.component.html',
  styleUrls: ['./team-images.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TeamImagesComponent {
  images$: Observable<Image[]>;
  tags$: Observable<ImageTag[]>;

  defaultImageType = ImageType.TEAM;

  constructor(private store: Store<fromImages.State>) {
    this.images$ = this.store.pipe(
      select(fromImages.selectAllImagesByType, this.defaultImageType),
    );
    this.tags$ = this.store.pipe(select(fromImages.selectAllSeasonTags));
  }
}
