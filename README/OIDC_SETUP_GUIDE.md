# Implementação de Autenticação OIDC com Angular OAuth2

Este guia descreve como usar a autenticação OpenID Connect (OIDC) na aplicação Angular.

## 📋 Pré-requisitos

- Angular 18+
- Node.js e npm
- Biblioteca `angular-oauth2-oidc` instalada

## 🔧 Configuração

### 1. Variáveis de Ambiente

Atualize os arquivos de configuração com seus dados do provedor OIDC:

**`src/environments/environment.ts`** e **`src/environments/environment.prod.ts`**:

```typescript
export const environment = {
  production: false,
  oidc: {
    issuer: 'https://seu-provedor-oidc.com',        // URL do provedor OIDC
    clientId: 'SEU_CLIENT_ID_AQUI',                  // Seu Client ID
    redirectUri: window.location.origin,             // URL de redirecionamento
    postLogoutRedirectUri: window.location.origin,   // URL após logout
    scope: 'openid profile email'                    // Escopos solicitados
  }
};
```

### 2. Configuração de Autenticação

O arquivo `src/app/core/auth/auth.config.ts` define os parâmetros de OIDC:

```typescript
export const authConfig: AuthConfig = {
  clientId: environment.oidc.clientId,
  redirectUri: environment.oidc.redirectUri,
  postLogoutRedirectUri: environment.oidc.postLogoutRedirectUri,
  issuer: environment.oidc.issuer,
  scope: environment.oidc.scope,
  responseType: 'code',           // Authorization Code Flow
  disablePKCE: false,             // PKCE habilitado (obrigatório)
  useSilentRefresh: true,         // Refresh silencioso
  sessionChecksEnabled: true      // Verificação de sessão
};
```

## 🚀 Uso

### AuthService

O `AuthService` fornece métodos para gerenciar autenticação:

```typescript
import { AuthService } from './core/auth/auth.service';

constructor(private authService: AuthService) {}

// Login
login() {
  this.authService.login();
}

// Logout
logout() {
  this.authService.logout();
}

// Verificar se está autenticado
if (this.authService.isLoggedIn()) {
  console.log('Usuário autenticado');
}

// Obter perfil do usuário
const profile = this.authService.getUserProfile();
console.log(profile.name, profile.email);

// Observar mudanças de autenticação
this.authService.getIsLoggedIn$().subscribe(isLoggedIn => {
  console.log('Status:', isLoggedIn);
});

// Obter tokens
const accessToken = this.authService.getAccessToken();
const idToken = this.authService.getIdToken();
```

### AuthGuard para Rotas Protegidas

Use o `authGuard` para proteger rotas que requerem autenticação:

**`src/app/app.routes.ts`**:

```typescript
import { Routes } from '@angular/router';
import { authGuard } from './core/auth/auth.guard';
import { HomeComponent } from './features/home/home.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { 
    path: 'dashboard', 
    component: DashboardComponent, 
    canActivate: [authGuard]  // ✅ Rota protegida
  }
];
```

### Componente de Perfil de Usuário

Use o componente `UserProfileComponent` para exibir opções de login/logout:

```typescript
import { UserProfileComponent } from './shared/components/user-profile/user-profile.component';

@Component({
  selector: 'app-root',
  imports: [UserProfileComponent],
  template: `
    <app-user-profile></app-user-profile>
  `
})
export class AppComponent {}
```

### Interceptor HTTP

O `authInterceptor` é automaticamente aplicado a todas as requisições HTTP, adicionando o token Bearer:

```typescript
// Nenhuma configuração necessária - funciona automaticamente
// Todas as requisições HTTP receberão:
// Authorization: Bearer <access_token>
```

## 🔄 Fluxo de Autenticação (Authorization Code Flow + PKCE)

```
┌─────────────────────────────────────────────────────────────────┐
│ 1. Usuário clica em "Login"                                      │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ 2. authService.login() inicia Authorization Code Flow            │
│    - Gera PKCE: code_verifier e code_challenge                  │
│    - Redireciona para provedor OIDC                              │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ 3. Usuário faz login no provedor OIDC                            │
│    - Autenticação (username/password, MFA, etc.)                │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ 4. Provedor redireciona para redirectUri com authorization code │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ 5. App troca code por tokens (access_token + id_token)           │
│    - Envia: code + code_verifier (PKCE)                          │
│    - Sem client_secret (Public client)                           │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ 6. Tokens recebidos e armazenados (localStorage/sessionStorage) │
│    - ID Token: contém informações do usuário                    │
│    - Access Token: para acessar APIs                             │
│    - Refresh Token (opcional): para renovar access token        │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ 7. Usuário autenticado - acesso às rotas protegidas              │
└─────────────────────────────────────────────────────────────────┘
```

## 🛡️ Segurança

- **PKCE (Proof Key for Public Clients)**: Protege contra ataques de autorização
- **No Client Secret**: Não necessário em aplicações SPA (habilitado por padrão)
- **Access Token**: Enviado automaticamente em todas as requisições HTTP
- **Refresh Token**: Renovação automática de tokens expirados (configurável)

## 📱 Ciclo de Vida da Aplicação

1. **Inicialização** (`initializeAuth`):
   - Carrega configurações de OIDC
   - Obtém documento de descoberta do provedor
   - Tenta fazer login automaticamente se houver authorization code na URL

2. **Autenticação**:
   - Usuário clica em login → `authService.login()`
   - Redirecionado para provedor OIDC
   - Retorna à aplicação com authorization code
   - Tokens são armazenados e verificados

3. **Requisições HTTP**:
   - `authInterceptor` adiciona access token automaticamente
   - APIs recebem requisições com Bearer token

4. **Refresh de Token**:
   - Configurado como `useSilentRefresh: true`
   - Renovação automática em background
   - Mantém sessão ativa

## 🐛 Debug

Para ativar logs de debug durante desenvolvimento:

```typescript
// Em auth.config.ts:
export const authConfig: AuthConfig = {
  // ...
  showDebugInformation: !environment.production,
  strictDiscoveryDocumentValidation: !environment.production
};
```

Os logs aparecerão no console do navegador e ajudarão a diagnosticar problemas.

## 📚 Referências

- [angular-oauth2-oidc Documentation](https://github.com/manfredsteyer/angular-oauth2-oidc)
- [OAuth 2.0 PKCE](https://tools.ietf.org/html/rfc7636)
- [OpenID Connect](https://openid.net/connect/)

## ❓ Troubleshooting

### Problema: "Invalid issuer"
**Solução**: Verifique se a URL do `issuer` está correta e sem trailing slash.

### Problema: Tokens não aparecem
**Solução**: Verifique se o `clientId` e `redirectUri` estão corretos na configuração de ambiente.

### Problema: CORS errors
**Solução**: Confirme que o provedor OIDC permite requisições do seu domínio.

### Problema: Logout não funciona
**Solução**: Verifique se o provedor OIDC suporta endpoint de logout configurado em `postLogoutRedirectUri`.
