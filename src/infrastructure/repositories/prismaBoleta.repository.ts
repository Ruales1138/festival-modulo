import { prisma } from '../database/prismaClient.js';
import { IBoletaRepository } from '../../domain/repository/IBoletaRepository.js';
import { Boleta, BoletaFilter } from '../../domain/models/Boleta.js';

export class PrismaBoletaRepository implements IBoletaRepository {
  async findAll(filter: BoletaFilter): Promise<{ boletas: Boleta[]; total: number }> {
    const { dia_id, asistente_id, tipo, page = 1, limit = 10 } = filter;
    
    const where: any = { state: 'ACTIVE' };
    
    if (dia_id) where.dia_id = Number(dia_id);
    if (asistente_id) where.asistente_id = Number(asistente_id);
    if (tipo) where.tipo = tipo;

    const skip = (Number(page) - 1) * Number(limit);

    const [boletas, total] = await Promise.all([
      prisma.boletas.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: { created_at: 'desc' }
      }),
      prisma.boletas.count({ where })
    ]);

    return { boletas: boletas as unknown as Boleta[], total };
  }

  async findById(id: number): Promise<Boleta | null> {
    const boleta = await prisma.boletas.findFirst({
      where: { id: Number(id), state: 'ACTIVE' }
    });
    return boleta as unknown as Boleta | null;
  }

  async create(data: { asistente_id: number; dia_id: number; tipo: string; precio: number }): Promise<Boleta> {
    const newBoleta = await prisma.boletas.create({
      data: {
        asistente_id: data.asistente_id,
        dia_id: data.dia_id,
        tipo: data.tipo,
        precio: data.precio,
        state: 'ACTIVE'
      }
    });
    return newBoleta as unknown as Boleta;
  }

  async update(id: number, data: { tipo: string; precio: number }): Promise<Boleta> {
    const updatedBoleta = await prisma.boletas.update({
      where: { id: Number(id) },
      data: {
        tipo: data.tipo,
        precio: data.precio
      }
    });
    return updatedBoleta as unknown as Boleta;
  }

  async softDelete(id: number): Promise<void> {
    await prisma.boletas.update({
      where: { id: Number(id) },
      data: { state: 'REMOVED' }
    });
  }

  async checkAsistenteExists(asistenteId: number): Promise<boolean> {
    const asistente = await prisma.asistentes.findUnique({
      where: { id: Number(asistenteId) }
    });
    return !!asistente;
  }

  async checkDiaExists(diaId: number): Promise<{ exists: boolean; aforo: number }> {
    const dia = await prisma.dias.findUnique({
      where: { id: Number(diaId) }
    });
    if (!dia) return { exists: false, aforo: 0 };
    return { exists: true, aforo: dia.aforo };
  }

  async countActiveBoletasByDia(diaId: number): Promise<number> {
    const count = await prisma.boletas.count({
      where: { dia_id: Number(diaId), state: 'ACTIVE' }
    });
    return count;
  }

  async hasActiveBoletaForDia(asistenteId: number, diaId: number): Promise<boolean> {
    const boleta = await prisma.boletas.findFirst({
      where: { 
        asistente_id: Number(asistenteId),
        dia_id: Number(diaId),
        state: 'ACTIVE'
      }
    });
    return !!boleta;
  }
}
