# 🧪 Guia de Testes Práticos

Este arquivo contém testes práticos que você pode fazer para verificar se a implementação de autenticação OIDC está funcionando corretamente.

---

## ✅ Verificação Pré-Testes

Antes de testar, verifique:

```
□ npm install foi executado
□ src/environments/environment.ts foi configurado com:
  - issuer (URL do provedor OIDC)
  - clientId (seu Client ID)
□ npm start está rodando sem erros
□ Browser abre em http://localhost:4200
```

---

## 🧪 Teste 1: Verificar Inicialização

### Objetivo
Verificar se a configuração OIDC foi carregada corretamente.

### Passos

1. **Abrir DevTools**
   - Pressione `F12` no browser
   - Vá para a aba **Console**

2. **Procurar por mensagens de inicialização**
   - Você deve ver: `Auth initialized successfully`
   - Ou logs do OIDC

3. **Verificar erros**
   - Se houver erros em vermelho, anote-os
   - Verifique se são relacionados a OIDC

### ✅ Sucesso
```
Console mostra:
✓ "Auth initialized successfully"
✓ Nenhum erro vermelho relacionado a oauth
```

### ❌ Problema Comum
```
Erro: "Invalid issuer"
↳ Solução: Verifique URL do issuer (sem trailing slash)
```

---

## 🧪 Teste 2: Verificar Componente de Perfil

### Objetivo
Verificar se o componente `UserProfileComponent` aparece e funciona.

### Passos

1. **Abrir aplicação**
   - Acesse http://localhost:4200
   - Procure pelo componente de perfil/login

2. **Verificar elemento**
   - Você deve ver um botão **"Entrar"** ou similar
   - O componente deve estar visível

3. **Inspecionar elemento**
   - Clique com botão direito → Inspecionar
   - Verifique se é um `<app-user-profile>` ou similar

### ✅ Sucesso
```
✓ Botão "Entrar" visível
✓ Styling aplicado
✓ Sem erros no console
```

### ❌ Problema Comum
```
Botão não aparece
↳ Verifique se UserProfileComponent está no imports do AppComponent
```

---

## 🧪 Teste 3: Iniciar Fluxo de Login

### Objetivo
Testar se o fluxo de login com OIDC funciona.

### Passos

1. **Clicar em "Entrar"**
   - Clique no botão de login
   - Você deve ser redirecionado para o provedor OIDC

2. **Verificar redirecionamento**
   - A URL deve mudar para domínio do provedor OIDC
   - Exemplo: `https://seu-provedor-oidc.com/auth`

3. **Se não redirecionar**
   - Verifique console (F12) para erros
   - Verifique se `clientId` está correto

### ✅ Sucesso
```
✓ Redirecionado para provedor OIDC
✓ Página de login do provedor aparece
✓ URL mudou para domínio externo
```

### ❌ Problemas Comuns

```
Erro 1: "Redirect URI mismatch"
↳ Solução: Verificar redirectUri em environment.ts
         Deve ser exatamente igual ao registrado no provedor

Erro 2: "Invalid Client ID"
↳ Solução: Verificar clientId em environment.ts
         Deve ser exatamente igual ao fornecido pelo provedor

Erro 3: Não redireciona (fica congelado)
↳ Solução: Verificar issuer (URL do provedor)
         Verifique se está online e acessível
```

---

## 🧪 Teste 4: Fazer Login no Provedor

### Objetivo
Testar se o login no provedor OIDC funciona.

### Passos

1. **Você agora está no provedor OIDC**
   - Vê uma página de login
   - Pode ter campo de email/senha

2. **Fazer login**
   - Insira suas credenciais
   - Clique em "Entrar" ou equivalente

3. **Se pedir consentimento**
   - Leia o que está sendo solicitado
   - Clique em "Permitir", "Concordar", etc.

4. **Esperar redirecionamento**
   - Após login bem-sucedido, você é redirecionado
   - De volta para http://localhost:4200

### ✅ Sucesso
```
✓ Login foi feito com sucesso
✓ Redirecionado de volta à aplicação
✓ Perfil do usuário aparece
```

### ❌ Problemas Comuns

```
Erro 1: "CORS error"
↳ Solução: Configurar CORS no provedor OIDC
         Adicionar seu domínio na lista de allowed origins

Erro 2: "Invalid redirect URI"
↳ Solução: Verificar redirectUri novamente
         Certificar que está registrado no provedor

Erro 3: Fica na página de login do provedor
↳ Solução: Verificar se credentials (email/senha) estão corretos
         Tentar novamente ou fazer reset de senha
```

---

## 🧪 Teste 5: Verificar Perfil do Usuário

### Objetivo
Verificar se as informações do usuário são exibidas corretamente.

### Passos

1. **Após login bem-sucedido**
   - Você deve ver seu perfil exibido
   - Exemplo: "Bem-vindo, João Silva"

2. **Verificar informações**
   - Nome do usuário
   - Email
   - Foto (se fornecida)

3. **Inspecionar dados**
   - F12 → Console
   - Digite: `sessionStorage.getItem('id_token_claims_obj')`
   - Você verá um JSON com dados do usuário

### ✅ Sucesso
```
✓ Perfil do usuário exibido
✓ Dados estão corretos
✓ ID Token contém claims do usuário
```

### ❌ Problemas Comuns

```
Erro 1: Perfil não aparece
↳ Solução: Verificar console para erros
         Verificar se userProfile$ Observable está assinado

Erro 2: Dados do usuário vazios
↳ Solução: Verificar scope em environment.ts
         Deve incluir pelo menos: 'openid profile'
```

---

## 🧪 Teste 6: Fazer Logout

### Objetivo
Verificar se o logout funciona corretamente.

### Passos

1. **Com perfil exibido**
   - Clique no botão "Sair" ou "Logout"

2. **Verificar mudanças**
   - Botão de login deve aparecer novamente
   - Perfil deve desaparecer
   - Tokens devem ser limpos

3. **Inspecionar dados**
   - F12 → Application → Session Storage
   - Tokens devem ter sido removidos

### ✅ Sucesso
```
✓ Botão de logout foi acionado
✓ Componente voltou ao estado "não autenticado"
✓ Perfil não é mais visível
✓ Tokens foram limpos
```

### ❌ Problemas Comuns

```
Erro 1: Logout não funciona
↳ Solução: Verificar se authService.logout() está sendo chamado
         Verificar console para erros

Erro 2: Usuário ainda aparece como logado
↳ Solução: Verificar se isLoggedIn$ está sendo atualizado
         Pode precisar limpar cache do browser
```

---

## 🧪 Teste 7: Testar Rota Protegida

### Objetivo
Verificar se o authGuard protege as rotas corretamente.

### Passos

1. **Adicionar rota protegida em app.routes.ts**
   ```typescript
   {
     path: 'dashboard',
     component: DashboardComponent,
     canActivate: [authGuard]
   }
   ```

2. **Criar um componente DashboardComponent simples**
   ```typescript
   @Component({
     selector: 'app-dashboard',
     standalone: true,
     template: '<h1>Dashboard Protegido</h1>'
   })
   export class DashboardComponent {}
   ```

3. **Testar acesso SEM autenticação**
   - Abra: http://localhost:4200/dashboard
   - Você deve ser redirecionado para login

4. **Testar acesso COM autenticação**
   - Faça login primeiro
   - Clique em: http://localhost:4200/dashboard
   - Você deve ver o dashboard

### ✅ Sucesso
```
✓ Sem login → Redirecionado para login
✓ Com login → Acesso liberado
✓ AuthGuard funcionando corretamente
```

### ❌ Problemas Comuns

```
Erro 1: Não redireciona para login
↳ Solução: Verificar se authGuard está importado corretamente
         Verificar se está na rota

Erro 2: Acesso negado mesmo logado
↳ Solução: Verificar se isLoggedIn() retorna true
         Pode ser problema com token
```

---

## 🧪 Teste 8: Testar HTTP com Token

### Objetivo
Verificar se o token é incluído automaticamente nas requisições HTTP.

### Passos

1. **Depois de fazer login**
   - Abra DevTools (F12)
   - Vá para a aba **Network**

2. **Fazer uma requisição HTTP**
   - Clique em um botão que faz requisição à API
   - Ou chame manualmente no console

3. **Inspecionar header**
   - Procure a requisição na aba Network
   - Clique nela para ver detalhes
   - Procure por: `Authorization: Bearer ...`

4. **Verificar token**
   ```javascript
   // No console, você pode ver:
   fetch('/api/users')  // Faz requisição
   
   // Verifique se o header foi adicionado:
   Authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

### ✅ Sucesso
```
✓ Header Authorization encontrado
✓ Token está no formato: Bearer <token>
✓ Interceptor funcionando corretamente
```

### ❌ Problemas Comuns

```
Erro 1: Authorization header não aparece
↳ Solução: Verificar se authInterceptor está em app.config.ts
         Verificar se está em withInterceptors

Erro 2: Token está vazio
↳ Solução: Verificar se login foi bem-sucedido
         Verificar se access token foi recebido
```

---

## 🧪 Teste 9: Testar Refresh de Token

### Objetivo
Verificar se o refresh automático de token funciona.

### Passos

1. **Depois de fazer login**
   - Abra DevTools (F12)
   - Vá para a aba **Network**

2. **Esperar 10 segundos**
   - O refresh silencioso pode ocorrer
   - Procure por requisições de token

3. **Verificar requisições**
   - Procure por `/token` ou similar
   - Deve haver requisições para renovar token

4. **Alternativa: Forçar refresh manualmente**
   ```javascript
   // No console:
   // Assumindo que injetou AuthService
   // authService.refreshToken()
   ```

### ✅ Sucesso
```
✓ Token é renovado periodicamente
✓ Sessão permanece ativa
✓ Sem interrupção para usuário
```

### ❌ Problemas Comuns

```
Erro 1: Refresh não ocorre
↳ Solução: Verificar se useSilentRefresh: true em auth.config.ts

Erro 2: Erro ao renovar token
↳ Solução: Verificar se refresh token é válido
         Verificar se provedor suporta refresh
```

---

## 🧪 Teste 10: Testar Comportamento Offline

### Objetivo
Verificar o comportamento quando a rede cai.

### Passos

1. **Fazer login com sucesso**

2. **Desligar internet**
   - Desconecte do WiFi ou cabo
   - Ou use DevTools para simular (F12 → Network → Offline)

3. **Tentar acessar recurso protegido**
   - Clique em um link
   - Faça uma requisição HTTP

4. **Verificar comportamento**
   - Deve mostrar erro de rede
   - Não deve fazer logout automaticamente

5. **Ligar internet de novo**
   - Reconecte à rede
   - Tente novamente

### ✅ Sucesso
```
✓ Aplicação trata erro de rede
✓ Sessão não é perdida offline
✓ Volta a funcionar quando reconectar
```

---

## 📊 Checklist de Testes

```
□ Teste 1: Inicialização ................... [ ] Passou
□ Teste 2: Componente de Perfil ........... [ ] Passou
□ Teste 3: Fluxo de Login ................. [ ] Passou
□ Teste 4: Login no Provedor .............. [ ] Passou
□ Teste 5: Perfil do Usuário .............. [ ] Passou
□ Teste 6: Logout ......................... [ ] Passou
□ Teste 7: Rota Protegida ................. [ ] Passou
□ Teste 8: HTTP com Token ................. [ ] Passou
□ Teste 9: Refresh de Token ............... [ ] Passou
□ Teste 10: Comportamento Offline ........ [ ] Passou
```

---

## 🎯 Próximos Passos Após Testes

### Se Tudo Passar ✅

1. Ir para produção
2. Configurar `environment.prod.ts`
3. Build: `npm run build`
4. Deploy

### Se Algum Teste Falhar ❌

1. Anotue qual teste falhou
2. Verifique a solução sugerida
3. Verifique console (F12)
4. Leia: [OIDC_SETUP_GUIDE.md](OIDC_SETUP_GUIDE.md#troubleshooting)

---

## 🆘 Debug Avançado

### Ativar Logs Detalhados

**Em auth.config.ts:**
```typescript
export const authConfig: AuthConfig = {
  // ...
  showDebugInformation: true,  // ← Adicione isto
  strictDiscoveryDocumentValidation: false  // Menos rigoroso
};
```

### Ver Tokens Armazenados

**No Console:**
```javascript
// Ver ID Token
JSON.parse(sessionStorage.getItem('id_token_claims_obj'))

// Ver tokens
sessionStorage.getItem('access_token')
sessionStorage.getItem('id_token')
sessionStorage.getItem('refresh_token')

// Ver estado
sessionStorage.getItem('auth_state')
```

### Ver Requisições de OIDC

**DevTools → Network:**
- Procure por requisições para seu `issuer`
- Verifique responses do `/discover`, `/token`, `/authorize`

---

## 📸 Capturas de Tela Esperadas

### Teste 1: Console de Inicialização
```
[OIDC] Angular OAuth2 OIDC Debugger
[OIDC] Discovery document loaded
[OIDC] tryLogin called
Auth initialized successfully
```

### Teste 2: Componente de Perfil
```
┌─────────────────────────┐
│    Bastião             │
│         [Entrar]       │
└─────────────────────────┘
```

### Teste 5: Após Login
```
┌─────────────────────────┐
│    Bastião             │
│  Bem-vindo, João Silva │
│  Email: joao@example   │
│    [Sair]              │
└─────────────────────────┘
```

---

**Todos os testes passaram? 🎉 Parabéns! Sua implementação está funcional e pronta para produção!**
