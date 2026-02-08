import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Community } from "./types";
import { Cake, Users, Info } from "lucide-react";

interface CommunityInfoProps {
    community: Community;
}

export const CommunityInfo = ({ community }: CommunityInfoProps) => {
    return (
        <div className="bg-card border rounded-md overflow-hidden sticky top-20">
            <div className="h-12 bg-primary/20 w-full" />
            <div className="px-4 pb-4">
                <div className="flex items-end gap-3 -mt-6 mb-3">
                    <div className="w-16 h-16 rounded-full bg-background border-4 border-background flex items-center justify-center text-3xl shadow-sm">
                        {community.icon}
                    </div>
                    <h2 className="font-bold text-lg pb-1">{community.name}</h2>
                </div>

                <p className="text-sm text-muted-foreground mb-4">
                    {community.description}
                </p>

                <div className="flex gap-8 text-sm font-medium mb-4 text-foreground">
                    <div className="flex flex-col">
                        <span className="font-bold text-base">{Intl.NumberFormat('en-US', { notation: "compact" }).format(community.members)}</span>
                        <span className="text-xs text-muted-foreground font-normal">Members</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="font-bold text-base flex items-center gap-1">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            124
                        </span>
                        <span className="text-xs text-muted-foreground font-normal">Online</span>
                    </div>
                </div>

                <Separator className="my-4" />

                <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Cake className="w-4 h-4" />
                        <span>Created Jan 1, 2024</span>
                    </div>
                </div>

                <Button className="w-full mt-4 rounded-full font-semibold">Join Community</Button>
            </div>
        </div>
    );
};
