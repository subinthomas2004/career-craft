import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Community } from "./types";

interface CreateCommunityDialogProps {
    children: React.ReactNode;
    onCreate: (community: Community) => void;
}

export const CreateCommunityDialog = ({ children, onCreate }: CreateCommunityDialogProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [icon, setIcon] = useState("💬");

    const handleSubmit = () => {
        if (!name) return;

        const newCommunity: Community = {
            id: Date.now().toString(),
            name,
            description,
            icon,
            members: 1, // Starter member
        };

        onCreate(newCommunity);
        setIsOpen(false);
        setName("");
        setDescription("");
        setIcon("💬");
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create a Community</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            placeholder="e.g., ReactDevelopers"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            placeholder="What is this community about?"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="icon">Icon (Emoji)</Label>
                        <Input
                            id="icon"
                            placeholder="e.g., 🚀"
                            value={icon}
                            onChange={(e) => setIcon(e.target.value)}
                            className="w-20"
                        />
                    </div>
                </div>
                <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
                    <Button onClick={handleSubmit} disabled={!name}>Create Community</Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};
