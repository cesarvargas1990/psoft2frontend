import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultaFacturaFEComponent } from './consulta-factura-fe.component';

describe('ConsultaFacturaFEComponent', () => {
  let component: ConsultaFacturaFEComponent;
  let fixture: ComponentFixture<ConsultaFacturaFEComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsultaFacturaFEComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultaFacturaFEComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
