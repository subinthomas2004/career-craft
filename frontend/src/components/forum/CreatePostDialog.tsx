import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Image, Link, Type } from "lucide-react";
import { ForumPost } from "./types";

interface CreatePostDialogProps {
    children: React.ReactNode;
    onCreate?: (post: Pick<ForumPost, 'title' | 'content'>) => void;
}

export const CreatePostDialog = ({ children, onCreate }: CreatePostDialogProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [activeTab, setActiveTab] = useState("post");

    const handleSubmit = () => {
        if (!title || !onCreate) return;

        onCreate({ title, content });
        setIsOpen(false);

        // Reset form
        setTitle("");
        setContent("");
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-[700px] h-[80vh] flex flex-col p-0 gap-0 overflow-hidden">
                <DialogHeader className="p-4 border-b">
                    <DialogTitle>Create a post</DialogTitle>
                </DialogHeader>

                <div className="p-4 flex flex-col flex-1 overflow-y-auto">

                    <Tabs defaultValue="post" value={activeTab} className="flex-1 flex flex-col" onValueChange={setActiveTab}>
                        <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0 h-auto">
                            <TabsTrigger value="post" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent pb-3 px-6 gap-2">
                                <Type className="h-4 w-4" /> Post
                            </TabsTrigger>
                            <TabsTrigger value="image" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent pb-3 px-6 gap-2">
                                <Image className="h-4 w-4" /> Images & Video
                            </TabsTrigger>
                            <TabsTrigger value="link" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent pb-3 px-6 gap-2">
                                <Link className="h-4 w-4" /> Link
                            </TabsTrigger>
                        </TabsList>

                        <div className="flex-1 py-4 space-y-4">
                            <Input
                                placeholder="Title"
                                className="text-lg font-medium border-secondary bg-transparent focus-visible:ring-0 focus-visible:border-primary px-3 py-6"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />

                            <div className="bg-secondary/30 rounded-md border min-h-[200px] flex flex-col relative">
                                {activeTab === "image" ? (
                                    <div className="flex items-center justify-center flex-1 border-2 border-dashed border-muted m-4 rounded-lg text-muted-foreground flex-col gap-2">
                                        <Image className="h-12 w-12 opacity-50" />
                                        <p>Drag and drop images or</p>
                                        <Button variant="outline">Upload</Button>
                                    </div>
                                ) : activeTab === "link" ? (
                                    <div className="p-4">
                                        <Input placeholder="Url" className="bg-background" />
                                    </div>
                                ) : (
                                    <Textarea
                                        placeholder="Text (optional)"
                                        className="resize-none border-none bg-transparent focus-visible:ring-0 min-h-[200px] p-4"
                                        value={content}
                                        onChange={(e) => setContent(e.target.value)}
                                    />
                                )}
                            </div>

                            <div className="flex gap-2">
                                <Button variant="secondary" size="sm" className="rounded-full">
                                    + OC
                                </Button>
                                <Button variant="secondary" size="sm" className="rounded-full">
                                    + Spoiler
                                </Button>
                                <Button variant="secondary" size="sm" className="rounded-full">
                                    + NSFW
                                </Button>
                            </div>
                        </div>
                    </Tabs>
                </div>

                <div className="p-4 border-t flex justify-end gap-2 bg-muted/10">
                    <Button variant="ghost" onClick={() => setIsOpen(false)}>Cancel</Button>
                    <Button disabled={!title} onClick={handleSubmit}>Post</Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};
