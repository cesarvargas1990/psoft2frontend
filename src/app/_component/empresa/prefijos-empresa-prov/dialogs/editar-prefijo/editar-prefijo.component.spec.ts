import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarPrefijoComponent } from './editar-prefijo.component';

describe('EditarPrefijoComponent', () => {
  let component: EditarPrefijoComponent;
  let fixture: ComponentFixture<EditarPrefijoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditarPrefijoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditarPrefijoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
