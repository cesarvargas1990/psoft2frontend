import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualizarEstadoDocumentoComponent } from './visualizar-estado-documento.component';

describe('VisualizarEstadoDocumentoComponent', () => {
  let component: VisualizarEstadoDocumentoComponent;
  let fixture: ComponentFixture<VisualizarEstadoDocumentoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisualizarEstadoDocumentoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisualizarEstadoDocumentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
