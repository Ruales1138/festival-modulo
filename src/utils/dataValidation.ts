import { BadRequestError } from './error.handler.js';
import { TipoBoleta } from '../domain/models/Boleta.js';

export function validatePositiveInteger(val: any, fieldName: string): number {
  if (val === undefined || val === null || val === '') {
    throw new BadRequestError(`El campo ${fieldName} es obligatorio`);
  }
  const num = Number(val);
  if (!Number.isInteger(num) || num <= 0) {
    throw new BadRequestError(`El campo ${fieldName} debe ser un entero positivo`);
  }
  return num;
}

export function validateOptionalPositiveInteger(val: any, fieldName: string): number | undefined {
  if (val === undefined || val === null || val === '') {
    return undefined;
  }
  const num = Number(val);
  if (!Number.isInteger(num) || num <= 0) {
    throw new BadRequestError(`El campo ${fieldName} debe ser un entero positivo`);
  }
  return num;
}

export function validateTipoBoleta(tipo: any): TipoBoleta {
  const validTipos = ['GENERAL', 'VIP', 'PLATINO'];
  if (!tipo || typeof tipo !== 'string' || !validTipos.includes(tipo)) {
    throw new BadRequestError('El tipo de boleta debe ser GENERAL, VIP o PLATINO');
  }
  return tipo as TipoBoleta;
}

export function validatePagination(pageVal: any, limitVal: any): { page: number; limit: number } {
  let page = 1;
  let limit = 10;

  if (pageVal !== undefined && pageVal !== null && pageVal !== '') {
    const p = Number(pageVal);
    if (!Number.isInteger(p) || p <= 0) {
      throw new BadRequestError('El parámetro page debe ser un entero positivo');
    }
    page = p;
  }

  if (limitVal !== undefined && limitVal !== null && limitVal !== '') {
    const l = Number(limitVal);
    if (!Number.isInteger(l) || l <= 0 || l > 50) {
      throw new BadRequestError('El parámetro limit debe ser un entero positivo menor o igual a 50');
    }
    limit = l;
  }

  return { page, limit };
}
