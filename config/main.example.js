/**
 * @type {{env_production: boolean, port: number, use_ssl: boolean, issuer: string}}
 */
export const MAIN_CONFIG = {
    port: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,
    issuer: process.env.ISSUER || 'http://localhost:3000',
    env_production: process.env.NODE_ENV === 'production' ? true : false,
    use_ssl: process.env.USE_SSL ? process.env.USE_SSL === 'true' : false,
    cf_team_domain: process.env.CF_TEAM_DOMAIN || 'my-cloudflare-team',
    cf_audience: process.env.CF_AUDIENCE || 'cloudflare-audience-copied-from-dashboard'
}
