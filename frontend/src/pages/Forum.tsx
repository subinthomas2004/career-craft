import { useState, useEffect } from "react";
import { Search, Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Custom Components
import { ForumSidebar } from "@/components/forum/ForumSidebar";
import { PostCard } from "@/components/forum/PostCard";
import { CreatePostDialog } from "@/components/forum/CreatePostDialog";
import { ForumPost } from "@/components/forum/types";

const API_ROOT = (import.meta.env.VITE_API_URL || "https://career-craft-u7fq.onrender.com/api").replace(/\/$/, "");
const FORUM_API_BASE = API_ROOT.endsWith("/api") ? API_ROOT : `${API_ROOT}/api`;

const Forum = () => {
  const [mongoUser, setMongoUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Home");
  const [isFetching, setIsFetching] = useState(true);

  // Fetch posts from API
  const fetchPosts = async () => {
    setIsFetching(true);
    try {
      if (selectedCategory === "YourPosts" && !mongoUser?._id) {
        setPosts([]);
        return;
      }

      let url = `${FORUM_API_BASE}/forum/posts`;
      if (selectedCategory === "YourPosts" && mongoUser?._id) {
        url = `${FORUM_API_BASE}/forum/posts/me/${mongoUser._id}`;
      } else if (searchQuery) {
        url += `?search=${encodeURIComponent(searchQuery)}`;
      }

      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setPosts(data);
      } else {
        console.error("Failed to fetch posts");
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    const loadUser = () => {
      const storedUser = localStorage.getItem("userInfo");
      setMongoUser(storedUser ? JSON.parse(storedUser) : null);
      setLoading(false);
    };

    loadUser();
    window.addEventListener("userInfoUpdated", loadUser);

    return () => window.removeEventListener("userInfoUpdated", loadUser);
  }, []);

  useEffect(() => {
    if (loading) return;
    fetchPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory, mongoUser, loading]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchPosts();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  // Handlers
  const handleCreatePost = async (postDetails: Pick<ForumPost, 'title' | 'content' | 'postType' | 'imageUrl' | 'linkUrl'>) => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo") || "null");
    if (!userInfo?.token) {
      alert("You must be logged in to post.");
      throw new Error("You must be logged in to post.");
    }

    const response = await fetch(`${FORUM_API_BASE}/forum/posts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${userInfo.token}`
      },
      body: JSON.stringify({
        title: postDetails.title,
        content: postDetails.content,
        postType: postDetails.postType ?? "text",
        imageUrl: postDetails.imageUrl ?? "",
        linkUrl: postDetails.linkUrl ?? "",
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.error || "Failed to create post");
    }

    const newPost = await response.json();
    if (selectedCategory === "Home" || selectedCategory === "YourPosts") {
      setPosts((currentPosts) => [newPost, ...currentPosts]);
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo") || "null");
      if (!userInfo?.token) return;

      const response = await fetch(`${FORUM_API_BASE}/forum/posts/${postId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${userInfo.token}`
        }
      });

      if (response.ok) {
        setPosts((currentPosts) => currentPosts.filter((p) => p._id !== postId));
      } else {
        console.error("Failed to delete post.");
      }
    } catch (err) {
      console.error("Error deleting post:", err);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Navigation Bar - Sticky */}
      <div className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center px-4 md:px-6">
          <div className="mr-4 hidden md:flex">
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">Forum</h1>
          </div>

          {/* Search Bar */}
          <div className="flex-1 flex justify-center max-w-2xl mx-auto">
            <div className="relative w-full">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search CareerCraft..."
                className="w-full pl-9 bg-muted/40 rounded-full focus-visible:ring-primary"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="ml-auto flex items-center space-x-2">
            <CreatePostDialog onCreate={handleCreatePost}>
              <Button size="sm" className="gap-2 rounded-full hidden sm:flex">
                <Plus className="h-4 w-4" /> Create
              </Button>
            </CreatePostDialog>
          </div>
        </div>
      </div>

      <div className="flex-1 container max-w-[1200px] flex gap-6 px-4 md:px-6 py-6 mx-auto">
        {/* Left Sidebar - Navigation */}
        <div className="hidden lg:block w-[250px] shrink-0">
          <ForumSidebar
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        </div>

        {/* Main Feed */}
        <div className="flex-1 min-w-0 max-w-3xl">
          <div className="space-y-4">
            {isFetching ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-20 border-2 border-dashed rounded-xl">
                <div className="text-4xl mb-4">📭</div>
                <h3 className="text-lg font-semibold">It's quiet here...</h3>
                <p className="text-muted-foreground mb-4">
                  {selectedCategory === "YourPosts"
                    ? "You haven't posted anything yet."
                    : "Be the first to create a post!"}
                </p>
                {selectedCategory === "Home" && (
                   <div className="flex justify-center mt-4">
                     <CreatePostDialog onCreate={handleCreatePost}>
                       <Button variant="outline" size="sm" className="gap-2 rounded-full">
                         <Plus className="h-4 w-4" /> Create First Post
                       </Button>
                     </CreatePostDialog>
                   </div>
                )}
              </div>
            ) : (
              posts.map((post) => (
                <PostCard
                  key={post._id}
                  post={post}
                  currentUserId={mongoUser?._id ?? null}
                  onDelete={handleDeletePost}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Forum;
