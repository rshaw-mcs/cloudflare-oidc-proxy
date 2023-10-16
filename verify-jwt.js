// https://developers.cloudflare.com/cloudflare-one/identity/authorization-cookie/validating-json/#javascript-example

import jwksClient from 'jwks-rsa';
import jwt from 'jsonwebtoken';
import cookie from "cookie";

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

// verifyToken is a middleware to verify a CF authorization token
export const addToken = (req, res, next) => {
    console.log('ACC', req.path)

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
            return res.status(403).send({ status: false, message: 'invalid token' });
        }

        req.user = decoded;
        next();
    });
}
