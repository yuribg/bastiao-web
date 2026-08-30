import { OAuthService } from 'angular-oauth2-oidc';
import { authConfig } from './auth.config';

/**
 * Inicializa o serviço de autenticação OIDC
 * Esta função deve ser chamada durante a inicialização da aplicação
 */
export async function initializeAuth(oauthService: OAuthService): Promise<void> {
  try {
    // Configura as definições de autenticação
    oauthService.configure(authConfig);

    // Carrega o documento de descoberta do OIDC provider
    // Este documento contém os endpoints da autorização, token, etc.
    await oauthService.loadDiscoveryDocument();

    // Tenta fazer login automaticamente se houver código de autorização na URL
    await oauthService.tryLogin();

    console.log('Auth initialized successfully');
  } catch (error) {
    console.error('Error during auth initialization:', error);
    throw error;
  }
}
