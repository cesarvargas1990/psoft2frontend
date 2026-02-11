import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { LoginResponse } from '../_models/user';

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
});
