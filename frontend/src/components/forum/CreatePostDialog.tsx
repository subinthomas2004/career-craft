import { useMemo, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Image, Link, Loader2, Type } from "lucide-react";
import { ForumPost } from "./types";

interface CreatePostDialogProps {
    children: React.ReactNode;
    onCreate?: (post: Pick<ForumPost, 'title' | 'content' | 'postType' | 'imageUrl' | 'linkUrl'>) => Promise<void> | void;
}

const API_ROOT = (import.meta.env.VITE_API_URL || "https://career-craft-u7fq.onrender.com/api").replace(/\/$/, "");
const FORUM_API_BASE = API_ROOT.endsWith("/api") ? API_ROOT : `${API_ROOT}/api`;

export const CreatePostDialog = ({ children, onCreate }: CreatePostDialogProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [linkUrl, setLinkUrl] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [activeTab, setActiveTab] = useState<"text" | "image" | "link">("text");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    const submitDisabled = useMemo(() => {
        if (!title.trim() || isSubmitting || isUploading) return true;
        if (activeTab === "text") return !content.trim();
        if (activeTab === "image") return !imageUrl;
        return !linkUrl.trim();
    }, [activeTab, content, imageUrl, isSubmitting, isUploading, linkUrl, title]);

    const resetForm = () => {
        setTitle("");
        setContent("");
        setLinkUrl("");
        setImageUrl("");
        setActiveTab("text");
    };

    const handleImageUpload = async (file: File) => {
        const userInfo = JSON.parse(localStorage.getItem("userInfo") || "null");
        if (!userInfo?.token) {
            alert("You must be logged in to upload images.");
            return;
        }

        setIsUploading(true);
        try {
            const formData = new FormData();
            formData.append("image", file);

            const response = await fetch(`${FORUM_API_BASE}/forum/posts/upload-image`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${userInfo.token}`
                },
                body: formData
            });

            if (!response.ok) {
                throw new Error("Image upload failed");
            }

            const data = await response.json();
            setImageUrl(data.imageUrl);
        } catch (error) {
            console.error("Error uploading forum image:", error);
            alert("Failed to upload image.");
        } finally {
            setIsUploading(false);
        }
    };

    const handleSubmit = async () => {
        if (submitDisabled || !onCreate) return;

        setIsSubmitting(true);
        try {
            await onCreate({
                title: title.trim(),
                content: content.trim(),
                postType: activeTab,
                imageUrl,
                linkUrl: linkUrl.trim()
            });
            setIsOpen(false);
            resetForm();
        } catch (error) {
            console.error("Failed to create forum post:", error);
            alert(error instanceof Error ? error.message : "Failed to create post.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-[700px] h-[80vh] flex flex-col p-0 gap-0 overflow-hidden">
                <DialogHeader className="p-4 border-b">
                    <DialogTitle>Create a post</DialogTitle>
                </DialogHeader>

                <div className="p-4 flex flex-col flex-1 overflow-y-auto">
                    <Tabs
                        value={activeTab}
                        className="flex-1 flex flex-col"
                        onValueChange={(value) => setActiveTab(value as "text" | "image" | "link")}
                    >
                        <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0 h-auto">
                            <TabsTrigger value="text" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent pb-3 px-6 gap-2">
                                <Type className="h-4 w-4" /> Post
                            </TabsTrigger>
                            <TabsTrigger value="image" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent pb-3 px-6 gap-2">
                                <Image className="h-4 w-4" /> Image
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

                            {activeTab === "text" && (
                                <div className="bg-secondary/30 rounded-md border min-h-[200px] flex flex-col relative">
                                    <Textarea
                                        placeholder="Write your post"
                                        className="resize-none border-none bg-transparent focus-visible:ring-0 min-h-[200px] p-4"
                                        value={content}
                                        onChange={(e) => setContent(e.target.value)}
                                    />
                                </div>
                            )}

                            {activeTab === "image" && (
                                <div className="bg-secondary/30 rounded-md border min-h-[200px] p-4 space-y-4">
                                    <label className="flex items-center justify-center min-h-[160px] border-2 border-dashed border-muted rounded-lg text-muted-foreground flex-col gap-2 cursor-pointer">
                                        {isUploading ? (
                                            <>
                                                <Loader2 className="h-8 w-8 animate-spin" />
                                                <p>Uploading image...</p>
                                            </>
                                        ) : imageUrl ? (
                                            <img
                                                src={`${API_ROOT.replace(/\/api$/, "")}${imageUrl}`}
                                                alt="Uploaded preview"
                                                className="max-h-[160px] rounded-md object-cover"
                                            />
                                        ) : (
                                            <>
                                                <Image className="h-12 w-12 opacity-50" />
                                                <p>Choose an image to upload</p>
                                            </>
                                        )}
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) {
                                                    void handleImageUpload(file);
                                                }
                                            }}
                                        />
                                    </label>
                                    <Textarea
                                        placeholder="Add an optional caption"
                                        className="resize-none min-h-[90px]"
                                        value={content}
                                        onChange={(e) => setContent(e.target.value)}
                                    />
                                </div>
                            )}

                            {activeTab === "link" && (
                                <div className="bg-secondary/30 rounded-md border min-h-[200px] p-4 space-y-4">
                                    <Input
                                        placeholder="https://example.com"
                                        className="bg-background"
                                        value={linkUrl}
                                        onChange={(e) => setLinkUrl(e.target.value)}
                                    />
                                    <Textarea
                                        placeholder="Add context for this link"
                                        className="resize-none min-h-[140px]"
                                        value={content}
                                        onChange={(e) => setContent(e.target.value)}
                                    />
                                </div>
                            )}
                        </div>
                    </Tabs>
                </div>

                <div className="p-4 border-t flex justify-end gap-2 bg-muted/10">
                    <Button variant="ghost" onClick={() => setIsOpen(false)} disabled={isSubmitting || isUploading}>Cancel</Button>
                    <Button disabled={submitDisabled} onClick={() => void handleSubmit()}>
                        {isSubmitting ? "Posting..." : "Post"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};
