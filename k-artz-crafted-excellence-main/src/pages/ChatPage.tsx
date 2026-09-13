import React, { memo, useCallback, useLayoutEffect, useRef, useState } from "react";
import {
  Send,
  Bot,
  User,
  MessageSquareDashed,
  Loader2,
  ShieldCheck,
  AlertTriangle,
  ChevronUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { useChatSession, type ChatMessage } from "@/hooks/useChatSession";
import { trackAIQuery } from "../utils/analytics";

/** Treat the reader as "at the bottom" within this many px, so we only follow
 *  new messages when they aren't scrolled up reading something. */
const STICK_TO_BOTTOM_PX = 120;

const formatTime = (value: Date) =>
  value instanceof Date && !Number.isNaN(value.getTime())
    ? value.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : "";

/**
 * Memoised so a new message re-renders one bubble instead of the whole
 * transcript — the previous version rebuilt every message on each socket event.
 */
const MessageBubble = memo(({ message }: { message: ChatMessage }) => {
  const isUser = message.senderType === "user";
  const isAdmin = message.senderType === "admin";

  return (
    <div className={`flex w-full ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`flex gap-3 max-w-[80%] md:max-w-[70%] ${
          isUser ? "flex-row-reverse" : "flex-row"
        }`}
      >
        <div className="flex-shrink-0 mt-1">
          {isUser ? (
            <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-slate-900 font-bold text-sm">
              {message.senderName?.charAt(0) || <User size={16} />}
            </div>
          ) : isAdmin ? (
            <div className="w-8 h-8 rounded-full bg-yellow-600 border border-yellow-400 flex items-center justify-center text-white shadow-lg shadow-yellow-500/20">
              <ShieldCheck size={16} />
            </div>
          ) : (
            <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-amber-500">
              <Bot size={16} />
            </div>
          )}
        </div>

        <div>
          <div
            className={`p-4 rounded-2xl shadow-sm relative transition-opacity ${
              message.pending ? "opacity-60" : "opacity-100"
            } ${
              isUser
                ? "bg-amber-500 text-slate-950 rounded-tr-none"
                : isAdmin
                ? "bg-gradient-to-br from-yellow-700 to-yellow-600 text-white rounded-tl-none border border-yellow-500/30"
                : "bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none"
            }`}
          >
            {isAdmin && (
              <span className="block text-[10px] font-bold text-yellow-200 mb-1 uppercase tracking-wider">
                Owner
              </span>
            )}

            <p className="text-sm md:text-base whitespace-pre-wrap leading-relaxed">
              {message.content}
            </p>
          </div>
          <span
            className={`text-[10px] text-slate-500 mt-1 block ${
              isUser ? "text-right" : "text-left"
            }`}
          >
            {message.pending ? "Sending…" : formatTime(message.timestamp)}
          </span>
        </div>
      </div>
    </div>
  );
});
MessageBubble.displayName = "MessageBubble";

const TypingIndicator = () => (
  <div className="flex w-full justify-start">
    <div className="flex gap-3">
      <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-amber-500 flex-shrink-0 mt-1">
        <Bot size={16} />
      </div>
      <div className="bg-slate-900 border border-slate-800 rounded-2xl rounded-tl-none px-4 py-4 flex items-center gap-1.5">
        {[0, 150, 300].map((delay) => (
          <span
            key={delay}
            className="w-2 h-2 rounded-full bg-slate-600 animate-bounce"
            style={{ animationDelay: `${delay}ms` }}
          />
        ))}
        <span className="sr-only">Assistant is typing</span>
      </div>
    </div>
  </div>
);

const ChatPage = () => {
  const { user } = useAuth();
  const {
    messages,
    hiddenCount,
    hasOlder,
    loadOlder,
    historyState,
    retryHistory,
    isConnected,
    awaitingReply,
    sendMessage,
    canSend,
  } = useChatSession(user?.uid, user?.email, user?.displayName);

  const [inputStr, setInputStr] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const pinnedToBottom = useRef(true);
  /** Distance from the bottom captured before paging back, so the message the
   *  reader was looking at stays put once older bubbles mount above it. */
  const restoreOffset = useRef<number | null>(null);
  const didInitialScroll = useRef(false);

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    pinnedToBottom.current =
      el.scrollHeight - el.scrollTop - el.clientHeight < STICK_TO_BOTTOM_PX;
  }, []);

  const handleLoadOlder = useCallback(() => {
    const el = scrollRef.current;
    restoreOffset.current = el ? el.scrollHeight - el.scrollTop : null;
    loadOlder();
  }, [loadOlder]);

  // One layout pass owns scrolling, so paging back, first paint and live
  // messages can't fight each other.
  useLayoutEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    if (restoreOffset.current !== null) {
      el.scrollTop = el.scrollHeight - restoreOffset.current;
      restoreOffset.current = null;
      return;
    }

    if (!didInitialScroll.current) {
      if (historyState !== "ready") return;
      // Jump rather than animate: smooth-scrolling a whole transcript on open
      // is what made this feel like it was loading everything at once.
      el.scrollTop = el.scrollHeight;
      didInitialScroll.current = true;
      return;
    }

    if (pinnedToBottom.current) {
      el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    }
  }, [messages, awaitingReply, historyState]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    const content = inputStr.trim();
    if (!content) return;

    // Always follow your own message, even if you were scrolled up.
    pinnedToBottom.current = true;

    if (sendMessage(content)) {
      trackAIQuery(content.length);
      setInputStr("");
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-slate-950 ">
      {/* Chat Header */}
      <div className="p-4 border-b border-slate-800 bg-slate-900/50 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-500">
          <Bot size={24} />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">K'artz Assistant</h1>
          <p className="text-sm text-slate-400 flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full ${
                isConnected ? "bg-green-500" : "bg-red-500"
              }`}
            />
            {isConnected ? "Online" : "Connecting..."}
          </p>
        </div>
      </div>

      {/* Messages Container */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-grow overflow-y-auto p-4 md:p-6 space-y-4 custom-scrollbar relative"
      >
        {historyState === "loading" && (
          <div className="absolute inset-0 bg-slate-950/80 flex items-center justify-center z-10">
            <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
          </div>
        )}

        {historyState === "error" && (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-3">
            <AlertTriangle size={40} className="text-amber-500/70" />
            <p className="text-sm">Couldn't load your earlier messages.</p>
            <Button
              type="button"
              onClick={retryHistory}
              variant="outline"
              className="border-slate-700 text-slate-300 hover:text-white"
            >
              Try again
            </Button>
          </div>
        )}

        {historyState === "ready" && hasOlder && (
          <div className="flex justify-center pb-2">
            <Button
              type="button"
              onClick={handleLoadOlder}
              variant="ghost"
              size="sm"
              className="text-slate-400 hover:text-amber-500 gap-1.5"
            >
              <ChevronUp size={14} />
              Load earlier messages ({hiddenCount})
            </Button>
          </div>
        )}

        {historyState === "ready" && messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-500 opacity-50">
            <MessageSquareDashed size={48} className="mb-4" />
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((message) => <MessageBubble key={message.id} message={message} />)
        )}

        {awaitingReply && <TypingIndicator />}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-slate-900/50 border-t border-slate-800 backdrop-blur-sm">
        <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto flex gap-2 relative">
          <Input
            value={inputStr}
            onChange={(e) => setInputStr(e.target.value)}
            placeholder="Type your message..."
            className="bg-slate-950 border-slate-800 focus-visible:ring-amber-500/50 text-white pr-12 py-6 rounded-xl shadow-inner"
            disabled={!canSend}
          />
          <Button
            type="submit"
            disabled={inputStr.trim() === "" || !canSend}
            className="absolute right-2 top-2 h-[calc(100%-16px)] aspect-square p-0 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-lg transition-all"
          >
            <Send size={20} className={inputStr.trim() === "" ? "opacity-50" : "opacity-100"} />
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ChatPage;
