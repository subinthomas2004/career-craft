import mongoose from 'mongoose';

const forumCommentSchema = new mongoose.Schema({
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ForumPost',
    required: true
  },
  authorId: {
    type: String,
    required: true
  },
  authorName: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  }
}, { timestamps: true });

const ForumComment = mongoose.models.ForumComment || mongoose.model('ForumComment', forumCommentSchema);

export default ForumComment;
