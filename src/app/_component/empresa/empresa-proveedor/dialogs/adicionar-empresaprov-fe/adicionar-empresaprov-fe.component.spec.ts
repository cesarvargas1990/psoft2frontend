import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdicionarEmpresaprovFeComponent } from './adicionar-empresaprov-fe.component';

describe('AdicionarEmpresaprovFeComponent', () => {
  let component: AdicionarEmpresaprovFeComponent;
  let fixture: ComponentFixture<AdicionarEmpresaprovFeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdicionarEmpresaprovFeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdicionarEmpresaprovFeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
