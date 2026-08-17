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
});
