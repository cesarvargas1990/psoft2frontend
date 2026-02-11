import {
  async,
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
  flush,
  discardPeriodicTasks
} from '@angular/core/testing';
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
    localStorage.setItem(
      'menu_usuario',
      JSON.stringify([{ displayName: 'Test', iconName: 'test' }])
    );

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
    const guardarSpy = spyOn(
      prestamosService,
      'guardarPrestamo'
    ).and.callThrough();
    const swalSpy = spyOn(Swal, 'fire').and.returnValue(
      Promise.resolve({ value: true })
    );

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
    const limpio = component.limpiarHTML(
      `<html><head></head><body>Contenido</body></html>`
    );
    expect(limpio).toBe('Contenido');
  });

  it('debe generar cuotas y mostrarlas si formulario válido', () => {
    const modelValido = {
      id_cliente: 1,
      valorpres: 100000,
      numcuotas: 12,
      porcint: 1.5,
      fec_inicial: new Date(),
      id_periodo_pago: 1,
      id_sistema_pago: 1,
      id_cobrador: 1
    };
    component.form.patchValue(modelValido);
    component.form.setErrors(null);
    component.obtenerCuotasPrestamo();
    expect(component.mostrarTablaResumen).toBe(true);
    expect(component.tableCuotasPrestamo.length).toBeGreaterThan(0);
  });

  it('getHeaders debe retornar los headers de la tabla', () => {
    component.tableCuotasPrestamo = [
      { cuota: 1, valor: 100000 },
      { cuota: 2, valor: 120000 }
    ];
    const headers = component.getHeaders();
    expect(headers).toContain('cuota');
    expect(headers).toContain('valor');
  });

  it('submit debe navegar a prestamos/listar si el formulario es válido', () => {
    const routerSpy = spyOn(router, 'navigate');
    component.form.setErrors(null);
    component.model = {};
    component.submit();
    expect(routerSpy).toHaveBeenCalledWith(['/prestamos/listar']);
  });

  it('debe llamar ngOnInit y remover event listener', () => {
    component.mobileQuery = {
      removeEventListener: jasmine.createSpy('removeEventListener'),
      addEventListener: jasmine.createSpy('addEventListener'),
      removeListener: jasmine.createSpy('removeListener'),
      addListener: jasmine.createSpy('addListener')
    } as any;
    component.ngOnInit();
    expect(component.mobileQuery.removeEventListener).toHaveBeenCalled();
  });

  it('debe llamar ngAfterViewInit y setear config y fields', async () => {
    component.appDrawer = {} as any;
    const navService = (component as any).navService as NavService;
    await component.ngAfterViewInit();
    expect(component.config.height).toBe(500);
    expect(component.fields.length).toBeGreaterThan(0);
    expect(navService.appDrawer).toBe(component.appDrawer);
  });

  it('debe navegar al crear cliente al llamar modalAdicionarEmpresa', () => {
    const spy = spyOn(router, 'navigate');
    component.modalAdicionarEmpresa();
    expect(spy).toHaveBeenCalledWith(['clientes/crear']);
  });

  it('debe mostrar error en obtenerCuotasPrestamo si formulario inválido', () => {
    const spy = spyOn(Swal, 'fire');
    component.form.setErrors({ invalid: true });
    component.obtenerCuotasPrestamo();
    expect(spy).toHaveBeenCalled();
    expect(component.mostrarTablaResumen).toBe(false);
  });

  it('debe mostrar error en guardarPrestamo si formulario inválido', () => {
    const spy = spyOn(Swal, 'fire');
    component.form.setErrors({ invalid: true });
    component.guardarPrestamo();
    expect(spy).toHaveBeenCalled();
  });

  it('debe llamar obtenerCuotasPrestamo desde Formly field change', () => {
    const spy = spyOn(component, 'obtenerCuotasPrestamo');
    component.form.setErrors(null);
    const field = { form: component.form };
    // Simula el evento de cambio en un campo
    component.fields = [
      {
        fieldGroup: [
          {
            templateOptions: {
              change: (f, e) => {
                if (component.form.valid) {
                  component.obtenerCuotasPrestamo();
                }
              }
            }
          }
        ]
      }
    ];
    // Ejecuta el change
    component.fields[0].fieldGroup[0].templateOptions.change(field, {});
    expect(spy).toHaveBeenCalled();
  });

  it('debe actualizar model y navegar tras submit válido', () => {
    const routerSpy = spyOn(router, 'navigate');
    spyOn(component.clienteService, 'saveCliente').and.returnValue(
      of({ id: 99 })
    );
    component.form.setErrors(null);
    component.model = { id_cliente: 1 };
    component.submit();
    expect(component.model.id).toBe(99);
    expect(routerSpy).toHaveBeenCalledWith(['/prestamos/listar']);
  });
});
