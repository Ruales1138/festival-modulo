import { IBoletaRepository } from '../domain/repository/IBoletaRepository.js';
import { Boleta, UpdateBoletaInput, PRECIOS_BOLETA } from '../domain/models/Boleta.js';
import { BadRequestError, NotFoundError } from '../utils/error.handler.js';
import { validateTipoBoleta } from '../utils/dataValidation.js';

export class UpdateBoletaUseCase {
  constructor(private repository: IBoletaRepository) {}

  async execute(id: string, data: UpdateBoletaInput): Promise<Boleta> {
    const boletaId = Number(id);
    if (!Number.isInteger(boletaId) || boletaId <= 0) throw new BadRequestError('ID inválido');

    if (!data || typeof data !== 'object' || Array.isArray(data)) {
      throw new BadRequestError('El cuerpo de la solicitud debe ser un objeto');
    }

    const body = data as Record<string, unknown>;
    const camposNoPermitidos = Object.keys(body).filter((campo) => campo !== 'tipo');
    if (camposNoPermitidos.length > 0) {
      throw new BadRequestError('Solo se permite actualizar el campo tipo');
    }
    
    const boleta = await this.repository.findById(boletaId);
    if (!boleta) throw new NotFoundError('Boleta no encontrada');

    let precio = boleta.precio;
    let tipo = boleta.tipo;

    if (body.tipo !== undefined) {
      tipo = validateTipoBoleta(body.tipo);
      precio = PRECIOS_BOLETA[tipo as keyof typeof PRECIOS_BOLETA];
    }

    return await this.repository.update(boletaId, { 
      tipo,
      precio
    });
  }
}
