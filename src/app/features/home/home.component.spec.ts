import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { of } from 'rxjs';

import { HomeComponent } from './home.component';
import { BastiaoService } from '../../core/services/bastiao.service';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [
        provideHttpClient(),
        {
          provide: BastiaoService,
          useValue: {
            loadIndex: jasmine.createSpy('loadIndex').and.stub(),
            loading: () => false,
            indexData: () => ({
              anoCorrente: 2026,
              artigosAnoCorrente: [],
              acervoHistorico: []
            })
          }
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should use the correct logo asset path', () => {
    expect(component.logoUrl).toBe('brand/logo-acropole.svg');
  });

  it('should expose the correct logo asset path for the template to load', () => {
    expect(component.logoUrl).toContain('logo-acropole.svg');
    expect(component.logoUrl.startsWith('brand/')).toBeTrue();
  });

  it('should filter books by their initial, ignoring accents', () => {
    const livros = [
      { titulo: 'Ética', autoria: '', descricao: '', pdfUrl: '' },
      { titulo: 'Apologia', autoria: '', descricao: '', pdfUrl: '' },
      { titulo: 'Banquete', autoria: '', descricao: '', pdfUrl: '' }
    ];
    component.filtroLivroInicial = 'E';

    expect(component.getLivrosFiltrados(livros).map((livro) => livro.titulo)).toEqual(['Ética']);
  });

  it('should filter books by an uppercase letter initial', () => {
    const livros = [
      { titulo: 'Apologia', autoria: '', descricao: '', pdfUrl: '' },
      { titulo: 'Banquete', autoria: '', descricao: '', pdfUrl: '' }
    ];
    component.filtroLivroInicial = 'A';

    expect(component.getLivrosFiltrados(livros).map((livro) => livro.titulo)).toEqual(['Apologia']);
  });

  it('should filter books whose titles start with a number', () => {
    const livros = [
      { titulo: '1984', autoria: '', descricao: '', pdfUrl: '' },
      { titulo: 'Apologia', autoria: '', descricao: '', pdfUrl: '' }
    ];
    component.filtroLivroInicial = '0-9';

    expect(component.getLivrosFiltrados(livros).map((livro) => livro.titulo)).toEqual(['1984']);
  });

  it('should return all books when the initial filter is cleared', () => {
    const livros = [
      { titulo: 'Apologia', autoria: '', descricao: '', pdfUrl: '' },
      { titulo: 'Banquete', autoria: '', descricao: '', pdfUrl: '' }
    ];
    component.filtroLivroInicial = null;

    expect(component.getLivrosFiltrados(livros)).toEqual(livros);
  });

  it('should search books by title, author, or description without accents', () => {
    const livros = [
      { titulo: 'Apologia', autoria: 'Platão', descricao: 'Filosofia grega', pdfUrl: '' },
      { titulo: 'Banquete', autoria: 'Outro autor', descricao: 'Diálogo', pdfUrl: '' }
    ];
    component.pesquisaLivros = 'platao';

    expect(component.getLivrosFiltrados(livros).map((livro) => livro.titulo)).toEqual(['Apologia']);
  });

  it('should return at most 50 books per page', () => {
    const livros = Array.from({ length: 105 }, (_, index) => ({
      titulo: `Livro ${index + 1}`,
      autoria: '',
      descricao: '',
      pdfUrl: ''
    }));

    expect(component.getLivrosPaginados(livros)).toHaveSize(50);
    component.paginaLivros = 2;
    expect(component.getLivrosPaginados(livros)).toHaveSize(5);
  });

  it('should reset the pagination when changing the initial filter', () => {
    component.paginaLivros = 2;

    component.selecionarInicialLivro('B');

    expect(component.paginaLivros).toBe(0);
    expect(component.filtroLivroInicial).toBe('B');
  });

  it('should clear the initial filter when the selected letter is clicked again', () => {
    component.filtroLivroInicial = 'A';
    component.paginaLivros = 1;

    component.selecionarInicialLivro('A');

    expect(component.filtroLivroInicial).toBeNull();
    expect(component.paginaLivros).toBe(0);
  });
});
