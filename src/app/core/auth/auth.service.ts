import { Injectable, inject } from '@angular/core';
import { OAuthService, OAuthEvent } from 'angular-oauth2-oidc';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private oauthService = inject(OAuthService);
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  public isLoggedIn$: Observable<boolean> = this.isLoggedInSubject.asObservable();

  constructor() {
    this.initializeAuthState();
    this.setupAuthEventListeners();
  }

  /**
   * Inicializa o estado de autenticação
   */
  private initializeAuthState(): void {
    this.isLoggedInSubject.next(this.oauthService.hasValidAccessToken());
  }

  /**
   * Configura listeners para eventos de autenticação
   */
  private setupAuthEventListeners(): void {
    this.oauthService.events
      .pipe(
        filter(event => 
          event.type === 'token_received' ||
          event.type === 'discovery_document_loaded' ||
          event.type === 'user_profile_loaded'
        )
      )
      .subscribe(() => {
        this.isLoggedInSubject.next(this.oauthService.hasValidAccessToken());
      });

    this.oauthService.events
      .pipe(
        filter(event => event.type === 'logout' || event.type === 'session_terminated')
      )
      .subscribe(() => {
        this.isLoggedInSubject.next(false);
      });
  }

  /**
   * Inicia o fluxo de login com Authorization Code Flow + PKCE
   */
  public login(): void {
    this.oauthService.initCodeFlow();
  }

  /**
   * Realiza logout e limpa as credenciais
   */
  public logout(): void {
    this.oauthService.logOut();
  }

  /**
   * Verifica se o usuário está autenticado
   */
  public isLoggedIn(): boolean {
    return this.oauthService.hasValidAccessToken();
  }

  /**
   * Retorna o perfil do usuário como Observable
   */
  public getUserProfile$(): Observable<any> {
    return new Observable(observer => {
      try {
        const profile = this.oauthService.getIdentityClaims();
        if (profile) {
          observer.next(profile);
          observer.complete();
        } else {
          observer.error(new Error('User profile not available'));
        }
      } catch (error) {
        observer.error(error);
      }
    });
  }

  /**
   * Retorna o perfil do usuário de forma síncrona
   */
  public getUserProfile(): any {
    return this.oauthService.getIdentityClaims();
  }

  /**
   * Obtém o access token
   */
  public getAccessToken(): string | null {
    return this.oauthService.getAccessToken();
  }

  /**
   * Obtém o ID token
   */
  public getIdToken(): string | null {
    return this.oauthService.getIdToken();
  }

  /**
   * Retorna o estado de autenticação como Observable
   */
  public getIsLoggedIn$(): Observable<boolean> {
    return this.isLoggedIn$;
  }

  /**
   * Refresh do access token usando refresh token
   */
  public refreshToken(): Promise<any> {
    return this.oauthService.refreshToken();
  }
}