import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualizarLogComponent } from './visualizar-log.component';

describe('VisualizarLogComponent', () => {
  let component: VisualizarLogComponent;
  let fixture: ComponentFixture<VisualizarLogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisualizarLogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisualizarLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
