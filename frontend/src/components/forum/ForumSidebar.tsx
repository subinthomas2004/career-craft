import { Home, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Community } from "./types";
import { cn } from "@/lib/utils";
import { CreateCommunityDialog } from "./CreateCommunityDialog";

interface ForumSidebarProps {
    communities: Community[];
    selectedCategory: string;
    onSelectCategory: (category: string) => void;
    onCreateCommunity: (community: Community) => void;
    className?: string;
}

export const ForumSidebar = ({
    communities,
    selectedCategory,
    onSelectCategory,
    onCreateCommunity,
    className,
}: ForumSidebarProps) => {
    return (
        <div className={cn("flex flex-col h-[calc(100vh-4rem)] sticky top-16", className)}>
            <ScrollArea className="flex-1 pr-4">
                <div className="space-y-6 py-4">

                    {/* Home Link (Always useful) */}
                    <div className="px-3">
                        <Button
                            variant={selectedCategory === "Home" ? "secondary" : "ghost"}
                            className="w-full justify-start gap-2"
                            onClick={() => onSelectCategory("Home")}
                        >
                            <Home className="w-4 h-4" />
                            Home
                        </Button>
                    </div>

                    <Separator />

                    {/* Communities */}
                    <div className="px-3 py-2">
                        <div className="flex items-center justify-between px-4 mb-2">
                            <h2 className="text-xs font-semibold tracking-tight text-muted-foreground uppercase">
                                Communities
                            </h2>
                            <CreateCommunityDialog onCreate={onCreateCommunity}>
                                <Button variant="ghost" size="icon" className="h-4 w-4">
                                    <Plus className="h-3 w-3" />
                                </Button>
                            </CreateCommunityDialog>
                        </div>

                        <div className="space-y-1">
                            {communities.length === 0 ? (
                                <p className="px-4 text-xs text-muted-foreground py-2">No communities yet.</p>
                            ) : (
                                communities.map((community) => (
                                    <Button
                                        key={community.id}
                                        variant={selectedCategory === community.name ? "secondary" : "ghost"}
                                        className="w-full justify-start gap-2 font-normal"
                                        onClick={() => onSelectCategory(community.name)}
                                    >
                                        <span className="text-lg leading-none">{community.icon}</span>
                                        <span className="truncate">{community.name}</span>
                                    </Button>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </ScrollArea>
        </div>
    );
};
