import { AuthConfig } from 'angular-oauth2-oidc';
import { environment } from '../../../environments/environment';

export const authConfig: AuthConfig = {
  clientId: environment.oidc.clientId,
  redirectUri: environment.oidc.redirectUri,
  postLogoutRedirectUri: environment.oidc.postLogoutRedirectUri,
  issuer: environment.oidc.issuer,
  scope: environment.oidc.scope,
  responseType: 'code',
  disablePKCE: false,
  useSilentRefresh: true,
  silentRefreshTimeout: 5000,
  timeoutFactor: 0.75,
  sessionChecksEnabled: true,
  showDebugInformation: !environment.production,
  strictDiscoveryDocumentValidation: !environment.production
};
