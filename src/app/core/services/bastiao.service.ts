import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BastiõesIndex, ConteudoArtigo } from '../models/bastiao.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BastiaoService {
  private http = inject(HttpClient);

  // Signals para gerenciamento de estado
  public indexData = signal<BastiõesIndex | null>(null);
  public loading = signal<boolean>(false);

  loadIndex(): void {
    this.loading.set(true);
    this.http.get<BastiõesIndex>('data/bastioes.index.json').subscribe({
      next: (data) => {
        this.indexData.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Erro ao carregar o índice de bastiões:', err);
        this.loading.set(false);
      }
    });
  }

  getArtigoConteudo(caminhoArquivo: string): Observable<ConteudoArtigo> {
    return this.http.get<ConteudoArtigo>(caminhoArquivo);
  }
}
