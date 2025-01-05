import { useState } from "react";
import { ChatRoom } from "@/components/ChatRoom";
import { UsernameDialog } from "@/components/UsernameDialog";

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
      
      <main className="container py-6">
        <div className="h-[600px] rounded-lg border shadow-sm">
          <ChatRoom username={username} />
        </div>
      </main>
    </div>
  );
};

export default Index;