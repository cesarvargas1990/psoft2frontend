import { NavItem } from '../../_models/nav-item';

type UnknownRecord = Record<string, unknown>;

function asRecord(value: unknown): UnknownRecord | null {
  return value !== null && typeof value === 'object'
    ? (value as UnknownRecord)
    : null;
}

export function parseNestedJson(value: unknown): unknown {
  let currentValue = value;

  while (typeof currentValue === 'string') {
    const trimmed = currentValue.trim();
    if (!trimmed) {
      return [];
    }

    try {
      currentValue = JSON.parse(trimmed);
    } catch (_error) {
      return [];
    }
  }

  return currentValue;
}

export function pickText(candidates: unknown[]): string | null {
  for (const candidate of candidates) {
    if (typeof candidate === 'string') {
      const value = candidate.trim();
      if (value) {
        return value;
      }
    }
  }

  return null;
}

export function normalizeNavItem(value: unknown): NavItem | null {
  const raw = asRecord(value);
  if (!raw) {
    return null;
  }

  const displayName = pickText([
    raw['displayName'],
    raw['display_name'],
    raw['nombre'],
    raw['name'],
    raw['title'],
    raw['label']
  ]);

  if (!displayName) {
    return null;
  }

  const route = pickText([
    raw['route'],
    raw['path'],
    raw['url'],
    raw['link'],
    raw['ruta']
  ]);

  const iconName =
    pickText([raw['iconName'], raw['icon_name'], raw['icon'], raw['icono']]) ??
    'chevron_right';

  const rawChildren =
    raw['children'] ??
    raw['items'] ??
    raw['hijos'] ??
    raw['submenu'] ??
    raw['subMenu'];

  const children = Array.isArray(rawChildren)
    ? normalizeNavItems(rawChildren)
    : undefined;

  const item: NavItem = {
    displayName,
    iconName
  };

  if (route) {
    item.route = route;
  }

  if (typeof raw['disabled'] === 'boolean') {
    item.disabled = raw['disabled'];
  }

  if (Array.isArray(rawChildren)) {
    item.children = children;
  }

  return item;
}

export function normalizeNavItems(items: unknown[]): NavItem[] {
  return items
    .map((item) => normalizeNavItem(item))
    .filter((item): item is NavItem => item !== null);
}

export function extractNavItemsFromUnknown(value: unknown): NavItem[] {
  const parsedValue = parseNestedJson(value);

  if (Array.isArray(parsedValue)) {
    return normalizeNavItems(parsedValue);
  }

  const raw = asRecord(parsedValue);
  if (!raw) {
    return [];
  }

  const sources = [
    raw['menu_usuario'],
    raw['menu'],
    raw['items'],
    raw['navItems'],
    asRecord(raw['data'])?.['menu_usuario'],
    asRecord(raw['data'])?.['menu'],
    asRecord(raw['usuario'])?.['menu_usuario'],
    asRecord(raw['user'])?.['menu_usuario']
  ];

  for (const source of sources) {
    const parsedSource = parseNestedJson(source);
    if (Array.isArray(parsedSource)) {
      const normalized = normalizeNavItems(parsedSource);
      if (normalized.length > 0) {
        return normalized;
      }
    }
  }

  return [];
}

export function extractStringArrayFromUnknown(value: unknown): string[] {
  const parsedValue = parseNestedJson(value);

  if (Array.isArray(parsedValue)) {
    return parsedValue.filter(
      (item): item is string => typeof item === 'string'
    );
  }

  const raw = asRecord(parsedValue);
  if (!raw) {
    return [];
  }

  const nestedCandidates = [
    raw['permisos'],
    raw['permissions'],
    asRecord(raw['data'])?.['permisos'],
    asRecord(raw['data'])?.['permissions']
  ];

  for (const candidate of nestedCandidates) {
    const nestedParsed = parseNestedJson(candidate);
    if (Array.isArray(nestedParsed)) {
      return nestedParsed.filter(
        (item): item is string => typeof item === 'string'
      );
    }
  }

  return [];
}
