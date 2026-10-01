import { IBoletaRepository } from '../domain/repository/IBoletaRepository.js';
import { Boleta, UpdateBoletaInput, PRECIOS_BOLETA } from '../domain/models/Boleta.js';
import { BadRequestError, NotFoundError } from '../utils/error.handler.js';
import { validateTipoBoleta } from '../utils/dataValidation.js';

export class UpdateBoletaUseCase {
  constructor(private repository: IBoletaRepository) {}

  async execute(id: string, data: UpdateBoletaInput): Promise<Boleta> {
    const boletaId = Number(id);
    if (isNaN(boletaId)) throw new BadRequestError('ID inválido');
    
    const boleta = await this.repository.findById(boletaId);
    if (!boleta) throw new NotFoundError('Boleta no encontrada');

    let precio = boleta.precio;
    let tipo = boleta.tipo;

    if (data.tipo !== undefined) {
      tipo = validateTipoBoleta(data.tipo);
      precio = PRECIOS_BOLETA[tipo as keyof typeof PRECIOS_BOLETA];
    }

    return await this.repository.update(boletaId, { 
      tipo,
      precio
    });
  }
}
