import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarEmpresaprovFeComponent } from './editar-empresaprov-fe.component';

describe('EditarEmpresaprovFeComponent', () => {
  let component: EditarEmpresaprovFeComponent;
  let fixture: ComponentFixture<EditarEmpresaprovFeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditarEmpresaprovFeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditarEmpresaprovFeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
