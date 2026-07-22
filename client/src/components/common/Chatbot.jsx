import React, { useState, useRef, useEffect } from 'react';
import API from '../../services/api';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hello! I am your LRC Medi+ AI Assistant. Ask me anything about renting or purchasing wheelchairs, hospital beds, oxygen concentrators, and medicines.' }
  ]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { sender: 'user', text: userMessage }]);
    setInput('');
    setLoading(true);

    try {
      const { data } = await API.post('/chat', { message: userMessage });
      setMessages(prev => [...prev, { sender: 'bot', text: data.text }]);
    } catch (error) {
      setMessages(prev => [...prev, { sender: 'bot', text: 'Sorry, I am having trouble connecting right now. Please call us directly at +91 9876543210.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button className="chatbot-trigger" onClick={() => setIsOpen(!isOpen)} title="AI Health Assistant">
        {isOpen ? <i className="fa-solid fa-xmark"></i> : <i className="fa-solid fa-robot"></i>}
      </button>

      {isOpen && (
        <div className="chatbot-window">
          <div className="chat-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <i className="fa-solid fa-brain" style={{ fontSize: '1.2rem' }}></i>
              <div>
                <strong style={{ fontSize: '0.95rem' }}>LRC Medi+ Assistant</strong>
                <span style={{ display: 'block', fontSize: '0.75rem', opacity: 0.9 }}>Powered by Gemini AI</span>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} style={{ background: 'transparent', color: 'white', fontSize: '1.1rem' }}>
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>

          <div className="chat-messages">
            {messages.map((msg, idx) => (
              <div key={idx} className={`chat-msg ${msg.sender}`}>
                {msg.text}
              </div>
            ))}
            {loading && (
              <div className="chat-msg bot">
                <i className="fa-solid fa-spinner fa-spin"></i> Thinking...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSend} className="chat-input-row">
            <input
              type="text"
              className="form-control"
              placeholder="Ask about equipment or rental..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button type="submit" className="btn btn-primary" disabled={loading}>
              <i className="fa-solid fa-paper-plane"></i>
            </button>
          </form>
        </div>
      )}
    </>
  );
}
