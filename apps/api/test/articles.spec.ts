import { Test } from '@nestjs/testing';
import { ErrorType } from '@svv/core/models';
import { ARTICLE_MODEL } from '@svv/api/core/constants';
import { JwtAuthGuard } from '@svv/api/auth/guards';
import { usersProviders } from '@svv/api/users';
import { ArticlesController, articlesProviders } from '@svv/api/articles';
import {
  ArticlesService,
  ArticleCategoriesService,
} from '@svv/api/articles/services';
import { Article } from '@svv/api/articles/interfaces';
import { CreateArticleDto, UpdateArticleDto } from '@svv/api/articles/dtos';
import { rootMongooseTestProvider } from '../src/test-utils';
import { Model } from 'mongoose';
import * as request from 'supertest';

describe('ArticlesController (e2e)', () => {
  let app;
  let model: Model<Article>;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      controllers: [ArticlesController],
      providers: [
        rootMongooseTestProvider,
        ArticlesService,
        ArticleCategoriesService,
        ...articlesProviders,
        ...usersProviders,
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    model = module.get(ARTICLE_MODEL);

    app = module.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  // Get Articles
  describe('getArticles (GET)', () => {
    it('should fail because no articles are stored', () => {
      return request(app.getHttpServer()).get('/articles').expect(500).expect({
        type: ErrorType.ARTICLES_NOT_FOUND,
        status: 500,
      });
    });

    it('should return an array of articles', async () => {
      const articles = [
        {
          date: '2021-01-21T15:26:59.463Z',
          title: 'Test Titel',
          content: 'Test Inhalt',
          categoryIds: [],
          authorIds: [],
          pinned: false,
          disabled: false,
          divided: false,
        },
        {
          date: '2021-01-21T15:26:33.463Z',
          title: 'Test Titel 2',
          content: 'Test Inhalt',
          categoryIds: [],
          authorIds: [],
          pinned: false,
          disabled: false,
          divided: false,
        },
      ];

      await model.insertMany(articles);
      const response = await request(app.getHttpServer())
        .get('/articles')
        .expect(200);

      expect(response.body).toMatchObject(articles);
    });
  });

  // Get Article
  describe('getArticle (GET)', () => {
    it('should fail because there is no article associated with the id', () => {
      return request(app.getHttpServer())
        .get('/articles/5fe1c469c0a4cb7fe157b14b')
        .expect(500)
        .expect({
          type: ErrorType.ARTICLE_NOT_FOUND,
          status: 500,
        });
    });

    it('should fail because the id is invalid', () => {
      return request(app.getHttpServer())
        .get('/articles/invalidId')
        .expect(500)
        .expect({
          type: ErrorType.INVALID_OBJECT_ID,
          status: 500,
        });
    });

    it('should return a article', async () => {
      const article = await model.findOne({ title: 'Test Titel' });
      const response = await request(app.getHttpServer())
        .get(`/articles/${article._id}`)
        .expect(200);

      expect(response.body._id).toEqual(String(article._id));
      expect(response.body.title).toEqual(article.title);
      expect(response.body.subtitle).toEqual(article.subtitle);
      expect(response.body.date).toEqual(article.date);
    });
  });

  // Create Article
  describe('createArticle (POST)', () => {
    it('should fail because the dto is invalid', () => {
      const createArticleDto = {
        content: 'test',
      };

      return request(app.getHttpServer())
        .post('/articles')
        .send({ article: createArticleDto })
        .expect(400)
        .expect({
          statusCode: 400,
          message: [
            'date should not be empty',
            'date must be a string',
            'title should not be empty',
            'title must be a string',
          ],
          error: 'Bad Request',
        });
    });

    it('should create a new article', async () => {
      const createArticleDto: CreateArticleDto = {
        date: '2021-01-21T15:26:33.463Z',
        title: 'Test Titel 3',
        content: 'Test Inhalt',
        categoryIds: [],
        authorIds: [],
      };
      const response = await request(app.getHttpServer())
        .post('/articles')
        .send({ article: createArticleDto })
        .expect(201);

      expect(response.body.title).toEqual(createArticleDto.title);
      expect(response.body.subtitle).toEqual(createArticleDto.subtitle);
      expect(response.body.content).toEqual(createArticleDto.content);
      expect(response.body.disabled).toEqual(false);
    });
  });

  // Update Article
  describe('updateArticle (PUT)', () => {
    it('should fail because the id is invalid', () => {
      return request(app.getHttpServer())
        .put('/articles/invalidId')
        .expect(500)
        .expect({
          type: ErrorType.INVALID_OBJECT_ID,
          status: 500,
        });
    });

    it('should fail because there is no article associated with the id', () => {
      return request(app.getHttpServer())
        .put('/articles/5fe1d469c0a4cb7fe157b14b')
        .expect(500)
        .expect({
          type: ErrorType.ARTICLE_NOT_FOUND,
          status: 500,
        });
    });

    it('should fail because the dto is invalid', async () => {
      const { _id } = await model.findOne({ title: 'Test Titel' });

      const updateArticleDto = {
        title: 1337,
        subtitle: 2,
      };

      return request(app.getHttpServer())
        .put(`/articles/${_id}`)
        .send({ changes: updateArticleDto })
        .expect(400)
        .expect({
          statusCode: 400,
          message: ['title must be a string', 'subtitle must be a string'],
          error: 'Bad Request',
        });
    });

    it('should update a article', async () => {
      const { _id } = await model.findOne({ title: 'Test Titel' });

      const updateArticleDto: UpdateArticleDto = {
        title: 'Neuer Titel',
        subtitle: 'Neuer Untertitel',
      };

      const response = await request(app.getHttpServer())
        .put(`/articles/${_id}`)
        .send({ changes: updateArticleDto })
        .expect(200);

      expect(response.body.title).toEqual(updateArticleDto.title);
      expect(response.body.subtitle).toEqual(updateArticleDto.subtitle);
    });
  });

  // Delete Article
  describe('deleteArticle (DELETE)', () => {
    it('should fail because the id is invalid', () => {
      return request(app.getHttpServer())
        .delete('/articles/invalidId')
        .expect(500)
        .expect({
          type: ErrorType.INVALID_OBJECT_ID,
          status: 500,
        });
    });

    it('should fail because there is no article associated with the id', () => {
      return request(app.getHttpServer())
        .delete('/articles/5de1c469c0a4cb7fe157b14b')
        .expect(500)
        .expect({
          type: ErrorType.ARTICLE_NOT_FOUND,
          status: 500,
        });
    });

    it('should delete a article', async () => {
      const { _id } = await model.findOne({ title: 'Test Titel 3' });
      await request(app.getHttpServer()).delete(`/articles/${_id}`).expect(200);
    });
  });
});
