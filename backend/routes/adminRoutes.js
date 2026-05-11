import express from 'express';
import { protect, admin } from '../middleware/authMiddleware.js';
import { 
    getStats, 
    getUsers, 
    deleteUser,
    toggleSuspendUser,
    getLogs,
    getFeedback,
    resolveFeedback,
    getAdminForumPosts,
    sendNotification,
    sendEmailBroadcast
} from '../controllers/adminController.js';

const router = express.Router();

// Stats
router.get('/stats', protect, admin, getStats);

// Users
router.get('/users', protect, admin, getUsers);
router.delete('/users/:id', protect, admin, deleteUser);
router.put('/users/:id/toggle-suspend', protect, admin, toggleSuspendUser);

// Logs
router.get('/logs', protect, admin, getLogs);

// Feedback
router.get('/feedback', protect, admin, getFeedback);
router.put('/feedback/:id', protect, admin, resolveFeedback);

// Forum control
router.get('/forum/posts', protect, admin, getAdminForumPosts);

// Notifications
router.post('/notifications', protect, admin, sendNotification);
router.post('/email-broadcast', protect, admin, sendEmailBroadcast);

export default router;
