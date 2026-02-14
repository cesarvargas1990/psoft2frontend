import {
  async,
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
  flush,
  discardPeriodicTasks
} from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, ElementRef, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { EmpresaParametrosComponent } from './empresa-parametros.component';

import { AuthService } from '../../../_services/auth.service';
import { NavService } from '../../../_services/nav.service';
import { EmpresaService } from '../../../_services/empresa/empresa.service';
import { MediaMatcher } from '@angular/cdk/layout';
import { of } from 'rxjs';
import Swal from 'sweetalert2';

class MockAuthService {
  isLoggedIn() {
    return true;
  }

  tienePermiso(_permiso: string): boolean {
    return true;
  }
}

class MockNavService {
  appDrawer: ElementRef;
}

class MockEmpresaService {
  getEmpresa() {
    return of({
      nombre: 'Mi Empresa',
      nitempresa: '123456789',
      vlr_capinicial: 100000,
      email: 'empresa@test.com',
      pagina: 'www.miempresa.com',
      telefono: '1234567890',
      ciudad: 'Bogotá',
      ddirec: 'Calle 123',
      firma: 'https://api.demo.com/firma.png'
    });
  }

  subirArchivoFirma() {
    return of({ nombrearchivo: '1-1770937470.png' });
  }

  actualizarDatosEmpresa() {
    return of(true);
  }
}

class MockRouter {
  navigate(_path: string[]) {
    return;
  }
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

describe('EmpresaParametrosComponent', () => {
  let component: EmpresaParametrosComponent;
  let fixture: ComponentFixture<EmpresaParametrosComponent>;
  let empresaService: EmpresaService;

  beforeEach(async(() => {
    localStorage.setItem(
      'menu_usuario',
      JSON.stringify([{ displayName: 'Test', iconName: 'test' }])
    );
    localStorage.setItem('permisos', JSON.stringify(['ver_empresa']));

    TestBed.configureTestingModule({
      declarations: [EmpresaParametrosComponent],
      providers: [
        { provide: AuthService, useClass: MockAuthService },
        { provide: NavService, useClass: MockNavService },
        { provide: EmpresaService, useClass: MockEmpresaService },
        { provide: Router, useClass: MockRouter },
        { provide: MediaMatcher, useClass: MockMediaMatcher }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmpresaParametrosComponent);
    component = fixture.componentInstance;
    empresaService = TestBed.get(EmpresaService);
    fixture.detectChanges();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debe cargar datos de empresa y configurar campos', fakeAsync(() => {
    component.ngOnInit();
    tick(200);
    fixture.detectChanges();
    expect(component.datosEmpresa.nombre).toBe('Mi Empresa');
    expect(component.firmaPreview).toBe('https://api.demo.com/firma.png');
    expect(component.fields.length).toBeGreaterThan(0);
  }));

  it('debe llamar actualizarDatosEmpresa cuando el formulario es válido', fakeAsync(() => {
    const spy = spyOn(
      empresaService,
      'actualizarDatosEmpresa'
    ).and.callThrough();
    const swalSpy = spyOn(Swal, 'fire').and.returnValue(
      Promise.resolve({ value: true }) as any
    );

    component.ngOnInit();
    tick(200);
    fixture.detectChanges();

    const patch = {
      nombre: 'Mi Empresa',
      nit: '123456789',
      vlr_capinicial: 100000,
      email: 'empresa@test.com',
      pagina: 'www.miempresa.com',
      telefono: '1234567890',
      ciudad: 'Bogotá',
      ddirec: 'Calle 123'
    };

    component.form.patchValue(patch);
    fixture.detectChanges();

    component.submit();

    expect(spy).toHaveBeenCalledWith(
      jasmine.objectContaining({
        firma: 'https://api.demo.com/firma.png'
      })
    );
    expect(swalSpy).toHaveBeenCalled();

    // ✅ Limpia timers de Angular Material, Formly o animaciones internas
    flush();
    discardPeriodicTasks();
  }));

  it('no debe llamar actualizarDatosEmpresa si el formulario no es válido', () => {
    const spy = spyOn(empresaService, 'actualizarDatosEmpresa');
    const swalSpy = spyOn(Swal, 'fire');
    component.form.setErrors({ invalid: true });

    component.submit();

    expect(spy).not.toHaveBeenCalled();
    expect(swalSpy).toHaveBeenCalled();
  });

  it('debe navegar al dashboard cuando se llama volver()', () => {
    const router = TestBed.get(Router) as Router;
    const navSpy = spyOn(router, 'navigate');

    component.volver();

    expect(navSpy).toHaveBeenCalledWith(['dashboard']);
  });

  it('debe remover event listener con removeEventListener si existe', () => {
    component.mobileQuery = {
      removeEventListener: jasmine.createSpy('removeEventListener'),
      addEventListener: jasmine.createSpy('addEventListener'),
      removeListener: jasmine.createSpy('removeListener'),
      addListener: jasmine.createSpy('addListener')
    } as any;

    component.ngOnInit();

    expect(component.mobileQuery.removeEventListener).toHaveBeenCalled();
  });

  it('debe remover event listener con removeListener si no existe removeEventListener', () => {
    component.mobileQuery = {
      removeListener: jasmine.createSpy('removeListener'),
      addListener: jasmine.createSpy('addListener')
    } as any;

    component.ngOnInit();

    expect(component.mobileQuery.removeListener).toHaveBeenCalled();
  });

  it('no debe mostrar Swal de éxito cuando actualizarDatosEmpresa responde falsy', () => {
    spyOn(empresaService, 'actualizarDatosEmpresa').and.returnValue(of(null));
    const swalSpy = spyOn(Swal, 'fire');
    component.form.setErrors(null);
    component.submit();
    expect(swalSpy).not.toHaveBeenCalled();
  });

  it('debe usar addEventListener cuando media lo soporta', () => {
    const mediaMatcher = {
      matchMedia: (_query: string) => ({
        matches: false,
        addEventListener: jasmine.createSpy('addEventListener')
      })
    } as unknown as MediaMatcher;
    const changeDetectorRef = {
      detectChanges: jasmine.createSpy('detectChanges')
    } as unknown as ChangeDetectorRef;

    const cmp = new EmpresaParametrosComponent(
      TestBed.get(AuthService),
      TestBed.get(NavService),
      changeDetectorRef,
      mediaMatcher,
      TestBed.get(Router),
      TestBed.get(EmpresaService)
    );
    const mediaQuery = (cmp as any).mobileQuery;
    expect(mediaQuery.addEventListener).toHaveBeenCalled();
  });

  it('debe actualizar la previsualización de firma al cargar imagen válida', () => {
    const file = new File(['firma'], 'firma.png', { type: 'image/png' });
    const fakeReader: any = {
      result: 'data:image/png;base64,abc',
      readAsDataURL(_f: File) {},
      onload: () => {}
    };
    spyOn(globalThis as any, 'FileReader').and.returnValue(fakeReader);

    component.previewFirma([file] as unknown as FileList);
    fakeReader.onload();

    expect(component.firmaPreview).toBe('data:image/png;base64,abc');
    expect(component.firmaMensaje).toBe('');
  });

  it('debe mostrar mensaje al cargar archivo inválido para firma', () => {
    const file = new File(['texto'], 'firma.txt', { type: 'text/plain' });

    component.previewFirma([file] as unknown as FileList);

    expect(component.firmaMensaje).toBe('Solo se aceptan imágenes.');
  });

  it('debe subir firma y guardar solo la ruta cuando se actualiza la firma', fakeAsync(() => {
    const uploadSpy = spyOn(
      empresaService,
      'subirArchivoFirma'
    ).and.returnValue(of({ nombrearchivo: '1-1770937470.png' }));
    const updateSpy = spyOn(
      empresaService,
      'actualizarDatosEmpresa'
    ).and.callThrough();

    component.firmaBase64 = 'data:image/png;base64,abc';
    component.firmaCambiada = true;

    component.submit();
    tick();

    expect(uploadSpy).toHaveBeenCalled();
    expect(updateSpy).toHaveBeenCalledWith(
      jasmine.objectContaining({
        firma: 'upload/documentosAdjuntos/1-1770937470.png'
      })
    );
  }));

  it('no debe actualizar empresa si upload no retorna nombre de archivo', fakeAsync(() => {
    const uploadSpy = spyOn(
      empresaService,
      'subirArchivoFirma'
    ).and.returnValue(of({ path: './upload/documentosAdjuntos/' }));
    const updateSpy = spyOn(empresaService, 'actualizarDatosEmpresa');
    const swalSpy = spyOn(Swal, 'fire');

    component.firmaBase64 = 'data:image/png;base64,abc';
    component.firmaCambiada = true;

    component.submit();
    tick();

    expect(uploadSpy).toHaveBeenCalled();
    expect(updateSpy).not.toHaveBeenCalled();
    expect(swalSpy).toHaveBeenCalled();
  }));
});
