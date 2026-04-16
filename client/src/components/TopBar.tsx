import React from 'react';
import { useDrawing } from '../hooks/useDrawing';
import './TopBar.css'; // Importing the layout and color styles

/**
 * TopBar Component
 * * Provides a toolbar for drawing management and an AI prompt input field.
 * Designed to match a specific UI reference with color-coded action buttons.
 */
const TopBar: React.FC = () => {
  const { 
    prompt, 
    setPrompt, 
    handleSend, 
    loading, 
    handleUndo,
    handleClear,
    handleSave,
    handleNewDrawing,
    canUndo,
    drawingId 
  } = useDrawing();

  /**
   * Executes the drawing generation when the user presses 'Enter'.
   */
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !loading) {
      handleSend();
    }
  };

  return (
    <div className="top-bar-container">
      {/* Upper Toolbar: Action Buttons */}
      <div className="toolbar-actions">
        <select value={drawingId} className="drawing-selector">
          <option value="10">Drawing #10</option>
        </select>

        <button onClick={handleNewDrawing} className="btn btn-new">
          + New Drawing
        </button>

        <button onClick={handleSend} disabled={loading} className="btn btn-send">
          {loading ? '...' : 'Send'}
        </button>

        <button onClick={handleUndo} disabled={!canUndo} className="btn btn-undo">
          Undo
        </button>

        <button onClick={handleClear} className="btn btn-clear">
          Clear
        </button>

        <button onClick={handleSave} className="btn btn-save">
          Save
        </button>
      </div>

      {/* Lower Section: AI Prompt Input */}
      <div className="prompt-section">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Describe what you want to draw..."
          className="prompt-input"
          disabled={loading}
          dir="auto" // Supports both Hebrew and English text direction
        />
      </div>
    </div>
  );
};

export default TopBar;