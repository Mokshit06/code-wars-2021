import { Router } from 'express';
import authRouter from './auth';
import storeRouter from './store';

const router = Router();

router.use('/auth', authRouter);
router.use('/stores', storeRouter);

export default router;
