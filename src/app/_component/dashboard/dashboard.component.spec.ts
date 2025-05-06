import { ComponentFixture, TestBed, getTestBed } from '@angular/core/testing';
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
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/clientes/crearPrestamo']);
  });
});
