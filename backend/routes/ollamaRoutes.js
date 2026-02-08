import express from 'express';
import { chat, checkConnection, generateQuiz } from '../controllers/ollamaController.js';

const router = express.Router();

router.post('/chat', chat);
router.post('/quiz', generateQuiz);
router.get('/status', checkConnection);

export default router;
