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

export const useDrawing = () => {
  // CRITICAL: Canvas reference for the CanvasSection component
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]); // Resolved red line issue
  const [history, setHistory] = useState<Shape[][]>([[]]);
  const [step, setStep] = useState(0);

  const handleSend = async () => {
    if (!prompt.trim()) return;

    const userPrompt = prompt;
    setMessages(prev => [...prev, { text: userPrompt, type: 'user' }]);
    setLoading(true);
    setPrompt("");

    try {
      const response = await fetch(`http://localhost:5045/api/Drawings/generate?prompt=${encodeURIComponent(userPrompt)}`);
      
      if (!response.ok) throw new Error("Server communication failed");

      const data = await response.json();
      const aiResponse = typeof data.drawingData === 'string' 
        ? JSON.parse(data.drawingData) 
        : data;

      if (aiResponse.Commands && Array.isArray(aiResponse.Commands)) {
        const newShapes: Shape[] = aiResponse.Commands;
debugger;
        const newHistory = [...history.slice(0, step + 1), newShapes];
        setHistory(newHistory);
        setStep(newHistory.length - 1);
        setMessages(prev => [...prev, { text: "Drawing updated!", type: 'bot' }]);
      }
    } catch (error) {
      console.error("Fetch Error:", error);
      setMessages(prev => [...prev, { text: "Connection error with AI server.", type: 'bot' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleUndo = useCallback(() => {
    if (step > 0) setStep(prev => prev - 1);
  }, [step]);

  const handleClear = useCallback(() => {
    const newHistory = [...history.slice(0, step + 1), []];
    setHistory(newHistory);
    setStep(newHistory.length - 1);
  }, [history, step]);

  return {
    canvasRef,
    prompt,
    setPrompt,
    loading,
    messages,
    handleSend,
    handleUndo,
    handleClear,
    currentShapes: history[step],
    canUndo: step > 0
  };
};