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
          },
          error: () => this.loading.set(false)
        });
      } else {
        this.loading.set(false);
      }
    }, 200);
  }

  windowPrint(): void {
    window.print();
  }

  ngOnDestroy(): void {
    // Cleanup se necessário
  }

  // Bloqueia evento de cópia (Ctrl+C, Cmd+C)
  @HostListener('copy', ['$event'])
  onCopy(event: ClipboardEvent): void {
    event.preventDefault();
  }

  // Bloqueia atalhos de teclado (Ctrl+C, Ctrl+X, Cmd+C, Cmd+X)
  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if ((event.ctrlKey || event.metaKey) && (event.key === 'c' || event.key === 'x')) {
      event.preventDefault();
    }
  }
}
