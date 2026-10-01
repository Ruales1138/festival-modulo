import { IBoletaRepository } from '../domain/repository/IBoletaRepository.js';
import { Boleta, CreateBoletaInput, PRECIOS_BOLETA } from '../domain/models/Boleta.js';
import { validatePositiveInteger, validateTipoBoleta } from '../utils/dataValidation.js';
import { NotFoundError, ConflictError } from '../utils/error.handler.js';

export class CreateBoletaUseCase {
  constructor(private boletaRepository: IBoletaRepository) {}

  async execute(input: any): Promise<Boleta> {
    // 1. Validaciones 400 (tipos, presencia, valores permitidos)
    const asistente_id = validatePositiveInteger(input?.asistente_id, 'asistente_id');
    const dia_id = validatePositiveInteger(input?.dia_id, 'dia_id');
    const tipo = validateTipoBoleta(input?.tipo);

    // 2. Validaciones 404 (existencia de llaves foráneas)
    const asistenteExists = await this.boletaRepository.checkAsistenteExists(asistente_id);
    if (!asistenteExists) {
      throw new NotFoundError(`El asistente con id ${asistente_id} no existe`);
    }

    const { exists: diaExists, aforo } = await this.boletaRepository.checkDiaExists(dia_id);
    if (!diaExists) {
      throw new NotFoundError(`El día con id ${dia_id} no existe`);
    }

    // 3. Reglas de negocio 409
    // Regla 1: No vender más boletas que el aforo del día
    const activasEnDia = await this.boletaRepository.countActiveBoletasByDia(dia_id);
    if (activasEnDia >= aforo) {
      throw new ConflictError('Aforo del día agotado');
    }

    // Regla 2: Máximo una boleta activa por asistente por día
    const tieneBoletaActiva = await this.boletaRepository.hasActiveBoletaForDia(asistente_id, dia_id);
    if (tieneBoletaActiva) {
      throw new ConflictError('El asistente ya tiene una boleta activa para este día');
    }

    // 4. Calcular precio según el tipo
    const precio = PRECIOS_BOLETA[tipo];

    // 5. Crear la boleta
    return await this.boletaRepository.create({
      asistente_id,
      dia_id,
      tipo,
      precio,
    });
  }
}
