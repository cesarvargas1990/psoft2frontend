import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
  flush
} from '@angular/core/testing';
import { EditarClienteComponent } from './editar-cliente.component';
import {
  MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA,
  MatLegacyDialogRef as MatDialogRef
} from '@angular/material/legacy-dialog';
import { ClienteService } from '../../../../../_services/cliente/cliente.service';
import { TipodocidentiService } from '../../../../../_services/tipodocidenti/tipodocidenti.service';
import { UsersService } from '../../../../../_services/users/users.service';
import { PrestamosService } from '../../../../../_services/prestamos/prestamos.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';
import Swal from 'sweetalert2';
import { WebcamImage } from 'ngx-webcam';

describe('EditarClienteComponent', () => {
  let component: EditarClienteComponent;
  let fixture: ComponentFixture<EditarClienteComponent>;
  let clienteService: jasmine.SpyObj<ClienteService>;
  let prestamosService: jasmine.SpyObj<PrestamosService>;
  let tipodocidentiService: jasmine.SpyObj<TipodocidentiService>;
  let usersService: jasmine.SpyObj<UsersService>;

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
    const clienteServiceSpy = jasmine.createSpyObj('ClienteService', [
      'updateCliente',
      'editFile',
      'listadoArchivosCliente'
    ]);
    const tipodocidentiServiceSpy = jasmine.createSpyObj(
      'TipodocidentiService',
      ['getTipodocidenti']
    );
    const usersServiceSpy = jasmine.createSpyObj('UsersService', ['getUsers']);
    const prestamosServiceSpy = jasmine.createSpyObj('PrestamosService', [
      'listaTiposDocumento',
      'listadoArchivosCliente'
    ]);

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

    clienteService = TestBed.inject(
      ClienteService
    ) as jasmine.SpyObj<ClienteService>;
    tipodocidentiService = TestBed.inject(
      TipodocidentiService
    ) as jasmine.SpyObj<TipodocidentiService>;
    usersService = TestBed.inject(UsersService) as jasmine.SpyObj<UsersService>;
    prestamosService = TestBed.inject(
      PrestamosService
    ) as jasmine.SpyObj<PrestamosService>;

    tipodocidentiService.getTipodocidenti.and.returnValue(of([]));
    usersService.getUsers.and.returnValue(of([]) as any);
    prestamosService.listadoArchivosCliente.and.returnValue(of([]));
    prestamosService.listaTiposDocumento.and.returnValue(of([]));
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

  it('debe actualizar cliente, llamar a editFile y cerrar modal si es válido', fakeAsync(() => {
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
    flush();

    expect(clienteService.updateCliente).toHaveBeenCalled();
    expect(clienteService.editFile).toHaveBeenCalled();
    expect(Swal.fire).toHaveBeenCalled();
    expect(component.editFirmar).toBe(false);
    expect(component.dialogRef.close).toHaveBeenCalledWith(fakeResponse);
  }));

  it('debe cargar archivos en ngOnInit', fakeAsync(() => {
    prestamosService.listadoArchivosCliente.and.returnValue(
      of([
        { id_tdocadjunto: 1, nombrearchivo: 'archivo1.png' },
        { id_tdocadjunto: 2, nombrearchivo: 'archivo2.pdf' }
      ])
    );

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
    const fakeImage = {
      imageAsDataUrl: 'data:image/png;base64,fakeimage'
    } as WebcamImage;
    component.handleImage(fakeImage);
    expect(component.listaArchivos[component.currentIndexImage]).toBe(
      'data:image/png;base64,fakeimage'
    );
  });

  it('debe actualizar deviceId al cambiar cámara', () => {
    component.cameraWasSwitched('new-camera-id');
    expect(component.deviceId).toBe('new-camera-id');
  });

  it('debe emitir triggerSnapshot correctamente', (done) => {
    component.triggerObservable.subscribe(() => {
      expect(true).toBeTruthy();
      done();
    });
    component.triggerSnapshot(0);
  });

  it('debe emitir nextWebcam correctamente', (done) => {
    component.nextWebcamObservable.subscribe((value) => {
      expect(value).toBe('next-device');
      done();
    });
    component.showNextWebcam('next-device');
  });

  it('debe validar extensión de archivo correctamente', () => {
    const ext = component.validateExtension('documento.pdf');
    expect(ext).toBe('pdf');
  });

  it('isBase64 debe retornar true para string base64 válido y false para inválido', () => {
    const valido = btoa('hola');
    expect(component.isBase64(valido)).toBe(true);
    expect(component.isBase64('@@@no-base64@@@')).toBe(false);
  });

  it('limpiarFirma debe limpiar pad y resetear firma en lista', fakeAsync(() => {
    component.editFirmar = false;
    component.listaArchivos[3] = 'firma.png';
    component.signaturePad = {
      clear: jasmine.createSpy('clear')
    } as any;

    component.limpiarFirma();
    tick();

    expect(component.editFirmar).toBe(true);
    expect(component.listaArchivos[3]).toBe('');
    expect(component.signaturePad.clear).toHaveBeenCalled();
    flush();
  }));

  it('onFileChange debe limpiar estado cuando no hay archivos', () => {
    component.listaArchivos[5] = 'algo';
    component.selectedFileNames[5] = 'algo.pdf';

    component.onFileChange([] as any, 5);

    expect(component.selectedFileNames[5]).toBe('');
    expect(component.listaArchivos[5]).toBe('');
    expect(component.listaTipoDoc[5]).toBe(5);
  });

  it('onFileChange debe delegar a preview cuando sí hay archivo', () => {
    const file = new File(['x'], 'archivo.pdf', { type: 'application/pdf' });
    const previewSpy = spyOn(component, 'preview');

    component.onFileChange([file] as any, 4);

    expect(component.selectedFileNames[4]).toBe('archivo.pdf');
    expect(previewSpy).toHaveBeenCalledWith([file] as any, 4);
  });

  it('clearSelectedFile debe limpiar nombre, archivo y mensaje', () => {
    component.listaArchivos[2] = 'doc';
    component.selectedFileNames[2] = 'doc.pdf';
    component.message = 'error';

    component.clearSelectedFile(2);

    expect(component.listaArchivos[2]).toBe('');
    expect(component.selectedFileNames[2]).toBe('');
    expect(component.listaTipoDoc[2]).toBe(2);
    expect(component.message).toBe('');
  });

  it('getSelectedFileName debe retornar valor por defecto cuando no hay archivo', () => {
    expect(component.getSelectedFileName(99)).toBe(
      'Ningún archivo seleccionado'
    );
    component.selectedFileNames[99] = 'archivo.png';
    expect(component.getSelectedFileName(99)).toBe('archivo.png');
  });

  it('isPdfFile debe evaluar correctamente data/pdf, nombre pdf y valores no string', () => {
    component.listaArchivos[1] = 'data:application/pdf;base64,abc';
    component.listaArchivos[2] = 'https://server.com/documento.PDF';
    component.listaArchivos[3] = 123 as any;

    expect(component.isPdfFile(1)).toBe(true);
    expect(component.isPdfFile(2)).toBe(true);
    expect(component.isPdfFile(3)).toBe(false);
    expect(component.isPdfFile(4)).toBe(false);
  });

  it('toggleWebcam debe cambiar el estado showWebcam', () => {
    const estadoInicial = component.showWebcam;
    component.toggleWebcam();
    expect(component.showWebcam).toBe(!estadoInicial);
  });

  it('validateExtension debe retornar undefined para nombre vacío o nulo', () => {
    expect(component.validateExtension('')).toBeUndefined();
    expect(component.validateExtension(null)).toBeUndefined();
  });

  it('debe manejar correctamente la carga de archivos válidos', () => {
    const file = new File(['img'], 'test.png', { type: 'image/png' });
    const readerSpy = jasmine.createSpyObj('FileReader', ['readAsDataURL']);
    (window as any).FileReader = function () {
      this.readAsDataURL = readerSpy.readAsDataURL;
      this.onload = null;
    };
    component.preview([file], 0);
    expect(component.message).toBeUndefined();
  });

  it('debe manejar correctamente la carga de archivos inválidos', () => {
    const file = new File(['doc'], 'test.txt', { type: 'text/plain' });
    component.preview([file], 0);
    expect(component.message).toBe(
      'Solo se Aceptan, Imagenes o Documentos PDF.'
    );
  });
});
