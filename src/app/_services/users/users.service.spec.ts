import { TestBed, getTestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { UsersService } from './users.service';
import { AuthService } from '../../_services/auth.service';
import { environment } from './../../../environments/environment';

describe('UsersService', () => {
  let injector: TestBed;
  let service: UsersService;
  let httpMock: HttpTestingController;

  // Mock AuthService si en algún momento se usa internamente
  const mockAuthService = {
    isAuthenticated: () => true,
    getToken: () => 'fake-token',
  };

  beforeEach(() => {
    // Simulamos valores esperados en localStorage
    spyOn(localStorage, 'getItem').and.callFake(
      (key: string): string | null => {
        const fakeStorage: { [key: string]: string } = {
          access_token: 'fake-token',
          id: '123',
        };
        return fakeStorage[key] || null;
      },
    );

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [
        UsersService,
        { provide: AuthService, useValue: mockAuthService },
      ],
    });

    injector = getTestBed();
    service = injector.get(UsersService);
    httpMock = injector.get(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debería crearse el servicio', () => {
    expect(service).toBeTruthy();
  });

  it('debería hacer una petición GET a /cobradores/{id}', () => {
    const dummyResponse = { nombre: 'Usuario de prueba' };

    service.getUsers().subscribe((response: any) => {
      expect(response).toEqual(dummyResponse);
    });

    const req = httpMock.expectOne(`${environment.API_URL}/cobradores/123`);
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toBe('Bearer fake-token');

    req.flush(dummyResponse);
  });
});
