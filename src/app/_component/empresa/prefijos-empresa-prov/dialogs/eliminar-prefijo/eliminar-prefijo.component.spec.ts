import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EliminarPrefijoComponent } from './eliminar-prefijo.component';

describe('EliminarPrefijoComponent', () => {
  let component: EliminarPrefijoComponent;
  let fixture: ComponentFixture<EliminarPrefijoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EliminarPrefijoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EliminarPrefijoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
