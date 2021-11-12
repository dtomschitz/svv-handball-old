import { Model } from 'mongoose';
import { Inject, Injectable } from '@nestjs/common';
import { SPONSOR_MODEL } from '@svv/api/core/constants';
import { Sponsor } from '@svv/api/sponsors/interfaces';
import {
  CreateSponsorDto,
  UpdateSponsorDto,
  UpdateSponsorsDto,
} from '@svv/api/sponsors/dtos';
import { join } from 'path';
import * as fs from 'fs';

@Injectable()
export class SponsorsService {
  constructor(@Inject(SPONSOR_MODEL) private sponsorModel: Model<Sponsor>) {}

  /**
   * Retrieves all `Sponsors` from the database, sorts them by thier position
   * and finally returns them.
   */
  findAll() {
    return this.sponsorModel.find().sort('position').exec();
  }

  /**
   * Retrieves the `Sponsor` which is associated with the given id and returns it.
   *
   * @param id The id of the `Sponsor`.
   */
  findOne(id: string) {
    return this.sponsorModel.findOne({ _id: id });
  }

  findTotal() {
    return this.sponsorModel.countDocuments().exec();
  }

  /**
   * Creates a new `Sponsor` based on the given parameters and returns it after
   * a successful creation.
   *
   * @param createSponsorDto The class which contains the validated variables
   * for creating the new `Sponsor`.
   */
  async createOne(createSponsorDto: CreateSponsorDto) {
    const createdSponsor = new this.sponsorModel(createSponsorDto);
    return createdSponsor.save();
  }

  /**
   * Retrieves a `Sponsor` based on the given id, updates it with the changes
   * and returns the modified document.
   *
   * @param id The id of the `Sponsor`.
   *
   * @param changes The class which contains the validated variables for updating
   * the existing `Sponsor`.
   */
  updateOne(id: string, changes: UpdateSponsorDto) {
    return this.sponsorModel.findOneAndUpdate(
      { _id: id },
      { $set: changes },
      { new: true },
    );
  }

  /**
   * Updates a list of `Sponsors` based on the given changes.
   */
  updateMany(updateSponsorsDtos: UpdateSponsorsDto) {
    const writes = updateSponsorsDtos.map(updateSponsorDto => {
      return {
        updateOne: {
          filter: { _id: updateSponsorDto.id },
          update: { $set: updateSponsorDto.changes },
        },
      };
    });

    return this.sponsorModel.bulkWrite(writes);
  }

  /**
   * Deletes a `Sponsor` based on the given id.
   *
   * @param id The id of the `Sponsor`.
   */
  deleteOne(id: string) {
    this.deleteSponsorImage(id);
    return this.sponsorModel.findOneAndRemove({ _id: id });
  }

  /**
   * Retrieves a `Sponsor` based on the given id and deletes all assoicated
   * images if they are definied. After the images are successfuly deleted and
   * the `Sponsor` has been updated, the modified document will be returned.
   *
   * @param id The id of the `Sponsor`.
   */
  async deleteSponsorImage(id: string) {
    const sponsor = await this.findOne(id);
    if (sponsor.img) {
      this.deleteImage(sponsor.img.path);
    }

    const changes: UpdateSponsorDto = {
      img: undefined,
    };

    return this.sponsorModel.findOneAndUpdate(
      { _id: id },
      { $set: changes },
      { new: true },
    );
  }

  private deleteImage(path: string) {
    const fullPath = join(__dirname, '..', '..', path);
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }
  }
}
