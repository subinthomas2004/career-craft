import express from 'express';
import { getCompanies, getCompanyMaterials, getCompanyById, getAICompanyInsight } from '../controllers/companyController.js';

const router = express.Router();

router.route('/').get(getCompanies);
router.route('/ai-search/insight').get(getAICompanyInsight);
router.route('/:id').get(getCompanyById);
router.route('/:id/materials').get(getCompanyMaterials);

export default router;
