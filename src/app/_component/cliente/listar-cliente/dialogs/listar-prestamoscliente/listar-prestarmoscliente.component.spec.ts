import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { ListarPrestamosclienteComponent } from './listar-prestamoscliente.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogModule
} from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';

import { ClienteService } from '../../../../../_services/cliente/cliente.service';
import { TipodocidentiService } from '../../../../../_services/tipodocidenti/tipodocidenti.service';
import { UsersService } from '../../../../../_services/users/users.service';
import Swal from 'sweetalert2';

const mockClienteData = {
  id: 1,
  nomcliente: 'Cliente Test',
  id_cobrador: 2,
  id_tipo_docid: 1,
  numdocumento: '123456789',
  fch_expdocumento: '2020-01-01',
  fch_nacimiento: '1990-01-01',
  ciudad: 'Ciudad Test',
  telefijo: '1234567',
  celular: '3001234567',
  email: 'cliente@test.com',
  direcasa: 'Calle 123',
  diretrabajo: 'Carrera 45',
  ref1: 'Referencia 1',
  ref2: 'Referencia 2'
};

describe('ListarPrestamosclienteComponent', () => {
  let component: ListarPrestamosclienteComponent;
  let fixture: ComponentFixture<ListarPrestamosclienteComponent>;
  let clienteServiceSpy: any;
  let tipodocidentiServiceSpy: any;
  let usersServiceSpy: any;

  beforeEach(async(() => {
    clienteServiceSpy = jasmine.createSpyObj('ClienteService', [
      'getPrestamosCliente',
      'updateCliente'
    ]);
    tipodocidentiServiceSpy = jasmine.createSpyObj('TipodocidentiService', [
      'getTipodocidenti'
    ]);
    usersServiceSpy = jasmine.createSpyObj('UsersService', ['getUsers']);

    TestBed.configureTestingModule({
      declarations: [ListarPrestamosclienteComponent],
      imports: [
        ReactiveFormsModule,
        FormsModule,
        FormlyModule.forRoot(),
        MatDialogModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: ClienteService, useValue: clienteServiceSpy },
        { provide: TipodocidentiService, useValue: tipodocidentiServiceSpy },
        { provide: UsersService, useValue: usersServiceSpy },
        {
          provide: MatDialogRef,
          useValue: { close: jasmine.createSpy('close') }
        },
        { provide: MAT_DIALOG_DATA, useValue: mockClienteData }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(async () => {
    clienteServiceSpy.getPrestamosCliente.and.returnValue(of([]));
    clienteServiceSpy.updateCliente.and.returnValue(of(mockClienteData));
    tipodocidentiServiceSpy.getTipodocidenti.and.returnValue(
      Promise.resolve([])
    );
    usersServiceSpy.getUsers.and.returnValue(Promise.resolve([]));

    fixture = TestBed.createComponent(ListarPrestamosclienteComponent);
    component = fixture.componentInstance;
    await component.ngAfterViewInit();
    fixture.detectChanges();
  });

  it('debería crearse', () => {
    expect(component).toBeTruthy();
  });

  it('debería obtener headers vacíos cuando no hay prestamos', () => {
    component.consultaPrestamoCliente = [];
    expect(component.getHeaders()).toEqual([]);
  });

  it('debería obtener headers únicos de los prestamos', () => {
    component.consultaPrestamoCliente = [
      { campoA: 'valorA', campoB: 'valorB' },
      { campoB: 'valorB2', campoC: 'valorC' }
    ];
    const headers = component.getHeaders();
    expect(headers).toContain('campoA');
    expect(headers).toContain('campoB');
    expect(headers).toContain('campoC');
  });

  it('debería ejecutar submit correctamente si el formulario es válido', async () => {
    spyOn(Swal, 'fire').and.returnValue(Promise.resolve({ value: true }));

    component.form.patchValue({});
    component.form.markAsDirty();
    component.form.markAsTouched();
    component.model = { id: mockClienteData.id };

    await component.submit();
    expect(clienteServiceSpy.updateCliente).toHaveBeenCalled();
    expect(Swal.fire).toHaveBeenCalled();
  });
});
