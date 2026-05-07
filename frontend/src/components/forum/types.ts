export interface ForumComment {
    _id: string;
    postId: string;
    authorId: string;
    authorName: string;
    authorPicture?: string;
    content: string;
    createdAt: string;
}

export interface ForumPost {
    _id: string;
    title: string;
    content: string;
    postType?: "text" | "image" | "link";
    imageUrl?: string;
    linkUrl?: string;
    authorId: string;
    authorName: string;
    authorPicture?: string;
    likes: string[]; // Array of User IDs
    commentCount?: number;
    createdAt: string;
}
