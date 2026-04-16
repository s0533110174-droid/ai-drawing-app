import { useState, useRef, useCallback } from 'react';

/**
 * Shape interface representing drawable objects.
 */
interface Shape {
  type: 'circle' | 'rect';
  x: number;
  y: number;
  color: string;
  radius?: number;
  width?: number;
  height?: number;
}

/**
 * Message interface for the ChatSection component.
 */
interface Message {
  text: string;
  type: 'user' | 'bot';
}

/**
 * Custom hook to manage drawing logic, history (Undo/Redo), 
 * and communication with the AI backend.
 */
export const useDrawing = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [history, setHistory] = useState<Shape[][]>([[]]);
  const [step, setStep] = useState(0);

  // The current active state of shapes based on the history stack
  const currentShapes = history[step];

  /**
   * Sends the user prompt and current canvas state to the backend.
   * Merges new shapes with existing ones to prevent data loss.
   */
  const handleSend = async () => {
    if (!prompt.trim()) return;

    const userPrompt = prompt;
    const currentShapesJson = JSON.stringify(currentShapes); // Context for the AI

    setMessages(prev => [...prev, { text: userPrompt, type: 'user' }]);
    setLoading(true);
    setPrompt("");

    try {
      // Send both the prompt and the current state to avoid overlaps
      const response = await fetch(
        `http://localhost:5045/api/Drawings/generate?prompt=${encodeURIComponent(userPrompt)}&currentShapesJson=${encodeURIComponent(currentShapesJson)}`
      );
      
      if (!response.ok) throw new Error("Server communication failed");

      const data = await response.json();
      
      // Support both raw JSON or wrapped drawingData from C#
      const aiResponse = typeof data.drawingData === 'string' 
        ? JSON.parse(data.drawingData) 
        : data;

      // Extract shapes (supporting your 'Commands' property name)
      const newShapesFromAI: Shape[] = aiResponse.Commands || aiResponse.shapes || [];

      if (Array.isArray(newShapesFromAI)) {
        /**
         * MERGE LOGIC: 
         * We take what we already have (currentShapes) and add what the AI just created.
         */
        const updatedShapes = [...currentShapes, ...newShapesFromAI];
        
        // Push the new combined state to history and remove any future steps (if we were in middle of undo)
        const newHistory = [...history.slice(0, step + 1), updatedShapes];
        
        setHistory(newHistory);
        setStep(newHistory.length - 1);
        setMessages(prev => [...prev, { text: "I've added the new shapes to your drawing!", type: 'bot' }]);
      }
    } catch (error) {
      console.error("Fetch Error:", error);
      setMessages(prev => [...prev, { text: "Connection error with AI server.", type: 'bot' }]);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Reverts to the previous history state.
   */
  const handleUndo = useCallback(() => {
    setStep(prev => (prev > 0 ? prev - 1 : prev));
  }, []);

  /**
   * Advances to the next history state.
   */
  const handleRedo = useCallback(() => {
    setStep(prev => (prev < history.length - 1 ? prev + 1 : prev));
  }, [history.length]);

  /**
   * Resets the canvas by adding an empty shapes array to history.
   */
  const handleClear = useCallback(() => {
    const newHistory = [...history.slice(0, step + 1), []];
    setHistory(newHistory);
    setStep(newHistory.length - 1);
    setMessages(prev => [...prev, { text: "Canvas cleared.", type: 'bot' }]);
  }, [history, step]);

  return {
    canvasRef,
    prompt,
    setPrompt,
    loading,
    messages,
    handleSend,
    handleUndo,
    handleRedo,
    handleClear,
    currentShapes,
    canUndo: step > 0,
    canRedo: step < history.length - 1
  };
};