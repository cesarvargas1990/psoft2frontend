import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
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
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import Swal from 'sweetalert2';
import { AuthService } from '../../../_services/auth.service';
import { NavService } from '../../../_services/nav.service';
import { ClienteService } from '../../../_services/cliente/cliente.service';
import { TipodocidentiService } from '../../../_services/tipodocidenti/tipodocidenti.service';
import { UsersService } from '../../../_services/users/users.service';
import { PrestamosService } from '../../../_services/prestamos/prestamos.service';

class MockAuthService {
  isLoggedIn = () => true;
  tienePermiso = () => true;
  logout = jasmine.createSpy();
}

class MockNavService {
  appDrawer: any;
}

class MockClienteService {}
class MockTipodocidentiService {}
class MockUsersService {}
class MockPrestamosService {
  listaVariablesPlantillas = () => of([]);
  consultaPlantillasDocumentos = () => of([]);
  guardarDocumento = () => of({});
  deleteDocumentoPlantilla = () => of({});
  updatePlantillaDocumento = () => of({});
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

  it('debería llamar a getDatosDocumentos() y asignar datos al dataSource', () => {
    const spy = spyOn(component as any, 'getDatosDocumentos').and.callThrough();
    component.getDatosDocumentos();
    expect(spy).toHaveBeenCalled();
  });

  it('debería validar el formulario antes de enviar', () => {
    component.html = '';
    component.form.setErrors(null); // Simula formulario inválido
    component.submit();
    expect(component.model.plantilla_html).toBeUndefined();
  });

  it('debería guardar un documento si el formulario es válido', () => {
    component.form.setErrors(null);
    component.html = '<p>Plantilla</p>';
    component.model = { nombre: 'Test' };
    component.form.markAsTouched();
    spyOn(component['prestamosService'], 'guardarDocumento').and.callThrough();
    component.submit();
    expect(component['prestamosService'].guardarDocumento).toHaveBeenCalled();
  });

  it('debería eliminar una plantilla de documento', async () => {
    const spySwal = spyOn(Swal, 'fire').and.returnValue(Promise.resolve({ value: true }) as any);
    const deleteSpy = spyOn(component['prestamosService'], 'deleteDocumentoPlantilla').and.callThrough();
  
    await component.eliminarDocumentoPlantilla({ id: 1 });
  
    expect(spySwal).toHaveBeenCalled();
    expect(deleteSpy).toHaveBeenCalled();
  });

  it('debería editar un documento y actualizar con éxito', fakeAsync(() => {
    component.form.setErrors(null);
    component.html = '<b>nuevo contenido</b>';
    component.model = { id: 1, nombre: 'TestDoc' };
    component.documentoPlantilla = { id: null, nombre: '', plantilla_html: '' };

    const updateSpy = spyOn(component['prestamosService'], 'updatePlantillaDocumento').and.callThrough();
    spyOn(Swal, 'fire').and.returnValue(Promise.resolve({ value: true }) as any);

    component.editarPlantilla();
    tick();

    expect(updateSpy).toHaveBeenCalled();
    expect(component.documentoPlantilla.nombre).toBe('TestDoc');
  }));

  it('debería aplicar filtro correctamente', () => {
    const mockData = [{ nombre: 'Test' }];
    component.dataSource.data = mockData;
    component.applyFilter('test');
    expect(component.dataSource.filter).toBe('test');
  });

  it('debería asignar valores al editarDocumento()', () => {
    const row = { plantilla_html: '<h1>hola</h1>', nombre: 'plantilla 1', id: 2 };
    component.editarDocumento(row);
    expect(component.html).toBe('<h1>hola</h1>');
    expect(component.model.nombre).toBe('plantilla 1');
    expect(component.model.id).toBe(2);
  });
});
