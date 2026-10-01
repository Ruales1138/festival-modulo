import { IBoletaRepository } from '../domain/repository/IBoletaRepository.js';
import { validatePositiveInteger } from '../utils/dataValidation.js';
import { NotFoundError } from '../utils/error.handler.js';

export class DeleteBoletaUseCase {
  constructor(private boletaRepository: IBoletaRepository) {}

  async execute(idParam: any): Promise<void> {
    const id = validatePositiveInteger(idParam, 'id');
    const existingBoleta = await this.boletaRepository.findById(id);

    if (!existingBoleta) {
      throw new NotFoundError(`La boleta con id ${id} no existe`);
    }

    await this.boletaRepository.softDelete(id);
  }
}
