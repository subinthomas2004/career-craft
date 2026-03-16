import { useState, useEffect } from "react";
import { MessageSquare, Share2, MoreHorizontal, ArrowBigUp, ArrowBigDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ForumPost, ForumComment } from "./types";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/firebase";

interface PostCardProps {
    post: ForumPost;
    compact?: boolean;
    onDelete?: (postId: string) => void;
}

export const PostCard = ({ post, compact = false, onDelete }: PostCardProps) => {
    const [user, setUser] = useState<User | null>(null);
    const [mongoUser, setMongoUser] = useState<any>(null);
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            const storedUser = localStorage.getItem("userInfo");
            if (storedUser) {
                setMongoUser(JSON.parse(storedUser));
            }
        });
        return () => unsubscribe();
    }, []);

    // Current user - hardcode or pull from context later, using local storage for toggle
    const [score, setScore] = useState(post.likes.length);
    const [voteStatus, setVoteStatus] = useState<"up" | "down" | null>(null);

    // Comments state
    const [showComments, setShowComments] = useState(false);
    const [comments, setComments] = useState<ForumComment[]>([]);
    const [newComment, setNewComment] = useState("");
    const [loadingComments, setLoadingComments] = useState(false);

    const loadComments = async () => {
        if (!showComments) {
            setLoadingComments(true);
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL || "https://career-craft-u7fq.onrender.com"}/api/forum/posts/${post._id}/comments`);
                if (res.ok) {
                    const data = await res.json();
                    setComments(data);
                }
            } catch (err) {
                console.error("Failed to load comments", err);
            } finally {
                setLoadingComments(false);
            }
        }
        setShowComments(!showComments);
    };

    const handleAddComment = async () => {
        if (!newComment.trim() || !user) return;
        try {
            const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
            const token = userInfo.token;

            const res = await fetch(`${import.meta.env.VITE_API_URL || "https://career-craft-u7fq.onrender.com"}/api/forum/posts/${post._id}/comments`, {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    content: newComment,
                    authorId: mongoUser._id,
                }),
            });
            if (res.ok) {
                const comment = await res.json();
                setComments([...comments, comment]);
                setNewComment("");
            }
        } catch (err) {
            console.error("Failed to add comment", err);
        }
    };

    const handleVote = async (type: "up" | "down") => {
        if (!user) {
            alert("Please log in to vote.");
            return;
        }

        // We only support 'likes' array in DB (which equates to an upvote)
        // If users click 'down', we can just remove their like if they had one or do nothing for now since schema only has likes.
        if (type === "down") {
             if (voteStatus === "up") {
                  setVoteStatus(null);
                  setScore(score - 1);
                  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
                  const token = userInfo.token;

                  // Call API to remove like
                  await fetch(`${import.meta.env.VITE_API_URL || "https://career-craft-u7fq.onrender.com"}/api/forum/posts/${post._id}/like`, {
                      method: "POST",
                      headers: { 
                          "Content-Type": "application/json",
                          "Authorization": `Bearer ${token}`
                      },
                      body: JSON.stringify({ userId: mongoUser._id }),
                  });
             }
             return;
        }

        // Type is "up"
        try {
            const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
            const token = userInfo.token;

            await fetch(`${import.meta.env.VITE_API_URL || "https://career-craft-u7fq.onrender.com"}/api/forum/posts/${post._id}/like`, {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ userId: mongoUser._id }),
            });

            if (voteStatus === "up") {
                setVoteStatus(null);
                setScore(score - 1);
            } else {
                setVoteStatus("up");
                setScore(score + 1);
            }
        } catch (err) {
            console.error("Error toggling like:", err);
        }
    };

    return (
        <div className="flex bg-card border rounded-md hover:border-sidebar-border transition-colors cursor-pointer mb-3">
            {/* Vote Sidebar */}
            <div className="flex flex-col items-center p-2 bg-muted/30 w-10 sm:w-12 rounded-l-md border-r border-transparent">
                <Button
                    variant="ghost"
                    size="icon"
                    className={cn("h-6 w-6 sm:h-8 sm:w-8 hover:bg-orange-500/10 hover:text-orange-500",
                        voteStatus === "up" && "text-orange-500"
                    )}
                    onClick={(e) => {
                        e.stopPropagation();
                        handleVote("up");
                    }}
                >
                    <ArrowBigUp className={cn("h-5 w-5 sm:h-6 sm:w-6", voteStatus === "up" && "fill-current")} />
                </Button>
                <span className={cn("text-xs sm:text-sm font-bold py-1",
                    voteStatus === "up" ? "text-orange-500" : voteStatus === "down" ? "text-blue-500" : ""
                )}>
                    {Intl.NumberFormat('en-US', { notation: "compact", maximumFractionDigits: 1 }).format(score)}
                </span>
                <Button
                    variant="ghost"
                    size="icon"
                    className={cn("h-6 w-6 sm:h-8 sm:w-8 hover:bg-blue-500/10 hover:text-blue-500",
                        voteStatus === "down" && "text-blue-500"
                    )}
                    onClick={(e) => {
                        e.stopPropagation();
                        handleVote("down");
                    }}
                >
                    <ArrowBigDown className={cn("h-5 w-5 sm:h-6 sm:w-6", voteStatus === "down" && "fill-current")} />
                </Button>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 p-2 sm:p-3">
                {/* Header */}
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                    <Avatar className="w-5 h-5">
                        {post.authorPicture ? (
                            <img src={post.authorPicture} alt={post.authorName} className="rounded-full object-cover" />
                        ) : (
                            <AvatarFallback>{post.authorName[0]}</AvatarFallback>
                        )}
                    </Avatar>
                    <span className="hover:underline font-medium text-foreground">Post by {post.authorName}</span>
                    <span>•</span>
                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                </div>

                {/* Title */}
                <h3 className="text-lg font-medium leading-6 text-foreground mb-2">{post.title}</h3>



                {/* Body Preview */}
                {!compact && (
                    <>
                        <div className="text-sm text-foreground/90 line-clamp-3 mb-3">
                            {post.content}
                        </div>
                    </>
                )}

                {/* Actions */}
                <div className="flex items-center gap-1 text-muted-foreground mb-2">
                    <Button variant="ghost" size="sm" className="gap-2 h-8 px-2 text-xs sm:text-sm hover:bg-muted" onClick={loadComments}>
                        <MessageSquare className="w-4 h-4" />
                        {post.commentCount || 0} Comments
                    </Button>
                    <Button variant="ghost" size="sm" className="gap-2 h-8 px-2 text-xs sm:text-sm hover:bg-muted">
                        <Share2 className="w-4 h-4" />
                        Share
                    </Button>
                    <div className="ml-auto">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <MoreHorizontal className="w-4 h-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem>Save</DropdownMenuItem>
                                <DropdownMenuItem>Report</DropdownMenuItem>
                                {user && user.uid === post.authorId && onDelete && (
                                    <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => onDelete(post._id)}>
                                        Delete Post
                                    </DropdownMenuItem>
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                {/* Comments Section */}
                {showComments && (
                    <div className="mt-4 border-t pt-4 space-y-4">
                        {user ? (
                            <div className="flex gap-2 mb-4">
                                <Input 
                                    placeholder="Add a comment..."
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') handleAddComment();
                                    }}
                                    className="bg-muted/40 h-9"
                                />
                                <Button size="sm" onClick={handleAddComment} disabled={!newComment.trim()}>Post</Button>
                            </div>
                        ) : (
                            <p className="text-xs text-muted-foreground mb-4">Log in to comment.</p>
                        )}
                        
                        {loadingComments ? (
                            <p className="text-xs text-muted-foreground text-center py-2">Loading comments...</p>
                        ) : comments.length === 0 ? (
                            <p className="text-xs text-muted-foreground text-center py-2">No comments yet. Be the first!</p>
                        ) : (
                            <div className="space-y-4">
                                {comments.map((comment) => (
                                    <div key={comment._id} className="flex gap-2">
                                        <Avatar className="w-6 h-6">
                                            {comment.authorPicture ? (
                                                <img src={comment.authorPicture} alt={comment.authorName} className="rounded-full object-cover" />
                                            ) : (
                                                <AvatarFallback className="text-[10px]">{comment.authorName[0]}</AvatarFallback>
                                            )}
                                        </Avatar>
                                        <div className="bg-muted/40 rounded-lg p-2 flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-semibold text-xs text-foreground cursor-pointer hover:underline">{comment.authorName}</span>
                                                <span className="text-[10px] text-muted-foreground">{new Date(comment.createdAt).toLocaleDateString()}</span>
                                            </div>
                                            <p className="text-sm text-foreground/90">{comment.content}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
