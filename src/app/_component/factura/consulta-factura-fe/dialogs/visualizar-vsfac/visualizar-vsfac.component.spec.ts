import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualizarVsfacComponent } from './visualizar-vsfac.component';

describe('VisualizarVsfacComponent', () => {
  let component: VisualizarVsfacComponent;
  let fixture: ComponentFixture<VisualizarVsfacComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisualizarVsfacComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisualizarVsfacComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
