import { useState, useEffect } from "react";
import { ChatRoom } from "@/components/ChatRoom";
import { UsernameDialog } from "@/components/UsernameDialog";
import { FeedPost } from "@/components/FeedPost";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Users, MessageSquare, LogOut } from "lucide-react";
import { DarkModeToggle } from "@/components/DarkModeToggle";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { AboutContent } from "@/components/AboutContent";

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

const GRADIENTS = [
  "bg-gradient-to-b from-background via-background to-secondary/10 dark:from-background dark:via-background dark:to-secondary/5",
  "bg-gradient-to-b from-background via-background to-purple-500/10 dark:from-background dark:via-background dark:to-purple-500/5",
  "bg-gradient-to-b from-background via-background to-pink-500/10 dark:from-background dark:via-background dark:to-pink-500/5",
  "bg-gradient-to-b from-background via-background to-blue-500/10 dark:from-background dark:via-background dark:to-blue-500/5",
  "bg-gradient-to-b from-background via-background to-green-500/10 dark:from-background dark:via-background dark:to-green-500/5"
];

const Index = () => {
  const [username, setUsername] = useState<string | null>(() => {
    return localStorage.getItem('username') || null;
  });
  const [isAdmin, setIsAdmin] = useState(() => {
    return localStorage.getItem('isAdmin') === 'true';
  });
  const [gradientIndex, setGradientIndex] = useState(0);
  const { toast } = useToast();

  const handleUsernameSubmit = (name: string, admin?: boolean) => {
    setUsername(name);
    setIsAdmin(!!admin);
    localStorage.setItem('username', name);
    localStorage.setItem('isAdmin', String(!!admin));
  };

  const handleLogout = () => {
    localStorage.removeItem('username');
    localStorage.removeItem('isAdmin');
    setUsername(null);
    setIsAdmin(false);
    toast({
      title: "Logged out successfully",
      description: "See you next time!",
    });
  };

  const handleBackgroundClick = () => {
    setGradientIndex((prev) => (prev + 1) % GRADIENTS.length);
  };

  if (!username) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent animate-pulse transform hover:scale-105 transition-transform duration-200">
          DomainChatbox.com
        </h1>
        <div className="mb-6">
          <AboutContent />
        </div>
        <UsernameDialog onSubmit={handleUsernameSubmit} />
      </div>
    );
  }

  return (
    <div 
      className={`min-h-screen ${GRADIENTS[gradientIndex]} transition-colors duration-500`}
      onClick={handleBackgroundClick}
    >
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10">
        <div className="container py-4 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
              DomainChatbox.com
            </h1>
            <div className="text-muted-foreground">
              <AboutContent />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
            <DarkModeToggle />
          </div>
        </div>
      </header>
      
      <main className="container py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-[600px] rounded-lg border shadow-lg bg-card">
          <ChatRoom username={username} isAdmin={isAdmin} />
        </div>
        
        <div className="h-[600px] rounded-lg border shadow-lg bg-card">
          <div className="p-4 border-b flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Users className="h-5 w-5" />
                Domain Community Feed
              </h2>
              <p className="text-sm text-muted-foreground">
                <a 
                  href="https://x.com/i/communities/1679163145921626113" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline inline-flex items-center gap-1"
                >
                  <MessageSquare className="h-4 w-4" />
                  Join the X.com Domain Names Community →
                </a>
              </p>
            </div>
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
