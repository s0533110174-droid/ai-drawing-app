import React, { useRef } from 'react';
import { useDrawing } from './hooks/useDrawing';
import TopBar from './components/TopBar';
import ChatSection from './components/ChatSection';
import CanvasSection from './components/CanvasSection';
import './App.css';

const App: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Destructuring all necessary logic from our custom TypeScript hook
  const { 
    prompt, 
    setPrompt, 
    messages, 
    loading, 
    currentShapes,
    canUndo,      
    canRedo,
    handleSend, 
    handleSave, 
    handleUndo, 
    handleRedo, 
    handleClear,   
    handleNewDrawing,
    loadDrawing,
    drawings,
    drawingId
  } = useDrawing(canvasRef);

  return (
    <div className="app-wrapper">
      {/* Header with drawing selection and main actions */}
      <TopBar 
        prompt={prompt}
        setPrompt={setPrompt}
        handleSend={handleSend}
        loading={loading}
        handleUndo={handleUndo}
        handleRedo={handleRedo}
        handleClear={handleClear}
        handleSave={handleSave}
        handleNewDrawing={handleNewDrawing}
        canUndo={canUndo}
        canRedo={canRedo}
        drawingId={drawingId}
      />

      <main className="main-content">
        <ChatSection 
          messages={messages} 
          prompt={prompt} 
          setPrompt={setPrompt} 
          onSend={handleSend} 
          loading={loading} 
        />

        <CanvasSection 
          canvasRef={canvasRef} 
          currentShapes={currentShapes} 
        />
      </main>
    </div>
  );
};

export default App;