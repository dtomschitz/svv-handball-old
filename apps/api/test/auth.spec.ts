import { Test } from '@nestjs/testing';
import { JwtModule } from '@nestjs/jwt';
import { ErrorType, UserRole } from '@svv/core/models';
import { USER_MODEL } from '@svv/api/core/constants';
import { AppConfigModule, AppConfigService } from '@svv/api/core/config';
import { AuthController, AuthService } from '@svv/api/auth';
import { JwtAuthGuard } from '@svv/api/auth/guards';
import { LoginDto } from '@svv/api/auth/dtos';
import {
  JwtRefreshStrategy,
  JwtStrategy,
  LocalStrategy,
} from '@svv/api/auth/strategies';
import { usersModelProvider } from '@svv/api/users';
import { UsersService } from '@svv/api/users/services';
import { User } from '@svv/api/users/interfaces';
import { teamModelProvider } from '@svv/api/teams';
import { TeamsService } from '@svv/api/teams/services';
import { ArticlesService } from '@svv/api/articles/services';
import { articlesProviders } from '@svv/api/articles';
import { rootMongooseTestProvider } from '../src/test-utils';
import { Model } from 'mongoose';
import * as request from 'supertest';

describe('AuthController (e2e)', () => {
  let app;
  let usersService: UsersService;
  let userModel: Model<User>;
  let refreshToken: string;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        JwtModule.registerAsync({
          imports: [AppConfigModule],
          useFactory: async (configService: AppConfigService) => ({
            secret: configService.ACCESS_TOKEN_SECRET,
            signOptions: {
              expiresIn: configService.ACCESS_TOKEN_EXPIRATION_TIME,
            },
          }),
          inject: [AppConfigService],
        }),
        AppConfigModule,
      ],
      controllers: [AuthController],
      providers: [
        rootMongooseTestProvider,
        AuthService,
        LocalStrategy,
        JwtStrategy,
        JwtRefreshStrategy,
        UsersService,
        TeamsService,
        ArticlesService,
        usersModelProvider,
        teamModelProvider,
        ...articlesProviders,
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    userModel = module.get(USER_MODEL);
    usersService = module.get<UsersService>(UsersService);
    await usersService.createOne({
      email: 'david@tomschitz.de',
      firstName: 'David',
      lastName: 'Tomschitz',
      role: UserRole.ADMIN,
      canLogin: true,
      password: 'test',
    });

    app = module.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  // Login
  describe('login (POST)', () => {
    it('should fail because the email is incorrect', () => {
      const loginDto: LoginDto = {
        email: 'david@tooomschitz.de',
        password: 'test',
      };

      return request(app.getHttpServer())
        .post('/auth/login')
        .send(loginDto)
        .expect(500)
        .expect({
          type: ErrorType.INVALID_EMAIL,
          status: 500,
        });
    });

    it('should fail because the password is incorrect', () => {
      const loginDto: LoginDto = {
        email: 'david@tomschitz.de',
        password: 'TEST',
      };

      return request(app.getHttpServer())
        .post('/auth/login')
        .send(loginDto)
        .expect(500)
        .expect({
          type: ErrorType.INVALID_PASSWORD,
          status: 500,
        });
    });

    it('should login the user', async () => {
      const loginDto: LoginDto = {
        email: 'david@tomschitz.de',
        password: 'test',
      };

      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send(loginDto)
        .expect(201);

      expect(response.body.user).toMatchObject({
        email: 'david@tomschitz.de',
        firstName: 'David',
        lastName: 'Tomschitz',
        role: UserRole.ADMIN,
        canLogin: true,
      });
      expect(response.body.tokens.accessToken).toBeDefined();
      expect(response.body.tokens.refreshToken).toBeDefined();
      refreshToken = response.body.tokens.refreshToken;
    });
  });

  // Refresh Access Token
  describe('refresh (POST)', () => {
    it('should refresh the access token', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/refresh')
        .send({ refreshToken })
        .expect(201);

      expect(response.body.accessToken).toBeDefined();
    });
  });

  // Verify Refresh Token
  describe('verify (POST)', () => {
    it('should verify the refresh token and return the associated user', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/verify')
        .send({ refreshToken })
        .expect(201);

      expect(response.body).toMatchObject({
        email: 'david@tomschitz.de',
        firstName: 'David',
        lastName: 'Tomschitz',
        role: UserRole.ADMIN,
        canLogin: true,
      });
    });
  });

  // Logout
  describe('logout (POST)', () => {
    it('should logout the user and remove the refresh token from the database', async () => {
      const { _id } = await userModel.findOne({ email: 'david@tomschitz.de' });
      await request(app.getHttpServer())
        .post('/auth/logout')
        .send({ _id })
        .expect(201);

      const { refreshToken } = await userModel.findOne({ _id });
      expect(refreshToken).toBeUndefined();
    });
  });
});
