import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { CrearClienteComponent } from './crear-cliente.component';

import { AuthService } from '../../../_services/auth.service';
import { ClienteService } from '../../../_services/cliente/cliente.service';
import { NavService } from '../../../_services/nav.service';
import { TipodocidentiService } from '../../../_services/tipodocidenti/tipodocidenti.service';
import { UsersService } from '../../../_services/users/users.service';
import { PrestamosService } from '../../../_services/prestamos/prestamos.service';
import { MediaMatcher } from '@angular/cdk/layout';

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
        { provide: MediaMatcher, useClass: MockMediaMatcher },
      ],
      schemas: [NO_ERRORS_SCHEMA] // Ignora errores de plantilla por componentes como ngx-webcam, formly, signature-pad, etc.
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrearClienteComponent);
    component = fixture.componentInstance;
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
});
