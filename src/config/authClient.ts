import openid from 'openid-client';

const issuer = new openid.Issuer({
    issuer: 'https://bravo68web.jp.auth0.com',
    authorization_endpoint: 'https://bravo68web.jp.auth0.com/authorize',
    token_endpoint: 'https://bravo68web.jp.auth0.com/oauth/token',
    userinfo_endpoint: 'https://bravo68web.jp.auth0.com/userinfo',
    jwks_uri: 'https://bravo68web.jp.auth0.com/.well-known/jwks.json',
    end_session_endpoint: 'https://bravo68web.jp.auth0.com/v2/logout'
})

export const authissuer = issuer;

// export const loginUrl = `https://bravo68web.jp.auth0.com/authorize?response_type=code&client_id=YllPpgjwKdxgJbJ2ifijRKVEZRkkW4Hy&connection=ad-sso&redirect_uri=http://localhost:3000/callback&state=12345`;

export const client = new issuer.Client({
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
    default_max_age: 84600,
    redirect_uris: [process.env.REDIRECT_URI],
    response_types: ['code'],
    id_token_signed_response_alg: 'RS256',
});

export const loginUrl = client.authorizationUrl({
    scope: 'openid profile email',
    state: '12345',
})