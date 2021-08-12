import { Router } from 'express';
import authRouter from './auth';
import storeRouter from './store';

const router = Router();

router.use('/auth', authRouter);
router.use('/store', storeRouter);

export default router;
