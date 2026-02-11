import { TestBed } from '@angular/core/testing';
import { ClienteService } from './cliente.service';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { AuthService } from '../../_services/auth.service';
import { environment } from './../../../environments/environment';

describe('ClienteService', () => {
  let service: ClienteService;
  let httpMock: HttpTestingController;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  const mockEmpresa = 'empresa1';
  const mockId = '123';

  beforeEach(() => {
    const authSpy = jasmine.createSpyObj('AuthService', ['isLoggedIn']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ClienteService, { provide: AuthService, useValue: authSpy }]
    });

    service = TestBed.get(ClienteService);
    httpMock = TestBed.get(HttpTestingController);
    authServiceSpy = TestBed.get(AuthService) as jasmine.SpyObj<AuthService>;

    spyOn(localStorage, 'getItem').and.callFake((key: string) => {
      if (key === 'id_empresa') {
        return mockEmpresa;
      }
      if (key === 'id') {
        return mockId;
      }
      if (key === 'access_token') {
        return 'token';
      }
      return null;
    });
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debería crearse correctamente', () => {
    expect(service).toBeTruthy();
  });

  it('debería obtener todos los clientes', () => {
    const data = { filtro: 'activo' };

    service.getAllClientes(data).subscribe((resp) => {
      expect(resp).toBeTruthy();
    });

    const req = httpMock.expectOne(
      `${environment.API_URL}/psclientes/${mockEmpresa}`
    );
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('debería obtener clientes', () => {
    service.getClientes().subscribe((resp) => {
      expect(resp).toBeTruthy();
    });

    const req = httpMock.expectOne(
      `${environment.API_URL}/listadoclientes/${mockEmpresa}`
    );
    expect(req.request.method).toBe('GET');
    req.flush({ ok: true });
  });

  it('debería guardar cliente', () => {
    const data = { nombre: 'Juan' };

    service.saveCliente(data).subscribe((resp) => {
      expect(resp).toBeTruthy();
    });

    const req = httpMock.expectOne(`${environment.API_URL}/psclientes`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body.id_empresa).toEqual(mockEmpresa);
    expect(req.request.body.id_user).toEqual(mockId);
    req.flush({ ok: true });
  });

  it('debería actualizar cliente', () => {
    const data = { id: 5, nombre: 'Pedro' };

    service.updateCliente(data).subscribe((resp) => {
      expect(resp).toBeTruthy();
    });

    const req = httpMock.expectOne(`${environment.API_URL}/psclientes/5`);
    expect(req.request.method).toBe('PUT');
    req.flush({ ok: true });
  });

  it('debería eliminar cliente', () => {
    const data = { id: 7 };

    service.deleteCliente(data).subscribe((resp) => {
      expect(resp).toBeTruthy();
    });

    const req = httpMock.expectOne(`${environment.API_URL}/psclientes/7`);
    expect(req.request.method).toBe('DELETE');
    req.flush({ ok: true });
  });

  it('debería subir archivo', () => {
    const data = { archivo: 'base64data' };

    service.uploadFile(data).subscribe((resp) => {
      expect(resp).toBeTruthy();
    });

    const req = httpMock.expectOne(
      `${environment.API_URL}/guardarArchivoAdjunto`
    );
    expect(req.request.method).toBe('POST');
    expect(req.request.body.id_empresa).toEqual(mockEmpresa);
    expect(req.request.body.id_usuario).toEqual(mockId);
    req.flush({ ok: true });
  });

  it('debería editar archivo', () => {
    const data = { archivo: 'nuevo' };

    service.editFile(data).subscribe((resp) => {
      expect(resp).toBeTruthy();
    });

    const req = httpMock.expectOne(
      `${environment.API_URL}/editarArchivoAdjunto`
    );
    expect(req.request.method).toBe('PUT');
    expect(req.request.body.id_empresa).toEqual(mockEmpresa);
    expect(req.request.body.id_usuario).toEqual(mockId);
    req.flush({ ok: true });
  });

  it('debería obtener préstamos del cliente', () => {
    const data = { cliente_id: 55 };

    service.getPrestamosCliente(data).subscribe((resp) => {
      expect(resp).toBeTruthy();
    });

    const req = httpMock.expectOne(`${environment.API_URL}/prestamosCliente`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body.id_empresa).toEqual(mockEmpresa);
    expect(req.request.body.id_user).toEqual(mockId);
    req.flush({ ok: true });
  });

  it('debería convertir dataURL a archivo con dataURLtoFile()', () => {
    const file = service.dataURLtoFile(
      'data:image/png;base64,aGVsbG8=',
      'test.png'
    );
    expect(file instanceof File).toBeTruthy();
    expect(file.name).toBe('test.png');
    expect(file.type).toBe('image/png');
  });
});
