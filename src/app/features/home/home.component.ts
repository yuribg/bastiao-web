import { Component, OnInit, OnDestroy, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { BastiaoService } from '../../core/services/bastiao.service';
import { BastiõesIndex, CompendioHistorico } from '../../core/models/bastiao.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatTabsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit, OnDestroy {
  public bastiaoService = inject(BastiaoService);
  public logoUrl = 'brand/logo-acropole.svg';
  public pesquisaHistorico = '';

  ngOnInit(): void {
    this.bastiaoService.loadIndex();
    this.setupPrintScreenProtection();
  }

  ngOnDestroy(): void {
    // Cleanup se necessário
  }

  private setupPrintScreenProtection(): void {
    // Listener global para PrintScreen - captura na fase de captura
    document.addEventListener('keydown', (event: KeyboardEvent) => {
      if (event.key === 'PrintScreen' || event.code === 'PrintScreen') {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
      }
    }, true);

    document.addEventListener('keyup', (event: KeyboardEvent) => {
      if (event.key === 'PrintScreen' || event.code === 'PrintScreen') {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
      }
    }, true);
  }

  // Bloqueia evento de cópia (Ctrl+C, Cmd+C)
  @HostListener('copy', ['$event'])
  onCopy(event: ClipboardEvent): void {
    event.preventDefault();
  }

  // Bloqueia atalhos de teclado (Ctrl+C, Ctrl+X, Cmd+C, Cmd+X, Print Screen, etc)
  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    // Bloqueia cópia/corte
    if ((event.ctrlKey || event.metaKey) && (event.key === 'c' || event.key === 'x')) {
      event.preventDefault();
      return;
    }

    // Bloqueia Print Screen
    if (event.key === 'PrintScreen') {
      event.preventDefault();
      return;
    }

    // Bloqueia Ctrl + Print Screen e Alt + Print Screen
    if ((event.ctrlKey || event.altKey) && event.key === 'PrintScreen') {
      event.preventDefault();
      return;
    }

    // Bloqueia Windows + Shift + S (Snip do Windows)
    if ((event.metaKey || event.ctrlKey) && event.shiftKey && event.key === 's') {
      event.preventDefault();
      return;
    }

    // Bloqueia Shift + Cmd + 3, 4, 5 (Mac screenshots)
    if (event.metaKey && event.shiftKey && (event.key === '3' || event.key === '4' || event.key === '5')) {
      event.preventDefault();
      return;
    }
  }

  public getAcervoFiltrado(data: BastiõesIndex | null): CompendioHistorico[] {
    if (!data) {
      return [];
    }

    const termo = this.pesquisaHistorico.trim().toLowerCase();
    if (!termo) {
      return data.acervoHistorico;
    }

    return data.acervoHistorico.filter((item) => {
      const textoPesquisa = [
        item.ano.toString(),
        item.lema,
      ]
        .join(' ')
        .toLowerCase();

      return textoPesquisa.includes(termo);
    });
  }
}
