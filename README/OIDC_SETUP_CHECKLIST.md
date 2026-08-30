# ✅ Guia de Configuração Final - OIDC com PKCE

Este arquivo contém o passo a passo para completar a implementação de autenticação OIDC.

## 🎯 O que foi implementado

### ✅ 1. Estrutura de Arquivos Criada

```
src/
├── environments/
│   ├── environment.ts           ✅ Configuração de desenvolvimento
│   └── environment.prod.ts      ✅ Configuração de produção
├── app/
│   ├── core/
│   │   └── auth/
│   │       ├── auth.config.ts       ✅ Configuração OIDC
│   │       ├── auth.service.ts      ✅ Serviço de autenticação
│   │       ├── auth.guard.ts        ✅ Guard para rotas protegidas
│   │       ├── auth.interceptor.ts  ✅ Interceptor HTTP
│   │       └── auth.initializer.ts  ✅ Inicializador da app
│   ├── shared/
│   │   └── components/
│   │       └── user-profile/
│   │           └── user-profile.component.ts  ✅ Componente de perfil
│   └── app.config.ts            ✅ Configuração da aplicação
```

### ✅ 2. Dependências Instaladas

```bash
✅ angular-oauth2-oidc (instalado com --legacy-peer-deps)
```

## 📝 Próximas Etapas

### 1️⃣ Configurar Variáveis de Ambiente

**Arquivo: `src/environments/environment.ts`**

Substitua os placeholders:

```typescript
export const environment = {
  production: false,
  oidc: {
    issuer: 'https://seu-provedor-oidc.com',        // ← CONFIGURAR
    clientId: 'SEU_CLIENT_ID_AQUI',                  // ← CONFIGURAR
    redirectUri: window.location.origin,
    postLogoutRedirectUri: window.location.origin,
    scope: 'openid profile email'
  }
};
```

**Arquivo: `src/environments/environment.prod.ts`**

Faça as mesmas alterações para produção.

### 2️⃣ Usar o Componente de Perfil

Adicione o `UserProfileComponent` no seu `AppComponent`:

```typescript
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UserProfileComponent } from './shared/components/user-profile/user-profile.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, UserProfileComponent],
  template: `
    <div class="app-header">
      <h1>Bastião</h1>
      <app-user-profile></app-user-profile>
    </div>
    <router-outlet></router-outlet>
  `,
  styles: [`
    .app-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px;
      border-bottom: 1px solid #ddd;
    }
  `]
})
export class AppComponent {}
```

### 3️⃣ Proteger Rotas (Exemplo)

Edite `src/app/app.routes.ts` para proteger rotas:

```typescript
import { authGuard } from './core/auth/auth.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  
  // Rota protegida
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard]
  },
  
  // Rotas filhas protegidas
  {
    path: 'admin',
    canActivate: [authGuard],
    children: [
      { path: 'users', component: AdminUsersComponent },
      { path: 'settings', component: AdminSettingsComponent }
    ]
  }
];
```

### 4️⃣ Usar o AuthService nos Componentes

Exemplo em um componente:

```typescript
import { Component, inject } from '@angular/core';
import { AuthService } from './core/auth/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  template: `
    <div *ngIf="authService.isLoggedIn()">
      <p>Bem-vindo, {{ profile?.name }}</p>
      <button (click)="logout()">Sair</button>
    </div>
  `
})
export class DashboardComponent {
  private authService = inject(AuthService);
  profile = this.authService.getUserProfile();

  logout() {
    this.authService.logout();
  }
}
```

### 5️⃣ Integrar com APIs

O `authInterceptor` adiciona automaticamente o token às requisições:

```typescript
import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';

export class UserService {
  private http = inject(HttpClient);

  // O token Bearer é adicionado automaticamente pelo interceptor
  getUsers() {
    return this.http.get('/api/users');
    // Header enviado: Authorization: Bearer <token>
  }
}
```

## 🔒 Segurança - Checklist

- ✅ PKCE habilitado (`disablePKCE: false`)
- ✅ Sem Client Secret (Public Client)
- ✅ Access Token incluído em todas as requisições HTTP
- ✅ Refresh Token automático (opcional)
- ✅ Proteção de rotas com `authGuard`

## 🧪 Testando a Implementação

### 1. Verificar Configuração

```bash
cd bastiao-web
npm install
npm start
```

Abra o console do navegador (F12) e procure por mensagens de debug do OIDC.

### 2. Testar Login/Logout

1. Clique no botão "Entrar" no componente `UserProfileComponent`
2. Você será redirecionado para o provedor OIDC
3. Faça login
4. Você será redirecionado de volta à aplicação
5. O perfil será exibido
6. Clique "Sair" para fazer logout

### 3. Testar Rotas Protegidas

1. Acesse uma rota protegida sem estar autenticado
2. Você será redirecionado para login automaticamente
3. Após login, terá acesso à rota

## 📚 Estrutura de Dados do Token

O ID Token contém informações do usuário:

```typescript
// Exemplo de perfil retornado por getUserProfile()
{
  iss: "https://seu-provedor-oidc.com",
  sub: "usuario123",
  aud: "seu-client-id",
  exp: 1234567890,
  iat: 1234567800,
  name: "João Silva",
  email: "joao@example.com",
  email_verified: true,
  // ... outros claims
}
```

## 🚨 Troubleshooting

### Problema: "Invalid issuer"
- Verifique se a URL do `issuer` em `environment.ts` está correta
- Remova trailing slash (não use `https://provider.com/`)

### Problema: CORS error
- Confirme que o provedor OIDC permite requisições do seu domínio
- Verifique as configurações CORS do backend

### Problema: Tokens não aparecem
- Verifique os logs do console (F12)
- Certifique-se de que `clientId` e `redirectUri` estão corretos
- Confirme que o provedor OIDC está retornando os tokens

### Problema: Logout não funciona
- Alguns provedores OIDC requerem logout adicional no lado do servidor
- Adicione chamada ao endpoint de logout do provedor

## 📞 Referências Úteis

- [angular-oauth2-oidc Docs](https://github.com/manfredsteyer/angular-oauth2-oidc)
- [OAuth 2.0 PKCE RFC 7636](https://tools.ietf.org/html/rfc7636)
- [OpenID Connect Specification](https://openid.net/specs/openid-connect-core-1_0.html)

## ✨ Próximas Melhorias (Opcional)

- [ ] Adicionar refresh token com tempo de expiração
- [ ] Implementar auto-logout após inatividade
- [ ] Adicionar tela de login customizada
- [ ] Integrar com gerenciador de estado (NgRx)
- [ ] Adicionar logs de auditoria
- [ ] Implementar Multi-Factor Authentication (MFA)

---

**Status: ✅ Implementação Completa**

Todos os arquivos foram criados e configurados. Agora é necessário apenas configurar as variáveis de ambiente com os dados do seu provedor OIDC.
