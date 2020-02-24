import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualizarVsComponent } from './visualizar-vs.component';

describe('VisualizarVsComponent', () => {
  let component: VisualizarVsComponent;
  let fixture: ComponentFixture<VisualizarVsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisualizarVsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisualizarVsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
