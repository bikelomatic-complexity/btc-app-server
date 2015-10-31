import {Router} from 'express';
import {verify} from '../token/token';

import {router as auth} from '../api/auth';
import {router as setup} from '../api/setup';
import {router as points} from '../api/points';

export const router = Router();
router.use('/authenticate', auth);
router.use('/points', points);
router.use('/setup', setup);
router.use(verify);
