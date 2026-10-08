import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { BastiaoReaderComponent } from './bastiao-reader.component';
import { BastiaoService } from '../../core/services/bastiao.service';

describe('BastiaoReaderComponent', () => {
  let component: BastiaoReaderComponent;
  let fixture: ComponentFixture<BastiaoReaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BastiaoReaderComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: { get: () => null } } }
        },
        {
          provide: BastiaoService,
          useValue: { indexData: signal(null), loadIndex: () => undefined }
        }
      ]
    })
    .compileComponents();
  });

  it('should create', fakeAsync(() => {
    fixture = TestBed.createComponent(BastiaoReaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    tick(200);

    expect(component).toBeTruthy();
  }));

  it('renders italic markup in article paragraphs', fakeAsync(() => {
    fixture = TestBed.createComponent(BastiaoReaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    tick(200);

    component.artigo.set({
      titulo: 'Fanatismo',
      numero: '553',
      autoria: 'JCAP',
      data: 'Outubro de 2026',
      paragrafos: ['Texto com <i>itálico</i>.']
    });
    component.loading.set(false);
    fixture.detectChanges();

    const paragraph = fixture.nativeElement.querySelector('.article-body p');
    expect(paragraph.querySelector('i')?.textContent).toBe('itálico');
    expect(paragraph.textContent).toContain('Texto com itálico.');
  }));
});
