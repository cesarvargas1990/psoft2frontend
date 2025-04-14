import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { AuthService } from '../../_services/auth.service';
import { FormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceSpy: any;

  const loginResponseMock = {
    status: 'success',
    access_token: 'token123',
    name: 'Test User',
    data: {},
    message: '',
    id: 1,
    id_user: 1,
    id_empresa: 2,
    ind_activo: true,
    is_admin: true,
    permisos: [],
    menu_usuario: []
  };

  beforeEach(async(() => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['loginForm', 'setUser']);

    TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [FormsModule],
      providers: [{ provide: AuthService, useValue: authServiceSpy }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA] // permite usar <mat-*> y <app-logo> en template
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería limpiar localStorage en ngOnInit', () => {
    spyOn(localStorage, 'clear');
    component.ngOnInit();
    expect(localStorage.clear).toHaveBeenCalled();
  });

  it('debería llamar loginForm y setUser si status es success', () => {
    authServiceSpy.loginForm.and.returnValue(of(loginResponseMock));
    component.model = { email: 'test@example.com', password: '1234' };
    component.login();
    expect(authServiceSpy.loginForm).toHaveBeenCalled();
    expect(authServiceSpy.setUser).toHaveBeenCalledWith(loginResponseMock);
  });

  it('no debe llamar setUser si status no es success', () => {
    const response = { status: 'error' };
    authServiceSpy.loginForm.and.returnValue(of(response));
    component.model = { email: 'test@example.com', password: '1234' };
    component.login();
    expect(authServiceSpy.setUser).not.toHaveBeenCalled();
  });

  it('debería manejar errores de loginForm y mostrarlos en consola', () => {
    const consoleSpy = spyOn(console, 'error');
    const error = { status: 401, message: 'Unauthorized' };
    authServiceSpy.loginForm.and.returnValue(throwError(error));
    component.model = { email: 'test@example.com', password: '1234' };
    component.login();
    expect(consoleSpy).toHaveBeenCalledWith(error);
  });
});
