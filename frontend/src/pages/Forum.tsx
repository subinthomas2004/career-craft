import { useState, useEffect } from "react";
import { Search, Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Custom Components
import { ForumSidebar } from "@/components/forum/ForumSidebar";
import { PostCard } from "@/components/forum/PostCard";
import { CreatePostDialog } from "@/components/forum/CreatePostDialog";
import { ForumPost } from "@/components/forum/types";
import { auth } from "@/firebase";
import { onAuthStateChanged, User } from "firebase/auth";

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://career-craft-u7fq.onrender.com";

const Forum = () => {
  const [user, setUser] = useState<User | null>(null);
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
      let url = `${API_BASE_URL}/api/forum/posts`;
      if (selectedCategory === "YourPosts" && mongoUser?._id) {
        url = `${API_BASE_URL}/api/forum/posts/me/${mongoUser._id}`;
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
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      
      const storedUser = localStorage.getItem("userInfo");
      if (storedUser) {
        setMongoUser(JSON.parse(storedUser));
      }
      
      setLoading(false);
    });
    return () => unsubscribe();
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
  const handleCreatePost = async (postDetails: Pick<ForumPost, 'title' | 'content'>) => {
    if (!user) {
      alert("You must be logged in to post.");
      return;
    }

    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
      const token = userInfo.token;

      const response = await fetch(`${API_BASE_URL}/api/forum/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          title: postDetails.title,
          content: postDetails.content,
          authorId: mongoUser._id,
        }),
      });

      if (response.ok) {
        const newPost = await response.json();
        if (selectedCategory === "Home" || selectedCategory === "YourPosts") {
          setPosts([newPost, ...posts]);
        }
      } else {
        console.error("Failed to create post");
      }
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
      const token = userInfo.token;

      const response = await fetch(`${API_BASE_URL}/api/forum/posts/${postId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ userId: mongoUser?._id }),
      });

      if (response.ok) {
        setPosts(posts.filter(p => p._id !== postId));
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
                <PostCard key={post._id} post={post} onDelete={handleDeletePost} />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Forum;
