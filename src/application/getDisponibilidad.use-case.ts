import { IBoletaRepository } from '../domain/repository/IBoletaRepository.js';
import { DisponibilidadData } from '../domain/models/Boleta.js';
import { BadRequestError, NotFoundError } from '../utils/error.handler.js';

export class GetDisponibilidadUseCase {
  constructor(private repository: IBoletaRepository) {}

  async execute(diaIdStr: string): Promise<DisponibilidadData> {
    const diaId = Number(diaIdStr);
    if (isNaN(diaId)) throw new BadRequestError('ID de día inválido');

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
