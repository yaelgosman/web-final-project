import express from 'express';
import { smartSearch } from '../controllers/aiController';

const router = express.Router();

router.post('/search', smartSearch);

export default router;
