import React, { useRef } from 'react';
import { useDrawing } from './hooks/useDrawing';
import TopBar from './components/TopBar';
import ChatSection from './components/ChatSection';
import CanvasSection from './components/CanvasSection';
import './App.css';

/**
 * Root Application Component.
 * Manages the layout and orchestrates data flow between the drawing hook and UI components.
 */
const App: React.FC = () => {
  // Reference to the canvas element, shared with the custom hook
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Destructuring all necessary logic from our custom TypeScript hook
  const { 
    prompt, 
    setPrompt, 
    messages, 
    loading, 
    currentShapes,
    drawings,
    loadDrawing, 
    handleSend, 
    handleSave, 
    setStep, 
    setHistory, 
    setMessages 
  } = useDrawing(canvasRef);

  /**
   * Resets the application state to a blank canvas and empty chat.
   */
  const handleClearAll = (): void => {
    setHistory([]);
    setStep(-1);
    setMessages([]);
  };

  /**
   * Handles the Undo action by moving the history step back.
   */
  const handleUndo = (): void => {
    setStep((prev) => Math.max(-1, prev - 1));
  };

  return (
    <div className="app-wrapper">
      {/* Header with drawing selection and main actions */}
      <TopBar 
        drawings={drawings} 
        onSelectDrawing={loadDrawing}
        onSend={handleSend}
        onSave={handleSave}
        onUndo={handleUndo}
        onClear={handleClearAll}
      />

      <main className="main-content">
        {/* Left Side: Chat interface for AI commands */}
        <ChatSection 
          messages={messages} 
          prompt={prompt} 
          setPrompt={setPrompt} 
          onSend={handleSend} 
          loading={loading} 
        />

        {/* Right Side: Visual Canvas area */}
       <CanvasSection canvasRef={canvasRef} currentShapes={currentShapes} />
      </main>
    </div>
  );
};

export default App;