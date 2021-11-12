import 'zone.js/dist/zone-node';

import { APP_BASE_HREF } from '@angular/common';
import { ngExpressEngine } from '@nguniversal/express-engine';
import { REQUEST, RESPONSE } from '@nguniversal/express-engine/tokens';
import { AppServerModule } from './src/main.server';
import { existsSync } from 'fs';
import { join } from 'path';
import * as useragent from 'express-useragent';
import * as compression from 'compression';
import * as express from 'express';
import * as redis from 'redis';

function run() {
  const server = express();
  const port = 4000;
  const distFolder = join(process.cwd(), 'dist/website/browser');
  const indexHtml = existsSync(join(distFolder, 'index.original.html'))
    ? 'index.original.html'
    : 'index';

  const redisClient = redis.createClient({ host: '127.0.0.1', db: 1 });
  redisClient.flushdb((error, _) => {
    if (error) {
      console.error('Unable to clear the redis cache');
    } else {
      console.log('Redis cache cleared');
    }
  });

  const cacheKey: (req: express.Request) => string = req => {
    const userAgent = useragent.parse(req.headers['user-agent']);
    return `${userAgent.isDesktop ? 'desktop' : 'mobile'}_${req.originalUrl}`;
  };

  server.engine(
    'html',
    ngExpressEngine({
      bootstrap: AppServerModule,
    }),
  );

  server.set('view engine', 'html');
  server.set('views', distFolder);

  const cachedResponse: express.RequestHandler = (req, res, next) =>
    redisClient.get(cacheKey(req), (_: Error, reply: string) => {
      if (reply?.length) {
        res.send(reply);
      } else {
        next();
      }
    });

  const universalRenderer: express.RequestHandler = (req, res) => {
    res.render(
      indexHtml,
      {
        req,
        res,
        providers: [
          {
            provide: APP_BASE_HREF,
            useValue: req.baseUrl,
          },
          {
            provide: REQUEST,
            useValue: req,
          },
          {
            provide: RESPONSE,
            useValue: res,
          },
        ],
      },
      (error: Error, html: string) => {
        if (error) {
          return req.next(error);
        }

        if (res.statusCode === 200) {
          redisClient.set(cacheKey(req), html);
        }

        res.send(html);
      },
    );
  };

  server.use(compression());
  server.get(
    '*.*',
    express.static(distFolder, {
      maxAge: '1y',
    }),
  );
  server.get('/*', cachedResponse, universalRenderer);
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

// Webpack will replace 'require' with '__webpack_require__'
// '__non_webpack_require__' is a proxy to Node 'require'
// The below code is to ensure that the server is run only when not requiring the bundle.
declare const __non_webpack_require__: NodeRequire;
const mainModule = __non_webpack_require__.main;
if (mainModule && mainModule.filename === __filename) {
  run();
}

export * from './src/main.server';
