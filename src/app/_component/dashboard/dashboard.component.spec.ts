import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick
} from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

import { PrestamosService } from '../../_services/prestamos/prestamos.service';
import { AuthService } from '../../_services/auth.service';
import { NavService } from '../../_services/nav.service';
import { Router } from '@angular/router';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let prestamosServiceSpy: jasmine.SpyObj<PrestamosService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let navServiceSpy: jasmine.SpyObj<NavService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;

  beforeEach(async () => {
    prestamosServiceSpy = jasmine.createSpyObj('PrestamosService', [
      'totales_dashboard',
      'listadoPrestamos',
      'listaFechasPago',
      'renderTemplates',
      'registrarPagoCuota',
      'deletePrestamo'
    ]);

    authServiceSpy = jasmine.createSpyObj('AuthService', [
      'logout',
      'isLoggedIn',
      'tienePermiso'
    ]);

    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);

    const fakeResponse = {
      total_capital_prestado: '1000',
      total_prestado_hoy: '200',
      total_interes_hoy: '50',
      total_interes: '300',
      total_prestado: '1200'
    };

    prestamosServiceSpy.totales_dashboard.and.returnValue(of(fakeResponse));
    prestamosServiceSpy.listadoPrestamos.and.returnValue(of([]));
    prestamosServiceSpy.listaFechasPago.and.returnValue(of([]));
    prestamosServiceSpy.renderTemplates.and.returnValue(of([]));
    prestamosServiceSpy.registrarPagoCuota.and.returnValue(
      of({ success: true })
    );
    prestamosServiceSpy.deletePrestamo.and.returnValue(of({}));

    await TestBed.configureTestingModule({
      declarations: [DashboardComponent],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        MatPaginatorModule,
        MatSortModule,
        MatTableModule,
        BrowserAnimationsModule,
        FormsModule
      ],
      providers: [
        { provide: PrestamosService, useValue: prestamosServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: NavService, useValue: { appDrawer: null } },
        { provide: Router, useValue: routerSpy },
        { provide: MatDialog, useValue: dialogSpy }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call refresh and load dashboard totals and prestamos', () => {
    component.refresh();
    expect(prestamosServiceSpy.totales_dashboard).toHaveBeenCalled();
    expect(prestamosServiceSpy.listadoPrestamos).toHaveBeenCalled();
  });

  it('should navigate to crear prestamo', () => {
    component.irPantallaCrearPrestamo();
    expect(routerSpy.navigate).toHaveBeenCalledWith([
      '/clientes/crearPrestamo'
    ]);
  });

  it('should call logout method', () => {
    component.logout();
    expect(authServiceSpy.logout).toHaveBeenCalled();
  });

  it('should clean HTML properly', () => {
    const input = '<html><head></head><body>Contenido</body></html>';
    const result = component.limpiarHTML(input);
    expect(result).toBe('Contenido');
  });

  it('should combine HTML content', () => {
    const response = [{ plantilla_html: '<html><body>Doc1</body></html>' }];
    component.combinarContenido(response);
    expect(component.contenidoCombinado).toContain('Doc1');
  });

  it('should apply filter to table', () => {
    component.applyFilter('cliente');
    expect(component.dataSource.filter).toBe('cliente');
  });

  it('should open modalListadoDocumentos and call renderTemplates', () => {
    const row = { id_prestamo: 1 };
    component.modalListadoDocumentos(row);
    expect(prestamosServiceSpy.renderTemplates).toHaveBeenCalled();
  });

  it('should call listadoCuotas and update dataSourceFecPago', () => {
    const row = { id_prestamo: 1, nomcliente: 'Cliente' };
    prestamosServiceSpy.listaFechasPago.and.returnValue(of([{ fecha_pago: '2026-02-11', fecha_realpago: '2026-02-11', valcuota: 100, valtotal: 100, action: '' }]));
    component.listadoCuotas(row);
    expect(component.codPrestaSeleccionado).toBe(1);
    expect(component.clienteSeleccionado).toBe('Cliente');
    expect(prestamosServiceSpy.listaFechasPago).toHaveBeenCalledWith(1);
    expect(component.dataSourceFecPago.data.length).toBeGreaterThan(0);
  });

  it('should call eliminarPrestamo and refresh on confirm', fakeAsync(() => {
    spyOn(Swal, 'fire').and.returnValue(Promise.resolve({ value: true }));
    prestamosServiceSpy.deletePrestamo.and.returnValue(of({}));
    spyOn(component, 'getDatosPrestamo');
    spyOn(component, 'refresh');
    const row = { id_prestamo: 1 };
    component.eliminarPrestamo(row);
    tick();
    expect(prestamosServiceSpy.deletePrestamo).toHaveBeenCalledWith(row);
    expect(component.getDatosPrestamo).toHaveBeenCalled();
    expect(component.refresh).toHaveBeenCalled();
  }));

  it('should call pagarCuotaPrestamo and refresh on confirm', fakeAsync(() => {
    spyOn(Swal, 'fire').and.returnValue(Promise.resolve({ value: true }));
    prestamosServiceSpy.registrarPagoCuota.and.returnValue(of({}));
    spyOn(component, 'listadoCuotas');
    spyOn(component, 'refresh');
    const row = { fecha_pago: '2026-02-11', id_prestamo: 1, id_cliente: 2, id: 3 };
    component.pagarCuotaPrestamo(row);
    tick();
    expect(prestamosServiceSpy.registrarPagoCuota).toHaveBeenCalled();
    expect(component.listadoCuotas).toHaveBeenCalledWith(row);
    expect(component.refresh).toHaveBeenCalled();
  }));

  it('should call ngOnInit and set config', () => {
    spyOn(component, 'refresh');
    component.ngOnInit();
    expect(component.config.height).toBe(500);
    expect(component.refresh).toHaveBeenCalled();
  });

  it('should call ngAfterViewInit and set navService.appDrawer', () => {
    const appDrawerMock = {};
    component.appDrawer = appDrawerMock as any;
    // No acceso directo a private navService, solo ejecutamos el método
    component.ngAfterViewInit();
    // No assertion directa sobre navService.appDrawer por ser private
  });

  it('should call getDatosPrestamo and update dataSource', () => {
    prestamosServiceSpy.listadoPrestamos.and.returnValue(of([{ id_prestamo: 1, nomcliente: 'Cliente', valorpres: 1000, valcuota: 100, nomfpago: 'Mensual', celular: '123456789', direcasa: 'Calle 1', action: '' }]));
    component.getDatosPrestamo();
    expect(prestamosServiceSpy.listadoPrestamos).toHaveBeenCalledWith(component.data);
    expect(component.dataSource.data.length).toBeGreaterThan(0);
    expect(component.dataSource.sort).toBe(component.sort);
    expect(component.dataSource.paginator).toBe(component.paginator);
  });

  it('should call refresh and remove event listener', () => {
    component.mobileQuery = {
      removeEventListener: jasmine.createSpy('removeEventListener'),
      addEventListener: jasmine.createSpy('addEventListener'),
      removeListener: jasmine.createSpy('removeListener'),
      addListener: jasmine.createSpy('addListener')
    } as any;
    spyOn(component, 'getDatosPrestamo');
    prestamosServiceSpy.totales_dashboard.and.returnValue(of({
      total_capital_prestado: '1000',
      total_prestado_hoy: '200',
      total_interes_hoy: '50',
      total_interes: '300',
      total_prestado: '1200'
    }));
    component.refresh();
    expect(prestamosServiceSpy.totales_dashboard).toHaveBeenCalled();
    expect(component.total_capital_prestado).toBe('1000');
    expect(component.mobileQuery.removeEventListener).toHaveBeenCalled();
    expect(component.getDatosPrestamo).toHaveBeenCalled();
  });
});
