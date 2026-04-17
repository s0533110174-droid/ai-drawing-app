export type Message = {
  text: string;
  type: 'user' | 'bot';
};

export type Shape = {
  Type: 'rect' | 'circle';
  X: number;
  Y: number;
  Color: string;
  Width?: number;
  Height?: number;
  Radius?: number;
};

export interface Drawing {
  id: number;
  name: string;
  commandsJson: string;
  createdAt: string;
  userId: number;
}

export interface CanvasSectionProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  currentShapes: Shape[]; // Data passed down from App.tsx
}