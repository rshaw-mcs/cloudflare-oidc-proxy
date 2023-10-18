/**
 * @type {{env_production: boolean, port: number, use_ssl: boolean, issuer: string}}
 */
export const MAIN_CONFIG = {
    port: 3000,
    issuer: 'http://localhost: 3000',
    env_production: false,
    use_ssl: false,
    cf_team_domain: 'my-cloudflare-team',
    cf_audience: 'cloudflare-audience-copied-from-dashboard'
}
