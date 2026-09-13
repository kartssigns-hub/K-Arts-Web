import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  LayoutDashboard, MessageSquare, ShoppingBag,
  Users, TrendingUp, Bell, Search, LogOut,
  Clock, Send, Inbox, Phone, Mail
} from 'lucide-react';
import {
  XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, AreaChart, Area
} from 'recharts';
import { io, type Socket } from 'socket.io-client';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { API_URL, AdminAuthError, adminFetch, clearAdminSession, getAdminToken } from '@/config/api';
import { enquiryServiceLabel } from '@/config/business';
import { logger } from '@/lib/monitoring';

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

/** Shape returned by GET /api/chat/history/:uid (shared with the customer chat widget). */
interface HistoryMessage {
  id?: string;
  _id?: string;
  content: string;
  senderType: Message['senderType'];
  timestamp?: string;
  createdAt?: string;
}

/** Payload of the 'admin_receive_message' socket event. */
interface IncomingMessage {
  chatId: string;
  userId: string;
  content: string;
  timestamp: string;
}

type EnquiryStatus = 'new' | 'contacted' | 'closed';

interface Enquiry {
  id: string;
  name: string;
  phone: string;
  email?: string;
  service?: string;
  message?: string;
  status: EnquiryStatus;
  createdAt: string;
}

const ENQUIRY_STATUS_STYLES: Record<EnquiryStatus, string> = {
  new: 'bg-yellow-900/30 text-yellow-500 border-yellow-900/50',
  contacted: 'bg-blue-900/30 text-blue-400 border-blue-900/50',
  closed: 'bg-gray-800 text-gray-400 border-gray-700',
};

/** wa.me wants the international number without "+"; bare 10-digit numbers are Indian mobiles. */
const toWhatsAppNumber = (phone: string) => {
  const digits = phone.replace(/\D/g, '').replace(/^0(?=\d{10}$)/, '');
  return digits.length === 10 ? `91${digits}` : digits;
};

// Helper to safely format dates without crashing
const safeFormat = (dateString: string | undefined, pattern = 'HH:mm') => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? '' : format(date, pattern);
};

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
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [inputText, setInputText] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const navigate = useNavigate();
  const socket = useRef<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const sessionEnded = useRef(false);

  // Read by socket handlers, which are registered once and would otherwise see a stale selection
  const selectedChatRef = useRef<ChatSession | null>(null);
  useEffect(() => {
    selectedChatRef.current = selectedChat;
  }, [selectedChat]);

  const endSession = useCallback((reason?: string) => {
    // Several requests can fail with 401 at once; only alert and redirect once
    if (sessionEnded.current) return;
    sessionEnded.current = true;

    if (reason) alert(reason);
    socket.current?.disconnect();
    clearAdminSession();
    navigate('/admin/login');
  }, [navigate]);

  const handleApiError = useCallback((message: string, err: unknown) => {
    if (err instanceof AdminAuthError) {
      endSession(err.message);
      return;
    }
    logger.error(message, err);
  }, [endSession]);

  // --- API CALLS ---
  const fetchStats = useCallback(async () => {
    try {
      const res = await adminFetch('/api/admin/stats');
      if (!res.ok) throw new Error(`Stats request failed (${res.status})`);
      setStats(await res.json());
    } catch (err) { handleApiError('Failed to load admin stats', err); }
  }, [handleApiError]);

  const fetchChats = useCallback(async () => {
    try {
      const res = await adminFetch('/api/admin/chats');
      if (!res.ok) throw new Error(`Chats request failed (${res.status})`);
      const data: unknown = await res.json();
      setChats(Array.isArray(data) ? data : []);
    } catch (err) { handleApiError('Failed to load chats', err); }
  }, [handleApiError]);

  const fetchEnquiries = useCallback(async () => {
    try {
      const res = await adminFetch('/api/admin/enquiries');
      if (!res.ok) throw new Error(`Enquiries request failed (${res.status})`);
      const data: unknown = await res.json();
      setEnquiries(Array.isArray(data) ? data : []);
    } catch (err) { handleApiError('Failed to load enquiries', err); }
  }, [handleApiError]);

  // --- INITIALIZATION & SOCKET CONNECTION ---
  useEffect(() => {
    const token = getAdminToken();
    if (!token) {
      navigate('/admin/login');
      return;
    }

    // One connection for the whole session. The server treats a disconnect as the
    // admin leaving and hands every live chat back to the AI, so this must not
    // reconnect when, for example, a different chat is selected.
    const client = io(API_URL);
    socket.current = client;

    client.on('connect', () => {
      setIsConnected(true);
      // Authenticate on every (re)connect
      client.emit('admin_connect', token);
    });

    client.on('disconnect', () => setIsConnected(false));

    // Invalid token or password changed
    client.on('error_message', (msg: string) => endSession(msg));

    client.on('admin_receive_message', (data: IncomingMessage) => {
      fetchChats();
      if (selectedChatRef.current?.userId === data.userId) {
        setMessages(prev => [...prev, {
          _id: `${data.timestamp}-${prev.length}`,
          content: data.content,
          senderType: 'user',
          createdAt: data.timestamp
        }]);
      }
    });

    client.on('admin_new_enquiry', () => fetchEnquiries());

    fetchStats();
    fetchChats();
    fetchEnquiries();

    return () => {
      client.disconnect();
    };
  }, [navigate, endSession, fetchStats, fetchChats, fetchEnquiries]);

  const handleLogout = () => {
    socket.current?.disconnect();
    clearAdminSession();
    navigate('/admin/login');
  };

  const loadChatHistory = async (chat: ChatSession) => {
    // Switch the view immediately; clear previous messages while loading
    setSelectedChat(chat);
    setMessages([]);

    try {
        const res = await fetch(`${API_URL}/api/chat/history/${chat.userId}`);
        if (!res.ok) throw new Error(`History request failed (${res.status})`);

        const data: unknown = await res.json();
        if (!Array.isArray(data)) throw new Error('Unexpected chat history response');

        setMessages(data.map((msg: HistoryMessage, index) => ({
            _id: msg.id ?? msg._id ?? `history-${index}`,
            content: msg.content,
            senderType: msg.senderType,
            createdAt: msg.timestamp ?? msg.createdAt ?? ''
        })));
        setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    } catch (err) {
        logger.error('Failed to load chat history', err);
        setMessages([{
            _id: 'error',
            content: "Could not load history. Please try again.",
            senderType: 'system',
            createdAt: new Date().toISOString()
        }]);
    }
  };

  const updateEnquiryStatus = async (id: string, status: EnquiryStatus) => {
    const previous = enquiries;
    setEnquiries(prev => prev.map(e => (e.id === id ? { ...e, status } : e)));

    try {
      const res = await adminFetch(`/api/admin/enquiries/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (!res.ok) throw new Error(`Enquiry status update failed (${res.status})`);
    } catch (err) {
      setEnquiries(previous);
      handleApiError('Failed to update enquiry status', err);
    }
  };


  // --- ACTIONS ---
  const handleTakeOver = () => {
    if (!selectedChat) return;

    // Tell Backend to switch status
    socket.current?.emit('admin_join_chat', { userId: selectedChat.userId });

    //  Update UI instantly (Optimistic update)
    setSelectedChat(prev => prev ? { ...prev, status: 'human_active' } : null);

    setChats(prev => prev.map(c =>
        c.userId === selectedChat.userId ? { ...c, status: 'human_active' } : c
    ));

    //  Add "System Message" to the visual log
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
    socket.current?.emit('admin_send_message', payload);

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
            { id: 'enquiries', icon: Inbox, label: 'Enquiries', badge: enquiries.filter(e => e.status === 'new').length },
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
             <div className={`flex items-center gap-2 text-sm mb-4 ${isConnected ? 'text-green-500' : 'text-gray-500'}`}>
                <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`}></span>
                {isConnected ? 'Live updates on' : 'Connecting…'}
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

            {/* --- ENQUIRIES VIEW (contact form submissions) --- */}
            {activeTab === 'enquiries' && (
                <div className="bg-[#0a0a1a] border border-gray-800 rounded-2xl overflow-hidden">
                    <div className="p-4 border-b border-gray-800 flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-white">Contact form enquiries</h3>
                        <button onClick={fetchEnquiries} className="text-sm text-gray-400 hover:text-yellow-500 transition-colors">
                            Refresh
                        </button>
                    </div>

                    {enquiries.length === 0 ? (
                        <div className="p-12 flex flex-col items-center text-center text-gray-500">
                            <Inbox size={48} className="mb-4 opacity-20" />
                            <p>No enquiries yet. Submissions from the contact page will appear here.</p>
                        </div>
                    ) : (
                        <ul className="divide-y divide-gray-800">
                            {enquiries.map((enquiry) => (
                                <li key={enquiry.id} className="p-5 flex flex-col lg:flex-row lg:items-start gap-4">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex flex-wrap items-center gap-3 mb-2">
                                            <span className="font-semibold text-gray-100">{enquiry.name}</span>
                                            {enquiry.service && (
                                                <span className="text-[10px] uppercase tracking-wider text-gray-400 bg-gray-900 px-2 py-0.5 rounded">
                                                    {enquiryServiceLabel(enquiry.service) ?? enquiry.service}
                                                </span>
                                            )}
                                            <span className="text-xs text-gray-500">{safeFormat(enquiry.createdAt, 'dd MMM yyyy, HH:mm')}</span>
                                        </div>
                                        <div className="flex flex-wrap gap-x-5 gap-y-1 text-sm text-gray-400 mb-2">
                                            <a href={`tel:${enquiry.phone}`} className="flex items-center gap-1.5 hover:text-yellow-500 transition-colors">
                                                <Phone size={14} /> {enquiry.phone}
                                            </a>
                                            {enquiry.email && (
                                                <a href={`mailto:${enquiry.email}`} className="flex items-center gap-1.5 hover:text-yellow-500 transition-colors break-all">
                                                    <Mail size={14} /> {enquiry.email}
                                                </a>
                                            )}
                                            <a
                                                href={`https://wa.me/${toWhatsAppNumber(enquiry.phone)}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-[#25D366] hover:underline"
                                            >
                                                WhatsApp
                                            </a>
                                        </div>
                                        {enquiry.message && (
                                            <p className="text-sm text-gray-300 whitespace-pre-line break-words">{enquiry.message}</p>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-3 shrink-0">
                                        <span className={`text-[10px] px-2 py-0.5 rounded border capitalize ${ENQUIRY_STATUS_STYLES[enquiry.status]}`}>
                                            {enquiry.status}
                                        </span>
                                        <select
                                            value={enquiry.status}
                                            onChange={(e) => updateEnquiryStatus(enquiry.id, e.target.value as EnquiryStatus)}
                                            aria-label={`Status for ${enquiry.name}`}
                                            className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-1.5 text-sm text-gray-300 focus:outline-none focus:border-yellow-500"
                                        >
                                            <option value="new">New</option>
                                            <option value="contacted">Contacted</option>
                                            <option value="closed">Closed</option>
                                        </select>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
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
                                       <span className="text-xs text-gray-500">{safeFormat(chat.updatedAt)}</span>
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
                                                    {safeFormat(msg.createdAt)}
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
