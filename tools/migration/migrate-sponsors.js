/* eslint-disable @typescript-eslint/no-var-requires */

const { MongoClient } = require('mongodb');
const mysql = require('mysql2/promise');
const constants = require('./constants');

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

    const sponsors = (await mysqlConnection.query('SELECT * FROM sponsors'))[0].map(sponsor => ({
      name: sponsor.name,
      img: sponsor.img,
      link: sponsor.link,
      position: sponsor.position,
    }));

    const result = await db.collection('sponsors').insertMany(sponsors, { ordered: true });
    console.log(` +  ${result.insertedCount} documents were inserted`);

    mongoClient.close();
    console.log('💤  Migration finished');

    process.exit(0);
  } catch (err) {
    console.log('❌  Error', err.stack);
    process.exit(1);
  }
}

main();
