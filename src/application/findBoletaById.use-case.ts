import { IBoletaRepository } from '../domain/repository/IBoletaRepository.js';
import { Boleta } from '../domain/models/Boleta.js';
import { BadRequestError, NotFoundError } from '../utils/error.handler.js';
import { validatePositiveInteger } from '../utils/dataValidation.js';

export class FindBoletaByIdUseCase {
  constructor(private repository: IBoletaRepository) {}

  async execute(id: string): Promise<Boleta> {
    const boletaId = validatePositiveInteger(id, 'id');
    
    const boleta = await this.repository.findById(boletaId);
    if (!boleta) throw new NotFoundError('Boleta no encontrada');

    return boleta;
  }
}
