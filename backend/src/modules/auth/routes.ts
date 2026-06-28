import { Router } from 'express';
import { AuthController } from './controller';
import { protect } from '../../middleware/authMiddleware';
import { authLimiter } from '../../middleware/rateLimiter';

const router = Router();
const controller = new AuthController();

router.post('/register', authLimiter, controller.register);
router.post('/login', authLimiter, controller.login);
router.post('/logout', controller.logout);
router.get('/me', protect, controller.getMe);

export default router;
