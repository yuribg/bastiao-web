import { Component, OnInit, inject } from '@angular/core';
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
export class HomeComponent implements OnInit {
  public bastiaoService = inject(BastiaoService);
  public logoUrl = 'brand/logo-acropole.svg';
  public pesquisaHistorico = '';

  ngOnInit(): void {
    this.bastiaoService.loadIndex();
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
