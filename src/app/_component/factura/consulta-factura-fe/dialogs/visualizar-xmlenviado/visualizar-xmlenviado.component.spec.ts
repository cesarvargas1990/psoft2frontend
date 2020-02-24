import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualizarXmlenviadoComponent } from './visualizar-xmlenviado.component';

describe('VisualizarXmlenviadoComponent', () => {
  let component: VisualizarXmlenviadoComponent;
  let fixture: ComponentFixture<VisualizarXmlenviadoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisualizarXmlenviadoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisualizarXmlenviadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
