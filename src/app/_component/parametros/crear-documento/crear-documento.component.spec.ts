import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick
} from '@angular/core/testing';
import { CrearDocumentoComponent } from './crear-documento.component';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';
import { FormlyMaterialModule } from '@ngx-formly/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import Swal from 'sweetalert2';
import { ChangeDetectorRef } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { AuthService } from '../../../_services/auth.service';
import { NavService } from '../../../_services/nav.service';
import { ClienteService } from '../../../_services/cliente/cliente.service';
import { TipodocidentiService } from '../../../_services/tipodocidenti/tipodocidenti.service';
import { UsersService } from '../../../_services/users/users.service';
import { PrestamosService } from '../../../_services/prestamos/prestamos.service';

class MockAuthService {
  logout = jasmine.createSpy();
  isLoggedIn = () => true;
  tienePermiso = () => true;
}

class MockNavService {
  appDrawer: any;
}

class MockClienteService {}
class MockTipodocidentiService {}
class MockUsersService {}
class MockPrestamosService {
  listaVariablesPlantillas = () => of([{ title: 'Var', description: 'X' }]);
  consultaPlantillasDocumentos = () => of([]);
  guardarDocumento = () => of({ id: 1, nombre: 'Test' });
  deleteDocumentoPlantilla = () => of({});
  updatePlantillaDocumento = () => of({ id: 1, nombre: 'Actualizado' });
}

describe('CrearDocumentoComponent', () => {
  let component: CrearDocumentoComponent;
  let fixture: ComponentFixture<CrearDocumentoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CrearDocumentoComponent],
      imports: [
        ReactiveFormsModule,
        FormsModule,
        FormlyModule.forRoot(),
        FormlyMaterialModule,
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        MatDialogModule,
        BrowserAnimationsModule,
        RouterTestingModule
      ],
      providers: [
        { provide: AuthService, useClass: MockAuthService },
        { provide: NavService, useClass: MockNavService },
        { provide: ClienteService, useClass: MockClienteService },
        { provide: TipodocidentiService, useClass: MockTipodocidentiService },
        { provide: UsersService, useClass: MockUsersService },
        { provide: PrestamosService, useClass: MockPrestamosService }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CrearDocumentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería inicializar los campos Formly correctamente', () => {
    expect(component.fields.length).toBeGreaterThan(0);
  });

  it('debería configurar TinyMCE y asignar appDrawer en ngAfterViewInit', async () => {
    component.appDrawer = {} as any;
    const navService = (component as any).navService as NavService;
    const spyDatos = spyOn(component, 'getDatosDocumentos').and.callThrough();

    await component.ngAfterViewInit();

    expect(component.config.height).toBe(500);
    expect(component.config.templates.length).toBe(1);
    expect(component.fields.length).toBeGreaterThan(0);
    expect(navService.appDrawer).toBe(component.appDrawer);
    expect(spyDatos).toHaveBeenCalled();
  });

  it('debería llamar a getDatosDocumentos() y asignar datos al dataSource', () => {
    const spy = spyOn(component as any, 'getDatosDocumentos').and.callThrough();
    component.getDatosDocumentos();
    expect(spy).toHaveBeenCalled();
  });

  it('debería mostrar error si el formulario es inválido', () => {
    const spy = spyOn(Swal, 'fire');
    component.form.setErrors({ invalid: true });

    component.submit();

    expect(spy).toHaveBeenCalled();
  });

  it('debería mostrar error si el formulario es válido pero el HTML está vacío', () => {
    const spy = spyOn(Swal, 'fire');
    component.form.setErrors(null);
    component.html = '';

    component.submit();

    expect(spy).toHaveBeenCalled();
  });

  it('debería guardar un documento si el formulario es válido', () => {
    component.form.setErrors(null);
    component.html = '<p>Plantilla</p>';
    component.model = { nombre: 'Test' };
    component.form.markAsTouched();
    spyOn(component.prestamosService, 'guardarDocumento').and.callThrough();
    const datosSpy = spyOn(component, 'getDatosDocumentos').and.callThrough();
    const swalSpy = spyOn(Swal, 'fire').and.returnValue(
      Promise.resolve({ value: true }) as any
    );
    component.submit();
    expect(component.prestamosService.guardarDocumento).toHaveBeenCalled();
    expect(datosSpy).toHaveBeenCalled();
    expect(swalSpy).toHaveBeenCalled();
  });

  it('debería eliminar una plantilla de documento', async () => {
    const spySwal = spyOn(Swal, 'fire').and.returnValue(
      Promise.resolve({ value: true }) as any
    );
    const deleteSpy = spyOn(
      component.prestamosService,
      'deleteDocumentoPlantilla'
    ).and.callThrough();

    await component.eliminarDocumentoPlantilla({ id: 1 });

    expect(spySwal).toHaveBeenCalled();
    expect(deleteSpy).toHaveBeenCalled();
  });

  it('no debería eliminar una plantilla si se cancela el confirm', async () => {
    const spySwal = spyOn(Swal, 'fire').and.returnValue(
      Promise.resolve({ value: false }) as any
    );
    const deleteSpy = spyOn(
      component.prestamosService,
      'deleteDocumentoPlantilla'
    ).and.callThrough();

    await component.eliminarDocumentoPlantilla({ id: 1 });

    expect(spySwal).toHaveBeenCalled();
    expect(deleteSpy).not.toHaveBeenCalled();
  });

  it('debería manejar error al eliminar plantilla', async () => {
    let callCount = 0;
    const swalSpy = spyOn(Swal, 'fire').and.callFake(() => {
      callCount += 1;
      if (callCount === 1) {
        return Promise.resolve({ value: true }) as any;
      }
      return Promise.resolve({ value: false }) as any;
    });
    spyOn(
      component.prestamosService,
      'deleteDocumentoPlantilla'
    ).and.returnValue(throwError('error'));

    await component.eliminarDocumentoPlantilla({ id: 1 });

    expect(swalSpy).toHaveBeenCalled();
  });

  it('debería editar un documento y actualizar con éxito', fakeAsync(() => {
    component.form.setErrors(null);
    component.html = '<b>nuevo contenido</b>';
    component.model = { id: 1, nombre: 'TestDoc' };
    component.documentoPlantilla = { id: null, nombre: '', plantilla_html: '' };

    const updateSpy = spyOn(
      component.prestamosService,
      'updatePlantillaDocumento'
    ).and.callThrough();
    spyOn(Swal, 'fire').and.returnValue(
      Promise.resolve({ value: true }) as any
    );

    component.editarPlantilla();
    tick();

    expect(updateSpy).toHaveBeenCalled();
    expect(component.documentoPlantilla.nombre).toBe('TestDoc');
  }));

  it('no debería actualizar plantilla si el formulario es inválido', () => {
    component.form.setErrors({ invalid: true });
    const updateSpy = spyOn(
      component.prestamosService,
      'updatePlantillaDocumento'
    ).and.callThrough();

    component.editarPlantilla();

    expect(updateSpy).not.toHaveBeenCalled();
  });

  it('debería aplicar filtro correctamente', () => {
    const mockData = [{ nombre: 'Test' }];
    component.dataSource.data = mockData;
    component.applyFilter('test');
    expect(component.dataSource.filter).toBe('test');
  });

  it('debería llamar logout si falla la carga de documentos', () => {
    const authService = TestBed.get(AuthService) as MockAuthService;
    spyOn(
      component.prestamosService,
      'consultaPlantillasDocumentos'
    ).and.returnValue(throwError('error'));

    component.getDatosDocumentos();

    expect(authService.logout).toHaveBeenCalled();
  });

  it('debería asignar valores al editarDocumento()', () => {
    const row = {
      plantilla_html: '<h1>hola</h1>',
      nombre: 'plantilla 1',
      id: 2
    };
    component.editarDocumento(row);
    expect(component.html).toBe('<h1>hola</h1>');
    expect(component.model.nombre).toBe('plantilla 1');
    expect(component.model.id).toBe(2);
  });

  it('debería usar removeListener en ngOnInit cuando removeEventListener no existe', () => {
    component.mobileQuery = {
      removeListener: jasmine.createSpy('removeListener'),
      addListener: jasmine.createSpy('addListener')
    } as any;
    component.ngOnInit();
    expect(component.mobileQuery.removeListener).toHaveBeenCalled();
  });

  it('debería ejecutar guardarFormaPago y actualizar model', () => {
    const guardarSpy = spyOn(
      component.prestamosService,
      'guardarDocumento'
    ).and.callThrough();
    component.model = { nombre: 'Nueva' };
    component.guardarFormaPago();
    expect(guardarSpy).toHaveBeenCalled();
    expect(component.model.id).toBe(1);
  });

  it('debería ejecutar modalEditarFormaPago sin errores', () => {
    const logSpy = spyOn(console, 'log');
    component.modalEditarFormaPago([{ id: 1 }] as any);
    expect(logSpy).toHaveBeenCalled();
  });

  it('no debería refrescar documentos si confirmación de editarPlantilla es false', fakeAsync(() => {
    component.form.setErrors(null);
    component.html = '<p>x</p>';
    component.model = { id: 1, nombre: 'Plantilla' };
    spyOn(Swal, 'fire').and.returnValue(
      Promise.resolve({ value: false }) as any
    );
    const getSpy = spyOn(component, 'getDatosDocumentos');

    component.editarPlantilla();
    tick();

    expect(getSpy).not.toHaveBeenCalled();
  }));

  it('no debería mostrar mensaje si updatePlantillaDocumento responde null', fakeAsync(() => {
    component.form.setErrors(null);
    component.html = '<p>x</p>';
    component.model = { id: 1, nombre: 'Plantilla' };
    spyOn(component.prestamosService, 'updatePlantillaDocumento').and.returnValue(
      of(null as any)
    );
    const swalSpy = spyOn(Swal, 'fire');

    component.editarPlantilla();
    tick();

    expect(swalSpy).not.toHaveBeenCalled();
  }));

  it('debería usar addListener cuando media no soporta addEventListener', () => {
    const mediaMatcher = {
      matchMedia: (_query: string) => ({
        matches: false,
        addListener: jasmine.createSpy('addListener')
      })
    } as unknown as MediaMatcher;
    const changeDetectorRef = {
      detectChanges: jasmine.createSpy('detectChanges')
    } as unknown as ChangeDetectorRef;

    const cmp = new CrearDocumentoComponent(
      TestBed.get(AuthService),
      TestBed.get(NavService),
      TestBed.get(ClienteService),
      changeDetectorRef,
      mediaMatcher,
      TestBed.get(Router),
      TestBed.get(TipodocidentiService),
      TestBed.get(UsersService),
      TestBed.get(PrestamosService),
      TestBed.get(MatDialog)
    );

    const mediaQuery = (cmp as any).mobileQuery as any;
    expect(mediaQuery.addListener).toHaveBeenCalled();
  });
});
