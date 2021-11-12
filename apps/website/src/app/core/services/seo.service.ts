import { Injectable } from '@angular/core';
import { Title, Meta, MetaDefinition } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root',
})
export class SeoService {
  constructor(private titleService: Title, private metaTagService: Meta) {}

  setTitle(title: string, disableAppName?: boolean) {
    this.titleService.setTitle(
      disableAppName ? title : `${title} - SV Vaihingen Handball`,
    );
  }

  addTags(tags: MetaDefinition[]) {
    this.metaTagService.addTags(tags);
  }

  updateTag(tag: MetaDefinition, selector?: string) {
    this.metaTagService.updateTag(tag, selector);
  }
}
