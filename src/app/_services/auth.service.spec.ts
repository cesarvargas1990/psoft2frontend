import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { LoginResponse } from '../_models/user';
import Swal from 'sweetalert2';

class MockRouter {
  navigate = jasmine.createSpy('navigate');
}

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let router: MockRouter;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService, { provide: Router, useClass: MockRouter }]
    });

    service = TestBed.get(AuthService);
    httpMock = TestBed.get(HttpTestingController);
    router = TestBed.get(Router);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('debería crearse correctamente', () => {
    expect(service).toBeTruthy();
  });

  it('debería verificar que el usuario está logueado si hay token', () => {
    localStorage.setItem('access_token', '123');
    expect(service.isLoggedIn()).toBe(true);
  });

  it('debería devolver false si no hay token', () => {
    expect(service.isLoggedIn()).toBe(false);
  });

  it('debería enviar petición de login y recibir token', () => {
    const mockData = { username: 'user', password: 'pass' };
    const mockResponse: LoginResponse = {
      access_token: 'abc123',
      name: 'User',
      id: '1',
      id_empresa: '1',
      ind_activo: 1,
      is_admin: 1,
      id_user: 1,
      permisos: [],
      menu_usuario: [],
      data: null,
      status: 'success',
      message: ''
    };

    service.loginForm(mockData).subscribe((res) => {
      expect(res.access_token).toBe('abc123');
    });

    const req = httpMock.expectOne(`${environment.API_URL}/auth/login`);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('debería guardar datos del usuario y redirigir al dashboard', () => {
    const response: LoginResponse = {
      name: 'Test',
      access_token: 'token123',
      menu_usuario: [],
      permisos: ['permiso.ver'],
      id: '1',
      id_empresa: '2',
      ind_activo: 1,
      is_admin: 0,
      id_user: 10,
      data: null,
      status: 'success',
      message: ''
    };

    service.setUser(response);
    expect(localStorage.getItem('access_token')).toBe('token123');
    expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('debería validar permisos con tienePermiso', () => {
    localStorage.setItem('permisos', JSON.stringify(['read', 'write']));
    expect(service.tienePermiso('read')).toBe(true);
    expect(service.tienePermiso('admin')).toBe(false);
  });

  it('debería hacer una petición con getData', () => {
    localStorage.setItem('access_token', 'token123');
    const data = { action: '/endpoint', value: 'x' };
    const response: LoginResponse = {
      access_token: 'abc123',
      name: 'User',
      id: '1',
      id_empresa: '1',
      ind_activo: 1,
      is_admin: 1,
      id_user: 1,
      permisos: [],
      menu_usuario: [],
      data: null,
      status: 'success',
      message: ''
    };

    service.getData(data).subscribe((res) => {
      expect(res).toEqual(response);
    });

    const req = httpMock.expectOne(`${environment.API_URL}${data.action}`);
    expect(req.request.method).toBe('POST');
    req.flush(response);
  });

  it('debería hacer una petición con getDataAny', () => {
    localStorage.setItem('access_token', 'token123');
    const data = { action: '/any-data', param: 1 };
    const response = { result: true };

    service.getDataAny(data).subscribe((res) => {
      expect(res.result).toBe(true);
    });

    const req = httpMock.expectOne(`${environment.API_URL}${data.action}`);
    expect(req.request.method).toBe('POST');
    req.flush(response);
  });

  it('debería retornar false en tienePermiso si no hay permisos en localStorage', () => {
    expect(service.tienePermiso('read')).toBe(false);
  });

  it('debería manejar errores del cliente en handleError', () => {
    const alertSpy = spyOn(window, 'alert');
    const error = new HttpErrorResponse({
      error: new ErrorEvent('NetworkError', { message: 'Sin red' })
    });

    service.handleError(error).subscribe(
      () => fail('Se esperaba error'),
      (err) => {
        expect(alertSpy).toHaveBeenCalled();
        expect(err).toContain('Error en la respuesta del servidor');
      }
    );
  });

  it('debería manejar error Unauthorized en handleError mostrando alerta visual', () => {
    const consoleErrorSpy = spyOn(console, 'error');
    const consoleLogSpy = spyOn(console, 'log');
    const swalSpy = spyOn(Swal, 'fire');
    const error = new HttpErrorResponse({
      status: 401,
      statusText: 'Unauthorized',
      error: { message: 'Unauthorized', error: 'Sin autorización' }
    });

    service.handleError(error).subscribe(
      () => fail('Se esperaba error'),
      () => {
        expect(consoleErrorSpy).toHaveBeenCalled();
        expect(consoleLogSpy).toHaveBeenCalled();
        expect(swalSpy).toHaveBeenCalled();
      }
    );
  });

  it('debería manejar error de backend sin mostrar swal cuando no es Unauthorized', () => {
    const swalSpy = spyOn(Swal, 'fire');
    const error = new HttpErrorResponse({
      status: 500,
      statusText: 'Server Error',
      error: { message: 'InternalError', error: 'Fallo interno' }
    });

    service.handleError(error).subscribe(
      () => fail('Se esperaba error'),
      () => {
        expect(swalSpy).not.toHaveBeenCalled();
      }
    );
  });

  it('debería ejecutar logout y navegar al login sin recargar cuando hasReloaded existe', () => {
    localStorage.setItem('access_token', 'token123');
    localStorage.setItem('hasReloaded', 'true');

    service.logout();

    const req = httpMock.expectOne(`${environment.API_URL}/auth/logout`);
    expect(req.request.method).toBe('POST');
    req.flush({ status: 'ok' });

    expect(router.navigate).toHaveBeenCalledWith(['/auth/login']);
    expect(localStorage.getItem('hasReloaded')).toBe('true');
  });

  it('debería marcar hasReloaded y recargar en el primer logout', () => {
    localStorage.setItem('access_token', 'token123');
    let reloadSpy: jasmine.Spy;
    try {
      reloadSpy = spyOn(window.location, 'reload').and.stub();
    } catch (e) {
      pending('No fue posible espiar window.location.reload en este entorno');
      return;
    }

    service.logout();

    const req = httpMock.expectOne(`${environment.API_URL}/auth/logout`);
    req.flush({ status: 'ok' });

    expect(localStorage.getItem('hasReloaded')).toBe('true');
    expect(reloadSpy).toHaveBeenCalled();
  });
});
