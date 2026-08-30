import { Component, OnInit, OnDestroy, HostListener, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { BastiaoService } from '../../core/services/bastiao.service';
import { ConteudoArtigo } from '../../core/models/bastiao.model';

@Component({
  selector: 'app-bastiao-reader',
  standalone: true,
  imports: [CommonModule, RouterModule, MatButtonModule, MatIconModule, MatCardModule],
  templateUrl: './bastiao-reader.component.html',
  styleUrl: './bastiao-reader.component.scss'
})
export class BastiaoReaderComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private bastiaoService = inject(BastiaoService);

  public artigo = signal<ConteudoArtigo | null>(null);
  public loading = signal<boolean>(true);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    
    // Busca o caminho do arquivo no índice baseado no ID
    this.bastiaoService.loadIndex();
    
    // Pequeno timeout/effect para esperar o índice carregar ou buscar direto
    setTimeout(() => {
      const data = this.bastiaoService.indexData();
      const match = data?.artigosAnoCorrente.find(a => a.id === id);

      if (match) {
        this.bastiaoService.getArtigoConteudo(match.arquivo).subscribe({
          next: (res) => {
            this.artigo.set(res);
            this.loading.set(false);
            this.setupPrintScreenProtection();
          },
          error: () => this.loading.set(false)
        });
      } else {
        this.loading.set(false);
      }
    }, 200);
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

  windowPrint(): void {
    alert('A impressão e captura de tela são desabilitadas neste site.');
  }

  ngOnDestroy(): void {
    // Cleanup se necessário
  }

  // Aviso ao tentar imprimir
  @HostListener('window:beforeprint')
  onBeforePrint(): void {
    alert('A impressão e captura de tela são desabilitadas neste site.');
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
}
