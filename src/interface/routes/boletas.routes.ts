import { Router } from 'express';
import { BoletasController } from '../controllers/boletas.controller.js';

const router = Router();
const controller = new BoletasController();

router.get('/disponibilidad/:diaId', controller.getDisponibilidad);
router.get('/', controller.findAll);
router.get('/:id', controller.findById);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.delete);

export default router;
