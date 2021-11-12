import { Test } from '@nestjs/testing';
import { ErrorType } from '@svv/core/models';
import { SPONSOR_MODEL } from '@svv/api/core/constants';
import { JwtAuthGuard } from '@svv/api/auth/guards';
import { SponsorsController, sponsorsProviders } from '@svv/api/sponsors';
import { SponsorsService } from '@svv/api/sponsors/services';
import { Sponsor } from '@svv/api/sponsors/interfaces';
import { CreateSponsorDto, UpdateSponsorDto } from '@svv/api/sponsors/dtos';
import { rootMongooseTestProvider } from '../src/test-utils';
import { Model } from 'mongoose';
import * as request from 'supertest';

describe('SponsorsController (e2e)', () => {
  let app;
  let model: Model<Sponsor>;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      controllers: [SponsorsController],
      providers: [
        rootMongooseTestProvider,
        SponsorsService,
        ...sponsorsProviders,
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    model = module.get(SPONSOR_MODEL);

    app = module.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  // Get Sponsors
  describe('getSponsors (GET)', () => {
    it('should fail because no sponsors are stored', () => {
      return request(app.getHttpServer()).get('/sponsors').expect(500).expect({
        type: ErrorType.SPONSORS_NOT_FOUND,
        status: 500,
      });
    });

    it('should return an array of sponsors', async () => {
      const sponsors = [
        {
          name: 'Webfix',
          link: 'https://www.webix.de/',
          position: 0,
        },
        {
          name: 'Stuttgarter Hofbräu',
          link: 'https://www.stuttgarter-hofbraeu.de/',
          position: 1,
        },
      ];

      await model.insertMany(sponsors);
      const response = await request(app.getHttpServer())
        .get('/sponsors')
        .expect(200);

      expect(response.body).toMatchObject(sponsors);
    });
  });

  // Get Sponor
  describe('getSponsor (GET)', () => {
    it('should fail because there is no sponsor associated with the id', () => {
      return request(app.getHttpServer())
        .get('/sponsors/5fe1c469c0a4cb7fe157b14b')
        .expect(500)
        .expect({
          type: ErrorType.SPONSOR_NOT_FOUND,
          status: 500,
        });
    });

    it('should fail because the id is invalid', () => {
      return request(app.getHttpServer())
        .get('/sponsors/invalidId')
        .expect(500)
        .expect({
          type: ErrorType.INVALID_OBJECT_ID,
          status: 500,
        });
    });

    it('should return a sponsor', async () => {
      const sponsor = await model.findOne({ name: 'Webfix' });
      const response = await request(app.getHttpServer())
        .get(`/sponsors/${sponsor._id}`)
        .expect(200);

      expect(response.body._id).toEqual(String(sponsor._id));
      expect(response.body.name).toEqual(sponsor.name);
      expect(response.body.link).toEqual(sponsor.link);
      expect(response.body.position).toEqual(sponsor.position);
    });
  });

  // Create Sponsor
  describe('createSponsor (POST)', () => {
    it('should fail because the dto is invalid', () => {
      const createSponsorDto = {
        link: 'hps:/www.mercedes-benz.de/',
        position: 2,
      };

      return request(app.getHttpServer())
        .post('/sponsors')
        .send({ sponsor: createSponsorDto })
        .expect(400)
        .expect({
          statusCode: 400,
          message: [
            'name should not be empty',
            'name must be a string',
            'link must be an URL address',
          ],
          error: 'Bad Request',
        });
    });

    it('should fail because the name is already used', () => {
      const createSponsorDto: CreateSponsorDto = {
        name: 'Stuttgarter Hofbräu',
        link: 'https://www.stuttgarter-hofbraeu.de/',
        position: 1,
      };

      return request(app.getHttpServer())
        .post('/sponsors')
        .send({ sponsor: createSponsorDto })
        .expect(500)
        .expect({
          type: ErrorType.DUPLICATE_SPONSOR,
          status: 500,
        });
    });

    it('should create a new sponsor', async () => {
      const createSponsorDto: CreateSponsorDto = {
        name: 'Mercedes-Benz',
        link: 'https://www.mercedes-benz.de/',
        position: 2,
      };
      const response = await request(app.getHttpServer())
        .post('/sponsors')
        .send({ sponsor: createSponsorDto })
        .expect(201);

      expect(response.body.name).toEqual(createSponsorDto.name);
      expect(response.body.link).toEqual(createSponsorDto.link);
      expect(response.body.position).toEqual(createSponsorDto.position);
      expect(response.body.disabled).toEqual(false);
    });
  });

  // Update Sponsor
  describe('updateSponsor (PUT)', () => {
    it('should fail because the id is invalid', () => {
      return request(app.getHttpServer())
        .put('/sponsors/invalidId')
        .expect(500)
        .expect({
          type: ErrorType.INVALID_OBJECT_ID,
          status: 500,
        });
    });

    it('should fail because there is no sponsor associated with the id', () => {
      return request(app.getHttpServer())
        .put('/sponsors/5fe1d469c0a4cb7fe157b14b')
        .expect(500)
        .expect({
          type: ErrorType.SPONSOR_NOT_FOUND,
          status: 500,
        });
    });

    it('should fail because the name is already used', async () => {
      const { _id } = await model.findOne({ name: 'Stuttgarter Hofbräu' });

      const updateSponsorDto: UpdateSponsorDto = {
        name: 'Webfix',
      };

      return request(app.getHttpServer())
        .put(`/sponsors/${_id}`)
        .send({ changes: updateSponsorDto })
        .expect(500)
        .expect({
          type: ErrorType.DUPLICATE_SPONSOR,
          status: 500,
        });
    });

    it('should fail because the dto is invalid', async () => {
      const { _id } = await model.findOne({ name: 'Webfix' });

      const updateSponsorDto = {
        name: 1337,
        link: 2,
      };

      return request(app.getHttpServer())
        .put(`/sponsors/${_id}`)
        .send({ changes: updateSponsorDto })
        .expect(400)
        .expect({
          statusCode: 400,
          message: ['name must be a string', 'link must be an URL address'],
          error: 'Bad Request',
        });
    });

    it('should update a sponsors', async () => {
      const { _id } = await model.findOne({ name: 'Mercedes-Benz' });

      const updateSponsorDto: UpdateSponsorDto = {
        name: 'Porsche',
        link: 'https://www.porsche.com/',
      };

      const response = await request(app.getHttpServer())
        .put(`/sponsors/${_id}`)
        .send({ changes: updateSponsorDto })
        .expect(200);

      expect(response.body.name).toEqual(updateSponsorDto.name);
      expect(response.body.link).toEqual(updateSponsorDto.link);
    });
  });

  // Delete Sponsor
  describe('deleteSponsor (DELETE)', () => {
    it('should fail because the id is invalid', () => {
      return request(app.getHttpServer())
        .delete('/sponsors/invalidId')
        .expect(500)
        .expect({
          type: ErrorType.INVALID_OBJECT_ID,
          status: 500,
        });
    });

    it('should fail because there is no sponsor associated with the id', () => {
      return request(app.getHttpServer())
        .delete('/sponsors/5de1c469c0a4cb7fe157b14b')
        .expect(500)
        .expect({
          type: ErrorType.SPONSOR_NOT_FOUND,
          status: 500,
        });
    });

    it('should delete a sponsor', async () => {
      const { _id } = await model.findOne({ name: 'Webfix' });
      await request(app.getHttpServer()).delete(`/sponsors/${_id}`).expect(200);
    });
  });
});
