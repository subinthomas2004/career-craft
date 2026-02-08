export interface Community {
    id: string;
    name: string;
    icon: string;
    members: number;
    description: string;
}

export interface ForumPost {
    id: string;
    title: string;
    author: {
        name: string;
        avatar?: string;
    };
    community: Community;
    content: string;
    likes: number; // This will act as upvotes - downvotes
    upvotes: number;
    downvotes: number;
    replies: number;
    views: number;
    createdAt: string;
    isPinned?: boolean;
    tags: string[];
    image?: string;
}
