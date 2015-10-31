import {Router} from 'express';

import {verify} from '../token/token';

import {router as auth} from '../api/auth';
import {router as setup} from '../api/setup';

export const router = Router();
router.use('/authenticate', auth);
router.use('/setup', setup);
router.use(verify);
