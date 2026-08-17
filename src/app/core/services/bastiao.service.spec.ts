import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { BastiaoService } from './bastiao.service';

describe('BastiaoService', () => {
  let service: BastiaoService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(BastiaoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load the bastioes index from the correct asset path', () => {
    service.loadIndex();

    const req = httpMock.expectOne('data/bastioes.index.json');
    expect(req.request.method).toBe('GET');

    req.flush({
      anoCorrente: 2026,
      artigosAnoCorrente: [],
      acervoHistorico: []
    });

    expect(service.indexData()!.anoCorrente).toBe(2026);
  });
});
