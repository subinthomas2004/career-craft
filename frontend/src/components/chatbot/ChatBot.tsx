import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, X, Send, Bot, User } from "lucide-react";
interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
}
const mockResponses: Record<string, string> = {
  interview: "For interview preparation, I recommend:\n\n1. **Practice common questions** - Start with behavioral questions like 'Tell me about yourself'\n2. **Mock interviews** - Use our AI Mock Interview feature\n3. **Research the company** - Understand their values and culture\n4. **Prepare questions** - Have thoughtful questions for the interviewer",
  resume: "To improve your resume:\n\n1. **Use action verbs** - Start bullet points with strong verbs\n2. **Quantify achievements** - Add numbers and metrics\n3. **Tailor for each job** - Customize for the position\n4. **Use our Resume Analyzer** - Get instant ATS optimization tips",
  coding: "For coding practice:\n\n1. **Start with fundamentals** - Arrays, strings, hash maps\n2. **Practice daily** - Consistency is key\n3. **Understand patterns** - Learn common problem-solving patterns\n4. **Use our Coding Practice** - Solve problems with test cases",
  default: "I'm your CareerCraft AI assistant! I can help you with:\n\n• **Interview preparation** tips and strategies\n• **Resume optimization** guidance\n• **Coding practice** recommendations\n• **Career advice** and planning\n\nWhat would you like to know?"
};
const getResponse = (message: string): string => {
  const lower = message.toLowerCase();
  if (lower.includes("interview")) return mockResponses.interview;
  if (lower.includes("resume") || lower.includes("cv")) return mockResponses.resume;
  if (lower.includes("coding") || lower.includes("code") || lower.includes("programming")) return mockResponses.coding;
  return mockResponses.default;
};
const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([{
    id: "1",
    content: "Hi! I'm your CareerCraft AI assistant. How can I help you with your placement preparation today?",
    role: "assistant",
    timestamp: new Date()
  }]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);
  const handleSend = () => {
    if (!input.trim()) return;
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: "user",
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(() => {
      const response: Message = {
        id: (Date.now() + 1).toString(),
        content: getResponse(input),
        role: "assistant",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, response]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };
  return <>
      {/* Chat Button */}
      <button onClick={() => setIsOpen(true)} className={`fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center ${isOpen ? "scale-0 opacity-0" : "scale-100 opacity-100"}`}>
        <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6" />
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent rounded-full flex items-center justify-center">
          
        </span>
      </button>

      {/* Chat Window */}
      <div className={`fixed z-50 bg-card/80 backdrop-blur-xl border border-border/40 shadow-2xl flex flex-col overflow-hidden transition-all duration-300 ${isOpen ? "scale-100 opacity-100 translate-y-0" : "scale-95 opacity-0 translate-y-4 pointer-events-none"} 
        /* Mobile: Full screen with padding */
        inset-2 sm:inset-auto
        /* Desktop: Fixed size in corner */
        sm:bottom-6 sm:right-6 sm:w-[380px] sm:h-[520px]
        rounded-2xl sm:rounded-2xl
        `}>
        {/* Header */}
        <div className="bg-primary text-primary-foreground p-3 sm:p-4 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center">
              <Bot className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-sm sm:text-base">CareerCraft AI</h3>
              <p className="text-xs text-primary-foreground/70">Always here to help</p>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="w-8 h-8 rounded-full hover:bg-primary-foreground/20 flex items-center justify-center transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-3 sm:p-4" ref={scrollRef}>
          <div className="space-y-3 sm:space-y-4">
            {messages.map(message => <div key={message.id} className={`flex gap-2 sm:gap-3 ${message.role === "user" ? "flex-row-reverse" : ""}`}>
                <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shrink-0 ${message.role === "user" ? "bg-primary text-primary-foreground" : "bg-accent/20 text-accent"}`}>
                  {message.role === "user" ? <User className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Bot className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                </div>
                <div className={`max-w-[80%] sm:max-w-[75%] rounded-2xl px-3 py-2 sm:px-4 sm:py-3 ${message.role === "user" ? "bg-primary text-primary-foreground rounded-br-md" : "bg-muted text-foreground rounded-bl-md"}`}>
                  <p className="text-xs sm:text-sm whitespace-pre-line">{message.content}</p>
                </div>
              </div>)}
            {isTyping && <div className="flex gap-2 sm:gap-3">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center">
                  <Bot className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
                <div className="bg-muted rounded-2xl rounded-bl-md px-3 py-2 sm:px-4 sm:py-3">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{
                  animationDelay: "0ms"
                }} />
                    <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{
                  animationDelay: "150ms"
                }} />
                    <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{
                  animationDelay: "300ms"
                }} />
                  </div>
                </div>
              </div>}
          </div>
        </ScrollArea>

        {/* Input */}
        <div className="p-3 sm:p-4 border-t border-border/40 bg-background/50 backdrop-blur-md">
          <form onSubmit={e => {
          e.preventDefault();
          handleSend();
        }} className="flex gap-2">
            <Input value={input} onChange={e => setInput(e.target.value)} placeholder="Ask me anything..." className="flex-1 text-sm" />
            <Button type="submit" size="icon" disabled={!input.trim()}>
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </div>
    </>;
};
export default ChatBot;