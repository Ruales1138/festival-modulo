import { IBoletaRepository } from '../domain/repository/IBoletaRepository.js';
import { BoletaFilter } from '../domain/models/Boleta.js';
import { validateOptionalPositiveInteger, validatePagination, validateTipoBoleta } from '../utils/dataValidation.js';

export class FindAllBoletasUseCase {
  constructor(private boletaRepository: IBoletaRepository) {}

  async execute(queryParams: any) {
    const dia_id = validateOptionalPositiveInteger(queryParams?.dia_id, 'dia_id');
    const asistente_id = validateOptionalPositiveInteger(queryParams?.asistente_id, 'asistente_id');
    const { page, limit } = validatePagination(queryParams?.page, queryParams?.limit);
    const tipo = queryParams?.tipo ? validateTipoBoleta(String(queryParams.tipo)) : undefined;

    const filter: BoletaFilter = {
      dia_id,
      asistente_id,
      tipo,
      page,
      limit,
    };

    const { boletas, total } = await this.boletaRepository.findAll(filter);
    const totalPages = total > 0 ? Math.ceil(total / limit) : 0;

    return {
      pagination: {
        total,
        currentPage: page,
        limit,
        totalPages,
      },
      data: boletas,
    };
  }
}
