import { Test } from '@nestjs/testing';
import { ErrorType, UserRole } from '@svv/core/models';
import { USER_MODEL } from '@svv/api/core/constants';
import { JwtAuthGuard } from '@svv/api/auth/guards';
import { User } from '@svv/api/users/interfaces';
import { CreateUserDto, UpdateUserDto } from '@svv/api/users/dtos';
import { TeamsService } from '@svv/api/teams/services';
import { articlesProviders } from '@svv/api/articles';
import { teamsProviders } from '@svv/api/teams';
import { ArticlesService } from '@svv/api/articles/services';
import { UsersController, usersProviders } from '@svv/api/users';
import { UsersService } from '@svv/api/users/services';
import { rootMongooseTestProvider } from '../src/test-utils';
import { Model } from 'mongoose';
import * as request from 'supertest';

describe('UserController (e2e)', () => {
  let app;
  let model: Model<User>;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        rootMongooseTestProvider,
        UsersService,
        TeamsService,
        ArticlesService,
        ...usersProviders,
        ...teamsProviders,
        ...articlesProviders,
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    model = module.get(USER_MODEL);

    app = module.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  // Get Users
  describe('getUsers (GET)', () => {
    it('should fail because no users are stored', () => {
      return request(app.getHttpServer()).get('/users').expect(500).expect({
        type: ErrorType.USERS_NOT_FOUND,
        status: 500,
      });
    });

    it('should fail because the id is invalid', () => {
      return request(app.getHttpServer())
        .get('/users/invalidId')
        .expect(500)
        .expect({
          type: ErrorType.INVALID_OBJECT_ID,
          status: 500,
        });
    });

    it('should return an array of users', async () => {
      const users = [
        {
          email: 'max@mustermann.de',
          firstName: 'Max',
          lastName: 'Mustermann',
          role: UserRole.ADMIN,
          canLogin: true,
        },
        {
          email: 'erika@mustermann.de',
          firstName: 'Erika',
          lastName: 'Mustermann',
          role: UserRole.TRAINER,
          canLogin: true,
        },
      ];

      await model.insertMany(users);
      const response = await request(app.getHttpServer())
        .get('/users')
        .expect(200);
      expect(response.body).toMatchObject(users);
    });
  });

  describe('getUser (GET)', () => {
    it('should fail because there is no user associated with the id', () => {
      return request(app.getHttpServer())
        .get('/users/5fe1c469c0a4cb7fe157b14b')
        .expect(500)
        .expect({
          type: ErrorType.USER_NOT_FOUND,
          status: 500,
        });
    });

    it('should fail because the id is invalid', () => {
      return request(app.getHttpServer())
        .get('/users/invalidId')
        .expect(500)
        .expect({
          type: ErrorType.INVALID_OBJECT_ID,
          status: 500,
        });
    });

    it('should return a user', async () => {
      const user = await model.findOne({ email: 'erika@mustermann.de' });
      const response = await request(app.getHttpServer())
        .get(`/users/${user._id}`)
        .expect(200);

      expect(response.body._id).toEqual(String(user._id));
      expect(response.body.email).toEqual(user.email);
      expect(response.body.firstName).toEqual(user.firstName);
      expect(response.body.lastName).toEqual(user.lastName);
      expect(response.body.role).toEqual(user.role);
    });
  });

  // Create User
  describe('createUser (POST)', () => {
    it('should create a new user', async () => {
      const createUserDto: CreateUserDto = {
        email: 'heiner@brand.de',
        firstName: 'Heiner',
        lastName: 'Brand',
        role: UserRole.TRAINER,
        password: 'test',
        canLogin: true,
      };

      const response = await request(app.getHttpServer())
        .post('/users')
        .send({ user: createUserDto })
        .expect(201);

      expect(response.body.email).toEqual(createUserDto.email);
      expect(response.body.firstName).toEqual(createUserDto.firstName);
      expect(response.body.lastName).toEqual(createUserDto.lastName);
      expect(response.body.role).toEqual(createUserDto.role);
    });

    it('should fail because the dto is invalid', () => {
      const createUserDto = {
        email: 'max@mustermann.de',
        firstName: 'Max',
        lastName: 'Mustermann',
        password: 'test',
      };

      return request(app.getHttpServer())
        .post('/users')
        .send({ user: createUserDto })
        .expect(400)
        .expect({
          statusCode: 400,
          message: ['role should not be empty'],
          error: 'Bad Request',
        });
    });
  });

  // Update User
  describe('updateUser (PUT)', () => {
    it('should fail because the id is invalid', () => {
      return request(app.getHttpServer())
        .put('/users/invalidId')
        .expect(500)
        .expect({
          type: ErrorType.INVALID_OBJECT_ID,
          status: 500,
        });
    });

    it('should fail because there is no user associated with the id', () => {
      return request(app.getHttpServer())
        .put('/users/5fe1c469c0a4cb7fe157b14b')
        .expect(500)
        .expect({
          type: ErrorType.USER_NOT_FOUND,
          status: 500,
        });
    });

    it('should fail because the dto is invalid', async () => {
      const { _id } = await model.findOne({ email: 'heiner@brand.de' });

      const updateUserDto = {
        firstName: 13,
        lastName: 444,
      };

      return request(app.getHttpServer())
        .put(`/users/${_id}`)
        .send({ changes: updateUserDto })
        .expect(400)
        .expect({
          statusCode: 400,
          message: ['firstName must be a string', 'lastName must be a string'],
          error: 'Bad Request',
        });
    });

    it('should update a user', async () => {
      const { _id } = await model.findOne({ email: 'heiner@brand.de' });

      const updateUserDto: UpdateUserDto = {
        email: 'david@tomschitz.de',
        firstName: 'David',
        lastName: 'Tomschitz',
      };

      return request(app.getHttpServer())
        .put(`/users/${_id}`)
        .send({ changes: updateUserDto })
        .expect(200);
    });
  });

  // Delete User
  describe('deleteUser (DELETE)', () => {
    it('should fail because the id is invalid', () => {
      return request(app.getHttpServer())
        .delete('/users/invalidId')
        .expect(500)
        .expect({
          type: ErrorType.INVALID_OBJECT_ID,
          status: 500,
        });
    });

    it('should fail because there is no user associated with the id', () => {
      return request(app.getHttpServer())
        .delete('/users/5fe1c469c0a4cb7fe157b14b')
        .expect(500)
        .expect({
          type: ErrorType.USER_NOT_FOUND,
          status: 500,
        });
    });

    it('should delete a user', async () => {
      const { _id } = await model.findOne({ email: 'david@tomschitz.de' });
      return request(app.getHttpServer()).delete(`/users/${_id}`).expect(200);
    });
  });
});
