import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { io, type Socket } from 'socket.io-client';
import { API_URL } from '@/config/api';
import { logger } from '@/lib/monitoring';

/**
 * Chat transport + message state for the K'artz assistant.
 *
 * Kept out of the page component so the view only deals with rendering, and so
 * the tricky parts — socket lifecycle, optimistic echo reconciliation and the
 * render window — live in one place.
 *
 * Windowing: the history endpoint hands back the whole conversation in one
 * response, so a long chat used to mount every bubble at once. We keep the full
 * list in memory but only render the newest `PAGE_SIZE`, and page backwards on
 * demand. Moving to a real server-side cursor later means changing only
 * `loadHistory` — everything downstream already works off a window.
 */

export const CHAT_API_URL = API_URL;

/** Bubbles rendered on first paint, and added each time the user pages back. */
const PAGE_SIZE = 25;

/** Stop showing "typing" if the assistant never answers. */
const REPLY_TIMEOUT_MS = 45_000;

export type SenderType = 'user' | 'ai' | 'agent' | 'admin';

export interface ChatMessage {
  id: string;
  content: string;
  senderType: SenderType;
  timestamp: Date;
  senderName?: string;
  /** Shown immediately on send, before the server has echoed it back. */
  pending?: boolean;
}

export type HistoryState = 'idle' | 'loading' | 'ready' | 'error';

/**
 * The socket and the history endpoint disagree about field names (`id` vs
 * `_id`) and timestamps arrive as strings, so everything entering state goes
 * through here. Returns null for records we can't render.
 */
const normalize = (raw: unknown): ChatMessage | null => {
  if (!raw || typeof raw !== 'object') return null;
  const record = raw as Record<string, unknown>;
  if (typeof record.content !== 'string') return null;

  const parsed = new Date(record.timestamp as string);
  const id = record.id ?? record._id;

  return {
    id: id ? String(id) : `srv-${record.senderType}-${record.timestamp}-${record.content.slice(0, 32)}`,
    content: record.content,
    senderType: (record.senderType as SenderType) ?? 'ai',
    senderName: typeof record.senderName === 'string' ? record.senderName : undefined,
    timestamp: Number.isNaN(parsed.getTime()) ? new Date() : parsed,
  };
};

/**
 * Adds an incoming message, absorbing the two ways the list used to grow
 * duplicates: the server re-emitting something we already hold, and the echo of
 * a message we are already showing optimistically.
 */
const mergeMessage = (list: ChatMessage[], incoming: ChatMessage): ChatMessage[] => {
  if (list.some((message) => message.id === incoming.id)) return list;

  if (incoming.senderType === 'user') {
    const pendingIndex = list.findIndex(
      (message) => message.pending && message.content === incoming.content,
    );
    if (pendingIndex !== -1) {
      const next = [...list];
      next[pendingIndex] = incoming;
      return next;
    }
  }

  return [...list, incoming];
};

export const useChatSession = (
  uid: string | undefined,
  email: string | null | undefined,
  displayName: string | null | undefined,
) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  /** How many of the oldest messages are held back from rendering. */
  const [hiddenCount, setHiddenCount] = useState(0);
  const [historyState, setHistoryState] = useState<HistoryState>('loading');
  const [isConnected, setIsConnected] = useState(false);
  const [awaitingReply, setAwaitingReply] = useState(false);
  const [reloadToken, setReloadToken] = useState(0);

  const socketRef = useRef<Socket | null>(null);

  // --- History -------------------------------------------------------------
  useEffect(() => {
    if (!uid) {
      setMessages([]);
      setHistoryState('idle');
      return;
    }

    // Aborting matters here: switching account mid-flight would otherwise let
    // the previous user's history land in state.
    const controller = new AbortController();
    setHistoryState('loading');

    (async () => {
      try {
        const res = await fetch(`${CHAT_API_URL}/api/chat/history/${uid}`, {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error(`History request failed (${res.status})`);

        const data: unknown = await res.json();
        const list = Array.isArray(data)
          ? (data.map(normalize).filter(Boolean) as ChatMessage[])
          : [];

        setMessages(list);
        setHiddenCount(Math.max(0, list.length - PAGE_SIZE));
        setHistoryState('ready');
      } catch (err) {
        if (controller.signal.aborted) return;
        logger.error('Failed to load chat history', err);
        setHistoryState('error');
      }
    })();

    return () => controller.abort();
  }, [uid, reloadToken]);

  // --- Socket --------------------------------------------------------------
  // Keyed on the primitives rather than the Firebase user object, which is a
  // fresh reference on every token refresh and used to tear down the socket.
  useEffect(() => {
    if (!uid) return;

    const socket = io(CHAT_API_URL);
    socketRef.current = socket;

    socket.on('connect', () => {
      setIsConnected(true);
      socket.emit('identify_user', { uid, email });
      // Subscribe to this user's room so admin replies reach us too.
      socket.emit('join_chat', uid);
    });

    socket.on('disconnect', () => setIsConnected(false));

    socket.on('receive_message', (raw: unknown) => {
      const message = normalize(raw);
      if (!message) return;

      setMessages((prev) => mergeMessage(prev, message));
      // Anything that isn't our own echo means the reply landed.
      if (message.senderType !== 'user') setAwaitingReply(false);
    });

    return () => {
      socket.removeAllListeners();
      socket.disconnect();
      socketRef.current = null;
    };
  }, [uid, email]);

  // Don't leave the typing indicator spinning forever if nothing comes back.
  useEffect(() => {
    if (!awaitingReply) return;
    const timer = window.setTimeout(() => setAwaitingReply(false), REPLY_TIMEOUT_MS);
    return () => window.clearTimeout(timer);
  }, [awaitingReply]);

  // --- Actions -------------------------------------------------------------
  const sendMessage = useCallback(
    (text: string) => {
      const content = text.trim();
      const socket = socketRef.current;
      if (!content || !socket || !uid || !email) return false;

      const optimistic: ChatMessage = {
        id: `pending-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        content,
        senderType: 'user',
        senderName: displayName || 'You',
        timestamp: new Date(),
        pending: true,
      };

      setMessages((prev) => [...prev, optimistic]);
      setAwaitingReply(true);
      socket.emit('send_message', {
        content,
        senderName: displayName || 'Client',
        uid,
        email,
      });

      return true;
    },
    [uid, email, displayName],
  );

  const loadOlder = useCallback(() => {
    setHiddenCount((count) => Math.max(0, count - PAGE_SIZE));
  }, []);

  const retryHistory = useCallback(() => setReloadToken((token) => token + 1), []);

  // New messages append past the window, so nothing already on screen is ever
  // pulled out from under the reader.
  const visibleMessages = useMemo(() => messages.slice(hiddenCount), [messages, hiddenCount]);

  return {
    messages: visibleMessages,
    hiddenCount,
    hasOlder: hiddenCount > 0,
    loadOlder,
    historyState,
    retryHistory,
    isConnected,
    awaitingReply,
    sendMessage,
    canSend: isConnected && historyState !== 'loading' && Boolean(uid && email),
  };
};
