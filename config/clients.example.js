/**
 * @typedef {'refresh_token' | 'authorization_code' | 'implicit' | 'urn:ietf:params:oauth:grant-type:device_code'} GrantType
 *
 * @typedef {{
 *     client_id: string,
 *     client_secret: string,
 *     grant_types: GrantType[],
 *     redirect_uris: string[]
 * }} OIDCClient
 */

/**
 * @type {OIDCClient[]}
 */
export const CLIENTS = [
  {
    client_id: process.env.OIDC_CLIENT_ID || 'oidc-client-id',
    client_secret: process.env.OIDC_CLIENT_SECRET || 'oidc-client-secret',
    grant_types: process.env.OIDC_CLIENT_GRANT_TYPES.split(',').map(s => s.trim()) || ['authorization_code', 'refresh_token'],
    redirect_uris: process.env.OIDC_CLIENT_REDIRECT_URIS.split(',').map(s => s.trim()) || ['http://localhost:3000/callback']
  }
];
