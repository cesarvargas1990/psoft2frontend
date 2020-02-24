import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EliminarEmpresaprovFeComponent } from './eliminar-empresaprov-fe.component';

describe('EliminarEmpresaprovFeComponent', () => {
  let component: EliminarEmpresaprovFeComponent;
  let fixture: ComponentFixture<EliminarEmpresaprovFeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EliminarEmpresaprovFeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EliminarEmpresaprovFeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
