import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="user-profile" *ngIf="isLoggedIn$ | async as isLoggedIn">
      <ng-container *ngIf="isLoggedIn">
        <div class="profile-info">
          <h3>{{ userProfile?.name || 'Usuário' }}</h3>
          <p>Email: {{ userProfile?.email }}</p>
          <button (click)="logout()" class="logout-btn">Sair</button>
        </div>
      </ng-container>
      <ng-container *ngIf="!isLoggedIn">
        <button (click)="login()" class="login-btn">Entrar</button>
      </ng-container>
    </div>
  `,
  styles: [`
    .user-profile {
      padding: 20px;
      border: 1px solid #ddd;
      border-radius: 4px;
      max-width: 300px;
    }
    
    .profile-info {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    
    .profile-info h3 {
      margin: 0;
    }
    
    .profile-info p {
      margin: 0;
      font-size: 0.9em;
      color: #666;
    }
    
    button {
      padding: 8px 16px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 1em;
    }
    
    .login-btn {
      background-color: #007bff;
      color: white;
    }
    
    .login-btn:hover {
      background-color: #0056b3;
    }
    
    .logout-btn {
      background-color: #dc3545;
      color: white;
    }
    
    .logout-btn:hover {
      background-color: #c82333;
    }
  `]
})
export class UserProfileComponent implements OnInit {
  private authService = inject(AuthService);
  isLoggedIn$ = this.authService.getIsLoggedIn$();
  userProfile: any;

  ngOnInit(): void {
    // Carrega o perfil do usuário quando estiver autenticado
    this.isLoggedIn$.subscribe(isLoggedIn => {
      if (isLoggedIn) {
        this.userProfile = this.authService.getUserProfile();
      } else {
        this.userProfile = null;
      }
    });
  }

  login(): void {
    this.authService.login();
  }

  logout(): void {
    this.authService.logout();
  }
}
