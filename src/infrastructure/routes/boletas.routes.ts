import { Router } from 'express';
import { BoletasController } from '../controllers/boletas.controller.js';

const router = Router();
const controller = new BoletasController();

router.get('/', controller.findAll);
router.get('/dia/:diaId/disponibilidad', controller.getDisponibilidad);
router.get('/:id', controller.findById);
router.post('/', controller.create);
router.patch('/:id', controller.update);
router.delete('/:id', controller.delete);

export default router;
