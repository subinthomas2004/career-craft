import Company from '../models/Company.js';
import { groqChat } from './groqController.js';

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

export const getAICompanyInsight = async (req, res) => {
    const { name } = req.query;
    if (!name) return res.status(400).json({ success: false, message: "Company name is required" });
    try {
        const systemPrompt = `You are a high-end Career Intelligence Engine for the "CareerCraft" platform. 
        Construct systematic interview and profile analysis for the company requested. 
        
        IMPORTANT: Provide highly specialized advice explicitly mapping to our CareerCraft modules.
        Available modules on CareerCraft to reference:
        - AI Mock Interview (for practice rounds)
        - Coding Practice (for algorithm rounds)
        - Group Discussion Simulator (for group filtering)
        - Communication Coach (for fluency)
        - Aptitude/Tech Quiz (for written rounds)
        - Resume Builder
        - Debate Simulator (for logical flow)
        
        Format MUST be strict JSON:
        {
          "name": "string",
          "tagline": "string",
          "description": "Detailed comprehensive multi-paragraph history and operations summary",
          "recruitmentDifficulty": "1-10 value",
          "hiringTrend": "e.g. aggressive hiring / selective",
          "interviewRounds": ["round 1 with detail", "round 2 with detail"],
          "techStack": ["tech1", "tech2"],
          "avgSalary": "detailed range with breakdown",
          "codingTopics": ["topic1", "topic2"],
          "cultureHighlight": "Summary of working hours and values",
          "topPros": ["pro1", "pro2"],
          "topCons": ["con1", "con2"],
          "prepAdvice": "Actionable strategy recommendation explicitly mentioning which CareerCraft module to utilize first"
        }`;
        const completion = await groqChat({
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: `Analyze placement parameters for: "${name}"` }
            ],
            model: "llama-3.1-8b-instant",
            response_format: { type: "json_object" }
        });
        const insight = JSON.parse(completion.choices[0]?.message?.content);
        res.json({ success: true, insight });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};
