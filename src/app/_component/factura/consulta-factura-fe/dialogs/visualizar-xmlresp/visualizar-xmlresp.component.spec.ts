import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualizarXmlrespComponent } from './visualizar-xmlresp.component';

describe('VisualizarXmlrespComponent', () => {
  let component: VisualizarXmlrespComponent;
  let fixture: ComponentFixture<VisualizarXmlrespComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisualizarXmlrespComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisualizarXmlrespComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
