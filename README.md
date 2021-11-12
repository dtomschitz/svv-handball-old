<p align="center">
  <img src="logo.png" alt="logo" width="200"/>
</p>

# Table of contents

- [Pre-Installation & Requirements](#Pre-Installation-&-Requirements)
- [Project Structure](#Project-Structure)
- [Development Environment](#Development-Environment)
  - [Initial Setup](#Initial-Setup)
  - [MongoDB](#MongoDB)
  - [Redis](#Redis)
  - [API](#API)
  - [CMS](#CMS)
  - [Website](#Website)
- [Production Environment](#Production-Environment)
  - [NGINX](#NGINX)
  - [Redis](#Redis)
  - [MongoDB](#MongoDB)
  - [Build](#Build)
  - [PM2](#PM2)
- [Tests](#Tests)
- [Common Commands](#Common-Commands)
  - [API](#API)
  - [CMS](#CMS)
  - [Website](#Website)

# Pre-Installation & Requirements

In order to run the different apps the repository obvisously needs to get clone
and the required packages must be installed via `npm install`. This will install
everything that is needed for development and building the apps for production.

```bash
$ git clone git@github.com:SV-Vaihingen-Handball/svv-handball.git
$ cd svv-handball
$ npm install

$ npm install -g nx
$ npm install -g @angular/cli
```

# Project Structure

The entire project is divided into different folders to ensure a generally clear
structure. This is necessary because the repository contains all applications
and tools and thus also many configuration files. To achieve this goal, Nrwl Nx
is used, which helps to architect, test, and build the applications and libraries
at any scale. Additionally the robust CLI, caching, dependency management and
the fact that it is easy to manage different frameworks in one repo without any
pain makes Nx realy helpful. The project is therefore structured as follows:

- **Apps**: The source and most of the configuration files of the different
  applications are stored inside the `apps` folder.
- **Libraries**: The `libs` folder contains libraries which are shared across
  multiple applications (eg. the Models/Interfaces)
- **Tools**: Inside the tools folder are scripts for specific actions like
  seeding the database.

# Development Environment

## Initial Setup

Besides the pre-installation process it is also necessary to run `npm run seed`
so the database is filled with dummy data. Additionally a user for the initial
login is created which is especially important for the API and the CMS application
because both are either completely or partially secured via a JWT-Authentication
mechanism.

```bash
$ npm run seed

# For the first authentication the created test user can be used.
# Email: test@test.de
# Password: test
```

## MongoDB

In order to use the API in dev and production mode, a instance of an MongoDB
server must be present. You can either install the current version locally via
[this](https://docs.mongodb.com/manual/administration/install-community/)
installation guide or use the prepared docker compose file with the following
command.

```bash
$ docker-compose up db
```

## Redis

In the current version state of the project both the API and the Express server
which is serving the website are using a Redis server. The Redis server is mostly
to improve the overall performance and response time by caching the created responses.

```bash
$ docker-compose up redis
```

## API

Run the following command in order to start the API in development mode.
Navigate to http://localhost:3000/. The API will automatically reload if you
change any of the source files.

```bash
$ npm run start:api:dev
```

For testing purposes the API can also easily get started in production mode by
building the application first and then running it via NodeJS.

```bash
$ npm run build:api
$ node dist/api/main.js
```

**Note: In order to start the API an instance of MongoDB and Redis must be running.**

## CMS

Run the following command in order to start the CMS app in development mode.
Navigate to http://localhost:4200/. The CMS will automatically reload if you
change any of the source files.

```bash
npm run start:cms:dev
```

**Note: In order to start the CMS application an instance of the API must be running.**

## Website

Run the following command in order to start the website in development mode.
Navigate to http://localhost:4201/. The website will automatically reload if you
change any of the source files.

```bash
$ npm run start:website:dev
```

For testing purposes the Website can also easily get started in production mode by
building the application first and then running it via NodeJS.

```bash
$ npm run build:website
$ node dist/website/server/main.js
```

**Note: In order to start the Website the API must be running as well as an instance of Redis.**

# Production Environment

The production server is currently running `Debain 10` with `NodeJS v14.15.5` and
`npm v6.14.11`.

## NGINX

In the production environment NGINX is used for managing and distributing the
different applications. Simply follow [this](https://docs.nginx.com/nginx/admin-guide/installing-nginx/installing-nginx-open-source/) guide for installing NGINX. With the following
commands the NGINX process can be managed:

```bash
$ sudo systemctl start nginx
$ sudo systemctl stop nginx
$ sudo systemctl restart nginx
$ sudo systemctl reload nginx
$ sudo systemctl status nginx
```

**`NOTE: In the root folder of this repository lies a finalized configuration file which should be used.`**

## Redis

To improve the interaction performance between the API and the Website, Redis is
used for caching the responses. Follow [this](https://www.digitalocean.com/community/tutorials/how-to-install-and-secure-redis-on-debian-10) guide for installing Redis. With
the following commands the Redis process can be managed:

```bash
$ sudo systemctl start redis
$ sudo systemctl stop redis
$ sudo systemctl restart redis
$ sudo systemctl status redis
```

**NOTE: In the root folder of this repository lies a finalized configuration file which should be used.**

## MongoDB

Obviously the API needs a place for storing the data which in this case is done
with MongoDB. With [this](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-debian/)
the installation is pretty simple and quick. In order to mange the MongoDB
process the following commands can be used:

```bash
$ sudo systemctl start mongod
$ sudo systemctl stop mongod
$ sudo systemctl restart mongod
$ sudo systemctl status mongod
```

## Build

```bash
$ npm run build:api
$ npm run build:cms
$ npm run build:website
```

## PM2

For managing the different daemon processes we are using PM2 in production mode.
This helps amongst other things to keep the different applications online 24/7.
PM2 can be easily installed via npm:

```bash
$ npm install pm2 -g
```

The following commands will either start, stop restart or reload the process of the respective
application:

```bash
# Website
$ npm run start:website:prod #Use this command only for the first time.
$ pm2 start website
$ pm2 stop website
$ pm2 reload website
$ pm2 delete website
```

```bash
# API
$ npm run start:api:prod #Use this command only for the first time.
$ pm2 start api
$ pm2 stop api
$ pm2 reload api
$ pm2 delete api
```

**NOTE: The CMS application is served staticly by NGINX and does not require to be managed by PM2**

# Tests

In the current state of the project, there are only tests for the API. In
addition to the actual logic, these also test various validation cases and the
interceptors used for the respective routes. So these tests are Unlike unit
testing, which focuses on individual modules and classes. These tests are more
like end-to-end (e2e) which are covering the interaction of classes and modules
at a more aggregate level which will be closer to the kind of interaction that
end-users will have with the whole system.

The individual test processes for the features always follow the same scheme.
First the respective GET methods, the POST, the PUT and finally the DELETE
methods are tested. The entire test process can be started with the following command.

```bash
$ npm run test:api
```

# Common Commands

## API

| Name             | Description                                                                                         |
| ---------------- | --------------------------------------------------------------------------------------------------- |
| _start:api:dev_  | Starts the API in development mode using the Angular Dev-Server                                     |
| _start:api:prod_ | Starts the API in production mode and initalizes the PM2 daemon                                     |
| _build:api_      | Builds the API for production mode which is required in order to perform the start:api:prod command |
| _test:api_       | Starts the End-to-End tests for the API                                                             |

## CMS

| Name            | Description                        |
| --------------- | ---------------------------------- |
| _start:cms:dev_ | Starts the CMS in development mode |
| _start:cms:dev_ | Builds the API for production mode |

## Website

| Name                    | Description                                                                     |
| ----------------------- | ------------------------------------------------------------------------------- |
| _start:website:dev_     | Starts the Website in development mode using the Angular Dev-Server             |
| _start:website:dev:ssr_ | Starts the Website in development mode using the implemented Express server     |
| _start:website:ssr_     | Starts the Express server in production mode which will serve the Website       |
| _start:website:prod_    | Starts the Website in production mode and initalizes the PM2 daemon             |
| _build:website:browser_ | Bundles only the parts which are shipped to the Browser                         |
| _build:website:server_  | Bundles the Expres server                                                       |
| _build:website_         | Bundles everthing that is needed to start the Express server in production mode |
