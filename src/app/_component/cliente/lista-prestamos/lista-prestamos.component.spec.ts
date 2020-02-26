import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaPrestamosComponent } from './lista-prestamos.component';

describe('ListaPrestamosComponent', () => {
  let component: ListaPrestamosComponent;
  let fixture: ComponentFixture<ListaPrestamosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListaPrestamosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaPrestamosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
