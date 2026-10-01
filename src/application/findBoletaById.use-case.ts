import { IBoletaRepository } from '../domain/repository/IBoletaRepository.js';
import { Boleta } from '../domain/models/Boleta.js';
import { validatePositiveInteger } from '../utils/dataValidation.js';
import { NotFoundError } from '../utils/error.handler.js';

export class FindBoletaByIdUseCase {
  constructor(private boletaRepository: IBoletaRepository) {}

  async execute(idParam: any): Promise<Boleta> {
    const id = validatePositiveInteger(idParam, 'id');
    const boleta = await this.boletaRepository.findById(id);

    if (!boleta) {
      throw new NotFoundError(`La boleta con id ${id} no existe`);
    }

    return boleta;
  }
}
