import { Inject, Injectable } from '@nestjs/common';
import { TEAM_MODEL } from '@svv/api/core/constants';
import { Team } from '@svv/api/teams/interfaces';
import {
  CreateTeamDto,
  UpdateTeamDto,
  UpdateTeamsDto,
} from '@svv/api/teams/dtos';
import { Model } from 'mongoose';
import { join } from 'path';
import * as fs from 'fs';

@Injectable()
export class TeamsService {
  constructor(@Inject(TEAM_MODEL) private teamModel: Model<Team>) {}

  /**
   * Retrieves all `Teams` from the database, populates the results with `Users`
   * and a `HvwClass` if the associated properties are correctly linked and
   * finally returns them.
   */
  findAll() {
    return this.teamModel
      .find({ disabled: false })
      .populate('coaches', '_id firstName lastName')
      .populate('class', '_id longName, shortName')
      .exec();
  }

  /**
   * Retrieves the minimal needed informations of all `Teams` from the database
   * and returns it.
   */
  findMinimal() {
    return this.teamModel
      .find({ disabled: false })
      .select('_id name gender type abbreviation classId articleCategoryId')
      .exec();
  }

  /**
   * Retrieves the `Team` which is associated with the given abbreviation from
   * the database, populates the result with `Users` and a `HvwClass` if the
   * associated properties are correctly linked and finally returns the result.
   *
   * @param abbreviation The abbreviation of the `Team`.
   */
  findOne(abbreviation: string) {
    return this.teamModel
      .findOne({ abbreviation })
      .populate('coaches', '_id firstName lastName')
      .populate('class', '_id longName shortName')
      .exec();
  }

  findTotal() {
    return this.teamModel.countDocuments().exec();
  }

  /**
   * Creates a new `Team` based on the given parameters and returns it after a
   * successful creation.
   *
   * @param createTeamDto The class which contains the validated variables for
   * creating the new `Team`.
   */
  createOne(createTeamDto: CreateTeamDto) {
    const createdTeam = new this.teamModel(createTeamDto);
    return createdTeam.save();
  }

  /**
   * Retrieves a `Team` based on the given id, updates it with the changes and
   * returns the modified document.
   *
   * @param id The id of the `Team`.
   *
   * @param changes The class which contains the validated variables for updating
   * the existing `Team`.
   */
  updateOne(id: string, changes: UpdateTeamDto) {
    return this.teamModel.findOneAndUpdate(
      { _id: id },
      { $set: changes },
      { new: true },
    );
  }

  /**
   * Updates a list of `Teams` based on the given changes.
   */
  updateMany(updateTeamDtos: UpdateTeamsDto) {
    const writes = updateTeamDtos.map(updateTeamDto => {
      return {
        updateOne: {
          filter: { _id: updateTeamDto.id },
          update: { $set: updateTeamDto.changes },
        },
      };
    });

    return this.teamModel.bulkWrite(writes);
  }

  /**
   * Removes the given id of the delete `User` from the `Teams` which contains
   * the id inside the `coachIds` array.
   * 
   * @param id The id of the deleted `User`.
   */
  removeCoachId(id: string) {
    return this.teamModel.updateMany(
      { coachIds: id },
      { $pullAll: { coachIds: [id] } },
    );
  }

  /**
   * Deletes a `Team` based on the given id.
   *
   * @param id The id of the `Team`.
   */
  async deleteOne(id: string) {
    this.deleteTeamImages(id);
    return this.teamModel.findOneAndRemove({ _id: id });
  }

  /**
   * Retrieves a `Team` based on the given id and deletes all assoicated images
   * if they are definied. After the images are successfuly deleted and the `Team`
   * has been updated, the modified document will be returned.
   *
   * @param id The id of the `Team`.
   */
  async deleteTeamImages(id: string) {
    const team = await this.findOne(id);
    if (team?.images) {
      this.deleteImage(team.images.big.path);
      this.deleteImage(team.images.small.path);
    }

    const changes: UpdateTeamDto = {
      images: undefined,
    };

    return this.teamModel.findOneAndUpdate(
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
