const fs = require('fs');
const envfile = require('envfile');
const crypto = require('crypto');

const ENV_PATH = '.env';

function main() {
  parsedEnvFile = envfile.parse(fs.readFileSync(ENV_PATH));

  parsedEnvFile.ACCESS_TOKEN_SECRET = generateSecret();
  parsedEnvFile.REFRESH_TOKEN_SECRET = generateSecret();

  fs.writeFile(ENV_PATH, envfile.stringify(parsedEnvFile), error => {
    if (error) {
      console.log(error);
      return;
    }

    console.log('✅  Scretes generated and saved');
  });
}

function generateSecret() {
  return crypto.randomBytes(256).toString('base64');
}

main();
