export interface ForumComment {
    _id: string;
    postId: string;
    authorId: string;
    authorName: string;
    content: string;
    createdAt: string;
}

export interface ForumPost {
    _id: string;
    title: string;
    content: string;
    authorId: string;
    authorName: string;
    likes: string[]; // Array of User IDs
    commentCount?: number;
    createdAt: string;
}
