import { Inject, Injectable } from '@nestjs/common';
import { CONTACT_PERSON_CATEGORY_MODEL } from '@svv/api/core/constants';
import { ContactPerson } from '@svv/api/contact-persons/interfaces';
import {
  CreateContactPersonCategoryDto,
  UpdateContactPersonCategoryDto,
  UpdateContactPersonCategoriesDto,
} from '@svv/api/contact-persons/dtos';
import { Model } from 'mongoose';

@Injectable()
export class ContactPersonCategoriesService {
  constructor(
    @Inject(CONTACT_PERSON_CATEGORY_MODEL)
    private contactPersonCategoryModel: Model<ContactPerson>,
  ) {}

  findAll() {
    return this.contactPersonCategoryModel.find().exec();
  }

  createOne(createContactPersonDto: CreateContactPersonCategoryDto) {
    const createdContactPerson = new this.contactPersonCategoryModel(
      createContactPersonDto,
    );
    return createdContactPerson.save();
  }

  updateOne(id: string, changes: UpdateContactPersonCategoryDto) {
    return this.contactPersonCategoryModel.findOneAndUpdate(
      { _id: id },
      { $set: changes },
      { new: true },
    );
  }

  updateMany(updateContactPersonsDto: UpdateContactPersonCategoriesDto) {
    const writes = updateContactPersonsDto.map(updateContactPersonDto => {
      return {
        updateOne: {
          filter: { _id: updateContactPersonDto.id },
          update: { $set: updateContactPersonDto.changes },
        },
      };
    });

    return this.contactPersonCategoryModel.bulkWrite(writes);
  }

  deleteOne(id: string) {
    return this.contactPersonCategoryModel.findOneAndRemove({ _id: id });
  }
}
