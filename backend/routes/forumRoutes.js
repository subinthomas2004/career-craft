import express from 'express';
import multer from 'multer';
import {
    getPosts,
    getMyPosts,
    createPost,
    deletePost,
    toggleLike,
    getComments,
    addComment,
    uploadPostImage
} from '../controllers/forumController.js';

import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Get all posts (with optional search)
router.get('/posts', getPosts);

// Get my posts
router.get('/posts/me/:userId', getMyPosts);

// Create a post
router.post('/posts', protect, createPost);

// Upload image for a forum post
router.post('/posts/upload-image', protect, upload.single('image'), uploadPostImage);

// Delete a post
router.delete('/posts/:id', protect, deletePost);

// Toggle like on a post
router.post('/posts/:id/like', protect, toggleLike);

// Get comments for a post
router.get('/posts/:id/comments', getComments);

// Add a comment
router.post('/posts/:id/comments', protect, addComment);

export default router;
