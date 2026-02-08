import { useState } from "react";
import { Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Custom Components
import { ForumSidebar } from "@/components/forum/ForumSidebar";
import { PostCard } from "@/components/forum/PostCard";
import { CommunityInfo } from "@/components/forum/CommunityInfo";
import { CreatePostDialog } from "@/components/forum/CreatePostDialog";
import { Community, ForumPost } from "@/components/forum/types";

// Empty Initial State - "Clear all sections"
const initialCommunities: Community[] = [];
const initialPosts: ForumPost[] = [];

const Forum = () => {
  const [communities, setCommunities] = useState<Community[]>(initialCommunities);
  const [posts, setPosts] = useState<ForumPost[]>(initialPosts);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Home");

  // Handlers
  const handleCreateCommunity = (newCommunity: Community) => {
    setCommunities([...communities, newCommunity]);
    setSelectedCategory(newCommunity.name); // Switch to new community
  };

  const handleCreatePost = (postDetails: any) => {
    // In a real app this comes from the dialog. 
    // For now we'll stub this or update the dialog to return data.
    // Since CreatePostDialog is UI only in the previous step, we'll need to update it or accept the limitation.
    // To strictly follow "manual upload", let's assume the dialog *works* or we add a simple function here.
    // For this iteration, I'll update the Dialog props in the next step if needed, 
    // but for now let's just make sure the PAGE logic is sound.

    // Quick fix: The Dialog doesn't return data yet. 
    // We will wrap the Dialog usage to intercept the "Post" action if we modify the Dialog, 
    // but the user just said "do it" for the UI previously.
    // To make it functional, I should update CreatePostDialog to actually return a post.
  };

  // Determine which posts to show
  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase());

    if (selectedCategory === "Home") {
      return matchesSearch;
    }

    return matchesSearch && post.community.name === selectedCategory;
  });

  // Find selected community details for right sidebar
  const activeCommunity = communities.find(c => c.name === selectedCategory);

  return (
    <div className="min-h-screen bg-background">
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
            {/* Pass setPosts to the dialog (we'll update the dialog component next to support this) */}
            <CreatePostDialog communities={communities} onCreate={(post) => setPosts([post, ...posts])}>
              <Button size="sm" className="gap-2 rounded-full hidden sm:flex">
                <Plus className="h-4 w-4" /> Create
              </Button>
            </CreatePostDialog>
          </div>
        </div>
      </div>

      <div className="container max-w-[1600px] flex gap-6 px-4 md:px-6 py-6">
        {/* Left Sidebar - Navigation */}
        <div className="hidden lg:block w-[270px] shrink-0">
          <ForumSidebar
            communities={communities}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            onCreateCommunity={handleCreateCommunity}
          />
        </div>

        {/* Main Feed */}
        <div className="flex-1 min-w-0 max-w-3xl mx-auto">
          {/* Posts */}
          <div className="space-y-4">
            {posts.length === 0 && (
              <div className="text-center py-20 border-2 border-dashed rounded-xl">
                <div className="text-4xl mb-4">📭</div>
                <h3 className="text-lg font-semibold">It's quiet here...</h3>
                <p className="text-muted-foreground mb-4">Join a community or create one to start discussing!</p>
                {/* Prompt to create community if none exist */}
                {communities.length === 0 && (
                  <p className="text-sm text-primary font-medium">👈 Create a community in the sidebar</p>
                )}
              </div>
            )}

            {filteredPosts.map(post => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </div>

        {/* Right Sidebar - Community Info */}
        <div className="hidden xl:block w-[320px] shrink-0">
          {activeCommunity && (
            <CommunityInfo community={activeCommunity} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Forum;
