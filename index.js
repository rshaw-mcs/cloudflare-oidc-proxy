/* eslint-disable no-console */

import * as path from 'node:path';
import * as url from 'node:url';

import { dirname } from 'desm';
import express from 'express';
import helmet from 'helmet';

import Provider from 'oidc-provider';

import Account from './account.js';
import configuration from './configuration.js';
import routes from './routes.js';

const __dirname = dirname(import.meta.url);

const { PORT = 3000, ISSUER = `http://localhost:${PORT}` } = process.env;
const ENV_PROD = process.env.NODE_ENV === 'production';
configuration.findAccount = Account.findAccount;

const app = express();

if (ENV_PROD) {
    const directives = helmet.contentSecurityPolicy.getDefaultDirectives();
    delete directives['form-action'];
    app.use(helmet({
        contentSecurityPolicy: {
            useDefaults: false,
            directives,
        },
    }));
}

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

let server;
try {
    let adapter;
    if (process.env.MONGODB_URI) {
        ({ default: adapter } = await import('./adapters/mongodb.js'));
        await adapter.connect();
    }

    const provider = new Provider(ISSUER, { adapter, ...configuration });

    if (ENV_PROD) {
        app.enable('trust proxy');
        provider.proxy = true;

        app.use((req, res, next) => {
            if (req.secure) {
                next();
            } else if (req.method === 'GET' || req.method === 'HEAD') {
                res.redirect(url.format({
                    protocol: 'https',
                    host: req.get('host'),
                    pathname: req.originalUrl,
                }));
            } else {
                res.status(400).json({
                    error: 'invalid_request',
                    error_description: 'do yourself a favor and only use https',
                });
            }
        });
    }

    routes(app, provider);
    app.use(provider.callback());
    server = app.listen(PORT, () => {
        console.log(`application is listening on port ${PORT}, check its /.well-known/openid-configuration`);
    });
} catch (err) {
    if (server?.listening) server.close();
    console.error(err);
    process.exitCode = 1;
}
