import { TestBed, getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PrestamosService } from './prestamos.service';
import { AuthService } from '../../_services/auth.service';
import { environment } from './../../../environments/environment';

describe('PrestamosService', () => {
  let injector: TestBed;
  let service: PrestamosService;
  let httpMock: HttpTestingController;

  const mockEmpresaId = '456';
  const mockUsuarioId = '999';

  const mockAuthService = {
    isAuthenticated: () => true
  };

  beforeEach(() => {
    spyOn(localStorage, 'getItem').and.callFake((key: string): string | null => {
      const storage = {
        'access_token': 'fake-token',
        'id_empresa': mockEmpresaId,
        'id': mockUsuarioId,
        'id_usuario': mockUsuarioId
      };
      return storage[key] || null;
    });

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        PrestamosService,
        { provide: AuthService, useValue: mockAuthService }
      ]
    });

    injector = getTestBed();
    service = injector.get(PrestamosService);
    httpMock = injector.get(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debería crearse correctamente', () => {
    expect(service).toBeTruthy();
  });

  it('debería calcular cuotas con empresa agregada al payload', () => {
    const mockData = { monto: 1000000 };

    service.calcularCuotas(mockData).subscribe((resp) => {
      expect(resp).toEqual({ ok: true });
    });

    const req = httpMock.expectOne(`${environment.API_URL}/calcularCuotas`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body.id_empresa).toBe(mockEmpresaId);
    req.flush({ ok: true });
  });

  it('debería obtener formas de pago', () => {
    service.getFormasPago().subscribe((resp) => {
      expect(resp).toEqual(['contado', 'cuotas']);
    });

    const req = httpMock.expectOne(`${environment.API_URL}/listaformaspago/${mockEmpresaId}`);
    expect(req.request.method).toBe('GET');
    req.flush(['contado', 'cuotas']);
  });

  it('debería obtener periodos de pago', () => {
    service.getPeriodosPago().subscribe((resp) => {
      expect(resp.length).toBeGreaterThan(0);
    });

    const req = httpMock.expectOne(`${environment.API_URL}/listaperiodopago`);
    expect(req.request.method).toBe('GET');
    req.flush([{ id: 1, descripcion: 'Mensual' }]);
  });

  it('debería guardar forma de pago con id_empresa y id_usureg', () => {
    const payload = { nombre: 'Mensual' };

    service.guardarFormaPago(payload).subscribe((resp) => {
      expect(resp.ok).toBeTruthy();
    });

    const req = httpMock.expectOne(`${environment.API_URL}/psformapago`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body.id_empresa).toBe(mockEmpresaId);
    expect(req.request.body.id_usureg).toBe(mockUsuarioId);
    req.flush({ ok: true });
  });

  it('debería eliminar un préstamo por ID', () => {
    const data = { id_prestamo: 77 };

    service.deletePrestamo(data).subscribe((resp) => {
      expect(resp.ok).toBeTruthy();
    });

    const req = httpMock.expectOne(`${environment.API_URL}/eliminarPrestamo/77`);
    expect(req.request.method).toBe('DELETE');
    req.flush({ ok: true });
  });

  it('debería guardar un préstamo con fecha generada', () => {
    const prestamo = { monto: 500000 };

    service.guardarPrestamo(prestamo).subscribe((resp) => {
      expect(resp.ok).toBeTruthy();
    });

    const req = httpMock.expectOne(`${environment.API_URL}/guardarPrestamo`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body.id_empresa).toBe(mockEmpresaId);
    expect(req.request.body.id_usureg).toBe(mockUsuarioId);
    expect(req.request.body.fecha).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/);
    req.flush({ ok: true });
  });

  it('debería consultar tipos de sistema de préstamo', () => {
    service.getSistemaPrestamo().subscribe((resp) => {
      expect(resp).toBeDefined();
    });

    const req = httpMock.expectOne(`${environment.API_URL}/listatiposistemaprest`);
    expect(req.request.method).toBe('GET');
    req.flush([{ tipo: 'Alemán' }]);
  });

  it('debería obtener totales para el dashboard', () => {
    service.totales_dashboard().subscribe((resp) => {
      expect(resp.total).toBeGreaterThanOrEqual(0);
    });

    const req = httpMock.expectOne(`${environment.API_URL}/totales_dashboard`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body.id_empresa).toBe(mockEmpresaId);
    req.flush({ total: 12 });
  });
});
