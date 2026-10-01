import { IBoletaRepository } from '../domain/repository/IBoletaRepository.js';
import { Boleta, PRECIOS_BOLETA } from '../domain/models/Boleta.js';
import { validatePositiveInteger, validateTipoBoleta } from '../utils/dataValidation.js';
import { BadRequestError, NotFoundError } from '../utils/error.handler.js';

export class UpdateBoletaUseCase {
  constructor(private boletaRepository: IBoletaRepository) {}

  async execute(idParam: any, body: any): Promise<Boleta> {
    // 1. Validar ID (400)
    const id = validatePositiveInteger(idParam, 'id');

    // 2. Verificar que el body sólo contenga el campo 'tipo'
    const allowedKeys = ['tipo'];
    const bodyKeys = Object.keys(body || {});
    const invalidKeys = bodyKeys.filter(key => !allowedKeys.includes(key));

    if (invalidKeys.length > 0) {
      throw new BadRequestError(`No se permite editar los campos: ${invalidKeys.join(', ')}`);
    }

    // 3. Validar tipo (400)
    const tipo = validateTipoBoleta(body?.tipo);

    // 4. Verificar existencia de la boleta (404)
    const existingBoleta = await this.boletaRepository.findById(id);
    if (!existingBoleta) {
      throw new NotFoundError(`La boleta con id ${id} no existe`);
    }

    // 5. Recalcular precio
    const precio = PRECIOS_BOLETA[tipo];

    // 6. Actualizar
    return await this.boletaRepository.update(id, {
      tipo,
      precio,
    });
  }
}
