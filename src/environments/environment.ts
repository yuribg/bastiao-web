export const environment = {
  production: false,
  oidc: {
    issuer: 'https://auth.acropolebrasil.com.br/as/realms/oinabnb',
    clientId: 'bastioes',
    redirectUri: typeof window !== 'undefined' ? window.location.origin : '',
    postLogoutRedirectUri: typeof window !== 'undefined' ? window.location.origin : '',
    scope: 'openid profile email'
  }
};
