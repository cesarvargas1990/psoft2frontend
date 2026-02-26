export interface documento {
  id: number;
  nombre: string;
  plantilla_html: string;
  id_empresa: number | string;
  id_prestamo?: number;
}
