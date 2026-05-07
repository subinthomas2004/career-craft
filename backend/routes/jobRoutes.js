import express from 'express';
import { getJobs, getInfoparkJobs } from '../controllers/jobController.js';

const router = express.Router();

router.get('/', getJobs);
router.get('/infopark', getInfoparkJobs);

export default router;
