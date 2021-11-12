import { Inject, Injectable } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { HvwCachingType } from '@svv/core/models';
import { HVW_JOB_MODEL } from '@svv/api/core/constants';
import { CreateHvwJobDto, UpdateHvwJobDto } from '@svv/api/hvw/dtos';
import { HvwJob } from '@svv/api/hvw/interfaces';
import { HvwClassService } from './hvw-class.service';
import { HvwGamesService } from './hvw-games.service';
import { HvwTablesService } from './hvw-tables.service';
import { HvwWeeksService } from './hvw-weeks.service';
import { Model } from 'mongoose';
import { CronJob, CronTime } from 'cron';

@Injectable()
export class HvwJobsService {
  constructor(
    @Inject(HVW_JOB_MODEL) private jobModel: Model<HvwJob>,
    private schedulerRegistry: SchedulerRegistry,
    private classService: HvwClassService,
    private weeksService: HvwWeeksService,
    private gamesService: HvwGamesService,
    private tablesService: HvwTablesService,
  ) {
    this.initialize();
  }

  /**
   * Retrieves all `CronJobs` from the database and returns them.
   */
  findAll() {
    return this.jobModel.find().exec();
  }

  /**
   * Creates a new `CronJob` based on the given parameters and returns it after
   * a successful creation. Additionally the job will be automatically registered
   * in the `Scheduler Registry`.
   *
   * @param createHvwJobDto The class which contains the validated variables for
   * creating the new `CronJob`.
   */
  async createOne(createHvwJobDto: CreateHvwJobDto) {
    const createdJob = new this.jobModel(createHvwJobDto);
    const job = await createdJob.save();
    this.addJob(job);

    return job;
  }

  /**
   * Retrieves a `CronJob` based on the given id, updates it with the changes
   * and returns the modified document.
   *
   * If the cron expression has been changed the job in the `Schedule Registry`
   * will be updated accordingly. After the new time has been set the job will be
   * started again.
   *
   * In case the changes will disable or enable the `CronJob` the
   * `Scheduler Registry` will either stop or start the specific job.
   *
   * @param id The id of the `CronJob`.
   *
   * @param changes The class which contains the validated variables for updating
   * the existing `CronJob`.
   */
  updateOne(id: string, updateHvwJobDto: UpdateHvwJobDto) {
    if (this.schedulerRegistry.getCronJobs().has(id)) {
      const job = this.schedulerRegistry.getCronJob(id);

      if (updateHvwJobDto.cronExpression) {
        job.setTime(new CronTime(updateHvwJobDto.cronExpression));
        job.start();
      }

      if (updateHvwJobDto.disabled !== undefined) {
        if (updateHvwJobDto.disabled) {
          job.stop();
        } else {
          job.start();
        }
      }
    }

    return this.jobModel.findOneAndUpdate(
      { _id: id },
      { $set: updateHvwJobDto },
      { new: true },
    );
  }

  /**
   * Deletes a `CronJob` based on the given id. If the `CronJob` is registered
   * in the `Scheduler Registry` the `CronJob` will be stopped and
   * deleted from it.
   *
   * @param id The id of the `CronJob`.
   */
  deleteOne(id: string) {
    if (this.schedulerRegistry.getCronJobs().has(id)) {
      this.schedulerRegistry.deleteCronJob(id);
    }

    return this.jobModel.findOneAndRemove({ _id: id });
  }

  private async initialize() {
    const jobs = await this.findAll();

    for (const job of jobs) {
      this.addJob(job);
    }
  }

  private addJob(job: HvwJob) {
    const cronJob = new CronJob(job.cronExpression, () => {
      switch (job.type) {
        case HvwCachingType.CLASSES:
          this.classService.cache();
          break;
        case HvwCachingType.WEEKS:
          this.weeksService.cache();
          break;
        case HvwCachingType.GAMES:
          this.gamesService.cache();
          break;
        case HvwCachingType.TABLES:
          this.tablesService.cache();
          break;
      }
    });
    const id = String(job._id);
    this.schedulerRegistry.addCronJob(id, cronJob);

    if (!job.disabled) {
      this.schedulerRegistry.getCronJob(id).start();
    }
  }
}
