import { ComponentFixture, TestBed, fakeAsync, tick, flush } from '@angular/core/testing';
import { EditarClienteComponent } from './editar-cliente.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ClienteService } from '../../../../../_services/cliente/cliente.service';
import { TipodocidentiService } from '../../../../../_services/tipodocidenti/tipodocidenti.service';
import { UsersService } from '../../../../../_services/users/users.service';
import { PrestamosService } from '../../../../../_services/prestamos/prestamos.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';
import Swal from 'sweetalert2';
import { WebcamImage } from 'ngx-webcam'; // ✅ import faltante

describe('EditarClienteComponent', () => {
  let component: EditarClienteComponent;
  let fixture: ComponentFixture<EditarClienteComponent>;
  let clienteService: jasmine.SpyObj<ClienteService>;
  let prestamosService: jasmine.SpyObj<PrestamosService>;

  const mockCliente = {
    id: 1,
    nomcliente: 'Juan',
    id_cobrador: 1,
    id_tipo_docid: 2,
    numdocumento: '12345',
    fch_expdocumento: '2020-01-01',
    fch_nacimiento: '1990-01-01',
    ciudad: 'Bogotá',
    telefijo: '1111111',
    celular: '3000000000',
    email: 'test@test.com',
    direcasa: 'calle 123',
    diretrabajo: 'carrera 456',
    ref1: 'Referencia A',
    ref2: 'Referencia B'
  };

  beforeEach(async () => {
    const clienteServiceSpy = jasmine.createSpyObj('ClienteService', ['updateCliente', 'editFile', 'listadoArchivosCliente']);
    const tipodocidentiServiceSpy = jasmine.createSpyObj('TipodocidentiService', ['getTipodocidenti']);
    const usersServiceSpy = jasmine.createSpyObj('UsersService', ['getUsers']);
    const prestamosServiceSpy = jasmine.createSpyObj('PrestamosService', ['listaTiposDocumento', 'listadoArchivosCliente']);

    await TestBed.configureTestingModule({
      declarations: [EditarClienteComponent],
      providers: [
        { provide: ClienteService, useValue: clienteServiceSpy },
        { provide: TipodocidentiService, useValue: tipodocidentiServiceSpy },
        { provide: UsersService, useValue: usersServiceSpy },
        { provide: PrestamosService, useValue: prestamosServiceSpy },
        { provide: MatDialogRef, useValue: { close: () => {} } },
        { provide: MAT_DIALOG_DATA, useValue: mockCliente }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(EditarClienteComponent);
    component = fixture.componentInstance;

    // ✅ Angular 8 compatible
    clienteService = TestBed.get(ClienteService);
    prestamosService = TestBed.get(PrestamosService);
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debe mostrar error si el formulario no es válido al hacer submit', () => {
    spyOn(Swal, 'fire');
    component.form.setErrors({ required: true });
    component.submit();
    expect(Swal.fire).not.toHaveBeenCalled();
  });

  it('debe actualizar cliente y llamar a editFile si es válido', fakeAsync(() => {
    const fakeResponse = { id: 1 };
    component.model = {};
    component.form.setErrors(null);
    component.editFirmar = true;
    component.signaturePad = {
      toDataURL: () => 'data:image/png;base64,fake'
    } as any;

    clienteService.updateCliente.and.returnValue(of(fakeResponse));
    clienteService.editFile.and.returnValue(of({}));

    spyOn(Swal, 'fire').and.returnValue(Promise.resolve({ value: true }));
    spyOn(component.dialogRef, 'close');

    component.submit();
    tick();

    expect(clienteService.updateCliente).toHaveBeenCalled();
    expect(clienteService.editFile).toHaveBeenCalled();
    expect(Swal.fire).toHaveBeenCalled();
    expect(component.dialogRef.close).toHaveBeenCalled();

    flush();
  }));

  it('debe cargar archivos en ngOnInit', fakeAsync(() => {
    prestamosService.listadoArchivosCliente.and.returnValue(of([
      { id_tdocadjunto: 1, nombrearchivo: 'archivo1.png' },
      { id_tdocadjunto: 2, nombrearchivo: 'archivo2.pdf' }
    ]));

    component.ngOnInit();
    tick();

    expect(Object.keys(component.listaArchivos).length).toBe(2);
    flush();
  }));

  it('debe agregar errores al array si falla init de webcam', () => {
    component.errors = [];
    const error = { message: 'camera error' } as any;
    component.handleInitError(error);
    expect(component.errors.length).toBe(1);
  });

  it('debe guardar imagen capturada en handleImage()', () => {
    const fakeImage = { imageAsDataUrl: 'data:image/png;base64,fakeimage' } as WebcamImage;
    component.handleImage(fakeImage);
    expect(component.listaArchivos[component.currentIndexImage]).toBe('data:image/png;base64,fakeimage');
  });

  it('debe actualizar deviceId al cambiar cámara', () => {
    component.cameraWasSwitched('new-camera-id');
    expect(component.deviceId).toBe('new-camera-id');
  });
});
