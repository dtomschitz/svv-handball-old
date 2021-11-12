import { Test } from '@nestjs/testing';
import { ErrorType, Gender, TeamType } from '@svv/core/models';
import { TEAM_MODEL } from '@svv/api/core/constants';
import { JwtAuthGuard } from '@svv/api/auth/guards';
import { Team } from '@svv/api/teams/interfaces';
import { usersModelProvider } from '@svv/api/users';
import { TeamsController, teamsProviders } from '@svv/api/teams';
import { TeamsService } from '@svv/api/teams/services';
import { CreateTeamDto, UpdateTeamDto } from '@svv/api/teams/dtos';
import { rootMongooseTestProvider } from '../src/test-utils';
import { Model } from 'mongoose';
import * as request from 'supertest';

describe('TeamsController (e2e)', () => {
  let app;
  let model: Model<Team>;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      controllers: [TeamsController],
      providers: [
        rootMongooseTestProvider,
        TeamsService,
        usersModelProvider,
        ...teamsProviders,
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    model = module.get(TEAM_MODEL);

    app = module.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  // Get Teams
  describe('getTeams (GET)', () => {
    it('should fail because no teams are stored', () => {
      return request(app.getHttpServer()).get('/teams').expect(500).expect({
        type: ErrorType.TEAMS_NOT_FOUND,
        status: 500,
      });
    });

    it('should return an array of teams', async () => {
      const teams = [
        {
          name: 'Männer I',
          abbreviation: 'm1',
          gender: Gender.MALE,
          type: TeamType.ACTIVE,
          position: 0,
        },
        {
          name: 'Männer II',
          abbreviation: 'm2',
          gender: Gender.MALE,
          type: TeamType.ACTIVE,
          position: 1,
        },
        {
          name: 'Frauen I',
          abbreviation: 'f1',
          gender: Gender.FEMALE,
          type: TeamType.ACTIVE,
          position: 2,
        },
      ];

      await model.insertMany(teams);
      const response = await request(app.getHttpServer())
        .get('/teams')
        .expect(200);

      expect(response.body).toMatchObject(teams);
    });
  });

  // Get Team
  describe('getTeam (GET)', () => {
    it('should fail because there is no team associated with the abbreviation', () => {
      return request(app.getHttpServer())
        .get('/teams/TEADAWdawdADad')
        .expect(500)
        .expect({
          type: ErrorType.TEAM_NOT_FOUND,
          status: 500,
        });
    });

    it('should return a team', async () => {
      const team = await model.findOne({ abbreviation: 'm1' });
      const response = await request(app.getHttpServer())
        .get(`/teams/m1`)
        .expect(200);

      expect(response.body._id).toEqual(String(team._id));
      expect(response.body.abbreviation).toEqual(team.abbreviation);
      expect(response.body.name).toEqual(team.name);
      expect(response.body.gender).toEqual(team.gender);
    });
  });

  // Create Team
  describe('createTeam (POST)', () => {
    it('should fail because the dto is invalid', () => {
      const createTeamDto = {
        abbreviation: 'm1',
        gender: Gender.MALE,
        type: TeamType.ACTIVE,
      };

      return request(app.getHttpServer())
        .post('/teams')
        .send({ team: createTeamDto })
        .expect(400)
        .expect({
          statusCode: 400,
          message: [
            'name must be a string',
            'name should not be empty',
            'position must be a number conforming to the specified constraints',
            'position should not be empty',
          ],
          error: 'Bad Request',
        });
    });

    it('should fail because the abbreviation is already used', () => {
      const createTeamDto: CreateTeamDto = {
        name: 'Männer I',
        abbreviation: 'm1',
        gender: Gender.MALE,
        type: TeamType.ACTIVE,
        position: 0,
      };

      return request(app.getHttpServer())
        .post('/teams')
        .send({ team: createTeamDto })
        .expect(500)
        .expect({
          type: ErrorType.DUPLICATE_TEAM,
          status: 500,
        });
    });

    it('should create a new team', async () => {
      const createTeamDto: CreateTeamDto = {
        name: 'Männer III',
        abbreviation: 'm3',
        gender: Gender.MALE,
        type: TeamType.ACTIVE,
        position: 0,
      };

      const response = await request(app.getHttpServer())
        .post('/teams')
        .send({ team: createTeamDto })
        .expect(201);

      expect(response.body.abbreviation).toEqual(createTeamDto.abbreviation);
      expect(response.body.name).toEqual(createTeamDto.name);
      expect(response.body.gender).toEqual(createTeamDto.gender);
      expect(response.body.settings).toEqual({
        cacheTable: true,
        cacheGames: true,
      });
      expect(response.body.disabled).toEqual(false);
    });
  });

  // Update Team
  describe('updateTeam (PUT)', () => {
    it('should fail because the id is invalid', () => {
      return request(app.getHttpServer())
        .put('/teams/invalidId')
        .expect(500)
        .expect({
          type: ErrorType.INVALID_OBJECT_ID,
          status: 500,
        });
    });

    it('should fail because there is no team associated with the id', () => {
      return request(app.getHttpServer())
        .put('/teams/5fe1d469c0a4cb7fe157b14b')
        .expect(500)
        .expect({
          type: ErrorType.TEAM_NOT_FOUND,
          status: 500,
        });
    });

    it('should fail because the abbreviation is already used', async () => {
      const { _id } = await model.findOne({ abbreviation: 'f1' });

      const updateTeamDto: UpdateTeamDto = {
        abbreviation: 'm1',
      };

      return request(app.getHttpServer())
        .put(`/teams/${_id}`)
        .send({ changes: updateTeamDto })
        .expect(500)
        .expect({
          type: ErrorType.DUPLICATE_TEAM,
          status: 500,
        });
    });

    it('should fail because the dto is invalid', async () => {
      const { _id } = await model.findOne({ abbreviation: 'm2' });

      const updateTeamDto = {
        name: 123,
      };

      return request(app.getHttpServer())
        .put(`/teams/${_id}`)
        .send({ changes: updateTeamDto })
        .expect(400)
        .expect({
          statusCode: 400,
          message: ['name must be a string'],
          error: 'Bad Request',
        });
    });

    it('should update a team', async () => {
      const { _id } = await model.findOne({ abbreviation: 'm2' });

      const updateTeamDto: UpdateTeamDto = {
        name: 'Frauen II',
        abbreviation: 'f2',
        gender: Gender.FEMALE,
      };

      const response = await request(app.getHttpServer())
        .put(`/teams/${_id}`)
        .send({ changes: updateTeamDto })
        .expect(200);

      expect(response.body.name).toEqual(updateTeamDto.name);
      expect(response.body.abbreviation).toEqual(updateTeamDto.abbreviation);
      expect(response.body.gender).toEqual(updateTeamDto.gender);
    });
  });

  // Delete Team
  describe('deleteTeam (DELETE)', () => {
    it('should fail because the id is invalid', () => {
      return request(app.getHttpServer())
        .delete('/teams/invalidId')
        .expect(500)
        .expect({
          type: ErrorType.INVALID_OBJECT_ID,
          status: 500,
        });
    });

    it('should fail because there is no team associated with the id', () => {
      return request(app.getHttpServer())
        .delete('/teams/5de1c469c0a4cb7fe157b14b')
        .expect(500)
        .expect({
          type: ErrorType.TEAM_NOT_FOUND,
          status: 500,
        });
    });

    it('should delete a team', async () => {
      const { _id } = await model.findOne({ abbreviation: 'm1' });
      await request(app.getHttpServer()).delete(`/teams/${_id}`).expect(200);
    });
  });
});
