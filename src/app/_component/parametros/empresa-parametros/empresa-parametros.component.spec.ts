import {
  async,
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
  flush,
  discardPeriodicTasks,
} from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { EmpresaParametrosComponent } from './empresa-parametros.component';

import { AuthService } from '../../../_services/auth.service';
import { NavService } from '../../../_services/nav.service';
import { EmpresaService } from '../../../_services/empresa/empresa.service';
import { MediaMatcher } from '@angular/cdk/layout';
import { of } from 'rxjs';

class MockAuthService {
  isLoggedIn() {
    return true;
  }

  tienePermiso(_permiso: string): boolean {
    return true;
  }
}

class MockNavService {
  appDrawer: ElementRef;
}

class MockEmpresaService {
  getEmpresa() {
    return of({
      nombre: 'Mi Empresa',
      nitempresa: '123456789',
      vlr_capinicial: 100000,
      email: 'empresa@test.com',
      pagina: 'www.miempresa.com',
      telefono: '1234567890',
      ciudad: 'Bogotá',
      ddirec: 'Calle 123',
    });
  }

  actualizarDatosEmpresa() {
    return of(true);
  }
}

class MockRouter {
  navigate(path: string[]) {}
}

class MockMediaMatcher {
  matchMedia(query: string) {
    return {
      matches: false,
      addListener: () => {},
      removeListener: () => {},
    };
  }
}

describe('EmpresaParametrosComponent', () => {
  let component: EmpresaParametrosComponent;
  let fixture: ComponentFixture<EmpresaParametrosComponent>;
  let empresaService: EmpresaService;

  beforeEach(async(() => {
    localStorage.setItem(
      'menu_usuario',
      JSON.stringify([{ displayName: 'Test', iconName: 'test' }]),
    );
    localStorage.setItem('permisos', JSON.stringify(['ver_empresa']));

    TestBed.configureTestingModule({
      declarations: [EmpresaParametrosComponent],
      providers: [
        { provide: AuthService, useClass: MockAuthService },
        { provide: NavService, useClass: MockNavService },
        { provide: EmpresaService, useClass: MockEmpresaService },
        { provide: Router, useClass: MockRouter },
        { provide: MediaMatcher, useClass: MockMediaMatcher },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmpresaParametrosComponent);
    component = fixture.componentInstance;
    empresaService = TestBed.get(EmpresaService);
    fixture.detectChanges();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debe cargar datos de empresa y configurar campos', fakeAsync(() => {
    component.ngOnInit();
    tick(200);
    fixture.detectChanges();
    expect(component.datosEmpresa.nombre).toBe('Mi Empresa');
    expect(component.fields.length).toBeGreaterThan(0);
  }));

  it('debe llamar actualizarDatosEmpresa cuando el formulario es válido', fakeAsync(() => {
    const spy = spyOn(
      empresaService,
      'actualizarDatosEmpresa',
    ).and.callThrough();

    component.ngOnInit();
    tick(200);
    fixture.detectChanges();

    const patch = {
      nombre: 'Mi Empresa',
      nit: '123456789',
      vlr_capinicial: 100000,
      email: 'empresa@test.com',
      pagina: 'www.miempresa.com',
      telefono: '1234567890',
      ciudad: 'Bogotá',
      ddirec: 'Calle 123',
    };

    component.form.patchValue(patch);
    fixture.detectChanges();

    component.submit();

    expect(spy).toHaveBeenCalled();

    // ✅ Limpia timers de Angular Material, Formly o animaciones internas
    flush();
    discardPeriodicTasks();
  }));

  it('no debe llamar actualizarDatosEmpresa si el formulario no es válido', () => {
    const spy = spyOn(empresaService, 'actualizarDatosEmpresa');
    component.form.setErrors({ invalid: true });

    component.submit();

    expect(spy).not.toHaveBeenCalled();
  });
});
