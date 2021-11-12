/* eslint-disable @typescript-eslint/no-var-requires */

const { isDivisibleBy } = require('class-validator');
const { MongoClient, ObjectId } = require('mongodb');
const mysql = require('mysql2/promise');
const constants = require('./constants');
const dayjs = require('dayjs');

async function main() {
  console.log('🌱  Migrating articles, categories and authors from mysql db');

  const mongoClient = new MongoClient(constants.MONGO_URI, {
    useUnifiedTopology: true,
  });

  const mysqlConnection = await mysql.createConnection({
    host: constants.MYSQL_HOST,
    user: constants.MYSQL_USER,
    password: constants.MYSQL_PASSWORD,
    database: constants.MYSQL_DATABASE,
  });

  try {
    await mongoClient.connect();
    await mysqlConnection.connect();

    const db = mongoClient.db();

    const authors = [];
    const mappedAuthorIds = {};

    console.log('+ Migrating authors');

    for (const row of (
      await mysqlConnection.query('SELECT * FROM authors')
    )[0]) {
      const _id = ObjectId();
      const [firstName, lastName] = row.name.split(' ');

      authors.push({
        _id,
        firstName,
        lastName,
        role: 'author',
        canLogin: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      mappedAuthorIds[row.id] = _id;
    }

    await db.collection('users').deleteMany({ role: 'author' });
    await db.collection('users').insertMany(authors);

    console.log('+ Migrating article categories');

    const categories = [];
    const mappedCategoryIds = {};

    for (const row of (
      await mysqlConnection.query('SELECT * FROM articles_categories')
    )[0]) {
      const _id = ObjectId();

      categories.push({
        _id,
        name: row.category,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      mappedCategoryIds[row.id] = _id;
    }

    await db.dropCollection('article_categories');
    await db.collection('article_categories').insertMany(categories);

    console.log('+ Migrating articles');

    const articles = [];
    for (const row of (
      await mysqlConnection.query('SELECT * FROM articles')
    )[0]) {
      const _id = ObjectId();
      const article = {
        _id,
        date: row.date,
        title: row.title,
        subtitle: row.meta,
        content: row.content,
        authorIds: [mappedAuthorIds[row.author]],
        categoryIds: [mappedCategoryIds[row.category]],
        pinned: false,
        disabled: false,
        readMore: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      if (row.teamID) {
        const team = await db
          .collection('teams')
          .findOne({ abbreviation: row.teamID });
        if (team) {
          let category = await db
            .collection('article_categories')
            .findOne({ name: team.name });

          if (!category) {
            await db.collection('article_categories').insertOne({
              _id: ObjectId(),
              name: team.name,
              createdAt: new Date(),
              updatedAt: new Date(),
            });
            category = await db
              .collection('article_categories')
              .findOne({ name: team.name });
          }

          article.categoryIds = [...article.categoryIds, category._id];
        }
      }

      articles.push(article);
    }

    await db.collection('articles').deleteMany({ pinned: false });
    await db.collection('articles').insertMany(articles);

    mongoClient.close();
    console.log('💤  Migration finished');

    process.exit(0);
  } catch (err) {
    console.log('❌  Error', err.stack);
    process.exit(1);
  }
}

main();
