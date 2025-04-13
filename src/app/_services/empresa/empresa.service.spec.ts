import { TestBed, getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { EmpresaService } from './empresa.service';
import { AuthService } from '../../_services/auth.service';
import { environment } from './../../../environments/environment';

describe('EmpresaService', () => {
  let injector: TestBed;
  let service: EmpresaService;
  let httpMock: HttpTestingController;

  const mockEmpresaId = '456';
  const dummyEmpresa = { nombre: 'Mi Empresa S.A.S.', nit: '123456789-0' };

  const mockAuthService = {
    isAuthenticated: () => true
  };

  beforeEach(() => {
    spyOn(localStorage, 'getItem').and.callFake((key: string): string | null => {
      if (key === 'access_token') return 'fake-token';
      if (key === 'id_empresa') return mockEmpresaId;
      return null;
    });

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        EmpresaService,
        { provide: AuthService, useValue: mockAuthService }
      ]
    });

    injector = getTestBed();
    service = injector.get(EmpresaService);
    httpMock = injector.get(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debería crearse el servicio', () => {
    expect(service).toBeTruthy();
  });

  it('debería obtener los datos de la empresa', () => {
    service.getEmpresa().subscribe((resp) => {
      expect(resp).toEqual(dummyEmpresa);
    });

    const req = httpMock.expectOne(`${environment.API_URL}/psempresa/${mockEmpresaId}`);
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toBe('Bearer fake-token');

    req.flush(dummyEmpresa);
  });

  it('debería actualizar los datos de la empresa', () => {
    const updatedData = { nombre: 'Empresa Actualizada', nit: '987654321-0' };

    service.actualizarDatosEmpresa(updatedData).subscribe((resp) => {
      expect(resp).toEqual({ ok: true });
    });

    const req = httpMock.expectOne(`${environment.API_URL}/psempresa/${mockEmpresaId}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updatedData);
    expect(req.request.headers.get('Authorization')).toBe('Bearer fake-token');

    req.flush({ ok: true });
  });
});
