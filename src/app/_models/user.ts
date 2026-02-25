import { NavItem } from './nav-item';

export interface LoginResponse {
  access_token: string;
  data: unknown;
  name: string;
  status: string;
  message: string;
  menu_usuario: NavItem[] | unknown;
  permisos: string[] | unknown;
  id: string;
  is_admin: number;
  id_empresa: string;
  ind_activo: number;
  id_user: number;
}
