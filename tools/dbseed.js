const { MongoClient, ObjectId } = require('mongodb');
const yargs = require('yargs');
const bcrypt = require('bcrypt');
const dayjs = require('dayjs');

const defaultCollections = [
  'users',
  'teams',
  'sponsors',
  'hvw_jobs',
  'contact_persons',
  'articles',
  'article_categories',
];

async function main(options = { collections, dropDatabase, dropCollections }) {
  console.log('🚀  Server ready');

  const client = new MongoClient('mongodb://localhost/svv', {
    useUnifiedTopology: true,
  });

  try {
    await client.connect();

    console.log('🌱  Database seeder is running');

    const db = client.db();

    if (options.dropDatabase) {
      console.log('🗑   Droping database');
      await db.dropDatabase('svv');
    }

    if (options.dropCollections) {
      for (const collection of options.dropCollections) {
        console.log(`🗑   Droping collection ${collection}`);
        await db.dropCollection(collection);
      }
    }

    // Users Seeding
    if (options.collections.includes('users')) {
      await db.collection('users').insertMany([
        {
          email: 'test@test.de',
          role: 'admin',
          firstName: 'Max',
          lastName: 'Mustermann',
          password: await bcrypt.hash('test', 10),
          canLogin: true,
        },
        {
          firstName: 'Martin',
          lastName: 'Schwalb',
          role: 'coach',
          canLogin: false,
        },
        {
          firstName: 'Heiner',
          lastName: 'Brand',
          role: 'coach',
          canLogin: false,
        },
        {
          firstName: 'Peter',
          lastName: 'Meisinger',
          role: 'coach',
          canLogin: false,
        },
        {
          firstName: 'Christian',
          lastName: 'Prokop',
          role: 'coach',
          canLogin: false,
        },
        {
          firstName: 'Horst',
          lastName: 'Bredemeier',
          role: 'coach',
          canLogin: false,
        },
      ]);
    }

    //Article Categories Seeding
    if (options.collections.includes('article_categories')) {
      await db.collection('article_categories').insertMany([
        {
          name: 'Spielbericht',
        },
        {
          name: 'Männer I',
        },
        {
          name: 'Männer II',
        },
        {
          name: 'Männer III',
        },
        {
          name: 'Frauen I',
        },
        {
          name: 'Frauen II',
        },
      ]);
    }

    // Articles Seeding
    if (options.collections.includes('articles')) {
      const categoryIds = await (
        await db.collection('article_categories').find().toArray()
      ).map(category => category._id);

      const title =
        'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam';
      const subtitle =
        'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.';
      const content =
        'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.';

      await db.collection('articles').insertMany([
        {
          date: dayjs().toISOString(),
          title,
          subtitle,
          content,
          categoryIds: [categoryIds[0], categoryIds[1]],
          pinned: false,
          disabled: false,
          divided: false,
        },
        {
          date: dayjs().toISOString(),
          title,
          subtitle,
          content,
          categoryIds: [categoryIds[2]],
          pinned: true,
          disabled: false,
          divided: false,
        },
        {
          date: dayjs().toISOString(),
          title,
          subtitle,
          content,
          categoryIds: [categoryIds[3], categoryIds[4]],
          pinned: false,
          disabled: false,
          divided: false,
        },
      ]);
    }

    // Teams Seeding
    if (options.collections.includes('teams')) {
      const coachIds = await (
        await db.collection('users').find({ role: 'coach' }).toArray()
      ).map(coach => coach._id);

      await db.collection('teams').insertMany([
        {
          name: 'Männer I',
          abbreviation: 'm1',
          gender: 'male',
          type: 'active',
          coachIds: [coachIds[0], coachIds[1]],
          position: 0,
          settings: {
            cacheTable: true,
            cacheGames: true,
          },
          disabled: false,
        },
        {
          name: 'Männer II',
          abbreviation: 'm2',
          gender: 'male',
          type: 'active',
          coachIds: [coachIds[2], coachIds[3]],
          position: 1,
          settings: {
            cacheTable: false,
            cacheGames: false,
          },
          disabled: false,
        },
        {
          name: 'Fauren I',
          abbreviation: 'f1',
          gender: 'female',
          type: 'active',
          coachIds: [coachIds[4], coachIds[5]],
          position: 2,
          settings: {
            cacheTable: true,
            cacheGames: true,
          },
          disabled: false,
        },
        {
          name: 'Männliche A-Jugend',
          abbreviation: 'mA1',
          gender: 'male',
          type: 'youth',
          coachIds: [],
          position: 0,
          settings: {
            cacheTable: true,
            cacheGames: true,
          },
          disabled: true,
        },
      ]);
    }

    // Contact Persons Seeding
    if (options.collections.includes('contact_persons')) {
      await db.collection('contact_persons').insertMany([
        {
          name: 'Abteilungsleitung',
          email: 'abteilungsleitung@svv-handball.de',
          type: 'executive',
          people: ['Dirk Nawatny', 'Jörg Zimmer'],
          position: 0,
        },
        {
          name: 'Kassenwart',
          email: 'kassenwart@svv-handball.de',
          type: 'executive',
          people: ['Lena Fischer'],
          position: 1,
        },
        {
          name: 'Admin',
          email: 'admin@svv-handball.de',
          type: 'normal',
          people: ['David Tomschitz'],
          position: 2,
        },
      ]);
    }

    // Sponsors Seeding
    if (options.collections.includes('sponsors')) {
      await db.collection('sponsors').insertMany([
        {
          name: 'Webfix',
          link: 'https://www.webix.de/',
          position: 1,
        },
        {
          name: 'Stuttgarter Hofbräu',
          link: 'https://www.stuttgarter-hofbraeu.de/',
          position: 1,
        },
      ]);
    }

    // HVW Jobs Seeding
    if (options.collections.includes('hvw_jobs')) {
      await db.collection('hvw_jobs').insertMany([
        {
          name: 'Spielklassen',
          type: 'classes',
          cronExpression: '*/1 * * * *',
          disabled: false,
        },
        {
          name: 'Spielwochen',
          type: 'weeks',
          cronExpression: '*/1 * * * *',
          disabled: false,
        },
        {
          name: 'Tabellen',
          type: 'tables',
          cronExpression: '*/1 * * * *',
          disabled: false,
        },
        {
          name: 'Begegnungen',
          type: 'games',
          cronExpression: '*/1 * * * *',
          disabled: false,
        },
      ]);
    }

    client.close();
    console.log('💤  Seeding finished');
  } catch (err) {
    console.log('❌  Error', err.stack);
  }
}

const { argv } = yargs
  .locale('en')
  .version()
  .help()
  .alias('help', 'h')
  .options({
    dropDatabase: {
      type: 'boolean',
      describe: 'Should the database get dropped on start?',
    },
    dropCollections: {
      type: 'string',
      describe: 'List of collections which should get dropped on start',
    },
    collections: {
      type: 'string',
      describe: 'List of collections which should get seeded',
    },
  });

const options = {
  collections: argv.collections
    ? argv.collections.split(',')
    : defaultCollections,
  dropDatabase: argv.dropDatabase ? argv.dropDatabase : true,
  dropCollections:
    !argv.dropDatabase && argv.dropCollections
      ? argv.dropCollections.split(',')
      : false,
};

main(options);
