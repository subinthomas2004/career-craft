import express from "express";
import { testGroqConnection, generateInterviewQuestion, analyzeCodeSubmission, generateReport, generateDebateResponse, generateGroupDiscussionTopic, generateGDResponse, analyzeSpeech, evaluateDebate, generateResumeBullet, analyzeResumeATS, analyzeSkillGap, generateSoftSkillsTips, analyzeCodingPractice, analyzeRole } from "../controllers/groqController.js";

const router = express.Router();

router.post("/test", testGroqConnection);
router.post("/interview/question", generateInterviewQuestion);
router.post("/interview/analyze-code", analyzeCodeSubmission);
router.post("/interview/report", generateReport);
router.post("/analyze-role", analyzeRole);

router.post("/debate/response", generateDebateResponse);
router.post("/debate/topic", generateGroupDiscussionTopic);
router.post("/debate/evaluate", evaluateDebate);

router.post("/gd/response", generateGDResponse);
router.post("/speech-analysis", analyzeSpeech);

router.post("/resume/bullet", generateResumeBullet);
router.post("/resume/analyze", analyzeResumeATS);

router.post("/skill-gap/analyze", analyzeSkillGap);
router.post("/soft-skills/tips", generateSoftSkillsTips);
router.post("/coding-practice/analyze", analyzeCodingPractice);

export default router;

