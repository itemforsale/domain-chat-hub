import { Users } from "lucide-react";

export const ChatHeader = () => {
  return (
    <div className="p-4 border-b flex items-center justify-between">
      <div>
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Users className="h-5 w-5" />
          Domain Chat
        </h2>
        <p className="text-sm text-muted-foreground">
          Connected users: 1
        </p>
      </div>
    </div>
  );
};