import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, ElementRef } from '@angular/core';
import { AppComponent } from './app.component';
import { NavService } from './_services/nav.service';
import { AuthService } from './_services/auth.service';

// Mock NavService
class MockNavService {
  appDrawer: ElementRef;
}

// Mock AuthService
class MockAuthService {}

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let navService: MockNavService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AppComponent],
      providers: [
        { provide: NavService, useClass: MockNavService },
        { provide: AuthService, useClass: MockAuthService }
      ],
      schemas: [NO_ERRORS_SCHEMA] // evita errores por componentes o directivas no declaradas
    }).compileComponents();
  }));

  beforeEach(() => {
    // Setear localStorage antes de crear el componente
    localStorage.setItem('menu_usuario', JSON.stringify([
      {
        displayName: 'Dashboard',
        iconName: 'dashboard',
        route: '/dashboard',
        disabled: false,
        children: []
      }
    ]));

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    navService = TestBed.get(NavService);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debe tener navItems cargados desde localStorage', () => {
    expect(component.navItems[0]).toEqual(jasmine.objectContaining({
      displayName: 'Dashboard',
      iconName: 'dashboard',
      route: '/dashboard',
      disabled: false,
      children: []
    }));
  });

  it('debe asignar el appDrawer al navService en ngAfterViewInit', () => {
    const fakeRef = new ElementRef(document.createElement('div'));
    component.appDrawer = fakeRef;

    component.ngAfterViewInit();

    expect(navService.appDrawer).toBe(fakeRef);
  });
});
