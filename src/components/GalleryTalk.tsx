import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client (in production, use env variables)
// @ts-ignore - Vite env variables
const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
// @ts-ignore - Vite env variables
const supabaseKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || 'placeholder-key';
const supabase = createClient(supabaseUrl, supabaseKey);

interface GalleryTalkProps {
  caseId: string;
  userRole: string;
  userHandle: string;
}

interface Message {
  id: string;
  content: string;
  authorHandle: string;
  createdAt: string;
}

export function GalleryTalk({ caseId, userRole, userHandle }: GalleryTalkProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // CRITICAL SECURITY: Only LISTENER role can access Gallery Talk
  if (userRole !== 'LISTENER') {
    return (
      <div className="bg-pink-50 rounded-3xl p-8 border border-pink-200 text-center">
        <div className="text-4xl mb-3">🔒</div>
        <h3 className="font-heading text-lg font-bold text-pink-700 mb-2">
          Gallery Talk Restricted
        </h3>
        <p className="text-sm text-pink-600">
          This space is exclusively for Floor Members (Listeners) to discuss cases amongst themselves.
          Lawyers and Chief Judges cannot access this chat.
        </p>
      </div>
    );
  }

  // Subscribe to real-time messages
  useEffect(() => {
    const channel = supabase
      .channel(`gallery-talk-${caseId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'gallery_comments',
          filter: `targetId=eq.${caseId}`,
        },
        (payload) => {
          const newMsg: Message = {
            id: payload.new.id,
            content: payload.new.content,
            authorHandle: payload.new.authorHandle,
            createdAt: payload.new.created_at,
          };
          setMessages((prev) => [...prev, newMsg]);
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          setIsConnected(true);
        }
      });

    // Fetch initial messages
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('gallery_comments')
        .select('*')
        .eq('targetId', caseId)
        .order('createdAt', { ascending: true });

      if (data && !error) {
        setMessages(data);
      }
    };

    fetchMessages();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [caseId]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const messageData = {
      content: newMessage.trim(),
      authorHandle: userHandle,
      targetId: caseId,
      targetType: 'CASE',
    };

    // Optimistic update
    const tempId = `temp-${Date.now()}`;
    const tempMessage: Message = {
      id: tempId,
      ...messageData,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempMessage]);
    setNewMessage('');

    try {
      const { error } = await supabase.from('gallery_comments').insert(messageData);

      if (error) {
        console.error('Failed to send message:', error);
        // Remove optimistic update on error
        setMessages((prev) => prev.filter((m) => m.id !== tempId));
      }
    } catch (err) {
      console.error('Send error:', err);
      setMessages((prev) => prev.filter((m) => m.id !== tempId));
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-pink-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-100 to-sky-100 p-4 border-b border-pink-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">💬</span>
            <div>
              <h3 className="font-heading text-lg font-bold text-pink-700">
                Gallery Talk
              </h3>
              <p className="text-xs text-pink-500">
                Floor Members Discussion
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`} />
            <span className="text-xs text-pink-600">
              {isConnected ? 'Live' : 'Connecting...'}
            </span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="h-96 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-3">💭</div>
            <p className="text-pink-500 text-sm">
              No messages yet. Be the first to share your thoughts!
            </p>
          </div>
        ) : (
          <AnimatePresence>
            {messages.map((msg) => {
              const isOwn = msg.authorHandle === userHandle;
              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                      isOwn
                        ? 'bg-gradient-to-r from-pink-400 to-pink-500 text-white'
                        : 'bg-pink-50 text-pink-700 border border-pink-100'
                    }`}
                  >
                    {!isOwn && (
                      <div className="text-xs font-mono font-bold mb-1 opacity-70">
                        {msg.authorHandle}
                      </div>
                    )}
                    <p className="text-sm">{msg.content}</p>
                    <div className={`text-xs mt-1 ${isOwn ? 'text-pink-100' : 'text-pink-400'}`}>
                      {new Date(msg.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-pink-100 bg-pink-50/50">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Share your thoughts..."
            className="flex-1 px-4 py-2 rounded-2xl border border-pink-200 bg-white text-pink-700 placeholder-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-300"
          />
          <motion.button
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            className="px-4 py-2 rounded-2xl bg-gradient-to-r from-pink-400 to-pink-500 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Send
          </motion.button>
        </div>
        <p className="text-xs text-pink-400 mt-2 text-center">
          🔒 This chat is private for Floor Members only
        </p>
      </div>
    </div>
  );
}
