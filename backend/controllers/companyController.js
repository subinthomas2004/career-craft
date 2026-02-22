import Company from '../models/Company.js';

// @desc    Get all companies
// @route   GET /api/companies
// @access  Public
export const getCompanies = async (req, res) => {
    try {
        const companies = await Company.find({}).select('-materials'); // Exclude materials for the fast grid view
        res.json(companies);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get materials for a specific company
// @route   GET /api/companies/:id/materials
// @access  Public
export const getCompanyMaterials = async (req, res) => {
    try {
        const company = await Company.findById(req.params.id);

        if (company) {
            res.json(company.materials);
        } else {
            res.status(404).json({ message: 'Company not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get single company details
// @route   GET /api/companies/:id
// @access  Public
export const getCompanyById = async (req, res) => {
    try {
        const company = await Company.findById(req.params.id);

        if (company) {
            res.json(company);
        } else {
            res.status(404).json({ message: 'Company not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};
