// import React, { useEffect, useState, useRef } from "react";
// import { io, Socket } from "socket.io-client";
// import { Send, Bot, User, MessageSquareDashed } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { useAuth } from "@/hooks/useAuth";

// // Define interface for messages displayed in UI
// interface MessageItem {
//   id: string;
//   content: string;
//   senderType: 'user' | 'ai' | 'agent';
//   timestamp: Date;
//   senderName?: string;
// }

// // Define interface for data sent to backend
// // --- NEW INTERFACE ---
// interface SendMessagePayload {
//     content: string;
//     senderName: string;
//     uid: string;
//     email: string;
// }
// // --------------------

// const BACKEND_URL = "http://localhost:5000";

// const ChatPage = () => {
//   const { user } = useAuth();
//   const [socket, setSocket] = useState<Socket | null>(null);
//   const [isConnected, setIsConnected] = useState(false);
//   const [messages, setMessages] = useState<MessageItem[]>([]);
//   const [inputStr, setInputStr] = useState("");
//   const messagesEndRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     // 1. Create socket and connect
//     const newSocket = io(BACKEND_URL);
//     setSocket(newSocket);

//     // 2. Add listeners to update state on connect/disconnect
//     newSocket.on("connect", () => {
//       console.log("✅ Frontend connected to socket ID:", newSocket.id);
//       setIsConnected(true);

//       // Send identification data immediately upon connection
//       if (user) {
//         newSocket.emit("identify_user", { uid: user.uid, email: user.email });
//       }
//     });

//     newSocket.on("disconnect", () => {
//         console.log("❌ Socket disconnected via server event");
//         setIsConnected(false);
//     });

//     // Listener for incoming messages (from AI or Agent)
//     newSocket.on("receive_message", (incomingMsg: MessageItem) => {
//       console.log("Received message:", incomingMsg);
//       setMessages((prev) => [...prev, incomingMsg]);
//     });

//     // Cleanup
//     return () => {
//       newSocket.disconnect();
//       console.log("🧹 Socket cleaned up by React useEffect");
//     };
//   }, [user]);

//   // Auto-scroll to bottom
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   const handleSendMessage = (e: React.FormEvent) => {
//     e.preventDefault();

//     // Safety checks: input empty? socket exists? connected? user auth loaded?
//     if (inputStr.trim() === "" || !socket || !isConnected || !user || !user.email || !user.uid) {
//         console.warn("Cannot send message: Missing input, socket connection, or user auth data.");
//         return;
//     }

//     const contentStr = inputStr; // Hold value before clearing state

//     // 1. Optimistically add to UI immediately (for feels-fast UX)
//     const tempUiMessage: MessageItem = {
//       id: Date.now().toString(), // Temporary ID until DB saves it
//       content: contentStr,
//       senderType: 'user',
//       senderName: user.displayName || "User",
//       timestamp: new Date(),
//     };
//     setMessages((prev) => [...prev, tempUiMessage]);
//     setInputStr(""); // Clear input immediately

//     // 2. Prepare Payload for Backend
//     // --- CRITICAL CHANGE HERE ---
//     const payload: SendMessagePayload = {
//         content: contentStr,
//         senderName: user.displayName || "Client",
//         uid: user.uid,    // Send Firebase UID
//         email: user.email // Send Email
//     };

//     // 3. Emit event to backend server with complete data
//     socket.emit("send_message", payload);
//     // ---------------------------
//   };

//   return (
//     <div className="flex flex-col h-[calc(100vh-64px)] bg-slate-950 mt-[64px]">
//       {/* Chat Header */}
//       <div className="p-4 border-b border-slate-800 bg-slate-900/50 flex items-center gap-3">
//          <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-500">
//              <Bot size={24} />
//          </div>
//          <div>
//             <h1 className="text-xl font-bold text-white">K'artz Assistant</h1>
//             <p className="text-sm text-slate-400 flex items-center gap-2">
//                <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></span>
//                {isConnected ? 'Online' : 'Connecting...'}
//             </p>
//          </div>
//       </div>

//       {/* Messages Container (Scrollable) */}
//       <div className="flex-grow overflow-y-auto p-4 md:p-6 space-y-4 custom-scrollbar">
//         {messages.length === 0 ? (
//             <div className="h-full flex flex-col items-center justify-center text-slate-500 opacity-50">
//                 <MessageSquareDashed size={48} className="mb-4" />
//                 <p>No messages yet. Start the conversation!</p>
//             </div>
//         ) : (
//             messages.map((msg) => {
//             const isUser = msg.senderType === 'user';
//             return (
//                 <div
//                 key={msg.id}
//                 className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'}`}
//                 >
//                 <div className={`flex gap-3 max-w-[80%] md:max-w-[70%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
//                     {/* Avatar */}
//                     <div className="flex-shrink-0 mt-1">
//                     {isUser ? (
//                         <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-slate-900 font-bold text-sm">
//                             {msg.senderName?.charAt(0) || <User size={16} />}
//                         </div>
//                     ) : (
//                         <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-amber-500">
//                             <Bot size={16} />
//                         </div>
//                     )}
//                     </div>

//                     {/* Message Bubble */}
//                     <div>
//                         <div
//                         className={`p-4 rounded-2xl shadow-sm ${
//                             isUser
//                             ? 'bg-amber-500 text-slate-950 rounded-tr-none'
//                             : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none'
//                         }`}
//                         >
//                         <p className="text-sm md:text-base whitespace-pre-wrap leading-relaxed">
//                             {msg.content}
//                         </p>
//                         </div>
//                          <span className={`text-[10px] text-slate-500 mt-1 block ${isUser ? 'text-right' : 'text-left'}`}>
//                             {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//                          </span>
//                     </div>
//                 </div>
//                 </div>
//             );
//             })
//         )}
//         <div ref={messagesEndRef} />
//       </div>

//       {/* Input Area */}
//       <div className="p-4 bg-slate-900/50 border-t border-slate-800 backdrop-blur-sm">
//         <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto flex gap-2 relative">
//           <Input
//             value={inputStr}
//             onChange={(e) => setInputStr(e.target.value)}
//             placeholder="Type your message..."
//             className="bg-slate-950 border-slate-800 focus-visible:ring-amber-500/50 text-white pr-12 py-6 rounded-xl shadow-inner"
//             disabled={!isConnected}
//           />
//           <Button
//             type="submit"
//             disabled={inputStr.trim() === "" || !isConnected}
//             className="absolute right-2 top-2 h-[calc(100%-16px)] aspect-square p-0 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-lg transition-all"
//           >
//             <Send size={20} className={inputStr.trim() === "" ? "opacity-50" : "opacity-100"} />
//             <span className="sr-only">Send</span>
//           </Button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default ChatPage;


import React, { useEffect, useState, useRef } from "react";
import { io, Socket } from "socket.io-client";
// CHANGE: Added Loader2 icon for loading state
import { Send, Bot, User, MessageSquareDashed, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";

interface MessageItem {
  id: string;
  content: string;
  senderType: 'user' | 'ai' | 'agent';
  timestamp: Date; // Frontend expects a Date object here
  senderName?: string;
}

interface SendMessagePayload {
    content: string;
    senderName: string;
    uid: string;
    email: string;
}

// const BACKEND_URL = "http://localhost:5000";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL||"http://localhost:5000";

const ChatPage = () => {
  const { user } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  // CHANGE: New state for loading history
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [inputStr, setInputStr] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // ==========================================
  // NEW: Fetch History useEffect
  // ==========================================
  useEffect(() => {
    // Only fetch if we have a logged-in user UID
    if (!user?.uid) {
        setIsLoadingHistory(false);
        return;
    }

    const fetchHistory = async () => {
        setIsLoadingHistory(true);
        try {
            console.log("Fetching chat history for:", user.uid);
            const res = await fetch(`${BACKEND_URL}/api/chat-history/${user.uid}`);

            if (!res.ok) throw new Error("Failed to fetch history");

            const data = await res.json();

            // IMPORTANT: Convert database timestamp strings back to Date objects
            const formattedHistory: MessageItem[] = data.map((msg: any) => ({
                ...msg,
                timestamp: new Date(msg.timestamp)
            }));

            setMessages(formattedHistory);
        } catch (err) {
            console.error("Error loading history:", err);
        } finally {
            setIsLoadingHistory(false);
        }
    };

    fetchHistory();
  }, [user]); // Rerun whenever the user auth state changes
  // ==========================================


  // Socket Connection useEffect (Existing)
  useEffect(() => {
    const newSocket = io(BACKEND_URL);
    setSocket(newSocket);

    newSocket.on("connect", () => {
      setIsConnected(true);
      if (user) newSocket.emit("identify_user", { uid: user.uid, email: user.email });
    });

    newSocket.on("disconnect", () => setIsConnected(false));

    newSocket.on("receive_message", (incomingMsg: any) => {
      // Convert timestamp string to Date object for real-time messages too
      const formattedMsg: MessageItem = {
          ...incomingMsg,
          timestamp: new Date(incomingMsg.timestamp)
      };
      setMessages((prev) => [...prev, formattedMsg]);
    });

    return () => { newSocket.disconnect(); };
  }, [user]);


  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);


  // Handle Send (Existing)
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputStr.trim() === "" || !socket || !isConnected || !user || !user.email || !user.uid) return;

    const contentStr = inputStr;
    // Optimistic UI update
    const tempUiMessage: MessageItem = {
      id: Date.now().toString() + "_temp", // Temp ID
      content: contentStr,
      senderType: 'user',
      senderName: user.displayName || "User",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, tempUiMessage]);
    setInputStr("");

    const payload: SendMessagePayload = {
        content: contentStr,
        senderName: user.displayName || "Client",
        uid: user.uid,
        email: user.email
    };
    socket.emit("send_message", payload);
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
               <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></span>
               {isConnected ? 'Online' : 'Connecting...'}
            </p>
         </div>
      </div>

      {/* Messages Container */}
      <div className="flex-grow overflow-y-auto p-4 md:p-6 space-y-4 custom-scrollbar relative">
        {/* --- CHANGE: Loading Spinner State --- */}
        {isLoadingHistory && (
            <div className="absolute inset-0 bg-slate-950/80 flex items-center justify-center z-10">
                 <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
            </div>
        )}
        {/* ------------------------------------- */}

        {!isLoadingHistory && messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-500 opacity-50">
                <MessageSquareDashed size={48} className="mb-4" />
                <p>No messages yet. Start the conversation!</p>
            </div>
        ) : (
            messages.map((msg) => {
            const isUser = msg.senderType === 'user';
            // Ensure timestamp is valid before trying to display time
            const timeDisplay = msg.timestamp instanceof Date && !isNaN(msg.timestamp.getTime())
                ? msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                : "";

            return (
                <div
                key={msg.id}
                className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'}`}
                >
                <div className={`flex gap-3 max-w-[80%] md:max-w-[70%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                    {/* Avatar */}
                    <div className="flex-shrink-0 mt-1">
                    {isUser ? (
                        <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-slate-900 font-bold text-sm">
                            {msg.senderName?.charAt(0) || <User size={16} />}
                        </div>
                    ) : (
                        <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-amber-500">
                            <Bot size={16} />
                        </div>
                    )}
                    </div>

                    {/* Message Bubble */}
                    <div>
                        <div
                        className={`p-4 rounded-2xl shadow-sm ${
                            isUser
                            ? 'bg-amber-500 text-slate-950 rounded-tr-none'
                            : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none'
                        }`}
                        >
                        <p className="text-sm md:text-base whitespace-pre-wrap leading-relaxed">
                            {msg.content}
                        </p>
                        </div>
                         <span className={`text-[10px] text-slate-500 mt-1 block ${isUser ? 'text-right' : 'text-left'}`}>
                            {timeDisplay}
                         </span>
                    </div>
                </div>
                </div>
            );
            })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-slate-900/50 border-t border-slate-800 backdrop-blur-sm">
        <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto flex gap-2 relative">
          <Input
            value={inputStr}
            onChange={(e) => setInputStr(e.target.value)}
            placeholder="Type your message..."
            className="bg-slate-950 border-slate-800 focus-visible:ring-amber-500/50 text-white pr-12 py-6 rounded-xl shadow-inner"
            disabled={!isConnected || isLoadingHistory}
          />
          <Button
            type="submit"
            disabled={inputStr.trim() === "" || !isConnected || isLoadingHistory}
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