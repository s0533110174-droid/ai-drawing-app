import React from 'react';
import './TopBar.css';
import { Drawing } from '../types/drawing';

/**
 * Props for the TopBar component to manage UI actions and drawing selection.
 */
interface TopBarProps {
  prompt: string;
  setPrompt: (val: string) => void;
  handleSend: () => void;
  loading: boolean;
  handleUndo: () => void;
  handleRedo: () => void;
  handleClear: () => void;
  handleNewDrawing: () => void;
  handleSave: () => void;
  canUndo: boolean;
  canRedo: boolean;
  drawingId?: string;
  // Dynamic list of drawings from the database
  allDrawings: Drawing[];
  // Function to load a specific drawing by its ID
  onLoadDrawing: (id: string) => void;
}

/**
 * TopBar component providing tools for drawing management and AI interaction.
 */
const TopBar: React.FC<TopBarProps> = ({
  prompt,
  setPrompt,
  handleSend,
  loading,
  handleUndo,
  handleRedo,
  handleClear,
  handleSave,
  handleNewDrawing,
  canUndo,
  canRedo,
  drawingId,
  allDrawings,
  onLoadDrawing
}) => {

  /**
   * Triggers the AI generation when the Enter key is pressed.
   */
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !loading) {
      handleSend();
    }
  };

  return (
    <div className="top-bar-container">
      <div className="toolbar-actions">
        {/* Dynamic selector for choosing previous drawings. 
            Populated by records fetched from the .NET backend. 
        */}
        <select
          value={drawingId}
          className="drawing-selector"
          onChange={(e) => onLoadDrawing(e.target.value)}
        >
          <option value="">-- Select Drawing --</option>
          {allDrawings.map((drawing) => (
            <option key={drawing.id} value={drawing.id.toString()}>
              {drawing.name}
            </option>
          ))}
        </select>

        <button onClick={handleNewDrawing} className="btn btn-new">
          + New Drawing
        </button>

        <button onClick={handleUndo} disabled={!canUndo} className="btn btn-undo">
          Undo
        </button>

        <button onClick={handleRedo} disabled={!canRedo} className="btn btn-redo">
          Redo
        </button>

        <button onClick={handleClear} className="btn btn-clear">
          Clear
        </button>

        <button onClick={handleSave} className="btn btn-save">
          Save
        </button>
      </div>
    </div>
  );
};

export default TopBar;