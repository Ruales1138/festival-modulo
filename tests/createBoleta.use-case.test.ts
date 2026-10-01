import assert from 'node:assert/strict';
import { test } from 'node:test';
import { CreateBoletaUseCase } from '../src/application/createBoleta.use-case.js';
import { ConflictError } from '../src/utils/error.handler.js';
import { Boleta } from '../src/domain/models/Boleta.js';
import { IBoletaRepository } from '../src/domain/repository/IBoletaRepository.js';

class FakeBoletaRepository implements IBoletaRepository {
  activeForDay = 0;
  duplicate = false;
  created: Boleta | undefined;

  async findAll(): Promise<{ boletas: Boleta[]; total: number }> {
    return { boletas: [], total: 0 };
  }

  async findById(): Promise<Boleta | null> {
    return null;
  }

  async create(data: { asistente_id: number; dia_id: number; tipo: string; precio: number }): Promise<Boleta> {
    this.created = {
      id: 1,
      ...data,
      state: 'ACTIVE',
    };
    return this.created;
  }

  async update(): Promise<Boleta> {
    throw new Error('No implementado en esta prueba');
  }

  async softDelete(): Promise<void> {}

  async checkAsistenteExists(): Promise<boolean> {
    return true;
  }

  async checkDiaExists(): Promise<{ exists: boolean; aforo: number }> {
    return { exists: true, aforo: 2 };
  }

  async countActiveBoletasByDia(): Promise<number> {
    return this.activeForDay;
  }

  async hasActiveBoletaForDia(): Promise<boolean> {
    return this.duplicate;
  }
}

test('calcula el precio en el servidor e ignora el precio enviado', async () => {
  const repository = new FakeBoletaRepository();
  const useCase = new CreateBoletaUseCase(repository);

  await useCase.execute({ asistente_id: 1, dia_id: 1, tipo: 'VIP', precio: 1 });

  assert.equal(repository.created?.precio, 480000);
});

test('rechaza vender cuando el aforo está agotado', async () => {
  const repository = new FakeBoletaRepository();
  repository.activeForDay = 2;
  const useCase = new CreateBoletaUseCase(repository);

  await assert.rejects(
    useCase.execute({ asistente_id: 1, dia_id: 1, tipo: 'GENERAL' }),
    (error: unknown) => error instanceof ConflictError && error.statusCode === 409,
  );
});

test('rechaza una segunda boleta activa del mismo asistente y día', async () => {
  const repository = new FakeBoletaRepository();
  repository.duplicate = true;
  const useCase = new CreateBoletaUseCase(repository);

  await assert.rejects(
    useCase.execute({ asistente_id: 1, dia_id: 1, tipo: 'GENERAL' }),
    (error: unknown) => error instanceof ConflictError && error.statusCode === 409,
  );
});