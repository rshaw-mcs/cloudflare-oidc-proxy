// Adapted from https://github.com/panva/node-oidc-provider/blob/main/example/support/configuration.js

import { dynamicImport } from './dynamicImport.js';
let CLIENTS;
({ CLIENTS } = await dynamicImport('../config/clients.js'));

// noinspection JSUnusedGlobalSymbols, JSUnusedLocalSymbols
export default {
  pkce: {
    required: (ctx, client) => false,
  },
  clients: CLIENTS,
  interactions: {
    url(ctx, interaction) { // eslint-disable-line no-unused-vars
      return `/protected/interaction/${interaction.uid}`;
    },
  },
  cookies: { /* loaded from file  */ },
  claims: {
    address: ['address'],
    email: ['email', 'email_verified'],
    phone: ['phone_number', 'phone_number_verified'],
    profile: ['birthdate', 'family_name', 'gender', 'given_name', 'locale', 'middle_name', 'name',
      'nickname', 'picture', 'preferred_username', 'profile', 'updated_at', 'website', 'zoneinfo'],
  },
  features: {
    devInteractions: { enabled: false }, // defaults to true

    deviceFlow: { enabled: true }, // defaults to false
    revocation: { enabled: true }, // defaults to false
  },
  ttl: {
    AccessToken: 3600,
    AuthorizationCode: 60 /* 1 minute in seconds */,
    BackchannelAuthenticationRequest: 600 /* 10 minutes in seconds */,
    ClientCredentials: 600 /* 10 minutes in seconds */,
    DeviceCode: 600 /* 10 minutes in seconds */,
    Grant: 3600 /* 1 hour in seconds */,
    IdToken: 3600 /* 1 hour in seconds */,
    Interaction: 3600 /* 1 hour in seconds */,
    Session: 3600 /* 1 hour in seconds */,
    RefreshToken: 3600 /* 1 hour in seconds */,
  },
  routes: {
    authorization: '/protected/auth',
    backchannel_authentication: '/protected/backchannel',
    code_verification: '/protected/device',
    device_authorization: '/protected/device/auth',
    end_session: '/protected/session/end',
    introspection: '/token/introspection',
    jwks: '/jwks',
    pushed_authorization_request: '/protected/request',
    registration: '/protected/reg',
    revocation: '/token/revocation',
    token: '/token',
    userinfo: '/me'
  },
  jwks: { /* loaded from file */ },
};
