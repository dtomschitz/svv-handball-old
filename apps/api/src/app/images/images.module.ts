import { Module } from '@nestjs/common';
import { DatabaseModule } from '@svv/api/core/database';
import { ImageTagsService, ImagesService } from './services';
import { imagesProviders } from './images.providers';
import { ImageTagsController } from './image-tags.controller';
import { ImagesController } from './images.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [ImageTagsController, ImagesController],
  providers: [ImageTagsService, ImagesService, ...imagesProviders],
  exports: [ImageTagsService, ImagesService],
})
export class ImagesModule {}
