import { ChangeDetectionStrategy, Component } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Image, ImageType } from '@svv/core/models';
import * as fromImages from '@svv/cms/images/store/reducers';

@Component({
  selector: 'sponsor-images',
  templateUrl: './sponsor-images.component.html',
  styleUrls: ['./sponsor-images.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SponsorImagesComponent {
  images$: Observable<Image[]>;
  defaultImageType = ImageType.SPONSOR;

  constructor(private store: Store<fromImages.State>) {
    this.images$ = this.store.pipe(
      select(fromImages.selectAllImagesByType, this.defaultImageType),
    );
  }
}
