import { IBoletaRepository } from '../../domain/repository/IBoletaRepository.js';
import { Boleta, BoletaFilter } from '../../domain/models/Boleta.js';
import { prisma } from '../database/prismaClient.js';

export class PrismaBoletaRepository implements IBoletaRepository {
  async findAll(filter: BoletaFilter): Promise<{ boletas: Boleta[]; total: number }> {
    const page = filter.page || 1;
    const limit = filter.limit || 10;
    const skip = (page - 1) * limit;

    const where: any = {
      state: {
        not: 'REMOVED',
      },
    };

    if (filter.dia_id !== undefined) {
      where.dia_id = filter.dia_id;
    }
    if (filter.asistente_id !== undefined) {
      where.asistente_id = filter.asistente_id;
    }
    if (filter.tipo !== undefined) {
      where.tipo = filter.tipo;
    }

    const [total, boletas] = await Promise.all([
      prisma.boletas.count({ where }),
      prisma.boletas.findMany({
        where,
        orderBy: {
          id: 'asc',
        },
        skip,
        take: limit,
      }),
    ]);

    return {
      total,
      boletas: boletas.map(b => ({
        id: b.id,
        asistente_id: b.asistente_id,
        dia_id: b.dia_id,
        tipo: b.tipo,
        precio: b.precio,
        state: b.state,
      })),
    };
  }

  async findById(id: number): Promise<Boleta | null> {
    const boleta = await prisma.boletas.findUnique({
      where: { id },
    });

    if (!boleta || boleta.state === 'REMOVED') {
      return null;
    }

    return {
      id: boleta.id,
      asistente_id: boleta.asistente_id,
      dia_id: boleta.dia_id,
      tipo: boleta.tipo,
      precio: boleta.precio,
      state: boleta.state,
    };
  }

  async create(data: {
    asistente_id: number;
    dia_id: number;
    tipo: string;
    precio: number;
  }): Promise<Boleta> {
    const boleta = await prisma.boletas.create({
      data: {
        asistente_id: data.asistente_id,
        dia_id: data.dia_id,
        tipo: data.tipo,
        precio: data.precio,
        state: 'ACTIVE',
      },
    });

    return {
      id: boleta.id,
      asistente_id: boleta.asistente_id,
      dia_id: boleta.dia_id,
      tipo: boleta.tipo,
      precio: boleta.precio,
      state: boleta.state,
    };
  }

  async update(id: number, data: { tipo: string; precio: number }): Promise<Boleta> {
    const boleta = await prisma.boletas.update({
      where: { id },
      data: {
        tipo: data.tipo,
        precio: data.precio,
        updated_at: new Date(),
      },
    });

    return {
      id: boleta.id,
      asistente_id: boleta.asistente_id,
      dia_id: boleta.dia_id,
      tipo: boleta.tipo,
      precio: boleta.precio,
      state: boleta.state,
    };
  }

  async softDelete(id: number): Promise<void> {
    await prisma.boletas.update({
      where: { id },
      data: {
        state: 'REMOVED',
        updated_at: new Date(),
      },
    });
  }

  async checkAsistenteExists(asistenteId: number): Promise<boolean> {
    const asistente = await prisma.asistentes.findUnique({
      where: { id: asistenteId },
      select: { id: true },
    });
    return !!asistente;
  }

  async checkDiaExists(diaId: number): Promise<{ exists: boolean; aforo: number }> {
    const dia = await prisma.dias.findUnique({
      where: { id: diaId },
      select: { id: true, aforo: true },
    });

    if (!dia) {
      return { exists: false, aforo: 0 };
    }

    return { exists: true, aforo: dia.aforo };
  }

  async countActiveBoletasByDia(diaId: number): Promise<number> {
    return await prisma.boletas.count({
      where: {
        dia_id: diaId,
        state: {
          not: 'REMOVED',
        },
      },
    });
  }

  async hasActiveBoletaForDia(asistenteId: number, diaId: number): Promise<boolean> {
    const existing = await prisma.boletas.findFirst({
      where: {
        asistente_id: asistenteId,
        dia_id: diaId,
        state: {
          not: 'REMOVED',
        },
      },
      select: { id: true },
    });
    return !!existing;
  }
}
