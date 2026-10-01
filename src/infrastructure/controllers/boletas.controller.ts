import { Request, Response } from 'express';
import { PrismaBoletaRepository } from '../repositories/prismaBoleta.repository.js';
import { CreateBoletaUseCase } from '../../application/createBoleta.use-case.js';
import { FindAllBoletasUseCase } from '../../application/findAllBoletas.use-case.js';
import { FindBoletaByIdUseCase } from '../../application/findBoletaById.use-case.js';
import { UpdateBoletaUseCase } from '../../application/updateBoleta.use-case.js';
import { DeleteBoletaUseCase } from '../../application/deleteBoleta.use-case.js';
import { GetDisponibilidadUseCase } from '../../application/getDisponibilidad.use-case.js';
import { AppError } from '../../utils/error.handler.js';

export class BoletasController {
  private repository: PrismaBoletaRepository;
  private createBoletaUseCase: CreateBoletaUseCase;
  private findAllBoletasUseCase: FindAllBoletasUseCase;
  private findBoletaByIdUseCase: FindBoletaByIdUseCase;
  private updateBoletaUseCase: UpdateBoletaUseCase;
  private deleteBoletaUseCase: DeleteBoletaUseCase;
  private getDisponibilidadUseCase: GetDisponibilidadUseCase;

  constructor() {
    this.repository = new PrismaBoletaRepository();
    this.createBoletaUseCase = new CreateBoletaUseCase(this.repository);
    this.findAllBoletasUseCase = new FindAllBoletasUseCase(this.repository);
    this.findBoletaByIdUseCase = new FindBoletaByIdUseCase(this.repository);
    this.updateBoletaUseCase = new UpdateBoletaUseCase(this.repository);
    this.deleteBoletaUseCase = new DeleteBoletaUseCase(this.repository);
    this.getDisponibilidadUseCase = new GetDisponibilidadUseCase(this.repository);
  }

  findAll = async (req: Request, res: Response): Promise<void> => {
    try {
      const result = await this.findAllBoletasUseCase.execute(req.query);
      res.status(200).json(result);
    } catch (error) {
      this.handleError(error, res);
    }
  };

  findById = async (req: Request, res: Response): Promise<void> => {
    try {
      const boleta = await this.findBoletaByIdUseCase.execute(req.params.id);
      res.status(200).json({ data: boleta });
    } catch (error) {
      this.handleError(error, res);
    }
  };

  create = async (req: Request, res: Response): Promise<void> => {
    try {
      const newBoleta = await this.createBoletaUseCase.execute(req.body);
      res.status(201).json({ data: newBoleta });
    } catch (error) {
      this.handleError(error, res);
    }
  };

  update = async (req: Request, res: Response): Promise<void> => {
    try {
      const updatedBoleta = await this.updateBoletaUseCase.execute(req.params.id, req.body);
      res.status(200).json({ data: updatedBoleta });
    } catch (error) {
      this.handleError(error, res);
    }
  };

  delete = async (req: Request, res: Response): Promise<void> => {
    try {
      await this.deleteBoletaUseCase.execute(req.params.id);
      res.status(200).json({ message: 'Boleta eliminada correctamente' });
    } catch (error) {
      this.handleError(error, res);
    }
  };

  getDisponibilidad = async (req: Request, res: Response): Promise<void> => {
    try {
      const disponibilidad = await this.getDisponibilidadUseCase.execute(req.params.diaId);
      res.status(200).json({ data: disponibilidad });
    } catch (error) {
      this.handleError(error, res);
    }
  };

  private handleError(error: any, res: Response): void {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ error: error.message });
      return;
    }

    console.error('Unhandled error:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}
