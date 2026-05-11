import { useState, useEffect } from "react";
import { MessageSquare, Share2, ArrowBigUp, ArrowBigDown, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ForumPost, ForumComment } from "./types";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

interface PostCardProps {
    post: ForumPost;
    currentUserId?: string | null;
    compact?: boolean;
    onDelete?: (postId: string) => void;
}

const API_ROOT = (import.meta.env.VITE_API_URL || "https://career-craft-u7fq.onrender.com/api").replace(/\/$/, "");
const FORUM_API_BASE = API_ROOT.endsWith("/api") ? API_ROOT : `${API_ROOT}/api`;
const STATIC_BASE = API_ROOT.replace(/\/api$/, "");

export const PostCard = ({ post, currentUserId, compact = false, onDelete }: PostCardProps) => {
    const userHasLiked = Boolean(currentUserId && post.likes.includes(currentUserId));
    const [score, setScore] = useState(post.likes.length);
    const [voteStatus, setVoteStatus] = useState<"up" | "down" | null>(
        userHasLiked ? "up" : null
    );

    // Comments state
    const [showComments, setShowComments] = useState(false);
    const [comments, setComments] = useState<ForumComment[]>([]);
    const [newComment, setNewComment] = useState("");
    const [loadingComments, setLoadingComments] = useState(false);
    const [commentCount, setCommentCount] = useState(post.commentCount || 0);

    useEffect(() => {
        setScore(post.likes.length);
        setVoteStatus(Boolean(currentUserId && post.likes.includes(currentUserId)) ? "up" : null);
        setCommentCount(post.commentCount || 0);
    }, [post.likes, post.commentCount, currentUserId]);

    const loadComments = async () => {
        if (!showComments) {
            setLoadingComments(true);
            try {
                const res = await fetch(`${FORUM_API_BASE}/forum/posts/${post._id}/comments`);
                if (res.ok) {
                    const data = await res.json();
                    setComments(data);
                    setCommentCount(data.length);
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
        const userInfo = JSON.parse(localStorage.getItem("userInfo") || "null");
        if (!newComment.trim() || !userInfo?.token) return;

        try {
            const res = await fetch(`${FORUM_API_BASE}/forum/posts/${post._id}/comments`, {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${userInfo.token}`
                },
                body: JSON.stringify({
                    content: newComment,
                }),
            });
            if (res.ok) {
                const comment = await res.json();
                setComments((currentComments) => [...currentComments, comment]);
                setCommentCount((currentCount) => currentCount + 1);
                setNewComment("");
            }
        } catch (err) {
            console.error("Failed to add comment", err);
        }
    };

    const handleVote = async (type: "up" | "down") => {
        const userInfo = JSON.parse(localStorage.getItem("userInfo") || "null");
        if (!userInfo?.token) {
            alert("Please log in to vote.");
            return;
        }

        // We only support 'likes' array in DB (which equates to an upvote)
        // If users click 'down', we can just remove their like if they had one or do nothing for now since schema only has likes.
        if (type === "down") {
             if (voteStatus === "up") {
                  const response = await fetch(`${FORUM_API_BASE}/forum/posts/${post._id}/like`, {
                      method: "POST",
                      headers: { 
                          "Content-Type": "application/json",
                          "Authorization": `Bearer ${userInfo.token}`
                      }
                  });

                  if (response.ok) {
                      const updatedPost = await response.json();
                      setVoteStatus(null);
                      setScore(updatedPost.likes.length);
                  }
             }
             return;
        }

        // Type is "up"
        try {
            const response = await fetch(`${FORUM_API_BASE}/forum/posts/${post._id}/like`, {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${userInfo.token}`
                }
            });

            if (response.ok) {
                const updatedPost = await response.json();
                const hasLiked = currentUserId ? updatedPost.likes.includes(currentUserId) : voteStatus !== "up";
                setVoteStatus(hasLiked ? "up" : null);
                setScore(updatedPost.likes.length);
            }
        } catch (err) {
            console.error("Error toggling like:", err);
        }
    };

    const handleShare = async () => {
        const shareUrl = `${window.location.origin}${window.location.pathname}#post-${post._id}`;

        try {
            if (navigator.share) {
                await navigator.share({
                    title: post.title,
                    text: post.content || post.title,
                    url: shareUrl
                });
                return;
            }

            await navigator.clipboard.writeText(shareUrl);
            alert("Post link copied.");
        } catch (error) {
            console.error("Share failed:", error);
        }
    };

    return (
        <div id={`post-${post._id}`} className="flex bg-card border rounded-md hover:border-sidebar-border transition-colors mb-3">
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
                        {post.postType === "image" && post.imageUrl && (
                            <div className="mb-3 overflow-hidden rounded-lg border bg-muted/30">
                                <img
                                    src={post.imageUrl.startsWith('data:') ? post.imageUrl : `${STATIC_BASE}${post.imageUrl}`}
                                    alt={post.title}
                                    className="max-h-[420px] w-full object-cover"
                                />
                            </div>
                        )}
                        {post.postType === "link" && post.linkUrl && (
                            <a
                                href={post.linkUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="mb-3 flex items-center gap-2 rounded-lg border p-3 text-sm text-primary hover:bg-muted/40"
                            >
                                <ExternalLink className="h-4 w-4 shrink-0" />
                                <span className="truncate">{post.linkUrl}</span>
                            </a>
                        )}
                    </>
                )}

                {/* Actions */}
                <div className="flex items-center gap-1 text-muted-foreground mb-2">
                    <Button variant="ghost" size="sm" className="gap-2 h-8 px-2 text-xs sm:text-sm hover:bg-muted" onClick={loadComments}>
                        <MessageSquare className="w-4 h-4" />
                        {commentCount} Comments
                    </Button>
                    <Button variant="ghost" size="sm" className="gap-2 h-8 px-2 text-xs sm:text-sm hover:bg-muted" onClick={() => void handleShare()}>
                        <Share2 className="w-4 h-4" />
                        Share
                    </Button>
                    {currentUserId === post.authorId && onDelete && (
                        <div className="ml-auto">
                            <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => onDelete(post._id)}>
                                Delete
                            </Button>
                        </div>
                    )}
                </div>

                {/* Comments Section */}
                {showComments && (
                    <div className="mt-4 border-t pt-4 space-y-4">
                        {currentUserId ? (
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
