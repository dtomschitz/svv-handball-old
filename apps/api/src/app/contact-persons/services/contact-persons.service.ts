import { Inject, Injectable } from '@nestjs/common';
import {
  CONTACT_PERSON_CATEGORY_MODEL,
  CONTACT_PERSON_MODEL,
} from '@svv/api/core/constants';
import {
  ContactPerson,
  ContactPersonCategory,
} from '@svv/api/contact-persons/interfaces';
import {
  CreateContactPersonCategoryDto,
  UpdateContactPersonCategoryDto,
  UpdateContactPersonCategoriesDto,
  ListAllCategories,
} from '@svv/api/contact-persons/dtos';
import { Model } from 'mongoose';

@Injectable()
export class ContactPersonsService {
  constructor(
    @Inject(CONTACT_PERSON_MODEL)
    private contactPersonModel: Model<ContactPerson>,
    @Inject(CONTACT_PERSON_CATEGORY_MODEL)
    private contactPersonCategoryModel: Model<ContactPersonCategory>,
  ) {}

  /**
   * Retrieves all `Contact Persons` and returns them.
   */
  async findAll(query: ListAllCategories) {
    if (query.grouped) {
      const categories = await this.contactPersonCategoryModel
        .find()
        .sort('position')
        .exec();
      const contactPersons = await this.contactPersonModel.find().exec();

      return categories.map(category => {
        return {
          _id: category._id,
          name: category.name,
          contactPersons: contactPersons
            .filter(
              contactPerson =>
                contactPerson.categoryId === category._id.toString(),
            )
            .sort((a, b) => a.position - b.position),
        };
      });
    }

    return this.contactPersonModel.find().exec();
  }

  /**
   * Creates a new `Contact Person` based on the given parameters and returns
   * it after a successful creation.
   *
   * @param createContactPersonDto The class which contains the validated
   * variables for creating the new `Contact Person`.
   */
  createOne(createContactPersonDto: CreateContactPersonCategoryDto) {
    const createdContactPerson = new this.contactPersonModel(
      createContactPersonDto,
    );
    return createdContactPerson.save();
  }

  /**
   * Retrieves a `Contact Person` based on the given id, updates it with the
   * changes and returns the modified document.
   *
   * @param id The id of the `Contact Person`.
   *
   * @param changes The class which contains the validated variables for updating
   * the existing `Contact Person`.
   */
  updateOne(id: string, changes: UpdateContactPersonCategoryDto) {
    return this.contactPersonModel.findOneAndUpdate(
      { _id: id },
      { $set: changes },
      { new: true },
    );
  }

  /**
   * Updates a list of `Contact Persons` based on the given changes.
   */
  updateMany(updateContactPersonsDto: UpdateContactPersonCategoriesDto) {
    const writes = updateContactPersonsDto.map(updateContactPersonDto => {
      return {
        updateOne: {
          filter: { _id: updateContactPersonDto.id },
          update: { $set: updateContactPersonDto.changes },
        },
      };
    });

    return this.contactPersonModel.bulkWrite(writes);
  }

  /**
   * Deletes a `Contact Person` based on the given id.
   *
   * @param id The id of the `Contact Person`.
   */
  async deleteOne(id: string) {
    return this.contactPersonModel.findOneAndRemove({ _id: id });
  }
}
