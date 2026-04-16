import React from 'react';
import { Message } from '../types/drawing';

/**
 * Props definition for the ChatSection component.
 */
interface ChatSectionProps {
  messages: Message[];
  prompt: string;
  setPrompt: (value: string) => void;
  onSend: () => void;
  loading: boolean;
}

/**
 * ChatSection component - Handles the user interaction and AI chat history.
 */
const ChatSection: React.FC<ChatSectionProps> = ({ 
  messages, 
  prompt, 
  setPrompt, 
  onSend, 
  loading 
}) => {

  /**
   * Allows sending messages by pressing the 'Enter' key.
   */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !loading) {
      onSend();
    }
  };

  return (
    <section className="chat-section">
      <div className="chat-window">
        {messages.length === 0 && (
          <p className="empty-state">Describe what you want to draw... 🎨</p>
        )}
        
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.type}`}>
            {msg.text}
          </div>
        ))}
        
        {loading && <div className="message bot">Thinking... 🧠</div>}
      </div>

      <div className="input-area">
        <input
          type="text"
          placeholder="מה לצייר?"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading}
        />
        <button 
          onClick={onSend} 
          disabled={loading || !prompt.trim()}
        >
          {loading ? '...' : 'שלח'}
        </button>
      </div>
    </section>
  );
};

export default ChatSection;