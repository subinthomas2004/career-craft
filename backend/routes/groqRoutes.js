import express from "express";
import { testGroqConnection, generateInterviewQuestion, analyzeCodeSubmission, generateReport, generateDebateResponse, generateGroupDiscussionTopic, generateGDResponse, analyzeSpeech, evaluateDebate } from "../controllers/groqController.js";

const router = express.Router();

router.post("/test", testGroqConnection);
router.post("/interview/question", generateInterviewQuestion);
router.post("/interview/analyze-code", analyzeCodeSubmission);
router.post("/interview/report", generateReport);

router.post("/debate/response", generateDebateResponse);
router.post("/debate/topic", generateGroupDiscussionTopic);
router.post("/debate/evaluate", evaluateDebate);

router.post("/gd/response", generateGDResponse);
router.post("/speech-analysis", analyzeSpeech);

export default router;
