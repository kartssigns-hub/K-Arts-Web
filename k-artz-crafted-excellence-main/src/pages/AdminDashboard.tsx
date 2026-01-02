import React, { useState, useEffect, useRef } from 'react';
import { 
  LayoutDashboard, MessageSquare, ShoppingBag, 
  Users, TrendingUp, Bell, Search, LogOut, 
  CheckCircle2, AlertCircle, Clock, Send, X
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, AreaChart, Area 
} from 'recharts';
import { io } from 'socket.io-client';
import { format } from 'date-fns';
import { Route,useNavigate } from 'react-router-dom';

// --- CONFIG ---
const API_URL = import.meta.env.VITE_API_URL || 'https://k-artz-server.onrender.com';
const SOCKET_URL = import.meta.env.VITE_API_URL || 'https://k-artz-server.onrender.com';

// --- TYPES ---
interface ChatSession {
  _id: string;
  userId: string;
  userEmail: string;
  lastMessage: string;
  status: 'ai_active' | 'human_active';
  unread: number;
  updatedAt: string;
}

interface Message {
  _id: string;
  content: string;
  senderType: 'user' | 'ai' | 'admin' | 'system';
  createdAt: string;
}

const AdminDashboard = () => {
  // --- STATE ---
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({
    activeChats: 0,
    pendingQuotes: 0,
    totalOrders: 0,
    revenue: 0
  });
  const [chats, setChats] = useState<ChatSession[]>([]);
  const [selectedChat, setSelectedChat] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const navigate=useNavigate();
  const socket = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Helper to safely format dates without crashing
const safeFormatTime = (dateString: string | undefined) => {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    // Check if date is "Invalid Date"
    if (isNaN(date.getTime())) return ''; 
    return format(date, 'HH:mm');
  } catch (error) {
    return '';
  }
};

// useEffect(() => {
//     // 1. Get the token we saved during Login
//     const token = localStorage.getItem('adminToken');

//     // 2. Connect to the backend
//     // (Make sure this URL matches your backend port, usually 5000)
//     const newSocket = io("http://localhost:5000"); 

//     // 3. ⭐ CRITICAL STEP: Send the token immediately
//     if (token) {
//         console.log("📤 Sending Admin Token to backend...");
//         newSocket.emit('admin_connect', token);
//     } else {
//         console.error("❌ No Admin Token found! Redirecting to login...");
//         // Optional: window.location.href = '/admin/login';
//     }

//     // 4. Listen for connection success
//     newSocket.on('connect', () => {
//         console.log("✅ Socket connected:", newSocket.id);
//     });

//     // 5. Store socket in state (if you haven't already)
//     // setSocket(newSocket); 

//     // 6. Cleanup on unmount
//     return () => {
//       newSocket.disconnect();
//     };
//   }, []);

//   // --- INITIALIZATION ---
//   useEffect(() => {
//     // 1. Connect to Socket
//     socket.current = io(SOCKET_URL);
    
//     socket.current.on('connect', () => {
//       console.log("✅ Admin Connected to Socket");
//       setIsConnected(true);
//       socket.current.emit('admin_connect'); // Join admin room
//     });

//     // 2. Real-time Incoming Message Handler
//     socket.current.on('admin_receive_message', (data: any) => {
//         // Play notification sound here if needed
//         fetchChats(); // Refresh chat list to show unread/newest
//         if (selectedChat && selectedChat.userId === data.userId) {
//              setMessages(prev => [...prev, data]);
//         }
//     });

//     // 3. Initial Data Fetch
//     fetchStats();
//     fetchChats();

//     return () => { socket.current.disconnect(); };
//   }, [selectedChat]);

// --- INITIALIZATION & SOCKET CONNECTION ---
  useEffect(() => {
    const token = localStorage.getItem('adminToken');

    // 1. Redirect if no token exists initially
    if (!token) {
        console.error("❌ No Admin Token found!");
        navigate('/admin/login');
        return;
    }

    // 2. Initialize Socket (Single Instance)
    // socket.current = io("http://localhost:5000"); // Use this if hardcoded
    socket.current = io(SOCKET_URL); // Better to use your config constant

    // 3. Setup Event Listeners
    socket.current.on('connect', () => {
      console.log("✅ Admin Socket Connected:", socket.current.id);
      setIsConnected(true);
      
      // ⚡ AUTHENTICATE IMMEDIATELY
      console.log("📤 Sending Admin Token...");
      socket.current.emit('admin_connect', token);
    });

    // 4. 🔒 HANDLE AUTH ERRORS (Password Changed / Invalid Token)
    socket.current.on('error_message', (msg: string) => {
        console.error("⛔ Auth Error:", msg);
        
        // A. Alert the user
        alert(msg); // "Session expired. Please login again."
        
        // B. Clear local storage
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminEmail');

        // C. Force Redirect to Login
        navigate('/admin/login');
    });

    // 5. Real-time Incoming Message Handler
    socket.current.on('admin_receive_message', (data: any) => {
        fetchChats(); // Refresh list
        if (selectedChat && selectedChat.userId === data.userId) {
             setMessages(prev => [...prev, data]);
        }
    });

    // 6. Initial API Data Fetch
    fetchStats();
    fetchChats();

    // 7. Cleanup
    return () => {
      if (socket.current) socket.current.disconnect();
    };
  }, [selectedChat, navigate]); // Added navigate dependency

  const handleLogout = () => {
    // 1. Disconnect Socket
    if (socket.current) socket.current.disconnect();

    // 2. Clear Storage
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminEmail');

    // 3. Redirect
    navigate('/admin/login');
  };


  // --- API CALLS ---
  const fetchStats = async () => {
    try {
      const res = await fetch(`${API_URL}/api/admin/stats`);
      const data = await res.json();
      setStats(data);
    } catch (err) { console.error("Stats Fetch Error:", err); }
  };

  const fetchChats = async () => {
    try {
      const res = await fetch(`${API_URL}/api/admin/chats`);
      const data = await res.json();
      setChats(data);
    } catch (err) { console.error("Chats Fetch Error:", err); }
  };

  const loadChatHistory = async (chat: ChatSession) => {
    // 1. Set selected chat immediately to switch the UI view
    setSelectedChat(chat);
    setMessages([]); // Clear previous messages to show "Loading..." state

    try {
        console.log(`Fetching history for: ${chat.userId}`);
        const res = await fetch(`${API_URL}/api/chat/history/${chat.userId}`);
        
        // 2. Safety Check: Did the API fail?
        if (!res.ok) {
            console.error("API Error:", res.status, res.statusText);
            // Fallback: Use the old route if the new one fails (Backward compatibility)
            const fallbackRes = await fetch(`${API_URL}/api/chat-history/${chat.userId}`);
            if (fallbackRes.ok) {
                const data = await fallbackRes.json();
                if (Array.isArray(data)) {
                    setMessages(data);
                    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
                    return;
                }
            }
            throw new Error("Failed to load history");
        }

        const data = await res.json();

        // 3. Crash Prevention: Ensure data is actually an array
        if (Array.isArray(data)) {
            setMessages(data);
            // Auto-scroll to bottom
            setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
        } else {
            console.error("Data format error. Expected array, got:", data);
            setMessages([]); 
        }

    } catch (err) { 
        console.error("History Error:", err); 
        // Optional: Show an error message in the chat window
        setMessages([{ 
            _id: 'error', 
            content: "⚠️ Could not load history. Check console/network tab.", 
            senderType: 'system', 
            createdAt: new Date().toISOString() 
        } as Message]);
    }
  };


  // --- ACTIONS ---
  const handleTakeOver = () => {
    if (!selectedChat) return;

    console.log("Taking over chat for:", selectedChat.userId); // Debug log

    // 1. Tell Backend to switch status
    socket.current.emit('admin_join_chat', { userId: selectedChat.userId });
    
    // 2. Update UI instantly (Optimistic update)
    setSelectedChat(prev => prev ? { ...prev, status: 'human_active' } : null);
    
    setChats(prev => prev.map(c => 
        c.userId === selectedChat.userId ? { ...c, status: 'human_active' } : c
    ));
    
    // 3. Add "System Message" to the visual log
    setMessages(prev => [...prev, { 
        _id: Date.now().toString(), 
        content: "👨‍💼 You joined the chat. AI Paused.", 
        senderType: 'system', 
        createdAt: new Date().toISOString() 
    }]);
  };

  const sendMessage = () => {
    if (!inputText.trim() || !selectedChat) return;

    const payload = {
        userId: selectedChat.userId,
        content: inputText,
        adminName: "Omkar (Owner)"
    };

    // Emit to backend
    socket.current.emit('admin_send_message', payload);

    // Update UI immediately
    setMessages(prev => [...prev, {
        _id: Date.now().toString(),
        content: inputText,
        senderType: 'admin',
        createdAt: new Date().toISOString()
    }]);
    
    setInputText('');
  };


  return (
    <div className="flex h-screen bg-[#050511] text-gray-100 font-sans overflow-hidden">
      
      {/* SIDEBAR */}
      <aside className="w-64 bg-[#0a0a1a] border-r border-gray-800 flex flex-col">
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-yellow-600 to-yellow-400 flex items-center justify-center font-bold text-black text-xl">K</div>
          <span className="text-xl font-bold tracking-wide text-white">K'artz <span className="text-yellow-500 text-xs block font-normal">Admin Panel</span></span>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          {[
            { id: 'dashboard', icon: LayoutDashboard, label: 'Overview' },
            { id: 'chats', icon: MessageSquare, label: 'Live Chats', badge: chats.filter(c => c.unread > 0).length },
            { id: 'orders', icon: ShoppingBag, label: 'Orders' },
            { id: 'users', icon: Users, label: 'Customers' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 ${
                activeTab === item.id 
                  ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 shadow-[0_0_15px_rgba(245,158,11,0.1)]' 
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon size={20} />
                <span>{item.label}</span>
              </div>
              {item.badge ? (
                <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">{item.badge}</span>
              ) : null}
            </button>
          ))}
        </nav>
        
        <div className="p-4 border-t border-gray-800">
             <div className="flex items-center gap-2 text-green-500 text-sm mb-4">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                System Operational
             </div>
             <button onClick={handleLogout} className="flex items-center gap-2 text-gray-400 hover:text-white w-full px-4 py-2 hover:bg-white/5 rounded-lg transition-colors">
                <LogOut   size={18} /> Logout
             </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col h-full relative">
        {/* Header */}
        <header className="h-16 border-b border-gray-800 flex items-center justify-between px-8 bg-[#050511]/90 backdrop-blur-md z-10">
          <h2 className="text-xl font-semibold text-white capitalize">{activeTab}</h2>
          <div className="flex items-center gap-6">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input type="text" placeholder="Search..." className="bg-gray-900 border border-gray-800 rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-yellow-500/50 w-64 text-gray-300" />
            </div>
            <button className="relative text-gray-400 hover:text-yellow-500 transition-colors">
                <Bell size={20} />
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="w-8 h-8 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
          </div>
        </header>

        {/* CONTENT SCROLL AREA */}
        <div className="flex-1 overflow-y-auto p-8 scrollbar-hide">
            
            {/* --- DASHBOARD VIEW --- */}
            {activeTab === 'dashboard' && (
                <div className="space-y-8">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { title: 'Active Chats', value: stats.activeChats, icon: MessageSquare, color: 'text-blue-400' },
                            { title: 'Pending Quotes', value: stats.pendingQuotes, icon: Clock, color: 'text-yellow-500' },
                            { title: 'Total Orders', value: stats.totalOrders, icon: ShoppingBag, color: 'text-purple-400' },
                            { title: 'Revenue (Est)', value: `₹${stats.revenue}`, icon: TrendingUp, color: 'text-green-400' },
                        ].map((stat, i) => (
                            <div key={i} className="bg-[#0a0a1a] border border-gray-800 p-6 rounded-2xl hover:border-yellow-500/30 transition-all cursor-default group">
                                <div className="flex justify-between items-start mb-4">
                                    <div className={`p-3 rounded-lg bg-white/5 ${stat.color} group-hover:bg-yellow-500/10 transition-colors`}>
                                        <stat.icon size={24} />
                                    </div>
                                    <span className="text-xs text-gray-500 bg-gray-900 px-2 py-1 rounded">Today</span>
                                </div>
                                <h3 className="text-3xl font-bold text-white mb-1">{stat.value}</h3>
                                <p className="text-gray-400 text-sm">{stat.title}</p>
                            </div>
                        ))}
                    </div>

                    {/* Charts Area - UPDATED to Fix Infinite Scroll */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                        <div className="lg:col-span-2 bg-[#0a0a1a] border border-gray-800 rounded-2xl p-6 flex flex-col">
                            <h3 className="text-lg font-semibold text-white mb-6">Traffic Overview</h3>
                            {/* Fixed Height Container for Chart */}
                            <div className="h-[300px] w-full min-h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={[
                                        { name: 'Mon', visits: 40 }, { name: 'Tue', visits: 30 }, 
                                        { name: 'Wed', visits: 60 }, { name: 'Thu', visits: 45 }, 
                                        { name: 'Fri', visits: 90 }, { name: 'Sat', visits: 70 }
                                    ]}>
                                        <defs>
                                            <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3}/>
                                                <stop offset="95%" stopColor="#F59E0B" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                                        <XAxis dataKey="name" stroke="#666" tick={{fill: '#666'}} axisLine={false} />
                                        <YAxis stroke="#666" tick={{fill: '#666'}} axisLine={false} />
                                        <Tooltip contentStyle={{ backgroundColor: '#000', borderColor: '#333' }} />
                                        <Area type="monotone" dataKey="visits" stroke="#F59E0B" strokeWidth={3} fillOpacity={1} fill="url(#colorVisits)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                        <div className="bg-[#0a0a1a] border border-gray-800 rounded-2xl p-6 flex flex-col h-[400px]">
                            <h3 className="text-lg font-semibold text-white mb-6">Recent Activity</h3>
                            <div className="space-y-6 overflow-y-auto pr-2 scrollbar-hide">
                                {[1,2,3,4].map((_, i) => (
                                    <div key={i} className="flex gap-4 items-start">
                                        <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-xs text-gray-400 shrink-0">
                                            {i === 0 ? 'Now' : `${i}h`}
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-300">New quote request from <span className="text-yellow-500">Luxe Hotel</span></p>
                                            <p className="text-xs text-gray-600 mt-1">Acrylic Signage • 3ft x 6ft</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* --- CHATS VIEW (FULL INTERFACE) --- */}
            {activeTab === 'chats' && (
                <div className="flex h-[calc(100vh-140px)] gap-6">
                    {/* Chat List */}
                    <div className="w-1/3 bg-[#0a0a1a] border border-gray-800 rounded-2xl overflow-hidden flex flex-col">
                        <div className="p-4 border-b border-gray-800">
                             <h3 className="text-lg font-semibold text-white">Inbox</h3>
                        </div>
                        <div className="flex-1 overflow-y-auto">
                            {chats.map(chat => (
                                <div 
                                    key={chat._id}
                                    onClick={() => loadChatHistory(chat)}
                                    className={`p-4 border-b border-gray-800 cursor-pointer hover:bg-white/5 transition-colors ${selectedChat?._id === chat._id ? 'bg-yellow-500/10 border-l-4 border-l-yellow-500' : ''}`}
                                >
                                    <div className="flex justify-between mb-1">
                                        <span className="font-semibold text-gray-200">{chat.userEmail}</span>
                                       <span className="text-xs text-gray-500">{safeFormatTime(chat.updatedAt)}</span>
                                    </div>
                                    <p className="text-sm text-gray-500 truncate">{chat.lastMessage}</p>
                                    <div className="flex gap-2 mt-2">
                                        {chat.status === 'ai_active' ? (
                                            <span className="text-[10px] bg-blue-900/30 text-blue-400 px-2 py-0.5 rounded border border-blue-900/50">AI Active</span>
                                        ) : (
                                            <span className="text-[10px] bg-yellow-900/30 text-yellow-500 px-2 py-0.5 rounded border border-yellow-900/50">Human Support</span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Chat Window */}
                    <div className="flex-1 bg-[#0a0a1a] border border-gray-800 rounded-2xl overflow-hidden flex flex-col relative">
                        {selectedChat ? (
                            <>
                                {/* Chat Header */}
                                <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-[#0d0d1f]">
                                    <div>
                                        <h3 className="font-bold text-white">{selectedChat.userEmail}</h3>
                                        <div className="flex items-center gap-2">
                                            <span className={`w-2 h-2 rounded-full ${selectedChat.status === 'ai_active' ? 'bg-blue-500' : 'bg-yellow-500'}`}></span>
                                            <span className="text-xs text-gray-400">
                                                {selectedChat.status === 'ai_active' ? 'Managed by AI' : 'Live with Admin'}
                                            </span>
                                        </div>
                                    </div>
                                    {selectedChat.status === 'ai_active' && (
                                        <button 
                                            onClick={handleTakeOver}
                                            className="bg-yellow-600 hover:bg-yellow-500 text-black px-4 py-2 rounded-lg text-sm font-bold transition-colors flex items-center gap-2"
                                        >
                                            <LogOut size={16} /> Take Over
                                        </button>
                                    )}
                                </div>

                                {/* Messages */}
                                <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#050511]">
                                    {messages.map((msg) => (
                                        <div key={msg._id} className={`flex ${msg.senderType === 'user' ? 'justify-start' : 'justify-end'}`}>
                                            <div className={`max-w-[70%] p-4 rounded-2xl text-sm leading-relaxed ${
                                                msg.senderType === 'user' 
                                                    ? 'bg-[#1a1a2e] text-gray-200 rounded-tl-none' 
                                                    : msg.senderType === 'system'
                                                    ? 'bg-transparent text-yellow-500 text-center w-full italic border border-yellow-500/20'
                                                    : 'bg-gradient-to-br from-yellow-600 to-yellow-500 text-black font-medium rounded-tr-none shadow-lg shadow-yellow-500/10'
                                            }`}>
                                                {msg.senderType === 'ai' && <span className="text-[10px] uppercase font-bold opacity-50 block mb-1">AI Assistant</span>}
                                                {msg.content}
                                                <span className={`text-[10px] block mt-2 opacity-60 ${msg.senderType === 'user' ? 'text-gray-500' : 'text-black'}`}>
                                                    {safeFormatTime(msg.createdAt)}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                    <div ref={messagesEndRef} />
                                </div>

                                {/* Input */}
                                <div className="p-4 border-t border-gray-800 bg-[#0d0d1f]">
                                    <div className="flex gap-4">
                                        <input 
                                            type="text" 
                                            value={inputText}
                                            onChange={(e) => setInputText(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                                            placeholder={selectedChat.status === 'ai_active' ? "Take over to type..." : "Type your reply..."}
                                            disabled={selectedChat.status === 'ai_active'}
                                            className="flex-1 bg-[#1a1a2e] border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                        />
                                        <button 
                                            onClick={sendMessage}
                                            disabled={selectedChat.status === 'ai_active'}
                                            className="bg-yellow-500 hover:bg-yellow-400 text-black p-3 rounded-xl disabled:opacity-50 disabled:grayscale transition-all"
                                        >
                                            <Send size={20} />
                                        </button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
                                <MessageSquare size={48} className="mb-4 opacity-20" />
                                <p>Select a conversation to start chatting</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;