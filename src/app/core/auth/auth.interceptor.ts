import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';

/**
 * Interceptor HTTP funcional que adiciona o access token às requisições
 * Este interceptor automaticamente inclui o token Bearer em todas as requisições HTTP
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const oauthService = inject(OAuthService);
  
  // Obtém o access token
  const accessToken = oauthService.getAccessToken();
  
  // Se houver um token válido, adiciona ao header
  if (accessToken) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${accessToken}`
      }
    });
  }
  
  return next(req);
};
