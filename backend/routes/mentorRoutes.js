import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { 
    getMentorProfile, 
    updatePersonality, 
    generateGoals, 
    toggleGoal, 
    mentorChat, 
    analyzeBehavior, 
    generateRoadmap, 
    generateReflection 
} from "../controllers/mentorController.js";

const router = express.Router();

router.use(protect); // All routes protected

router.get("/profile", getMentorProfile);
router.put("/personality", updatePersonality);
router.post("/chat", mentorChat);

router.post("/goals/generate", generateGoals);
router.patch("/goals/toggle", toggleGoal);

router.post("/behavior/analyze", analyzeBehavior);
router.post("/roadmap/generate", generateRoadmap);
router.post("/reflection/generate", generateReflection);

export default router;
