import { IBoletaRepository } from '../domain/repository/IBoletaRepository.js';
import { DisponibilidadData } from '../domain/models/Boleta.js';
import { validatePositiveInteger } from '../utils/dataValidation.js';
import { NotFoundError } from '../utils/error.handler.js';

export class GetDisponibilidadUseCase {
  constructor(private boletaRepository: IBoletaRepository) {}

  async execute(diaIdParam: any): Promise<DisponibilidadData> {
    const dia_id = validatePositiveInteger(diaIdParam, 'diaId');

    const { exists, aforo } = await this.boletaRepository.checkDiaExists(dia_id);
    if (!exists) {
      throw new NotFoundError(`El día con id ${dia_id} no existe`);
    }

    const vendidas = await this.boletaRepository.countActiveBoletasByDia(dia_id);
    const disponibles = Math.max(0, aforo - vendidas);

    return {
      dia_id,
      aforo,
      vendidas,
      disponibles,
    };
  }
}
