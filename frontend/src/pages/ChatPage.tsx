import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { chatAPI } from '../services/api';
import { useSpeechToText } from '../hooks/useSpeechToText';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import {
  Button,
  Avatar,
  TypingIndicator,
  SuggestionChip,
  Sun,
  Moon,
  Mic,
  Plus,
  LogOut,
  Send,
  Brain,
  Copy,
  Check,
} from '../components/ui';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
}

const SUGGESTIONS = [
  'Explain React hooks with examples',
  'Debug my Python code',
  'How to optimize SQL queries?',
  'Create a REST API in Spring Boot',
  'Explain system design patterns',
  'Best practices for TypeScript'
];

export default function ChatPage() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { isListening, transcript, startListening, stopListening, isSupported } = useSpeechToText();

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    if (transcript) {
      setInput(transcript);
    }
  }, [transcript]);

  const generateId = () => Math.random().toString(36).substring(2, 9);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: generateId(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const assistantMessage: Message = {
      id: generateId(),
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      isStreaming: true,
    };

    setMessages((prev) => [...prev, assistantMessage]);

    try {
      const response = await chatAPI.askAI(userMessage.content);
      const content = typeof response.data === 'string' ? response.data : String(response.data || '');

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMessage.id
            ? { ...msg, content, isStreaming: false }
            : msg
        )
      );
    } catch (error) {
      console.error('Error asking AI:', error);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMessage.id
            ? {
                ...msg,
                content: 'Sorry, I encountered an error. Please try again.',
                isStreaming: false,
              }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleVoiceToggle = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleNewChat = () => {
    setMessages([]);
    setInput('');
  };

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  // Message component
  const MessageBubble = ({ message }: { message: Message }) => {
    const isUser = message.role === 'user';

    return (
      <div className={`flex gap-4 ${isUser ? 'flex-row-reverse' : ''} group`}>
        <div className="flex-shrink-0">
          {isUser ? (
            <Avatar name={user?.fullName || user?.email || 'User'} size="sm" />
          ) : (
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center">
              <Brain className="w-4 h-4 text-white" />
            </div>
          )}
        </div>

        <div className={`flex-1 max-w-[85%] ${isUser ? 'text-right' : ''}`}>
          <div className={`flex items-center gap-2 mb-1 ${isUser ? 'justify-end' : ''}`}>
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
              {isUser ? 'You' : 'Kikki'}
            </span>
            <span className="text-xs text-gray-400">
              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>

          <div
            className={`inline-block px-4 py-3 rounded-2xl text-left ${
              isUser
                ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
            }`}
          >
            {message.isStreaming ? (
              <TypingIndicator />
            ) : (
              <div className="whitespace-pre-wrap">
                {message.content}
              </div>
            )}
          </div>

          {/* Message actions */}
          {!isUser && !message.isStreaming && (
            <div className="flex items-center gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => copyToClipboard(message.content, message.id)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                title="Copy message"
              >
                {copiedId === message.id ? (
                  <Check className="w-4 h-4 text-emerald-500" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-[#0d0d0d] transition-colors duration-300">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transform transition-transform duration-300 lg:static lg:transform-none ${
          showSidebar ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* New Chat Button */}
          <div className="p-4">
            <Button
              onClick={handleNewChat}
              variant="secondary"
              className="w-full justify-start gap-2 border border-gray-300 dark:border-gray-700"
              leftIcon={<Plus className="w-5 h-5" />}
            >
              New Chat
            </Button>
          </div>

          {/* Chat History */}
          <div className="flex-1 overflow-y-auto px-4">
            {messages.length > 0 && (
              <div className="space-y-2">
                <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                  Current Chat
                </div>
                <button
                  onClick={handleNewChat}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition truncate"
                >
                  {messages[0]?.content.slice(0, 30)}...
                </button>
              </div>
            )}
          </div>

          {/* User Info */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-3 mb-3">
              <Avatar name={user?.fullName || user?.email || 'User'} size="sm" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {user?.fullName || user?.email || 'User'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {user?.email}
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="flex-1"
              >
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                className="flex-1 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile sidebar */}
      {showSidebar && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setShowSidebar(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="sticky top-0 z-30 flex items-center justify-between px-4 py-3 bg-white/80 dark:bg-[#0d0d0d]/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowSidebar(true)}
              className="lg:hidden"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </Button>
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
              {messages.length === 0 ? 'Kikki AI' : 'Chat'}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="hidden lg:flex"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>
          </div>
        </header>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto">
          {messages.length === 0 ? (
            /* Empty State */
            <div className="h-full flex flex-col items-center justify-center px-4 py-8">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-2xl shadow-purple-500/20">
                <Brain className="w-10 h-10 text-white" />
              </div>

              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                What can I help you code?
              </h2>
              <p className="text-gray-500 dark:text-gray-400 mb-8 text-center max-w-md">
                Ask me anything about coding, debugging, system design, or best practices.
              </p>

              {/* Suggestion Chips */}
              <div className="flex flex-wrap justify-center gap-3 max-w-2xl">
                {SUGGESTIONS.map((suggestion) => (
                  <SuggestionChip
                    key={suggestion}
                    text={suggestion}
                    onClick={() => setInput(suggestion)}
                  />
                ))}
              </div>
            </div>
          ) : (
            /* Messages */
            <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
              {messages.map((message) => (
                <MessageBubble key={message.id} message={message} />
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="sticky bottom-0 bg-white/80 dark:bg-[#0d0d0d]/80 backdrop-blur-md border-t border-gray-200 dark:border-gray-800 p-4">
          <div className="max-w-3xl mx-auto">
            <form onSubmit={handleSubmit}>
              <div className="relative flex items-end gap-2 bg-gray-100 dark:bg-gray-800 rounded-2xl p-2 shadow-lg">
                {/* Attach Button */}
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="flex-shrink-0 mb-1"
                >
                  <Plus className="w-5 h-5" />
                </Button>

                {/* Text Input */}
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask anything..."
                  rows={1}
                  className="flex-1 bg-transparent border-0 resize-none py-3 px-2 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-0 max-h-32"
                  style={{ minHeight: '44px' }}
                  disabled={isLoading}
                />

                {/* Action Buttons */}
                <div className="flex items-center gap-1 mb-1">
                  {isSupported && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={handleVoiceToggle}
                      className={isListening ? 'text-red-500 bg-red-50 dark:bg-red-900/20' : ''}
                    >
                      <Mic className="w-5 h-5" />
                    </Button>
                  )}

                  <Button
                    type="submit"
                    size="icon"
                    disabled={isLoading || !input.trim()}
                    className={input.trim() ? '' : 'opacity-50'}
                  >
                    <Send className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              <p className="text-center text-xs text-gray-400 mt-2">
                Kikki can make mistakes. Please verify important information.
              </p>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
