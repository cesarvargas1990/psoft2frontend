import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarFormapagoComponent } from './editar-formapago.component';

describe('EditarFormapagoComponent', () => {
  let component: EditarFormapagoComponent;
  let fixture: ComponentFixture<EditarFormapagoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditarFormapagoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditarFormapagoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
