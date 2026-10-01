import { IBoletaRepository } from '../domain/repository/IBoletaRepository.js';
import { Boleta } from '../domain/models/Boleta.js';
import { BadRequestError, NotFoundError } from '../utils/error.handler.js';

export class FindBoletaByIdUseCase {
  constructor(private repository: IBoletaRepository) {}

  async execute(id: string): Promise<Boleta> {
    const boletaId = Number(id);
    if (isNaN(boletaId)) throw new BadRequestError('ID inválido');
    
    const boleta = await this.repository.findById(boletaId);
    if (!boleta) throw new NotFoundError('Boleta no encontrada');

    return boleta;
  }
}
