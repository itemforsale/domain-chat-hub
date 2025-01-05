import { useState } from "react";
import { ChatRoom } from "@/components/ChatRoom";
import { UsernameDialog } from "@/components/UsernameDialog";
import { FeedPost } from "@/components/FeedPost";
import { ScrollArea } from "@/components/ui/scroll-area";

const SAMPLE_POSTS = [
  {
    username: "DomainExpert",
    content: "Just acquired a premium .ai domain! The future of tech domains is here. What do you think about AI-related domain names?",
    timestamp: "2h ago",
    likes: 24,
    comments: 5,
  },
  {
    username: "WebMaster",
    content: "Pro tip: When choosing a domain name, keep it short, memorable, and avoid hyphens. Your brand will thank you later! #Domains #Branding",
    timestamp: "4h ago",
    likes: 42,
    comments: 8,
  },
  {
    username: "DomainTrader",
    content: "Market analysis: .com domains still dominate, but we're seeing a rise in .io and .dev popularity among tech startups. Interesting trends!",
    timestamp: "6h ago",
    likes: 31,
    comments: 12,
  },
];

const Index = () => {
  const [username, setUsername] = useState<string | null>(null);

  if (!username) {
    return <UsernameDialog onSubmit={setUsername} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container py-4">
          <h1 className="text-2xl font-bold">DomainChat</h1>
          <p className="text-muted-foreground">Connect with domain enthusiasts</p>
        </div>
      </header>
      
      <main className="container py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-[600px] rounded-lg border shadow-sm">
          <ChatRoom username={username} />
        </div>
        
        <div className="h-[600px] rounded-lg border shadow-sm bg-background">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold">Domain Community Feed</h2>
            <p className="text-sm text-muted-foreground">Latest updates and discussions</p>
          </div>
          <ScrollArea className="h-[calc(100%-73px)]">
            <div className="divide-y">
              {SAMPLE_POSTS.map((post, index) => (
                <FeedPost key={index} {...post} />
              ))}
            </div>
          </ScrollArea>
        </div>
      </main>
    </div>
  );
};

export default Index;