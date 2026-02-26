export interface fechasPago {
  id?: number;
  id_cliente?: number;
  id_prestamo?: number;
  fecha_pago: string;
  fecha_realpago: string;
  valcuota: number | string;
  valtotal?: number | string;
  id_fecha_pago?: number | null;
  ind_cuotapaga?: number;
}
