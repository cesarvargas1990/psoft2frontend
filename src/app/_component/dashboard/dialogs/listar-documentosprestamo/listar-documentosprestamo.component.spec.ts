import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { ListarDocumentosprestamoComponent } from './listar-documentosprestamo.component';
import { Component, Input, forwardRef } from '@angular/core';
import {
  ReactiveFormsModule,
  FormsModule,
  NG_VALUE_ACCESSOR,
  ControlValueAccessor
} from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import Swal from 'sweetalert2';

// Angular Material
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDialogModule } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { ClienteService } from '../../../../_services/cliente/cliente.service';
import { TipodocidentiService } from '../../../../_services/tipodocidenti/tipodocidenti.service';
import { UsersService } from '../../../../_services/users/users.service';
import { PrestamosService } from '../../../../_services/prestamos/prestamos.service';

// Mock <tinymce>
@Component({
  selector: 'tinymce',
  template: '<div></div>',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MockTinymceComponent),
      multi: true
    }
  ]
})
class MockTinymceComponent implements ControlValueAccessor {
  @Input() config: any;
  writeValue(): void {}
  registerOnChange(): void {}
  registerOnTouched(): void {}
}

describe('ListarDocumentosprestamoComponent', () => {
  let component: ListarDocumentosprestamoComponent;
  let fixture: ComponentFixture<ListarDocumentosprestamoComponent>;

  const mockDialogRef = {
    close: jasmine.createSpy('close'),
    componentInstance: {
      data: { id_prestamo: 1 }
    }
  };

  const mockData = {
    id: 123,
    nombre: 'Plantilla de prueba',
    plantilla_html: '<p>Contenido</p>'
  };

  const prestamosServiceMock = jasmine.createSpyObj('PrestamosService', [
    'updatePlantillaDocumento',
    'renderTemplates',
    'getPeriodosPago',
    'listaVariablesPlantillas'
  ]);

  const tipodocidentiServiceMock = jasmine.createSpyObj(
    'TipodocidentiService',
    ['getTipodocidenti']
  );
  const usersServiceMock = jasmine.createSpyObj('UsersService', ['getUsers']);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ListarDocumentosprestamoComponent, MockTinymceComponent],
      imports: [
        RouterTestingModule,
        ReactiveFormsModule,
        FormsModule,
        FormlyModule.forRoot(),
        MatExpansionModule,
        MatDialogModule,
        NoopAnimationsModule // 🔥 clave para evitar errores por animaciones
      ],
      providers: [
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: mockData },
        { provide: ClienteService, useValue: {} },
        { provide: TipodocidentiService, useValue: tipodocidentiServiceMock },
        { provide: UsersService, useValue: usersServiceMock },
        { provide: PrestamosService, useValue: prestamosServiceMock }
      ]
    }).compileComponents();
  }));

  beforeEach(async () => {
    fixture = TestBed.createComponent(ListarDocumentosprestamoComponent);
    component = fixture.componentInstance;

    prestamosServiceMock.renderTemplates.and.returnValue(
      of([
        { nombre: 'Plantilla demo', plantilla_html: '<p>HTML de prueba</p>' }
      ])
    );
    prestamosServiceMock.listaVariablesPlantillas.and.returnValue(of([]));
    prestamosServiceMock.getPeriodosPago.and.returnValue(Promise.resolve([]));
    tipodocidentiServiceMock.getTipodocidenti.and.returnValue(
      Promise.resolve([])
    );
    usersServiceMock.getUsers.and.returnValue(Promise.resolve([]));

    await component.ngAfterViewInit();
    fixture.detectChanges();
  });

  it('debería crearse correctamente', () => {
    expect(component).toBeTruthy();
    expect(Array.isArray(component.plantillas_html)).toBe(true);
    expect(component.plantillas_html.length).toBeGreaterThan(0);
  });

  it('debería ejecutar submit si el formulario es válido', async () => {
    spyOn(Swal, 'fire').and.returnValue(Promise.resolve({ value: true }));
    prestamosServiceMock.updatePlantillaDocumento.and.returnValue(of(mockData));

    component.html = '<p>Nuevo contenido</p>';
    component.model.nombre = 'Plantilla de prueba';
    component.form.markAsDirty();
    component.form.markAsTouched();

    component.submit();
    await fixture.whenStable();

    expect(prestamosServiceMock.updatePlantillaDocumento).toHaveBeenCalled();
    expect(Swal.fire).toHaveBeenCalled();
  });
});
