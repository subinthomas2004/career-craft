import mongoose from 'mongoose';

const forumPostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  authorId: {
    type: String, // Storing Firebase uid usually in this project, or object id
    required: true
  },
  authorName: {
    type: String,
    required: true
  },
  likes: [{
    type: String // Array of user IDs who liked the post to prevent duplicate likes
  }],
}, { timestamps: true });

const ForumPost = mongoose.models.ForumPost || mongoose.model('ForumPost', forumPostSchema);

export default ForumPost;
