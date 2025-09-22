"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const FloatingChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! I'm your AI assistant for NeuroNet DAO. I can help you with questions about our decentralized AI marketplace, guide you through the platform, or assist with any other inquiries. How can I help you today?",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [showExamples, setShowExamples] = useState(true);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showScrollIndicator, setShowScrollIndicator] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Also scroll to bottom when chat opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(scrollToBottom, 100);
    }
  }, [isOpen]);

  // Check if scroll indicator should be shown
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (container) {
      const handleScroll = () => {
        const { scrollTop, scrollHeight, clientHeight } = container;
        setShowScrollIndicator(scrollTop < scrollHeight - clientHeight - 10);
      };
      
      container.addEventListener('scroll', handleScroll);
      handleScroll(); // Check initial state
      
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const generateAIResponse = async (userMessage: string): Promise<string> => {
    try {
      // Call the marketplace agent API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage }),
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const data = await response.json();
      return data.response;
    } catch (error) {
      console.error('Error getting AI response:', error);
      return "I'm sorry, I'm having trouble connecting to the AI service right now. Please try again later or contact support if the issue persists.";
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);
    setShowExamples(false); // Hide examples when user sends a message

    // Generate AI response
    try {
      const aiResponse = await generateAIResponse(inputValue);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error generating AI response:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm sorry, I encountered an error while processing your request. Please try again.",
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleExampleClick = (example: string) => {
    setInputValue(example);
    setShowExamples(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const canScroll =
      el.scrollHeight > el.clientHeight &&
      ((e.deltaY < 0 && el.scrollTop > 0) ||
        (e.deltaY > 0 && el.scrollTop + el.clientHeight < el.scrollHeight));
    if (canScroll) {
      e.stopPropagation();
    }
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <motion.button
        className="floating-chat-toggle"
        onClick={toggleChat}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <i className="bi bi-chat-dots"></i>
        </motion.div>
        {!isOpen && (
          <motion.div
            className="notification-badge"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5 }}
          >
            <span>1</span>
          </motion.div>
        )}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="floating-chat-window"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {/* Chat Header */}
            <div className="chat-header">
              <div className="chat-header-info">
                <div className="chat-avatar">
                  <i className="bi bi-robot"></i>
                </div>
                <div className="chat-header-text">
                  <h6>NeuroNet AI Assistant</h6>
                  <span className="status">Online</span>
                </div>
              </div>
              <button
                className="chat-close-btn"
                onClick={() => setIsOpen(false)}
              >
                <i className="bi bi-x"></i>
              </button>
            </div>

            {/* Messages Container */}
            <div className="chat-messages" ref={messagesContainerRef} onWheel={handleWheel}>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  className={`message ${message.isUser ? "user" : "ai"}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="message-content">
                    <ReactMarkdown
                      components={{
                        p: ({ children }) => <p>{children}</p>,
                        strong: ({ children }) => <strong>{children}</strong>,
                        em: ({ children }) => <em>{children}</em>,
                        a: ({ href, children }) => (
                          <a 
                            href={href} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="chat-link"
                          >
                            {children}
                          </a>
                        ),
                        h1: ({ children }) => <h1 className="chat-h1">{children}</h1>,
                        h2: ({ children }) => <h2 className="chat-h2">{children}</h2>,
                        h3: ({ children }) => <h3 className="chat-h3">{children}</h3>,
                        ul: ({ children }) => <ul className="chat-list">{children}</ul>,
                        ol: ({ children }) => <ol className="chat-list">{children}</ol>,
                        li: ({ children }) => <li className="chat-list-item">{children}</li>,
                      }}
                    >
                      {message.text}
                    </ReactMarkdown>
                    <span className="message-time">
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </motion.div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <motion.div
                  className="message ai typing"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="message-content">
                    <div className="typing-indicator">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
              
              {/* Example Questions */}
              {showExamples && messages.length <= 1 && (
                <motion.div
                  className="example-questions"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <div className="example-header">
                    <h6>Try asking:</h6>
                  </div>
                  <div className="example-buttons">
                    <button
                      className="example-btn"
                      onClick={() => handleExampleClick("Show me featured items")}
                    >
                      <i className="bi bi-star"></i>
                      Featured items
                    </button>
                    <button
                      className="example-btn"
                      onClick={() => handleExampleClick("What categories are available?")}
                    >
                      <i className="bi bi-tags"></i>
                      Categories
                    </button>
                    <button
                      className="example-btn"
                      onClick={() => handleExampleClick("Search for AI writing prompts")}
                    >
                      <i className="bi bi-search"></i>
                      Search prompts
                    </button>
                    <button
                      className="example-btn"
                      onClick={() => handleExampleClick("What is NeuroNet DAO?")}
                    >
                      <i className="bi bi-info-circle"></i>
                      About platform
                    </button>
                  </div>
                </motion.div>
              )}
              
              {/* Scroll to bottom button */}
              {/* {showScrollIndicator && (
                <motion.button
                  className="scroll-to-bottom-btn"
                  onClick={scrollToBottom}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <i className="bi bi-chevron-down"></i>
                </motion.button>
              )} */}
            </div>

            {/* Chat Input */}
            <div className="chat-input-container">
              <div className="chat-input-wrapper">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about NeuroNet DAO..."
                  className="chat-input"
                />
                <button
                  className="chat-send-btn"
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim()}
                >
                  <i className="bi bi-send"></i>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default FloatingChat;