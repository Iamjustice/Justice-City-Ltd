import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, ShieldCheck, MoreVertical, Paperclip } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface ChatInterfaceProps {
  recipient: {
    name: string;
    image: string;
    verified: boolean;
  };
  propertyTitle: string;
  initialMessage?: string;
}

export function ChatInterface({ recipient, propertyTitle, initialMessage }: ChatInterfaceProps) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "system",
      content: "This chat is monitored by Justice City for your safety. Do not share financial details off-platform.",
      time: "10:00 AM",
    },
    {
      id: 2,
      sender: "them",
      content: initialMessage || `Hello! I saw you were interested in the ${propertyTitle}. Do you have any questions?`,
      time: "10:05 AM",
    },
  ]);
  const [newMessage, setNewMessage] = useState("");

  const handleSend = () => {
    if (!newMessage.trim()) return;
    setMessages([
      ...messages,
      {
        id: messages.length + 1,
        sender: "me",
        content: newMessage,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    setNewMessage("");
  };

  return (
    <div className="flex flex-col h-[500px] bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Avatar>
              <AvatarImage src={recipient.image} />
              <AvatarFallback>{recipient.name.charAt(0)}</AvatarFallback>
            </Avatar>
            {recipient.verified && (
              <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5">
                <ShieldCheck className="w-3.5 h-3.5 text-green-600 fill-green-100" />
              </div>
            )}
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 text-sm">{recipient.name}</h3>
            <p className="text-xs text-slate-500 truncate max-w-[200px]">Re: {propertyTitle}</p>
          </div>
        </div>
        <Button variant="ghost" size="icon">
          <MoreVertical className="w-4 h-4 text-slate-400" />
        </Button>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4 bg-slate-50/30">
        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                "flex w-full",
                msg.sender === "me" ? "justify-end" : "justify-start",
                msg.sender === "system" ? "justify-center" : ""
              )}
            >
              {msg.sender === "system" ? (
                <div className="bg-amber-50 text-amber-800 text-xs px-3 py-1.5 rounded-full border border-amber-100 flex items-center gap-1.5 max-w-[90%] text-center">
                  <ShieldCheck className="w-3 h-3" />
                  {msg.content}
                </div>
              ) : (
                <div
                  className={cn(
                    "max-w-[80%] rounded-2xl px-4 py-2 text-sm",
                    msg.sender === "me"
                      ? "bg-blue-600 text-white rounded-br-none"
                      : "bg-white border border-slate-200 text-slate-800 rounded-bl-none shadow-sm"
                  )}
                >
                  <p>{msg.content}</p>
                  <p className={cn(
                    "text-[10px] mt-1 text-right",
                    msg.sender === "me" ? "text-blue-100" : "text-slate-400"
                  )}>{msg.time}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-3 bg-white border-t border-slate-100 flex items-center gap-2">
        <Button variant="ghost" size="icon" className="text-slate-400 hover:text-slate-600 shrink-0">
          <Paperclip className="w-5 h-5" />
        </Button>
        <Input 
          placeholder="Type a message..." 
          className="flex-1 bg-slate-50 border-transparent focus-visible:ring-1 focus-visible:ring-blue-500"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <Button 
          size="icon" 
          className="bg-blue-600 hover:bg-blue-700 shrink-0"
          onClick={handleSend}
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
