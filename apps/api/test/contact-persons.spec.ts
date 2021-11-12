import { Test } from '@nestjs/testing';
import { ContactPersonType, ErrorType } from '@svv/core/models';
import { CONTACT_PERSON_MODEL } from '@svv/api/core/constants';
import { JwtAuthGuard } from '@svv/api/auth/guards';
import {
  ContactPersonsController,
  contactPersonsProviders,
} from '@svv/api/contact-persons';
import { ContactPersonCategoriesService } from '@svv/api/contact-persons/services';
import { ContactPerson } from '@svv/api/contact-persons/interfaces';
import { rootMongooseTestProvider } from '../src/test-utils';
import { Model } from 'mongoose';
import * as request from 'supertest';
import {
  CreateContactPersonCategoryDto,
  UpdateContactPersonCategoryDto,
} from '@svv/api/contact-persons/dtos';

const featureKey = 'contact-persons';

describe('ContactPersonsController (e2e)', () => {
  let app;
  let model: Model<ContactPerson>;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      controllers: [ContactPersonsController],
      providers: [
        rootMongooseTestProvider,
        ContactPersonCategoriesService,
        ...contactPersonsProviders,
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    model = module.get(CONTACT_PERSON_MODEL);

    app = module.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  // Get Contact Persons
  describe('getContactPersons (GET)', () => {
    it('should fail because no contact persons are stored', () => {
      return request(app.getHttpServer())
        .get(`/${featureKey}`)
        .expect(500)
        .expect({
          type: ErrorType.CONTACT_PERSONS_NOT_FOUND,
          status: 500,
        });
    });

    it('should return an array of contact persons', async () => {
      const contactPersons = [
        {
          name: 'Abteilungsleitung',
          email: 'abteilungsleitung@svv-handball.de',
          type: ContactPersonType.EXECUTIVE,
          people: ['Dirk Nawatny', 'Jörg Zimmer'],
          position: 0,
        },
        {
          name: 'Kassenwart',
          email: 'kassenwart@svv-handball.de',
          type: ContactPersonType.EXECUTIVE,
          people: ['Lena Fischer'],
          position: 1,
        },
        {
          name: 'Admin',
          email: 'admin@svv-handball.de',
          type: ContactPersonType.NORMAL,
          people: ['David Tomschitz'],
          position: 2,
        },
      ];

      await model.insertMany(contactPersons);
      const response = await request(app.getHttpServer())
        .get(`/${featureKey}`)
        .expect(200);

      expect(response.body).toMatchObject(contactPersons);
    });
  });

  // Create Contact Person
  describe('createContactPerson (POST)', () => {
    it('should fail because the dto is invalid', () => {
      const createContactPersonDto = {
        name: 'Sportliche Leitung',
        email: 1337,
        position: 2,
      };

      return request(app.getHttpServer())
        .post(`/${featureKey}`)
        .send({ contactPerson: createContactPersonDto })
        .expect(400)
        .expect({
          statusCode: 400,
          message: [
            'email must be an email',
            'type should not be empty',
            'type must be a valid enum value',
          ],
          error: 'Bad Request',
        });
    });

    it('should fail because the name is already used', () => {
      const createContactPersonDto: CreateContactPersonCategoryDto = {
        name: 'Abteilungsleitung',
        email: 'abteilungsleitung@svv-handball.de',
        type: ContactPersonType.EXECUTIVE,
        people: ['Dirk Nawatny', 'Jörg Zimmer'],
        position: 0,
      };

      return request(app.getHttpServer())
        .post(`/${featureKey}`)
        .send({ contactPerson: createContactPersonDto })
        .expect(500)
        .expect({
          type: ErrorType.DUPLICATE_CONTACT_PERSON,
          status: 500,
        });
    });

    it('should create a new contact person', async () => {
      const createContactPersonDto: CreateContactPersonCategoryDto = {
        name: 'Sponsoring',
        email: 'sponsoring@svv-handball.de',
        type: ContactPersonType.NORMAL,
        people: ['Patrick Rommel'],
        position: 3,
      };

      const response = await request(app.getHttpServer())
        .post(`/${featureKey}`)
        .send({ contactPerson: createContactPersonDto })
        .expect(201);

      expect(response.body.name).toEqual(createContactPersonDto.name);
      expect(response.body.email).toEqual(createContactPersonDto.email);
      expect(response.body.type).toEqual(createContactPersonDto.type);
      expect(response.body.people).toEqual(createContactPersonDto.people);
      expect(response.body.position).toEqual(createContactPersonDto.position);
    });
  });

  // Update Contact Person
  describe('updateContactPerson (PUT)', () => {
    it('should fail because the id is invalid', () => {
      return request(app.getHttpServer())
        .put(`/${featureKey}/invalidId`)
        .expect(500)
        .expect({
          type: ErrorType.INVALID_OBJECT_ID,
          status: 500,
        });
    });

    it('should fail because there is no contact person associated with the id', () => {
      return request(app.getHttpServer())
        .put(`/${featureKey}/5fe1d469c0a4cb7fe157b14b`)
        .expect(500)
        .expect({
          type: ErrorType.CONTACT_PERSON_NOT_FOUND,
          status: 500,
        });
    });

    it('should fail because the name is already used', async () => {
      const { _id } = await model.findOne({ name: 'Kassenwart' });

      const updateContactPersonDto: UpdateContactPersonCategoryDto = {
        name: 'Admin',
      };

      return request(app.getHttpServer())
        .put(`/${featureKey}/${_id}`)
        .send({ changes: updateContactPersonDto })
        .expect(500)
        .expect({
          type: ErrorType.DUPLICATE_CONTACT_PERSON,
          status: 500,
        });
    });

    it('should fail because the dto is invalid', async () => {
      const { _id } = await model.findOne({ name: 'Kassenwart' });

      const updateContactPersonDto = {
        name: 1337,
        email: 'test',
      };

      return request(app.getHttpServer())
        .put(`/${featureKey}/${_id}`)
        .send({ changes: updateContactPersonDto })
        .expect(400)
        .expect({
          statusCode: 400,
          message: ['name must be a string'],
          error: 'Bad Request',
        });
    });

    it('should update a contact person', async () => {
      const { _id } = await model.findOne({ name: 'Kassenwart' });

      const updateSponsorDto: UpdateContactPersonCategoryDto = {
        name: 'Technische Leitung',
      };

      const response = await request(app.getHttpServer())
        .put(`/${featureKey}/${_id}`)
        .send({ changes: updateSponsorDto })
        .expect(200);

      expect(response.body.name).toEqual(updateSponsorDto.name);
    });
  });

  // Delete Contact Person
  describe('deleteContactPerson (DELETE)', () => {
    it('should fail because the id is invalid', () => {
      return request(app.getHttpServer())
        .delete(`/${featureKey}/invalidId`)
        .expect(500)
        .expect({
          type: ErrorType.INVALID_OBJECT_ID,
          status: 500,
        });
    });

    it('should fail because there is no contact person associated with the id', () => {
      return request(app.getHttpServer())
        .delete(`/${featureKey}/5de1c469c0a4cb7fe157b14b`)
        .expect(500)
        .expect({
          type: ErrorType.CONTACT_PERSON_NOT_FOUND,
          status: 500,
        });
    });

    it('should delete a contact person', async () => {
      const { _id } = await model.findOne({ name: 'Admin' });
      await request(app.getHttpServer())
        .delete(`/${featureKey}/${_id}`)
        .expect(200);
    });
  });
});
