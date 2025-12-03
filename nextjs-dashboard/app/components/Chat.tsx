import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  senderName: string;
}

export default function Chat() {
  const threadId = 'TH-2024-11-30-001';
  const conversationWith = 'Your Name';
  const contactEmail = 'your.email@example.com';
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: 'Hello, thank you for visiting my portfolio. I would love to hear about your project.',
      sender: 'bot',
      timestamp: new Date(Date.now() - 3600000), // 1 hour ago
      senderName: 'Your Name'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (inputText.trim() === '') return;

    const userMessage: Message = {
      id: messages.length + 1,
      text: inputText,
      sender: 'user',
      timestamp: new Date(),
      senderName: 'User'
    };

    setMessages([...messages, userMessage]);
    setInputText('');

    setIsTyping(true);
    
    setTimeout(() => {
      setIsTyping(false);
      const responses = [
        'Thank you for reaching out. I will get back to you shortly.',
        'I appreciate your message. Let me review the details and respond soon.',
        'Lovely to hear from you. I look forward to discussing this further.',
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      const botMessage: Message = {
        id: messages.length + 2,
        text: randomResponse,
        sender: 'bot',
        timestamp: new Date(),
        senderName: 'Your Name'
      };
      setMessages((prev) => [...prev, botMessage]);
    }, 2500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <section className="min-h-screen px-6 py-24 pt-32">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 space-y-3">
          <p className="text-[#8799BD] tracking-[0.3em] uppercase text-xs">Connect</p>
          <h2 className="font-serif italic text-[#0A2C6A] text-5xl">
            Let's Talk
          </h2>
          <p className="text-[#4A5C7A] mt-6 max-w-md mx-auto leading-relaxed">
            I'm always open to discussing new projects,
            creative ideas, or opportunities.
          </p>
        </div>

        {/* Chat Container */}
        <div 
          className="relative bg-white/50 backdrop-blur-md overflow-hidden"
          style={{
            boxShadow: 'inset 0 0 0 8px #0A2C6A, inset 0 0 0 12px rgba(135, 153, 189, 0.3), inset 0 0 0 13px #0A2C6A, 0 8px 32px rgba(10, 44, 106, 0.15)',
            padding: '20px'
          }}
        >
          {/* Decorative frame corners */}
          <div className="absolute top-0 left-0 w-12 h-12" style={{
            borderTop: '3px solid #8799BD',
            borderLeft: '3px solid #8799BD'
          }}></div>
          <div className="absolute top-0 right-0 w-12 h-12" style={{
            borderTop: '3px solid #8799BD',
            borderRight: '3px solid #8799BD'
          }}></div>
          <div className="absolute bottom-0 left-0 w-12 h-12" style={{
            borderBottom: '3px solid #8799BD',
            borderLeft: '3px solid #8799BD'
          }}></div>
          <div className="absolute bottom-0 right-0 w-12 h-12" style={{
            borderBottom: '3px solid #8799BD',
            borderRight: '3px solid #8799BD'
          }}></div>
          
          {/* Inner frame content */}
          <div className="relative bg-white/30 backdrop-blur-sm" style={{
            boxShadow: '0 0 0 1px rgba(135, 153, 189, 0.2)'
          }}>
            {/* Chat Header with conversation details */}
            <div 
              className="relative px-12 py-6"
              style={{
                borderBottom: '0.5px solid rgba(135, 153, 189, 0.2)'
              }}
            >
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <h3 className="font-serif italic text-[#0A2C6A] text-2xl">
                    Conversation with {conversationWith}
                  </h3>
                  <div className="flex items-center gap-6 text-xs text-[#8799BD]">
                    <span className="tracking-wide">{contactEmail}</span>
                    <span className="text-[#8b7d9e]">·</span>
                    <span className="tracking-wider">Thread ID: {threadId}</span>
                  </div>
                </div>
                <div className="text-[#8b7d9e] opacity-40 text-2xl">✦</div>
              </div>
            </div>
            
            {/* Subtle watercolor texture overlay */}
            <div 
              className="absolute inset-0 opacity-30 pointer-events-none"
              style={{
                backgroundImage: `radial-gradient(circle at 20% 30%, rgba(135, 153, 189, 0.1) 0%, transparent 50%),
                                 radial-gradient(circle at 80% 70%, rgba(139, 125, 158, 0.08) 0%, transparent 50%)`
              }}
            ></div>

            {/* Messages Container */}
            <div className="relative h-[560px] overflow-y-auto px-12 py-12 space-y-8">
              {/* Decorative elements */}
              <div className="absolute top-8 right-12 text-[#8799BD] opacity-25 text-xl">✦</div>
              <div className="absolute top-32 left-16 text-[#8b7d9e] opacity-20 text-sm">✧</div>
              <div className="absolute bottom-24 right-20 text-[#8799BD] opacity-25 text-lg">☽</div>
              
              <AnimatePresence mode="popLayout">
                {messages.map((message, index) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                      duration: 0.8, 
                      ease: [0.25, 0.1, 0.25, 1],
                      delay: index * 0.1 
                    }}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[70%] ${message.sender === 'user' ? 'items-end' : 'items-start'} flex flex-col gap-2`}>
                      <p className="text-xs text-[#8799BD] px-3 tracking-wide">
                        {message.senderName}
                      </p>
                      
                      <motion.div
                        className={`relative px-7 py-5 rounded-[28px] ${
                          message.sender === 'user'
                            ? 'bg-[#8b7d9e]/15'
                            : 'bg-white/70'
                        }`}
                        style={{
                          border: message.sender === 'user' 
                            ? '0.5px solid rgba(139, 125, 158, 0.35)'
                            : '0.5px solid rgba(135, 153, 189, 0.3)',
                          boxShadow: '0 2px 16px rgba(10, 44, 106, 0.04)'
                        }}
                        whileHover={{ 
                          scale: 1.01,
                          transition: { duration: 0.4 }
                        }}
                      >
                        <p className={`leading-relaxed ${
                          message.sender === 'user' 
                            ? 'text-[#0A2C6A]' 
                            : 'text-[#0A2C6A]'
                        }`}>
                          {message.text}
                        </p>
                      </motion.div>
                      
                      <div className="flex items-center gap-3 px-3">
                        <p className="font-serif italic text-xs text-[#8799BD]">
                          {message.timestamp.toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </p>
                        <span className="text-[#8b7d9e] text-xs">·</span>
                        <p className="font-serif italic text-xs text-[#8799BD]">
                          {message.timestamp.toLocaleTimeString('en-US', {
                            hour: 'numeric',
                            minute: '2-digit',
                            hour12: true
                          })}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {/* Typing indicator */}
              <AnimatePresence>
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.6 }}
                    className="flex justify-start"
                  >
                    <div 
                      className="px-7 py-5 rounded-[28px] bg-white/70"
                      style={{
                        border: '0.5px solid rgba(135, 153, 189, 0.3)',
                        boxShadow: '0 2px 16px rgba(10, 44, 106, 0.04)'
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <motion.span
                          className="text-[#8799BD]"
                          animate={{ opacity: [0.3, 1, 0.3] }}
                          transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}
                        >
                          .
                        </motion.span>
                        <motion.span
                          className="text-[#8799BD]"
                          animate={{ opacity: [0.3, 1, 0.3] }}
                          transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
                        >
                          .
                        </motion.span>
                        <motion.span
                          className="text-[#8799BD]"
                          animate={{ opacity: [0.3, 1, 0.3] }}
                          transition={{ duration: 1.5, repeat: Infinity, delay: 0.6 }}
                        >
                          .
                        </motion.span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div 
              className="relative px-12 py-8 bg-white/20 backdrop-blur-sm"
              style={{
                borderTop: '0.5px solid rgba(135, 153, 189, 0.25)'
              }}
            >
              <div className="flex gap-4 items-center">
                <div className="flex-1 relative">
                  <textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Write your message..."
                    className="w-full px-6 py-4 bg-white/50 backdrop-blur-sm rounded-[24px] focus:outline-none resize-none text-[#0A2C6A] placeholder-[#8799BD]/50 transition-all duration-500 focus:bg-white/70"
                    style={{
                      border: '0.5px solid rgba(135, 153, 189, 0.3)',
                      boxShadow: '0 2px 12px rgba(10, 44, 106, 0.03)',
                      maxHeight: '120px'
                    }}
                    rows={1}
                  />
                </div>
                
                <motion.button
                  onClick={handleSend}
                  disabled={inputText.trim() === ''}
                  className="relative w-14 h-14 flex items-center justify-center rounded-full text-white disabled:opacity-30 transition-all duration-500"
                  style={{
                    background: 'linear-gradient(135deg, #8799BD 0%, #8b7d9e 100%)',
                    border: '0.5px solid rgba(255, 255, 255, 0.5)',
                    boxShadow: '0 4px 16px rgba(135, 153, 189, 0.3)'
                  }}
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: '0 6px 24px rgba(135, 153, 189, 0.4)',
                    transition: { duration: 0.3 }
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Send className="w-5 h-5" />
                </motion.button>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="mt-12 text-center space-y-4">
          <p className="text-[#8799BD] text-sm tracking-wide">Or reach me directly</p>
          <div className="flex flex-wrap justify-center gap-8">
            <a
              href={`mailto:${contactEmail}`}
              className="text-[#8799BD] hover:text-[#0A2C6A] transition-colors duration-500 tracking-wide"
            >
              {contactEmail}
            </a>
            <span className="text-[#8b7d9e]">·</span>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#8799BD] hover:text-[#0A2C6A] transition-colors duration-500 tracking-wide"
            >
              GitHub
            </a>
            <span className="text-[#8b7d9e]">·</span>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#8799BD] hover:text-[#0A2C6A] transition-colors duration-500 tracking-wide"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
