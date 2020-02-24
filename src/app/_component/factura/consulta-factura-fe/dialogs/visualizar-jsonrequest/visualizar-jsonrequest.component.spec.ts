import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualizarJsonrequestComponent } from './visualizar-jsonrequest.component';

describe('VisualizarJsonrequestComponent', () => {
  let component: VisualizarJsonrequestComponent;
  let fixture: ComponentFixture<VisualizarJsonrequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisualizarJsonrequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisualizarJsonrequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
