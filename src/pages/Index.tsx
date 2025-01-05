import { useState } from "react";
import { ChatRoom } from "@/components/ChatRoom";
import { UsernameDialog } from "@/components/UsernameDialog";
import { FeedPost } from "@/components/FeedPost";
import { ScrollArea } from "@/components/ui/scroll-area";

const SAMPLE_POSTS = [
  {
    username: "DomainInvesting",
    content: "Just listed a premium 3L .com domain name for sale. Seeing strong interest in short domain names lately. What's your take on the current market for 3L domains? #Domains",
    timestamp: "1h ago",
    likes: 45,
    comments: 12,
  },
  {
    username: "DomainNameWire",
    content: "Breaking: ICANN announces new gTLD application window. This could be a game-changer for the domain industry. Who's planning to apply? #NewGTLDs #Domains",
    timestamp: "3h ago",
    likes: 89,
    comments: 34,
  },
  {
    username: "DNAcademy",
    content: "Domain Tip: When evaluating a domain's worth, consider its brandability, length, and extension. The best domains are often short, memorable, and versatile. What's your domain valuation strategy?",
    timestamp: "5h ago",
    likes: 67,
    comments: 23,
  },
  {
    username: "DomainSherpa",
    content: "Interesting trend: AI-related domain names are seeing a 300% increase in sales volume compared to last year. The tech sector continues to drive domain market growth. #DomainNames #AI",
    timestamp: "6h ago",
    likes: 112,
    comments: 41,
  }
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
            <p className="text-sm text-muted-foreground">
              <a 
                href="https://x.com/i/communities/1679163145921626113" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                Join the X.com Domain Names Community →
              </a>
            </p>
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