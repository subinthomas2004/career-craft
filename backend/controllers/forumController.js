import ForumPost from '../models/ForumPost.js';
import ForumComment from '../models/ForumComment.js';
import fs from 'fs';
import path from 'path';

const buildPostResponse = async (post) => {
    const commentCount = await ForumComment.countDocuments({ postId: post._id });
    return {
        ...post.toObject(),
        commentCount
    };
};

// Get all posts, optionally filtered by search term, sorted by likes
export const getPosts = async (req, res) => {
    try {
        const { search } = req.query;
        let query = {};

        if (search) {
            query = {
                $or: [
                    { title: { $regex: search, $options: 'i' } },
                    { content: { $regex: search, $options: 'i' } }
                ]
            };
        }

        const posts = await ForumPost.find(query).sort({ createdAt: -1 });

        const postsWithCommentCount = await Promise.all(posts.map(buildPostResponse));

        res.status(200).json(postsWithCommentCount);
    } catch (error) {
        console.error('Error fetching forum posts:', error);
        res.status(500).json({ error: 'Failed to fetch posts' });
    }
};

export const getMyPosts = async (req, res) => {
    try {
        const { userId } = req.params; // Assuming userId is passed as param or from auth middleware
        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' });
        }

        const posts = await ForumPost.find({ authorId: userId }).sort({ createdAt: -1 });

        const postsWithCommentCount = await Promise.all(posts.map(buildPostResponse));

        res.status(200).json(postsWithCommentCount);
    } catch (error) {
        console.error('Error fetching user posts:', error);
        res.status(500).json({ error: 'Failed to fetch user posts' });
    }
};

export const createPost = async (req, res) => {
    try {
        const normalizedTitle = req.body.title?.trim();
        const normalizedContent = req.body.content?.trim() || "";
        const postType = req.body.postType || 'text';
        const imageUrl = req.body.imageUrl?.trim() || "";
        const linkUrl = req.body.linkUrl?.trim() || "";

        if (!normalizedTitle) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        if (postType === 'text' && !normalizedContent) {
            return res.status(400).json({ error: 'Text posts require content' });
        }

        if (postType === 'image' && !imageUrl) {
            return res.status(400).json({ error: 'Image posts require an uploaded image' });
        }

        if (postType === 'link' && !linkUrl) {
            return res.status(400).json({ error: 'Link posts require a URL' });
        }

        if (!req.user) {
            return res.status(401).json({ error: 'Not authorized' });
        }

        const newPost = new ForumPost({
            title: normalizedTitle,
            content: normalizedContent,
            postType,
            imageUrl,
            linkUrl,
            authorId: req.user._id.toString(),
            authorName: req.user.name,
            authorPicture: req.user.profilePicture || "",
            likes: []
        });

        const savedPost = await newPost.save();
        res.status(201).json(await buildPostResponse(savedPost));
    } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({ error: 'Failed to create post' });
    }
};

export const deletePost = async (req, res) => {
    try {
        const { id } = req.params;

        const post = await ForumPost.findById(id);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        if (!req.user) {
            return res.status(401).json({ error: 'Not authorized' });
        }

        if (post.authorId !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Unauthorized to delete this post' });
        }

        await ForumPost.findByIdAndDelete(id);
        await ForumComment.deleteMany({ postId: id });

        res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
        console.error('Error deleting post:', error);
        res.status(500).json({ error: 'Failed to delete post' });
    }
};

export const toggleLike = async (req, res) => {
    try {
        const { id } = req.params;
        if (!req.user) {
            return res.status(401).json({ error: 'Not authorized' });
        }

        const post = await ForumPost.findById(id);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        const userId = req.user._id.toString();
        const hasLiked = post.likes.includes(userId);
        
        if (hasLiked) {
            // Unlike
            post.likes = post.likes.filter(id => id !== userId);
        } else {
            // Like
            post.likes.push(userId);
        }

        await post.save();
        res.status(200).json(await buildPostResponse(post));
    } catch (error) {
        console.error('Error toggling like:', error);
        res.status(500).json({ error: 'Failed to toggle like' });
    }
};

export const getComments = async (req, res) => {
    try {
        const { id } = req.params;
        const comments = await ForumComment.find({ postId: id }).sort({ createdAt: 1 });
        res.status(200).json(comments);
    } catch (error) {
        console.error('Error fetching comments:', error);
        res.status(500).json({ error: 'Failed to fetch comments' });
    }
};

export const addComment = async (req, res) => {
    try {
        const { id } = req.params;
        const normalizedContent = req.body.content?.trim();

        if (!normalizedContent) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        if (!req.user) {
            return res.status(401).json({ error: 'Not authorized' });
        }

        const post = await ForumPost.findById(id);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        const newComment = new ForumComment({
            postId: id,
            authorId: req.user._id.toString(),
            authorName: req.user.name,
            authorPicture: req.user.profilePicture || "",
            content: normalizedContent
        });

        const savedComment = await newComment.save();
        res.status(201).json(savedComment);
    } catch (error) {
        console.error('Error adding comment:', error);
        res.status(500).json({ error: 'Failed to add comment' });
    }
};

export const uploadPostImage = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'Not authorized' });
        }

        if (!req.file) {
            return res.status(400).json({ error: 'No image uploaded' });
        }

        // Convert the image buffer to a Base64 Data URL
        const base64Image = req.file.buffer.toString('base64');
        const mimeType = req.file.mimetype || 'image/jpeg';
        const dataUrl = `data:${mimeType};base64,${base64Image}`;

        res.status(201).json({
            imageUrl: dataUrl
        });
    } catch (error) {
        console.error('Error uploading forum image:', error);
        res.status(500).json({ error: 'Failed to process image' });
    }
};
