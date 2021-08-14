import { Router } from 'express';
import authRouter from './auth';
import pageRouter from './pages';

const router = Router();

router.use('/', authRouter);
router.use('/', pageRouter);

export default router;
