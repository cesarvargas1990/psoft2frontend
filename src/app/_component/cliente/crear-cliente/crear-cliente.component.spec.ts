import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { CrearClienteComponent } from './crear-cliente.component';
import { of } from 'rxjs';
import { AuthService } from '../../../_services/auth.service';
import { ClienteService } from '../../../_services/cliente/cliente.service';
import { NavService } from '../../../_services/nav.service';
import { TipodocidentiService } from '../../../_services/tipodocidenti/tipodocidenti.service';
import { UsersService } from '../../../_services/users/users.service';
import { PrestamosService } from '../../../_services/prestamos/prestamos.service';
import { MediaMatcher } from '@angular/cdk/layout';
import Swal from 'sweetalert2';
import { MatDialogRef } from '@angular/material/dialog';
// =======================
// 🧪 Mock Services
// =======================

class MockAuthService {
  isLoggedIn() {
    return true;
  }
}
class MockClienteService {
  saveCliente() {
    return { subscribe: () => {} };
  }
  uploadFile() {
    return { subscribe: () => {} };
  }
}
class MockNavService {
  appDrawer: ElementRef;
}
class MockTipodocidentiService {
  getTipodocidenti() {
    return [];
  }
}
class MockUsersService {
  getUsers() {
    return [];
  }
}
class MockPrestamosService {
  listaTiposDocumento() {
    return { subscribe: () => {} };
  }
}
class MockRouter {
  navigate(path) {}
}
class MockMediaMatcher {
  matchMedia(query: string) {
    return {
      matches: false,
      addListener: () => {},
      removeListener: () => {}
    };
  }
}

describe('CrearClienteComponent', () => {
  let component: CrearClienteComponent;
  let fixture: ComponentFixture<CrearClienteComponent>;
  let clienteService: ClienteService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CrearClienteComponent],
      providers: [
        { provide: AuthService, useClass: MockAuthService },
        { provide: ClienteService, useClass: MockClienteService },
        { provide: NavService, useClass: MockNavService },
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
    fixture = TestBed.createComponent(CrearClienteComponent);
    component = fixture.componentInstance;
    clienteService = TestBed.get(ClienteService);
    fixture.detectChanges();
  });

  it('debe crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('debe tener tabs inicializados', () => {
    expect(component.tabs.length).toBeGreaterThan(0);
  });

  it('debe tener showWebcam activado por defecto', () => {
    expect(component.showWebcam).toBe(true);
  });

  it('debe alternar el estado de la webcam', () => {
    const estadoInicial = component.showWebcam;
    component.toggleWebcam();
    expect(component.showWebcam).toBe(!estadoInicial);
  });

  it('debe manejar errores de cámara correctamente', () => {
    const fakeError = { message: 'No se pudo iniciar webcam' } as any;
    component.handleInitError(fakeError);
    expect(component.errors.length).toBeGreaterThan(0);
  });

  it('debe actualizar deviceId al cambiar cámara', () => {
    component.cameraWasSwitched('device123');
    expect(component.deviceId).toBe('device123');
  });

  it('debe emitir triggerSnapshot', (done) => {
    component.triggerObservable.subscribe(() => {
      expect(true).toBe(true);
      done();
    });
    component.triggerSnapshot(0);
  });

  it('debe emitir cambio de webcam', (done) => {
    component.nextWebcamObservable.subscribe((val) => {
      expect(val).toBe('testDevice');
      done();
    });
    component.showNextWebcam('testDevice');
  });

  it('debe limpiar firma y cambiar flag', () => {
    component.sign = true;
    component.signaturePad = {
      clear: () => {}
    } as any;
    spyOn(component.signaturePad, 'clear');
    component.drawClear();
    expect(component.sign).toBe(false);
    expect(component.signaturePad.clear).toHaveBeenCalled();
  });

  it('debe establecer sign como true cuando se inicia o completa el trazo', () => {
    component.sign = false;
    component.drawStart();
    expect(component.sign).toBe(true);
    component.sign = false;
    component.drawComplete();
    expect(component.sign).toBe(true);
  });

  it('debe cargar tipos de documento en ngAfterViewInit', async(() => {
    spyOn(component, 'tiposDocumentos').and.callThrough();
    component.ngAfterViewInit();
    expect(component.tiposDocumentos).toHaveBeenCalled();
  }));

  it('debe cargar archivo al previsualizar imagen válida', () => {
    const file = new Blob([''], { type: 'image/png' });
    const mockFileList = {
      length: 1,
      0: file
    };

    const fileReaderSpy = spyOn(window as any, 'FileReader').and.returnValue({
      readAsDataURL: () => {},
      onload: () => {}
    });

    component.preview(mockFileList as any, 0);
    expect(fileReaderSpy).toHaveBeenCalled();
  });

  it('debe rechazar archivos con tipo no soportado', () => {
    const file = new Blob([''], { type: 'text/plain' });
    const mockFileList = {
      length: 1,
      0: file
    };
    component.preview(mockFileList as any, 0);
    expect(component.message).toBe(
      'Solo se Aceptan, Imagenes o Documentos PDF.'
    );
  });

  it('debe validar extensión de archivo', () => {
    const ext = component.validateExtension('documento.pdf');
    expect(ext).toBe('pdf');
  });

  it('debe retornar undefined en validateExtension para nombre vacío o nulo', () => {
    expect(component.validateExtension('')).toBeUndefined();
    expect(component.validateExtension(null)).toBeUndefined();
  });

  it('onFileChange debe limpiar selección cuando no llegan archivos', () => {
    component.listaArchivos[0] = 'x';
    component.selectedFileNames[0] = 'x.png';

    component.onFileChange([] as any, 0, 2);

    expect(component.listaArchivos[0]).toBe('');
    expect(component.selectedFileNames[0]).toBe('');
    expect(component.listaTipoDoc[0]).toBe(2);
  });

  it('onFileChange debe delegar a preview cuando llega archivo válido', () => {
    const file = new File(['pdf'], 'archivo.pdf', { type: 'application/pdf' });
    const previewSpy = spyOn(component, 'preview');

    component.onFileChange([file] as any, 1, 5);

    expect(component.selectedFileNames[1]).toBe('archivo.pdf');
    expect(previewSpy).toHaveBeenCalledWith([file] as any, 1);
  });

  it('clearSelectedFile debe limpiar archivo, nombre y mensaje', () => {
    component.listaArchivos[2] = 'archivo';
    component.selectedFileNames[2] = 'archivo.pdf';
    component.message = 'error';

    component.clearSelectedFile(2);

    expect(component.listaArchivos[2]).toBe('');
    expect(component.selectedFileNames[2]).toBe('');
    expect(component.message).toBe('');
  });

  it('isPdfFile y getSelectedFileName deben responder correctamente', () => {
    component.listaArchivos[0] = 'data:application/pdf;base64,abc';
    component.listaArchivos[1] = 'data:image/png;base64,abc';
    component.selectedFileNames[7] = 'doc.pdf';

    expect(component.isPdfFile(0)).toBe(true);
    expect(component.isPdfFile(1)).toBe(false);
    expect(component.isPdfFile(2)).toBe(false);
    expect(component.getSelectedFileName(7)).toBe('doc.pdf');
    expect(component.getSelectedFileName(8)).toBe('Ningún archivo seleccionado');
  });

  it('debe navegar al dashboard al llamar volver()', () => {
    const router = TestBed.get(Router);
    spyOn(router, 'navigate');
    component.volver();
    expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('debe ejecutar submit correctamente con firma y archivos', async () => {
    component.form = { valid: true } as any;
    component.model = {};
    component.sign = true;
    component.signaturePad = {
      toDataURL: () => 'data:image/png;base64,firma'
    } as any;
    component.listaArchivos = ['data:image/png;base64,archivo'];
    component.listaTipoDoc = [3];

    // 👇 Mock que garantiza que response.id esté definido
    spyOn(clienteService, 'saveCliente').and.returnValue(of({ id: 123 }));

    const uploadSpy = spyOn(clienteService, 'uploadFile').and.returnValue(
      of({ status: 'ok' })
    );

    spyOn(Swal, 'fire').and.returnValue(Promise.resolve({ value: true }));

    component.submit();
    await fixture.whenStable();

    expect(clienteService.saveCliente).toHaveBeenCalled();
    expect(uploadSpy).toHaveBeenCalled();
  });

  it('no debe subir archivos si el usuario no confirma alerta de éxito', async () => {
    component.form = { valid: true } as any;
    component.model = {};
    component.sign = true;
    component.signaturePad = {
      toDataURL: () => 'data:image/png;base64,firma'
    } as any;
    component.listaArchivos = ['data:image/png;base64,archivo'];
    component.listaTipoDoc = [3];

    spyOn(clienteService, 'saveCliente').and.returnValue(of({ id: 123 }));
    const uploadSpy = spyOn(clienteService, 'uploadFile').and.returnValue(
      of({ status: 'ok' })
    );
    spyOn(Swal, 'fire').and.returnValue(Promise.resolve({ value: false }));

    component.submit();
    await fixture.whenStable();

    expect(uploadSpy).not.toHaveBeenCalled();
  });

  it('no debe continuar flujo de éxito si saveCliente responde null', async () => {
    component.form = { valid: true } as any;
    spyOn(clienteService, 'saveCliente').and.returnValue(of(null));
    const swalSpy = spyOn(Swal, 'fire');

    component.submit();
    await fixture.whenStable();

    expect(swalSpy).not.toHaveBeenCalled();
  });

  it('volver debe cerrar dialogo en modo dialog', () => {
    const dialogRefSpy = { close: jasmine.createSpy('close') };
    const router = TestBed.get(Router);
    const routerSpy = spyOn(router, 'navigate');
    const mediaMatcher = {
      matchMedia: (_q: string) => ({
        matches: false,
        addEventListener: () => {},
        removeEventListener: () => {}
      })
    } as any;

    const dialogComponent = new CrearClienteComponent(
      TestBed.get(AuthService),
      TestBed.get(NavService),
      TestBed.get(ClienteService),
      { detectChanges: () => {} } as any,
      mediaMatcher,
      router,
      TestBed.get(TipodocidentiService),
      TestBed.get(UsersService),
      TestBed.get(PrestamosService),
      dialogRefSpy as unknown as MatDialogRef<CrearClienteComponent>,
      { fromDialog: true }
    );

    dialogComponent.volver();

    expect(dialogRefSpy.close).toHaveBeenCalled();
    expect(routerSpy).not.toHaveBeenCalled();
  });

  it('no debe ejecutar submit si el formulario es inválido', () => {
    component.form = { valid: false } as any;
    spyOn(Swal, 'fire');
    component.submit();
    expect(Swal.fire).toHaveBeenCalledWith({
      type: 'error',
      title: 'Error',
      text: 'Por favor valide los campos obligatorios, para guardar el cliente.'
    });
  });
});
