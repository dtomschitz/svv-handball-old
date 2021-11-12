import { Test } from '@nestjs/testing';
import { HttpModule } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { CronExpression, ErrorType, HvwCachingType } from '@svv/core/models';
import { AppConfigModule } from '@svv/api/core/config';
import { HVW_JOB_MODEL } from '@svv/api/core/constants';
import { JwtAuthGuard } from '@svv/api/auth/guards';
import { HvwController, hvwProviders } from '@svv/api/hvw/';
import { CreateHvwJobDto, UpdateHvwJobDto } from '@svv/api/hvw/dtos';
import {
  HvwCachingResultService,
  HvwClassService,
  HvwGamesService,
  HvwJobsService,
  HvwTablesService,
  HvwWeeksService,
} from '@svv/api/hvw/services';
import { HvwJob } from '@svv/api/hvw/interfaces';
import { rootMongooseTestProvider } from '../src/test-utils';
import { Model } from 'mongoose';
import * as request from 'supertest';

describe('HvwController (e2e)', () => {
  let app;
  let jobModel: Model<HvwJob>;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [HttpModule, ScheduleModule.forRoot(), AppConfigModule],
      controllers: [HvwController],
      providers: [
        rootMongooseTestProvider,
        HvwJobsService,
        HvwClassService,
        HvwWeeksService,
        HvwTablesService,
        HvwGamesService,
        HvwCachingResultService,
        ...hvwProviders,
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    jobModel = module.get(HVW_JOB_MODEL);

    app = module.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  // Get HVW Cron Jobs
  describe('getJobs (GET)', () => {
    it('should fail because no jobs are stored', () => {
      return request(app.getHttpServer()).get('/hvw/jobs').expect(500).expect({
        type: ErrorType.JOBS_NOT_FOUND,
        status: 500,
      });
    });

    it('should return an array of sponsors', async () => {
      const jobs: CreateHvwJobDto[] = [
        {
          name: 'Spielklassen',
          type: HvwCachingType.CLASSES,
          cronExpression: '*/1 * * * *',
        },
        {
          name: 'Spielwochen',
          type: HvwCachingType.WEEKS,
          cronExpression: '*/1 * * * *',
          disabled: true,
        },
        {
          name: 'Tabellen',
          type: HvwCachingType.TABLES,
          cronExpression: '*/1 * * * *',
        },
      ];

      await jobModel.insertMany(jobs);
      const response = await request(app.getHttpServer())
        .get('/hvw/jobs')
        .expect(200);

      expect(response.body).toMatchObject(jobs);
    });
  });

  // Create HVW Cron Job
  describe('createJob (POST)', () => {
    it('should fail because the dto is invalid', () => {
      const createJobDto = {
        type: HvwCachingType.CLASSES,
      };

      return request(app.getHttpServer())
        .post('/hvw/jobs')
        .send({ job: createJobDto })
        .expect(400)
        .expect({
          statusCode: 400,
          message: [
            'name should not be empty',
            'name must be a string',
            'cronExpression should not be empty',
            'cronExpression must be a string',
          ],
          error: 'Bad Request',
        });
    });

    it('should fail because the name is already used', () => {
      const createJobDto: CreateHvwJobDto = {
        name: 'Spielwochen',
        type: HvwCachingType.WEEKS,
        cronExpression: '*/1 * * * *',
      };

      return request(app.getHttpServer())
        .post('/hvw/jobs')
        .send({ job: createJobDto })
        .expect(500)
        .expect({
          type: ErrorType.DUPLICATE_JOB,
          status: 500,
        });
    });

    it('should create a new sponsor', async () => {
      const createJobDto: CreateHvwJobDto = {
        name: 'Begegnungen',
        type: HvwCachingType.GAMES,
        cronExpression: '*/1 * * * *',
      };

      const response = await request(app.getHttpServer())
        .post('/hvw/jobs')
        .send({ job: createJobDto })
        .expect(201);

      expect(response.body.name).toEqual(createJobDto.name);
      expect(response.body.type).toEqual(createJobDto.type);
      expect(response.body.cronExpression).toEqual(createJobDto.cronExpression);
      expect(response.body.disabled).toEqual(false);
    });
  });

  // Update HVW Cron Job
  describe('updateJob (PUT)', () => {
    it('should fail because the id is invalid', () => {
      return request(app.getHttpServer())
        .put('/hvw/jobs/invalidId')
        .expect(500)
        .expect({
          type: ErrorType.INVALID_OBJECT_ID,
          status: 500,
        });
    });

    it('should fail because there is no job associated with the id', () => {
      return request(app.getHttpServer())
        .put('/hvw/jobs/5fe1d469c0a4cb7fe157b14b')
        .expect(500)
        .expect({
          type: ErrorType.JOB_NOT_FOUND,
          status: 500,
        });
    });

    it('should fail because the name is already used', async () => {
      const { _id } = await jobModel.findOne({ name: 'Begegnungen' });

      const updateJobDto: UpdateHvwJobDto = {
        name: 'Spielklassen',
      };

      return request(app.getHttpServer())
        .put(`/hvw/jobs/${_id}`)
        .send({ changes: updateJobDto })
        .expect(500)
        .expect({
          type: ErrorType.DUPLICATE_JOB,
          status: 500,
        });
    });

    it('should fail because the dto is invalid', async () => {
      const { _id } = await jobModel.findOne({ name: 'Begegnungen' });

      const updateJobDto = {
        name: 1312,
        type: 'TEST',
      };

      return request(app.getHttpServer())
        .put(`/hvw/jobs/${_id}`)
        .send({ changes: updateJobDto })
        .expect(400)
        .expect({
          statusCode: 400,
          message: ['name must be a string', 'type must be an object'],
          error: 'Bad Request',
        });
    });

    it('should update a job', async () => {
      const { _id } = await jobModel.findOne({ name: 'Tabellen' });

      const updateJobDto: UpdateHvwJobDto = {
        cronExpression: CronExpression.EVERY_1ST_DAY_OF_MONTH_AT_MIDNIGHT,
        disabled: true,
      };

      const response = await request(app.getHttpServer())
        .put(`/hvw/jobs/${_id}`)
        .send({ changes: updateJobDto })
        .expect(200);

      expect(response.body.cronExpression).toEqual(updateJobDto.cronExpression);
      expect(response.body.disabled).toEqual(updateJobDto.disabled);
    });
  });

  // Delete HVW Cron Job
  describe('deleteJob (DELETE)', () => {
    it('should fail because the id is invalid', () => {
      return request(app.getHttpServer())
        .delete('/hvw/jobs/invalidId')
        .expect(500)
        .expect({
          type: ErrorType.INVALID_OBJECT_ID,
          status: 500,
        });
    });

    it('should fail because there is no job associated with the id', () => {
      return request(app.getHttpServer())
        .delete('/hvw/jobs/5de1c469c0a4cb7fe157b14b')
        .expect(500)
        .expect({
          type: ErrorType.JOB_NOT_FOUND,
          status: 500,
        });
    });

    it('should delete a job', async () => {
      const { _id } = await jobModel.findOne({ name: 'Spielklassen' });
      await request(app.getHttpServer()).delete(`/hvw/jobs/${_id}`).expect(200);
    });
  });
});
