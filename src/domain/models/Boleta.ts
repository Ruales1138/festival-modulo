export type TipoBoleta = 'GENERAL' | 'VIP' | 'PLATINO';

export interface Boleta {
  id: number;
  asistente_id: number;
  dia_id: number;
  tipo: string;
  precio: number;
  state: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface CreateBoletaInput {
  asistente_id: number;
  dia_id: number;
  tipo: TipoBoleta;
}

export interface UpdateBoletaInput {
  tipo?: TipoBoleta;
}

export interface BoletaFilter {
  dia_id?: number;
  asistente_id?: number;
  tipo?: string;
  page?: number;
  limit?: number;
}

export interface DisponibilidadData {
  dia_id: number;
  aforo: number;
  vendidas: number;
  disponibles: number;
}

export const PRECIOS_BOLETA: Record<TipoBoleta, number> = {
  GENERAL: 250000,
  VIP: 480000,
  PLATINO: 900000,
};
