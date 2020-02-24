import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdicionarPrefijoComponent } from './adicionar-prefijo.component';

describe('AdicionarPrefijoComponent', () => {
  let component: AdicionarPrefijoComponent;
  let fixture: ComponentFixture<AdicionarPrefijoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdicionarPrefijoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdicionarPrefijoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
