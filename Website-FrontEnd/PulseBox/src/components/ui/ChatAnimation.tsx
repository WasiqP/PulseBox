import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './ChatAnimation.css';

interface Message {
  id: number;
  sender: 'teacher' | 'bot';
  text: string;
  delay: number;
}

interface ChatAnimationProps {
  messages?: Message[];
  className?: string;
}

const defaultMessages: Message[] = [
  { id: 1, sender: 'bot', text: 'Hello! 👋 Welcome to Raviro!', delay: 500 },
  { id: 2, sender: 'teacher', text: 'Hi! I\'m excited to get started.', delay: 2000 },
  { id: 3, sender: 'bot', text: 'Great! I\'m here to help you manage your classes, create lesson plans, and save time.', delay: 3500 },
  { id: 4, sender: 'teacher', text: 'That sounds amazing! How do I begin?', delay: 5000 },
  { id: 5, sender: 'bot', text: 'Just sign in and I\'ll guide you through everything step by step. Let\'s transform your teaching! 🚀', delay: 6500 },
];

const ChatAnimation: React.FC<ChatAnimationProps> = ({ messages = defaultMessages, className = '' }) => {
  const [displayedMessages, setDisplayedMessages] = useState<Message[]>([]);
  const [showTyping, setShowTyping] = useState(true);

  useEffect(() => {
    let timeouts: NodeJS.Timeout[] = [];

    messages.forEach((message, index) => {
      const timeout = setTimeout(() => {
        setDisplayedMessages(prev => [...prev, message]);
        if (index === messages.length - 1) {
          setTimeout(() => setShowTyping(false), 500);
        }
      }, message.delay);
      timeouts.push(timeout);
    });

    return () => {
      timeouts.forEach(timeout => clearTimeout(timeout));
    };
  }, [messages]);

  return (
    <div className={`chat-animation ${className}`}>
      <div className="chat-messages">
        <AnimatePresence>
          {displayedMessages.map((message) => (
            <motion.div
              key={message.id}
              className={`chat-message chat-message-${message.sender}`}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <div className="chat-message-avatar">
                {message.sender === 'bot' ? '🤖' : '👨‍🏫'}
              </div>
              <div className="chat-message-content">
                <div className="chat-message-bubble">
                  {message.text}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {showTyping && displayedMessages.length < messages.length && (
          <motion.div
            className="chat-message chat-message-bot chat-typing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="chat-message-avatar">🤖</div>
            <div className="chat-message-content">
              <div className="chat-message-bubble chat-typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ChatAnimation;


