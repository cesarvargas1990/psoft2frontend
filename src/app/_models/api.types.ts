import { NavItem } from './nav-item';

export interface SelectOption {
  value: number | string;
  label: string;
}

export interface BackendMessageResponse {
  message?: string;
  success?: string | boolean;
  ok?: boolean;
}

export interface LoginRequest {
  email?: string;
  username?: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type?: string;
  expires_in?: number;
  status?: string;
  message?: string;
  name: string;
  email?: string;
  menu_usuario: NavItem[] | unknown;
  permisos: string[] | unknown;
  data?: unknown;
  id: number | string;
  is_admin?: number;
  id_empresa?: number | string;
  ind_activo?: number;
  id_user?: number | string;
}

export interface ClientePayload {
  id?: number | string;
  nomcliente?: string;
  id_tipo_docid?: number | string;
  numdocumento?: string;
  ciudad?: string;
  celular?: string;
  id_empresa?: number | string;
  id_cobrador?: number | string;
  id_user?: number | string;
  email?: string;
  fch_expdocumento?: string;
  fch_nacimiento?: string;
  [key: string]: unknown;
}

export interface ArchivoAdjuntoPayload {
  id_cliente?: number | string;
  id_usuario?: number | string;
  id_empresa?: number | string;
  id_tdocadjunto?: number | string;
  filename?: string;
  image?: string;
  id_tdocadjunto_list?: Array<number | string>;
  [key: string]: unknown;
}

export interface ArchivoAdjuntoUploadResponse {
  status?: string;
  data?: string;
  path?: string;
  nombrearchivo?: string;
}

export interface PrestamoClienteResumen {
  'Codigo Prestamo'?: number | string;
  'Numero Cuotas'?: number | string;
  'Valor Prestamo'?: string;
  'Valor Total Prestamo'?: string;
  'Abonos capital'?: string;
  'Total Abonado'?: string;
  Saldo?: string;
  [key: string]: unknown;
}

export interface CuotaCalculada {
  cuota?: number;
  valor?: number | string;
  [key: string]: unknown;
}

export interface DocumentoPlantilla {
  id: number;
  nombre: string;
  plantilla_html: string;
  id_empresa: number | string;
  id_prestamo?: number | string;
}

export interface DocumentoTipoAdjunto {
  id: number;
  nombre: string;
  id_empresa: number | string;
}

export interface VariablePlantilla {
  title: string;
  content: string;
}

export interface SistemaPrestamo {
  id?: number;
  codtipsistemap?: number | string;
  nomtipsistemap?: string;
  formula?: string;
}

export interface GuardarPrestamoResponse {
  id_prestamo: number;
}

export interface DashboardTotalsResponse {
  total_capital_prestado?: string;
  total_interes?: string;
  total_interes_hoy?: string;
  total_prestado_hoy?: string;
  total_prestado?: string;
  total?: unknown;
  ahora?: string;
}

export interface EmpresaResponse {
  id?: number;
  nombre?: string;
  nitempresa?: string;
  nit?: string;
  ok?: boolean;
  ddirec?: string;
  ciudad?: string;
  telefono?: string;
  pagina?: string;
  email?: string;
  vlr_capinicial?: number | string;
  firma?: string;
  [key: string]: unknown;
}

export interface EmpresaUpdatePayload {
  nombre?: string;
  nit?: string;
  ddirec?: string;
  ciudad?: string;
  telefono?: string;
  pagina?: string;
  email?: string;
  vlr_capinicial?: number | string;
  firma?: string | null;
  [key: string]: unknown;
}
