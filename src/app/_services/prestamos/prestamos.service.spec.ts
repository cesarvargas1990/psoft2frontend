import { TestBed, getTestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { PrestamosService } from './prestamos.service';
import { AuthService } from '../../_services/auth.service';
import { environment } from './../../../environments/environment';
import Swal from 'sweetalert2';

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
    spyOn(localStorage, 'getItem').and.callFake(
      (key: string): string | null => {
        const storage = {
          access_token: 'fake-token',
          id_empresa: mockEmpresaId,
          id: mockUsuarioId,
          id_usuario: mockUsuarioId
        };
        return storage[key] || null;
      }
    );

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
    const req = httpMock.expectOne(
      `${environment.API_URL}/listaformaspago/${mockEmpresaId}`
    );
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

  it('debería guardar forma de pago usando saveFormaPago', () => {
    const data = { nombre: 'PAGO' };
    service.saveFormaPago(data).subscribe((resp) => {
      expect(resp).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(`${environment.API_URL}/psformapago`);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('debería eliminar forma de pago por ID', () => {
    const data = { id: 10 };
    service.deleteFormaPago(data).subscribe((resp) => {
      expect(resp.ok).toBeTruthy();
    });
    const req = httpMock.expectOne(`${environment.API_URL}/psformapago/10`);
    expect(req.request.method).toBe('DELETE');
    req.flush({ ok: true });
  });

  it('debería eliminar un préstamo por ID', () => {
    const data = { id_prestamo: 77 };
    service.deletePrestamo(data).subscribe((resp) => {
      expect(resp.ok).toBeTruthy();
    });
    const req = httpMock.expectOne(
      `${environment.API_URL}/eliminarPrestamo/77`
    );
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
    expect(req.request.body.fecha).toMatch(/\d{4}-\d{2}-\d{2}/);
    req.flush({ ok: true });
  });

  it('debería consultar tipos de sistema de préstamo', () => {
    service.getSistemaPrestamo().subscribe((resp) => {
      expect(resp).toBeDefined();
    });
    const req = httpMock.expectOne(
      `${environment.API_URL}/listatiposistemaprest`
    );
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

  it('debería eliminar documento plantilla por ID', () => {
    const row = { id: 111 };
    service.deleteDocumentoPlantilla(row).subscribe((resp) => {
      expect(resp.ok).toBe(true);
    });
    const req = httpMock.expectOne(`${environment.API_URL}/pstdocplant/111`);
    expect(req.request.method).toBe('DELETE');
    req.flush({ ok: true });
  });

  it('debería consultar plantillas de documentos', () => {
    service.consultaPlantillasDocumentos().subscribe((resp) => {
      expect(Array.isArray(resp)).toBe(true);
    });
    const req = httpMock.expectOne(
      `${environment.API_URL}/consultaTipoDocPlantilla`
    );
    expect(req.request.method).toBe('POST');
    req.flush([]);
  });

  it('debería renderizar plantilla con metadata', () => {
    const mockPlantilla = { html: '<b>Hola</b>' };
    service.renderTemplates(mockPlantilla).subscribe((resp) => {
      expect(resp.rendered).toBeDefined();
    });
    const req = httpMock.expectOne(`${environment.API_URL}/renderTemplates`);
    expect(req.request.method).toBe('POST');
    req.flush({ rendered: '<b>Hola</b>' });
  });

  it('debería consultar variables de plantilla', () => {
    service.listaVariablesPlantillas().subscribe((resp) => {
      expect(resp).toEqual({ vars: [] });
    });
    const req = httpMock.expectOne(
      `${environment.API_URL}/generarVariablesPlantillas/${mockEmpresaId}`
    );
    expect(req.request.method).toBe('GET');
    req.flush({ vars: [] });
  });

  it('debería consultar fechas de pago de préstamo', () => {
    service.listaFechasPago('abc123').subscribe((resp) => {
      expect(resp).toBeDefined();
    });
    const req = httpMock.expectOne(
      `${environment.API_URL}/psfechaspago/abc123`
    );
    expect(req.request.method).toBe('GET');
    req.flush({ fechas: [] });
  });

  it('debería registrar pago de cuota con fecha y user', () => {
    const data = { monto: 10000 };
    service.registrarPagoCuota(data).subscribe((resp) => {
      expect(resp).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(`${environment.API_URL}/pspagos`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body.id_user).toBe(mockUsuarioId);
    expect(req.request.body.fecha).toMatch(/\d{4}-\d{2}-\d{2}/);
    req.flush({ ok: true });
  });

  it('debería listar documentos adjuntos de cliente', () => {
    service.listadoArchivosCliente('cliente123').subscribe((resp) => {
      expect(resp).toBeDefined();
    });
    const req = httpMock.expectOne(
      `${environment.API_URL}/psdocadjuntos/cliente123`
    );
    expect(req.request.method).toBe('GET');
    req.flush({ archivos: [] });
  });

  it('debería actualizar forma de pago', () => {
    const data = { id: 9, nombre: 'Quincenal' };
    service.updateFormaPago(data).subscribe((resp) => {
      expect(resp).toBeDefined();
    });
    const req = httpMock.expectOne(`${environment.API_URL}/psformapago/9`);
    expect(req.request.method).toBe('PUT');
    req.flush({ ok: true });
  });

  it('debería actualizar plantilla de documento', () => {
    const data = { id: 5, nombre: 'Nuevo' };
    service.updatePlantillaDocumento(data).subscribe((resp) => {
      expect(resp).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(`${environment.API_URL}/pstdocplant/5`);
    expect(req.request.method).toBe('PUT');
    req.flush({ ok: true });
  });

  it('debería ejecutar método prueba()', () => {
    service.prueba().subscribe((resp) => {
      expect(resp).toEqual({ data: true });
    });
    const req = httpMock.expectOne(
      `${environment.API_URL}/generarVariablesPlantillas`
    );
    expect(req.request.method).toBe('GET');
    req.flush({ data: true });
  });

  it('debería ejecutar handleError correctamente con mensaje Unauthorized', () => {
    const fakeError = {
      error: { message: 'Unauthorized' },
      status: 401
    } as any;
    spyOn(Swal, 'fire');
    const result = (service as any).handleError(fakeError);
    expect(result).toBeTruthy();
    expect(Swal.fire).toHaveBeenCalled();
  });

  it('debería retornar la fecha actual correctamente', () => {
    const result = service.fechaActual();
    expect(result).toMatch(/\d{4}-\d{2}-\d{2}/);
  });

  it('debería retornar la fecha y hora del cliente correctamente', () => {
    const result = service.obtenerFechaHoraCliente();
    expect(result).toMatch(
      /\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2} [+-]\d{2}:\d{2}/
    );
  });
});
