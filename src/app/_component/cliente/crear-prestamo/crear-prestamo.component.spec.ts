import { async, ComponentFixture, TestBed, fakeAsync, tick, flush, discardPeriodicTasks } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { CrearPrestamoComponent } from './crear-prestamo.component';
import { AuthService } from '../../../_services/auth.service';
import { NavService } from '../../../_services/nav.service';
import { ClienteService } from '../../../_services/cliente/cliente.service';
import { TipodocidentiService } from '../../../_services/tipodocidenti/tipodocidenti.service';
import { UsersService } from '../../../_services/users/users.service';
import { PrestamosService } from '../../../_services/prestamos/prestamos.service';
import { MediaMatcher } from '@angular/cdk/layout';
import Swal from 'sweetalert2';

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

class MockClienteService {
  getClientes() {
    return Promise.resolve([{ id: 1, name: 'Cliente Test' }]);
  }
  saveCliente(model: any) {
    return of({ id: 99 });
  }
}

class MockTipodocidentiService {
  getTipodocidenti() {
    return Promise.resolve([]);
  }
}

class MockUsersService {
  getUsers() {
    return Promise.resolve([]);
  }
}

class MockPrestamosService {
  getFormasPago() {
    return Promise.resolve([]);
  }

  getSistemaPrestamo() {
    return Promise.resolve([]);
  }

  calcularCuotas(data: any) {
    return of([{ cuota: 1, valor: 100000 }]);
  }

  guardarPrestamo(model: any) {
    return of(123);
  }

  renderTemplates(model: any) {
    return of([{ plantilla_html: '<html><body>Contenido</body></html>' }]);
  }

  pstiposistemaprest() {
    return of(true);
  }
}

class MockRouter {
  navigate(path: string[]) {}
}

class MockMediaMatcher {
  matchMedia(_query: string) {
    return {
      matches: false,
      addListener: () => {},
      removeListener: () => {}
    };
  }
}

describe('CrearPrestamoComponent', () => {
  let component: CrearPrestamoComponent;
  let fixture: ComponentFixture<CrearPrestamoComponent>;
  let router: Router;
  let prestamosService: PrestamosService;

  beforeEach(async(() => {
    localStorage.setItem('menu_usuario', JSON.stringify([{ displayName: 'Test', iconName: 'test' }]));

    TestBed.configureTestingModule({
      declarations: [CrearPrestamoComponent],
      providers: [
        { provide: AuthService, useClass: MockAuthService },
        { provide: NavService, useClass: MockNavService },
        { provide: ClienteService, useClass: MockClienteService },
        { provide: TipodocidentiService, useClass: MockTipodocidentiService },
        { provide: UsersService, useClass: MockUsersService },
        { provide: PrestamosService, useClass: MockPrestamosService },
        { provide: Router, useClass: MockRouter },
        { provide: MediaMatcher, useClass: MockMediaMatcher }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrearPrestamoComponent);
    component = fixture.componentInstance;
    router = TestBed.get(Router);
    prestamosService = TestBed.get(PrestamosService);
    fixture.detectChanges();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debe navegar al dashboard al llamar volver()', () => {
    const spy = spyOn(router, 'navigate');
    component.volver();
    expect(spy).toHaveBeenCalledWith(['/dashboard']);
  });

  it('debe mostrar error si el formulario es inválido al hacer submit', () => {
    const spy = spyOn(Swal, 'fire');
    component.form.setErrors({ invalid: true });
    component.submit();
    expect(spy).toHaveBeenCalled();
  });

  it('debe llamar guardarPrestamo si formulario es válido', fakeAsync(() => {
    const guardarSpy = spyOn(prestamosService, 'guardarPrestamo').and.callThrough();
    const swalSpy = spyOn(Swal, 'fire').and.returnValue(Promise.resolve({ value: true }));

    component.model = {
      id_cliente: 1,
      valorpres: 100000,
      numcuotas: 12,
      porcint: 1.5,
      fec_inicial: new Date(),
      id_periodo_pago: 1,
      id_sistema_pago: 1,
      id_cobrador: 1
    };

    component.form.patchValue(component.model);
    component.form.setErrors(null);
    fixture.detectChanges();

    component.guardarPrestamo();
    tick(); // espera Swal
    expect(swalSpy).toHaveBeenCalled();
    expect(guardarSpy).toHaveBeenCalled();

    flush();
    discardPeriodicTasks();
  }));

  it('debe combinar contenido HTML correctamente', () => {
    const htmlItems = [
      { plantilla_html: '<html><body>Texto A</body></html>' },
      { plantilla_html: '<html><body>Texto B</body></html>' }
    ];
    component.combinarContenido(htmlItems);
    expect(component.contenidoCombinado).toContain('Texto A');
    expect(component.contenidoCombinado).toContain('Texto B');
    expect(component.contenidoCombinado).toContain('<hr');
  });

  it('debe limpiar HTML removiendo body y head', () => {
    const limpio = component.limpiarHTML(`<html><head></head><body>Contenido</body></html>`);
    expect(limpio).toBe('Contenido');
  });
});
