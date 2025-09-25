import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Send, X, Users, Minimize2, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import api from '@/services/api';

interface Message {
  id: number;
  senderId: number;
  senderName: string;
  receiverId: number;
  content: string;
  timestamp: string;
  read: boolean;
}

interface User {
  id: number;
  name: string;
  role: string;
  online: boolean;
}

const MessagingSystem: React.FC = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [activeChat, setActiveChat] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (user) {
      fetchUsers();
      fetchMessages();
      connectWebSocket();
    }

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const connectWebSocket = () => {
    // In a real implementation, you'd connect to a WebSocket server
    // For now, we'll simulate real-time updates with polling
    const interval = setInterval(() => {
      if (activeChat) {
        fetchMessages();
      }
    }, 3000);

    return () => clearInterval(interval);
  };

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users');
      const filteredUsers = response.data
        .filter((u: any) => u.id !== user?.id)
        .map((u: any) => ({
          id: u.id,
          name: u.name,
          role: u.role,
          online: Math.random() > 0.3 // Simulate online status
        }));
      setUsers(filteredUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchMessages = async () => {
    try {
      // Simulate fetching messages - in real implementation, you'd have a messages API
      const mockMessages: Message[] = [
        {
          id: 1,
          senderId: 2,
          senderName: 'Dr. Sarah Wilson',
          receiverId: user?.id || 0,
          content: 'Can you please check on patient in room 205?',
          timestamp: new Date().toISOString(),
          read: false
        }
      ];
      setMessages(mockMessages);
      setUnreadCount(mockMessages.filter(m => !m.read && m.receiverId === user?.id).length);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !activeChat) return;

    const message: Message = {
      id: Date.now(),
      senderId: user?.id || 0,
      senderName: user?.name || '',
      receiverId: activeChat,
      content: newMessage,
      timestamp: new Date().toISOString(),
      read: false
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');

    // In real implementation, send to server via WebSocket or API
    try {
      await api.post('/messages', message);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const startChat = (userId: number) => {
    setActiveChat(userId);
    setIsMinimized(false);
  };

  const filteredMessages = messages.filter(
    m => (m.senderId === activeChat && m.receiverId === user?.id) ||
         (m.senderId === user?.id && m.receiverId === activeChat)
  );

  const activeChatUser = users.find(u => u.id === activeChat);

  return (
    <>
      {/* Floating Message Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-40"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1 }}
      >
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-200 relative"
        >
          <MessageCircle className="w-6 h-6" />
          {unreadCount > 0 && (
            <span className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </Button>
      </motion.div>

      {/* Messaging Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 400 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 400 }}
            className="fixed bottom-20 right-6 z-30 w-80 h-96 bg-white dark:bg-slate-800 rounded-lg shadow-2xl border border-slate-200 dark:border-slate-700"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
                <div className="flex items-center space-x-2">
                  <MessageCircle className="w-5 h-5 text-blue-600" />
                  <h3 className="font-semibold text-slate-900 dark:text-white">
                    {activeChat ? activeChatUser?.name : 'Messages'}
                  </h3>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsMinimized(!isMinimized)}
                    className="w-8 h-8"
                  >
                    {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsOpen(false)}
                    className="w-8 h-8"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {!isMinimized && (
                <>
                  {!activeChat ? (
                    /* Users List */
                    <div className="flex-1 overflow-y-auto p-4">
                      <div className="space-y-2">
                        {users.map(user => (
                          <motion.div
                            key={user.id}
                            whileHover={{ scale: 1.02 }}
                            onClick={() => startChat(user.id)}
                            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer"
                          >
                            <div className="relative">
                              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
                                <span className="text-white font-medium">
                                  {user.name.charAt(0)}
                                </span>
                              </div>
                              {user.online && (
                                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-slate-800"></div>
                              )}
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-slate-900 dark:text-white">
                                {user.name}
                              </p>
                              <p className="text-sm text-slate-500 dark:text-slate-400">
                                {user.role}
                              </p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    /* Chat View */
                    <>
                      <div className="flex-1 overflow-y-auto p-4 space-y-3">
                        {filteredMessages.map(message => (
                          <div
                            key={message.id}
                            className={`flex ${message.senderId === user?.id ? 'justify-end' : 'justify-start'}`}
                          >
                            <div
                              className={`max-w-xs px-3 py-2 rounded-lg ${
                                message.senderId === user?.id
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white'
                              }`}
                            >
                              <p className="text-sm">{message.content}</p>
                              <p className="text-xs opacity-70 mt-1">
                                {new Date(message.timestamp).toLocaleTimeString()}
                              </p>
                            </div>
                          </div>
                        ))}
                        <div ref={messagesEndRef} />
                      </div>

                      {/* Message Input */}
                      <div className="p-4 border-t border-slate-200 dark:border-slate-700">
                        <div className="flex space-x-2">
                          <Input
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Type a message..."
                            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                            className="flex-1"
                          />
                          <Button
                            onClick={sendMessage}
                            size="icon"
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            <Send className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </>
                  )}

                  {activeChat && (
                    <div className="p-2 border-t border-slate-200 dark:border-slate-700">
                      <Button
                        variant="ghost"
                        onClick={() => setActiveChat(null)}
                        className="w-full text-sm"
                      >
                        ← Back to contacts
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default MessagingSystem;