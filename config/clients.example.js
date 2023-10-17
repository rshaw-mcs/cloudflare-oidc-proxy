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
];
