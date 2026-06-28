import { Router } from 'express';
import { TaskController } from './controller';
import { protect } from '../../middleware/authMiddleware';

const router = Router();
const controller = new TaskController();

// Protect all routes within the Task module
router.use(protect);

router.post('/', controller.create);
router.get('/', controller.getAll);
router.get('/stats', controller.getStats);
router.get('/:id', controller.getOne);
router.put('/:id', controller.update);
router.delete('/:id', controller.delete);

export default router;
