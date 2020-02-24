import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrefijosEmpresaProvComponent } from './prefijos-empresa-prov.component';

describe('PrefijosEmpresaProvComponent', () => {
  let component: PrefijosEmpresaProvComponent;
  let fixture: ComponentFixture<PrefijosEmpresaProvComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrefijosEmpresaProvComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrefijosEmpresaProvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
