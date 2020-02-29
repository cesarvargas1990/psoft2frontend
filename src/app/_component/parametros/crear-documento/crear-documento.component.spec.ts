import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearFormapagoComponent } from './crear-formapago.component';

describe('CrearFormapagoComponent', () => {
  let component: CrearFormapagoComponent;
  let fixture: ComponentFixture<CrearFormapagoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrearFormapagoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrearFormapagoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
