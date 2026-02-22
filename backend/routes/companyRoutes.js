import express from 'express';
import { getCompanies, getCompanyMaterials, getCompanyById } from '../controllers/companyController.js';

const router = express.Router();

router.route('/').get(getCompanies);
router.route('/:id').get(getCompanyById);
router.route('/:id/materials').get(getCompanyMaterials);

export default router;
