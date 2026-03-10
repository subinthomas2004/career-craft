import { Home, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
interface ForumSidebarProps {
    selectedCategory: string;
    onSelectCategory: (category: string) => void;
    className?: string;
}

export const ForumSidebar = ({
    selectedCategory,
    onSelectCategory,
    className,
}: ForumSidebarProps) => {
    return (
        <div className={cn("flex flex-col h-[calc(100vh-4rem)] sticky top-16", className)}>
            <ScrollArea className="flex-1 pr-4">
                <div className="space-y-6 py-4">

                    {/* Home Link (All Posts) */}
                    <div className="px-3">
                        <Button
                            variant={selectedCategory === "Home" ? "secondary" : "ghost"}
                            className="w-full justify-start gap-2"
                            onClick={() => onSelectCategory("Home")}
                        >
                            <Home className="w-4 h-4" />
                            All Posts
                        </Button>
                    </div>

                    <Separator />

                    {/* Navigation */}
                    <div className="px-3 py-2">
                        <div className="space-y-1">
                            <Button
                                variant={selectedCategory === "YourPosts" ? "secondary" : "ghost"}
                                className="w-full justify-start gap-2 font-normal"
                                onClick={() => onSelectCategory("YourPosts")}
                            >
                                <span className="text-lg leading-none">👤</span>
                                <span className="truncate">Your Posts</span>
                            </Button>
                        </div>
                    </div>
                </div>
            </ScrollArea>
        </div>
    );
};
