import mongoose from 'mongoose';

const forumPostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    default: ""
  },
  postType: {
    type: String,
    enum: ["text", "image", "link"],
    default: "text"
  },
  imageUrl: {
    type: String,
    default: ""
  },
  linkUrl: {
    type: String,
    default: ""
  },
  authorId: {
    type: String, // Storing Firebase uid usually in this project, or object id
    required: true
  },
  authorName: {
    type: String,
    required: true
  },
  authorPicture: {
    type: String,
    default: ""
  },
  likes: [{
    type: String // Array of user IDs who liked the post to prevent duplicate likes
  }],
}, { timestamps: true });

const ForumPost = mongoose.models.ForumPost || mongoose.model('ForumPost', forumPostSchema);

export default ForumPost;
