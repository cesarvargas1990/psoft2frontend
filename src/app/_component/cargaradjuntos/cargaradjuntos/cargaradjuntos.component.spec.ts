import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CargaradjuntosComponent } from './cargaradjuntos.component';

describe('CargaradjuntosComponent', () => {
  let component: CargaradjuntosComponent;
  let fixture: ComponentFixture<CargaradjuntosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CargaradjuntosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CargaradjuntosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
