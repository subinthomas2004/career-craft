import { useState } from "react";
import { MessageSquare, Share2, MoreHorizontal, ArrowBigUp, ArrowBigDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ForumPost } from "./types";
import { cn } from "@/lib/utils";

interface PostCardProps {
    post: ForumPost;
    compact?: boolean;
}

export const PostCard = ({ post, compact = false }: PostCardProps) => {
    const [voteStatus, setVoteStatus] = useState<"up" | "down" | null>(null);
    const [score, setScore] = useState(post.likes);

    const handleVote = (type: "up" | "down") => {
        if (voteStatus === type) {
            setVoteStatus(null);
            setScore(type === "up" ? score - 1 : score + 1);
        } else {
            if (voteStatus === "up") setScore(score - 2);
            else if (voteStatus === "down") setScore(score + 2);
            else setScore(type === "up" ? score + 1 : score - 1);
            setVoteStatus(type);
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
                    {post.community.icon && <span className="text-base">{post.community.icon}</span>}
                    <span className="font-bold text-foreground hover:underline z-10 relative" onClick={(e) => e.stopPropagation()}>
                        {post.community.name}
                    </span>
                    <span>•</span>
                    <span className="hover:underline">Posted by u/{post.author.name}</span>
                    <span>•</span>
                    <span>{post.createdAt}</span>
                </div>

                {/* Title */}
                <h3 className="text-lg font-medium leading-6 text-foreground mb-2">{post.title}</h3>

                {/* Tags */}
                {post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                        {post.tags.map(tag => (
                            <Badge key={tag} variant="secondary" className="text-xs font-normal rounded-full px-2 py-0">
                                {tag}
                            </Badge>
                        ))}
                    </div>
                )}

                {/* Body Preview */}
                {!compact && (
                    <>
                        <div className="text-sm text-foreground/90 line-clamp-3 mb-3">
                            {post.content}
                        </div>
                        {post.image && (
                            <div className="rounded-lg overflow-hidden border border-border mb-3 max-h-[400px] flex justify-center bg-black/5">
                                <img src={post.image} alt={post.title} className="object-contain max-h-[400px] w-full" />
                            </div>
                        )}
                    </>
                )}

                {/* Actions */}
                <div className="flex items-center gap-1 text-muted-foreground">
                    <Button variant="ghost" size="sm" className="gap-2 h-8 px-2 text-xs sm:text-sm hover:bg-muted">
                        <MessageSquare className="w-4 h-4" />
                        {post.replies} Comments
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
                                <DropdownMenuItem>Hide</DropdownMenuItem>
                                <DropdownMenuItem>Report</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div>
        </div>
    );
};
