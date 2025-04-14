import { TestBed, getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TipodocidentiService } from './tipodocidenti.service';
import { AuthService } from '../../_services/auth.service';
import { environment } from './../../../environments/environment';

describe('TipodocidentiService', () => {
  let injector: TestBed;
  let service: TipodocidentiService;
  let httpMock: HttpTestingController;

  const mockAuthService = {
    isAuthenticated: () => true
  };

  const dummyResponse = [
    { id: 1, descripcion: 'Cédula de ciudadanía' },
    { id: 2, descripcion: 'NIT' }
  ];

  beforeEach(() => {
    spyOn(localStorage, 'getItem').and.callFake((key: string): string | null => {
      if (key === 'access_token') return 'fake-token';
      return null;
    });

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        TipodocidentiService,
        { provide: AuthService, useValue: mockAuthService }
      ]
    });

    injector = getTestBed();
    service = injector.get(TipodocidentiService);
    httpMock = injector.get(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debería crearse correctamente', () => {
    expect(service).toBeTruthy();
  });

  it('debería obtener todos los tipos de documento con getAllTipodocidenti()', () => {
    service.getAllTipodocidenti().subscribe((resp) => {
      expect(resp).toEqual(dummyResponse);
    });

    const req = httpMock.expectOne(`${environment.API_URL}/pstipodocidenti`);
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toBe('Bearer fake-token');
    req.flush(dummyResponse);
  });

  it('debería obtener los tipos de documento con getTipodocidenti()', () => {
    service.getTipodocidenti().subscribe((resp) => {
      expect(resp).toEqual(dummyResponse);
    });

    const req = httpMock.expectOne(`${environment.API_URL}/pstipodocidenti`);
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toBe('Bearer fake-token');
    req.flush(dummyResponse);
  });
});
