import { Injectable } from '@angular/core';
import { NavItem } from '../../_models/nav-item';
import {
  extractNavItemsFromUnknown,
  extractStringArrayFromUnknown,
  parseNestedJson
} from './nav-menu.mapper';

@Injectable({
  providedIn: 'root'
})
export class SessionStateService {
  getMenuItems(): NavItem[] {
    return extractNavItemsFromUnknown(localStorage.getItem('menu_usuario'));
  }

  getPermissions(): string[] {
    return extractStringArrayFromUnknown(localStorage.getItem('permisos'));
  }

  hasPermission(permission: string): boolean {
    return this.getPermissions().includes(permission);
  }

  parseStoredJson<T = unknown>(key: string, fallback: T): T {
    const value = localStorage.getItem(key);
    if (value === null) {
      return fallback;
    }

    const parsed = parseNestedJson(value);
    return (parsed as T) ?? fallback;
  }
}
