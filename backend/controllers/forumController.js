import ForumPost from '../models/ForumPost.js';
import ForumComment from '../models/ForumComment.js';

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

        const posts = await ForumPost.find(query).sort({ likes: -1, createdAt: -1 });

        // Add comment count to each post
        const postsWithCommentCount = await Promise.all(posts.map(async (post) => {
            const commentCount = await ForumComment.countDocuments({ postId: post._id });
            return {
                ...post.toObject(),
                commentCount
            };
        }));

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
        
        const postsWithCommentCount = await Promise.all(posts.map(async (post) => {
            const commentCount = await ForumComment.countDocuments({ postId: post._id });
            return {
                ...post.toObject(),
                commentCount
            };
        }));

        res.status(200).json(postsWithCommentCount);
    } catch (error) {
        console.error('Error fetching user posts:', error);
        res.status(500).json({ error: 'Failed to fetch user posts' });
    }
};

export const createPost = async (req, res) => {
    try {
        const { title, content, authorId, authorName } = req.body;

        if (!title || !content || !authorId || !authorName) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const newPost = new ForumPost({
            title,
            content,
            authorId,
            authorName,
            likes: []
        });

        const savedPost = await newPost.save();
        res.status(201).json(savedPost);
    } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({ error: 'Failed to create post' });
    }
};

export const deletePost = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId } = req.body; // or req.user if using auth middleware

        const post = await ForumPost.findById(id);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        // Optional: Check if the user is the author
        // if (post.authorId !== userId) {
        //    return res.status(403).json({ error: 'Unauthorized to delete this post' });
        // }

        await ForumPost.findByIdAndDelete(id);
        // Delete associated comments
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
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({ error: 'User ID is required to like a post' });
        }

        const post = await ForumPost.findById(id);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        const hasLiked = post.likes.includes(userId);
        
        if (hasLiked) {
            // Unlike
            post.likes = post.likes.filter(id => id !== userId);
        } else {
            // Like
            post.likes.push(userId);
        }

        await post.save();
        res.status(200).json(post);
    } catch (error) {
        console.error('Error toggling like:', error);
        res.status(500).json({ error: 'Failed to toggle like' });
    }
};

export const getComments = async (req, res) => {
    try {
        const { postId } = req.params;
        const comments = await ForumComment.find({ postId }).sort({ createdAt: 1 });
        res.status(200).json(comments);
    } catch (error) {
        console.error('Error fetching comments:', error);
        res.status(500).json({ error: 'Failed to fetch comments' });
    }
};

export const addComment = async (req, res) => {
    try {
        const { postId } = req.params;
        const { content, authorId, authorName } = req.body;

        if (!content || !authorId || !authorName) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Verify post exists
        const post = await ForumPost.findById(postId);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        const newComment = new ForumComment({
            postId,
            authorId,
            authorName,
            content
        });

        const savedComment = await newComment.save();
        res.status(201).json(savedComment);
    } catch (error) {
        console.error('Error adding comment:', error);
        res.status(500).json({ error: 'Failed to add comment' });
    }
};
