import { TestBed } from '@angular/core/testing';
import { SessionStateService } from './session-state.service';

describe('SessionStateService', () => {
  let service: SessionStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SessionStateService);
    localStorage.clear();
  });

  it('should parse nested menu json from localStorage', () => {
    const menu = [
      { displayName: 'Dashboard', iconName: 'dashboard', route: 'dashboard' }
    ];
    localStorage.setItem('menu_usuario', JSON.stringify(JSON.stringify(menu)));

    expect(service.getMenuItems().length).toBe(1);
    expect(service.getMenuItems()[0].displayName).toBe('Dashboard');
  });

  it('should parse permissions and validate access', () => {
    localStorage.setItem('permisos', JSON.stringify(['clientes.listar']));

    expect(service.getPermissions()).toEqual(['clientes.listar']);
    expect(service.hasPermission('clientes.listar')).toBe(true);
    expect(service.hasPermission('clientes.crear')).toBe(false);
  });
});
