import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MenuListItemComponent } from './menu-list-item.component';
import { RouterTestingModule } from '@angular/router/testing';
import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';
import { NavService } from '../../_services/nav.service';
import { BehaviorSubject } from 'rxjs';
import { NavItem } from '../../_models/nav-item';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';

@Component({ selector: 'app-menu-list-item', template: '' })
class DummyChildComponent {}

class MockNavService {
  currentUrl = new BehaviorSubject<string>('/dashboard');
  closeNav = jasmine.createSpy('closeNav');
}

describe('MenuListItemComponent', () => {
  let component: MenuListItemComponent;
  let fixture: ComponentFixture<MenuListItemComponent>;
  let router: Router;
  let navService: MockNavService;

  const mockItem: NavItem = {
    displayName: 'Dashboard',
    iconName: 'dashboard',
    route: 'dashboard',
    children: [],
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MenuListItemComponent],
      imports: [
        RouterTestingModule.withRoutes([]),
        NoopAnimationsModule,
        MatIconModule,
        MatListModule,
        BrowserAnimationsModule,
      ],
      providers: [{ provide: NavService, useClass: MockNavService }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuListItemComponent);
    component = fixture.componentInstance;
    router = TestBed.get(Router);
    navService = TestBed.get(NavService);
    component.item = mockItem;
    component.depth = 0;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería establecer expanded en true si la ruta coincide', () => {
    navService.currentUrl.next('/dashboard');
    expect(component.expanded).toBe(true);
    expect(component.ariaExpanded).toBe(true);
  });

  it('debería navegar y cerrar el nav si no tiene hijos', () => {
    const spyNavigate = spyOn(router, 'navigate');
    component.onItemSelected(mockItem);
    expect(spyNavigate).toHaveBeenCalledWith(['dashboard']);
    expect(navService.closeNav).toHaveBeenCalled();
  });

  it('debería alternar expansión si tiene hijos', () => {
    // Asegura que la ruta actual NO coincida con la del ítem
    navService.currentUrl.next('/otra-ruta');

    const itemWithChildren: NavItem = {
      displayName: 'Parent',
      iconName: 'folder',
      route: 'parent',
      children: [mockItem],
    };

    component.item = itemWithChildren;
    fixture.detectChanges();

    expect(component.expanded).toBe(false); // Asegura estado inicial
    component.onItemSelected(itemWithChildren);
    expect(component.expanded).toBe(true); // Verifica que se expanda correctamente
  });
});
