import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EdicionarPrefijoComponent } from './edicionar-prefijo.component';

describe('EdicionarPrefijoComponent', () => {
  let component: EdicionarPrefijoComponent;
  let fixture: ComponentFixture<EdicionarPrefijoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EdicionarPrefijoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EdicionarPrefijoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
