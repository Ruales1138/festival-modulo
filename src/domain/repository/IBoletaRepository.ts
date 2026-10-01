import { Boleta, BoletaFilter } from '../models/Boleta.js';

export interface IBoletaRepository {
  findAll(filter: BoletaFilter): Promise<{ boletas: Boleta[]; total: number }>;
  findById(id: number): Promise<Boleta | null>;
  create(data: {
    asistente_id: number;
    dia_id: number;
    tipo: string;
    precio: number;
  }): Promise<Boleta>;
  update(id: number, data: { tipo: string; precio: number }): Promise<Boleta>;
  softDelete(id: number): Promise<void>;

  checkAsistenteExists(asistenteId: number): Promise<boolean>;
  checkDiaExists(diaId: number): Promise<{ exists: boolean; aforo: number }>;
  countActiveBoletasByDia(diaId: number): Promise<number>;
  hasActiveBoletaForDia(asistenteId: number, diaId: number): Promise<boolean>;
}
