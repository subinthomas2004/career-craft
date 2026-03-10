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

/*
import { authCheck } from '../middleware/auth.js'; 
// Use your project's auth middleware if needed
// For now, these routes don't strictly enforce backend auth middleware 
// to keep them simple and based on client requests body logic as implemented in controller.
// You can add it later if the rest of the application uses it consistently.
*/

const router = express.Router();

// Get all posts (with optional search)
router.get('/posts', getPosts);

// Get my posts
router.get('/posts/me/:userId', getMyPosts);

// Create a post
router.post('/posts', createPost);

// Delete a post
router.delete('/posts/:id', deletePost);

// Toggle like on a post
router.post('/posts/:id/like', toggleLike);

// Get comments for a post
router.get('/posts/:id/comments', getComments);

// Add a comment
router.post('/posts/:id/comments', addComment);

export default router;
