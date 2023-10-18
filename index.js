// Adapted from https://github.com/panva/node-oidc-provider/blob/main/example/express.js

/* eslint-disable no-console */
import 'dotenv/config';
import https from 'https';
import fs from 'fs';
import * as path from 'node:path';
import * as url from 'node:url';

import { dirname } from 'desm';
import express from 'express';
import helmet from 'helmet';

import Provider from 'oidc-provider';

import AccountService from './util/accountService.js';
import configuration from './util/configuration.js';
import routes from './util/routes.js';
import { addUserInfo } from "./util/verifyJWT.js";
import PersistentAdapter from "./util/persistentAdapter.js";
import { KeyManager } from "./util/generateKeys.js";
import { CookieSecretManager } from "./util/generateCookieKeys.js";

const __dirname = dirname(import.meta.url);

const { PORT = 3000, ISSUER = `http://localhost:${PORT}` } = process.env;
const ENV_PROD = process.env.NODE_ENV === 'production';
const ENV_SSL = !!process.env.SSL;
configuration.findAccount = AccountService.findAccount;

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

async function main() {
    let server;
    try {
        configuration.jwks = await (new KeyManager()).loadKeysOrGenerateAndSave(path.join('data', 'keys.json'));
        configuration.cookies = new CookieSecretManager(path.join('data', 'cookie_secrets.json')).getCookies();
        const provider = new Provider(ISSUER, {adapter: PersistentAdapter, ...configuration });

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

        // noinspection JSCheckFunctionSignatures
        app.use(addUserInfo)
        routes(app, provider);
        app.use(provider.callback());

        if (ENV_SSL) {
            server = https.createServer({
                key: fs.readFileSync('key.pem'),
                cert: fs.readFileSync('cert.pem')
            }, app).listen(PORT,  '',() => {
                console.log(`application is listening on port https://localhost:${PORT}, check its /.well-known/openid-configuration`);
            });
        } else {
            server = app.listen(PORT, () => {
                console.log(`Application is listening on port http://localhost:${PORT}, check its http://localhost:${PORT}/.well-known/openid-configuration`);
            });
        }
    } catch (err) {
        if (server?.listening) server.close();
        console.error(err);
        process.exitCode = 1;
    }
}

main().then(() => console.log("Application start initialized"));
