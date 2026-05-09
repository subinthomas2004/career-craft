import express from 'express';
import { getNotifications, markRead, deleteNotification } from '../controllers/notificationController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
    .get(protect, getNotifications)
    .put(protect, markRead);

router.route('/:id')
    .delete(protect, deleteNotification);

export default router;
