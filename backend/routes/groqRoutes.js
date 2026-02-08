import express from "express";
import { testGroqConnection, generateInterviewQuestion, generateReport, generateDebateResponse, generateGroupDiscussionTopic, generateGDResponse } from "../controllers/groqController.js";

const router = express.Router();

router.post("/test", testGroqConnection);
router.post("/interview/question", generateInterviewQuestion);
router.post("/interview/report", generateReport);
router.post("/debate/response", generateDebateResponse);
router.post("/debate/topic", generateGroupDiscussionTopic);
router.post("/gd/response", generateGDResponse);

export default router;
