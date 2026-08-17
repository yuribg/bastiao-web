import { Component, OnInit, inject, signal } from '@angular/core';
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
export class BastiaoReaderComponent implements OnInit {
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
}
