import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpresaProveedorComponent } from './empresa-proveedor.component';

describe('EmpresaProveedorComponent', () => {
  let component: EmpresaProveedorComponent;
  let fixture: ComponentFixture<EmpresaProveedorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmpresaProveedorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmpresaProveedorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
