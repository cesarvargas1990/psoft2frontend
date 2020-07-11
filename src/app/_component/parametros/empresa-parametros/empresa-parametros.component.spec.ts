import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpresaParametrosComponent } from './empresa-parametros.component';

describe('EmpresaParametrosComponent', () => {
  let component: EmpresaParametrosComponent;
  let fixture: ComponentFixture<EmpresaParametrosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmpresaParametrosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmpresaParametrosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
