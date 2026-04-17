import { useState, useRef, useCallback, useEffect } from 'react';
import { Shape, Message, Drawing } from '../types/drawing';
const BASE_URL = import.meta.env.VITE_API_URL;
const DRAWINGS_API = `${BASE_URL}/api/Drawings`;

export const useDrawing = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [history, setHistory] = useState<Shape[][]>([[]]);
  const [step, setStep] = useState(0);

  // State to hold the full list of drawings from the database
  const [allDrawings, setAllDrawings] = useState<Drawing[]>([]);

  // The current active state of shapes based on the history stack
  const currentShapes = history[step];
  

  /**
   * Fetches the complete list of drawings for the user from the API.
   * According to your controller, it returns { drawings: [...] }.
   */
  const fetchDrawingsList = useCallback(async () => {
    try {
      console.log("Attempting to fetch drawings...");
      const response = await fetch(`${DRAWINGS_API}/GetFullUserDrawings`);
      if (response.ok) {
        const data = await response.json();
        // Extracting 'drawings' property from the server response object
        setAllDrawings(data.drawings || []);
      }
    } catch (error) {
      console.error("Fetch drawings list error:", error);
    }
  }, []);

  // Load the list on initial mount
  useEffect(() => {
    fetchDrawingsList();
  }, [fetchDrawingsList]);

  /**
   * Loads a specific drawing from the local state into the active canvas history.
   * @param id - The ID of the drawing selected from the dropdown.
   */
  const loadDrawingFromHistory = (id: string) => {
    if (!id) return;

    const selected = allDrawings.find(d => d.id === parseInt(id));
    if (selected && selected.commandsJson) {
      try {
        const shapes: Shape[] = JSON.parse(selected.commandsJson);
        
        // Push the loaded shapes as a new step in history
        const newHistory = [...history.slice(0, step + 1), shapes];
        setHistory(newHistory);
        setStep(newHistory.length - 1);
        
        setMessages(prev => [...prev, { text: `System: Loaded "${selected.name}"`, type: 'bot' }]);
      } catch (e) {
        console.error("Error parsing drawing commandsJson:", e);
      }
    }
  };

  /**
   * Persists the current canvas state to the .NET database.
   * Sends the shapes as a double-serialized JSON string to match the string [FromBody] param.
   */
  const handleSave = async () => {
    if (currentShapes.length === 0) {
      alert("Cannot save an empty canvas.");
      return;
    }

    setLoading(true);
    try {
      const drawingData = JSON.stringify(currentShapes); 
      const bodyContent = JSON.stringify(drawingData);

      const response = await fetch(`${DRAWINGS_API}/Save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: bodyContent
      });

      if (!response.ok) throw new Error("Failed to save drawing to the server.");

      alert("Drawing saved successfully!");
      setMessages(prev => [...prev, { text: "System: Drawing has been saved.", type: 'bot' }]);
      
      // Refresh the list so the new drawing appears in the select menu
      fetchDrawingsList(); 
    } catch (error: any) {
      console.error("Save Error:", error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Sends the user prompt and current canvas state to the AI generation endpoint.
   */
  const handleSend = async () => {
    if (!prompt.trim()) return;

    const userPrompt = prompt;
    const currentShapesJson = JSON.stringify(currentShapes);

    setMessages(prev => [...prev, { text: userPrompt, type: 'user' }]);
    setLoading(true);
    setPrompt("");

    try {
      const response = await fetch(
        `${DRAWINGS_API}/Generate?prompt=${encodeURIComponent(userPrompt)}&currentShapesJson=${encodeURIComponent(currentShapesJson)}`
      );
      
      if (!response.ok) throw new Error("Server communication failed");

      const data = await response.json();
      const aiResponse = typeof data.drawingData === 'string' 
        ? JSON.parse(data.drawingData) 
        : data;

      const newShapesFromAI: Shape[] = aiResponse.Commands || aiResponse.shapes || [];

      if (Array.isArray(newShapesFromAI)) {
        const updatedShapes = [...currentShapes, ...newShapesFromAI];
        const newHistory = [...history.slice(0, step + 1), updatedShapes];
        
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
    setStep(prev => (prev > 0 ? prev - 1 : prev));
  }, []);

  const handleRedo = useCallback(() => {
    setStep(prev => (prev < history.length - 1 ? prev + 1 : prev));
  }, [history.length]);

  const handleClear = useCallback(() => {
    const newHistory = [...history.slice(0, step + 1), []];
    setHistory(newHistory);
    setStep(newHistory.length - 1);
    setMessages(prev => [...prev, { text: "Canvas cleared.", type: 'bot' }]);
  }, [history, step]);

const handleNewDrawing = useCallback(() => {
  // Clear canvas history (start with one empty array step)
  setHistory([[]]);
  setStep(0);
  
  // Clear chat messages to start a fresh conversation
  setMessages([]);
  
  // Reset prompt input
  setPrompt("");

  console.log("New drawing session started. Canvas and chat history cleared.");
}, []);

  return {
    canvasRef,
    prompt,
    setPrompt,
    loading,
    messages,
    allDrawings,           // Exported for the Select dropdown
    currentShapes,         // Exported for the Canvas renderer
    handleSend,
    handleSave,
    handleUndo,
    handleRedo,
    handleClear,
    handleNewDrawing,
    loadDrawingFromHistory, // Call this when a dropdown item is selected
    canUndo: step > 0,
    canRedo: step < history.length - 1
  };
};