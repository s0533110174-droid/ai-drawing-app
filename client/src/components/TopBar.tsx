import React from 'react';
import './TopBar.css';

interface TopBarProps {
  prompt: string;
  setPrompt: (val: string) => void;
  handleSend: () => void;
  loading: boolean;
  handleUndo: () => void;
  handleRedo: () => void;
  handleClear: () => void;
  handleSave: () => void;
  handleNewDrawing: () => void;
  canUndo: boolean;
  canRedo: boolean;
  drawingId?: string;
}

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
  drawingId
}) => {
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !loading) {
      handleSend();
    }
  };

  return (
    <div className="top-bar-container">
      <div className="toolbar-actions">
        <select value={drawingId} className="drawing-selector" readOnly>
          <option value="10">Drawing #10</option>
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