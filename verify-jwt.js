// https://developers.cloudflare.com/cloudflare-one/identity/authorization-cookie/validating-json/#javascript-example

import jwksClient from 'jwks-rsa';
import jwt from 'jsonwebtoken';
import cookie from "cookie";
import express from "express";
import { strict as assert } from 'assert';

const {Request, Response} = express;

/**
 * @typedef {Request & {user: {email: string} | undefined | null}} AuthorizedRequest
 */

// The Application Audience (AUD) tag for your application
const AUD = process.env.POLICY_AUD;

// Your CF Access team domain
const TEAM_DOMAIN = process.env.TEAM_DOMAIN;
const CERTS_URL = `https://${TEAM_DOMAIN}.cloudflareaccess.com/cdn-cgi/access/certs`;

const client = jwksClient({
    jwksUri: CERTS_URL
});

const getKey = (header, callback) => {
    client.getSigningKey(header.kid, function(err, key) {
        callback(err, key?.getPublicKey());
    });
}

/**
 * addUserInfo is a middleware to verify a CF authorization token
 * @param req {AuthorizedRequest}
 * @param res {Response}
 * @param next {() => void}
 */
export const addUserInfo = (req, res, next) => {
    console.debug('ACC', req.path);

    let token = req.header('Cf-Access-Jwt-Assertion');

    if (!token && req.header('Cookie')) {
        const cookies = cookie.parse(req.header('Cookie'));
        token = cookies['CF_Authorization'];
    }

    // Make sure that the incoming request has our token header
    if (!token) {
        req.user = null;
        next();
        return;
    }
    jwt.verify(token, getKey, { audience: AUD }, (err, decoded) => {
        if (err) {
            assert(res);
            return res.status(403).send({ status: false, message: 'invalid token' });
        }

        // noinspection JSUnresolvedReference
        /** @type {string} */
        const email = decoded.email;
        assert(typeof email === "string");
        req.user = {email};
        next();
    });
}

/**
 * @type {AuthorizedRequest}
 * @return Promise<void>
 */
export async function addUserInfoPromise(req) {
    let promiseResolve;
    const promise = new Promise((resolve) => promiseResolve = resolve);

    addUserInfo(req, undefined, () => promiseResolve());
    await promiseResolve;
}
