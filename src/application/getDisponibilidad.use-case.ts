import { IBoletaRepository } from '../domain/repository/IBoletaRepository.js';
import { DisponibilidadData } from '../domain/models/Boleta.js';
import { NotFoundError } from '../utils/error.handler.js';
import { validatePositiveInteger } from '../utils/dataValidation.js';

export class GetDisponibilidadUseCase {
  constructor(private repository: IBoletaRepository) {}

  async execute(diaIdStr: string): Promise<DisponibilidadData> {
    const diaId = validatePositiveInteger(diaIdStr, 'diaId');

    const diaCheck = await this.repository.checkDiaExists(diaId);
    if (!diaCheck.exists) {
      throw new NotFoundError('Día no encontrado');
    }

    const vendidas = await this.repository.countActiveBoletasByDia(diaId);
    const disponibles = diaCheck.aforo - vendidas;

    return {
      dia_id: diaId,
      aforo: diaCheck.aforo,
      vendidas,
      disponibles: disponibles > 0 ? disponibles : 0
    };
  }
}
