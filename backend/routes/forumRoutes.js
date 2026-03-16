import express from 'express';
import {
    getPosts,
    getMyPosts,
    createPost,
    deletePost,
    toggleLike,
    getComments,
    addComment
} from '../controllers/forumController.js';

import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get all posts (with optional search)
router.get('/posts', getPosts);

// Get my posts
router.get('/posts/me/:userId', getMyPosts);

// Create a post
router.post('/posts', protect, createPost);

// Delete a post
router.delete('/posts/:id', protect, deletePost);

// Toggle like on a post
router.post('/posts/:id/like', protect, toggleLike);

// Get comments for a post
router.get('/posts/:id/comments', getComments);

// Add a comment
router.post('/posts/:id/comments', protect, addComment);

export default router;
