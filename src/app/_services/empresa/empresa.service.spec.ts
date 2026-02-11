import { TestBed, getTestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { EmpresaService } from './empresa.service';
import { AuthService } from '../../_services/auth.service';
import { environment } from './../../../environments/environment';
import Swal from 'sweetalert2';
import { HttpErrorResponse } from '@angular/common/http';
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
    spyOn(localStorage, 'getItem').and.callFake(
      (key: string): string | null => {
        const mockStorage = {
          access_token: 'fake-token',
          id_empresa: mockEmpresaId
        };
        return mockStorage[key] || null;
      }
    );

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

    const req = httpMock.expectOne(
      `${environment.API_URL}/psempresa/${mockEmpresaId}`
    );
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toBe('Bearer fake-token');

    req.flush(dummyEmpresa);
  });

  it('debería actualizar los datos de la empresa', () => {
    const updatedData = { nombre: 'Empresa Actualizada', nit: '987654321-0' };

    service.actualizarDatosEmpresa(updatedData).subscribe((resp) => {
      expect(resp).toEqual({ ok: true });
    });

    const req = httpMock.expectOne(
      `${environment.API_URL}/psempresa/${mockEmpresaId}`
    );
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updatedData);
    expect(req.request.headers.get('Authorization')).toBe('Bearer fake-token');

    req.flush({ ok: true });
  });

  it('debería manejar errores del cliente (ErrorEvent)', () => {
    const spy = spyOn(window, 'alert');

    const mockError = new ErrorEvent('Network error', {
      message: 'Error de red'
    });

    (service as any)
      .handleError({
        error: mockError,
        status: 0,
        message: 'error',
        name: '',
        headers: null,
        ok: false,
        statusText: '',
        type: null,
        url: ''
      })
      .subscribe({
        error: (err) => {
          expect(err).toContain('Error en la respuesta del servidor');
          expect(spy).toHaveBeenCalledWith('An error occurred:Error de red');
        }
      });
  });

  it('debería manejar errores del servidor (status 401)', () => {
    const swalSpy = spyOn(Swal, 'fire');
    const mockErrorResponse = new HttpErrorResponse({
      error: { message: 'Unauthorized', error: 'Sin autorización' },
      status: 401,
      statusText: 'Unauthorized',
      url: 'http://localhost/api'
    });

    (service as any).handleError(mockErrorResponse).subscribe({
      error: (err) => {
        expect(err).toContain('Error en la respuesta del servidor');
        expect(swalSpy).toHaveBeenCalled();
      }
    });
  });
});
