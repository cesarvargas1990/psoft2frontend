import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ListarClienteComponent } from './listar-cliente.component';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDividerModule } from '@angular/material/divider';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';
import { FormlyMaterialModule } from '@ngx-formly/material';
import { of } from 'rxjs';

import { ClienteService } from '../../../_services/cliente/cliente.service';
import { AuthService } from '../../../_services/auth.service';
import { NavService } from '../../../_services/nav.service';
import Swal from 'sweetalert2';
describe('ListarClienteComponent', () => {
  let component: ListarClienteComponent;
  let fixture: ComponentFixture<ListarClienteComponent>;
  let clienteServiceSpy: jasmine.SpyObj<ClienteService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    const clienteSpy = jasmine.createSpyObj('ClienteService', ['getAllClientes', 'deleteCliente']);
    const authSpy = jasmine.createSpyObj('AuthService', ['logout', 'isLoggedIn', 'tienePermiso']);
    const navSpy = jasmine.createSpyObj('NavService', ['dummyMethod']);
    (navSpy as any).appDrawer = null;

    await TestBed.configureTestingModule({
      declarations: [ListarClienteComponent],
      imports: [
        BrowserAnimationsModule,
        RouterTestingModule,
        HttpClientTestingModule,
        MatDialogModule,
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        MatSidenavModule,
        MatButtonModule,
        MatTabsModule,
        MatExpansionModule,
        MatDividerModule,
        ReactiveFormsModule,
        FormsModule,
        FormlyModule.forRoot(),
        FormlyMaterialModule
      ],
      providers: [
        { provide: ClienteService, useValue: clienteSpy },
        { provide: AuthService, useValue: authSpy },
        { provide: NavService, useValue: navSpy }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(ListarClienteComponent);
    component = fixture.componentInstance;

    clienteServiceSpy = TestBed.get(ClienteService) as jasmine.SpyObj<ClienteService>;
    authServiceSpy = TestBed.get(AuthService) as jasmine.SpyObj<AuthService>;

    authServiceSpy.isLoggedIn.and.returnValue(true);
    authServiceSpy.tienePermiso.and.returnValue(true);
    clienteServiceSpy.getAllClientes.and.returnValue(of([]));

    fixture.detectChanges();
  });

  it('debería crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('debería aplicar filtro correctamente', () => {
    const testData = [{ nomcliente: 'Juan' }];
    component.dataSource.data = testData;
    component.applyFilter('Juan');
    expect(component.dataSource.filter).toBe('juan');
  });

  it('debería obtener datos de cliente al inicializar', fakeAsync(() => {
    clienteServiceSpy.getAllClientes.and.returnValue(of([{ nomcliente: 'Prueba' }]));
    component.getDatosCliente();
    tick();
    expect(component.dataSource.data.length).toBe(1);
    expect(component.dataSource.data[0].nomcliente).toBe('Prueba');
  }));

  it('debería eliminar un cliente si se confirma', async () => {
    // Simula la confirmación positiva de SweetAlert2
    spyOn(Swal, 'fire').and.returnValue(Promise.resolve({ value: true }));
  
    clienteServiceSpy.deleteCliente.and.returnValue(of({}));
    clienteServiceSpy.getAllClientes.and.returnValue(of([]));
  
    component.modalEliminarCliente({ id: 1 });
  
    // Espera que el flujo de la promesa y el change detection terminen
    await fixture.whenStable();
  
    expect(clienteServiceSpy.deleteCliente).toHaveBeenCalled();
  });
});
