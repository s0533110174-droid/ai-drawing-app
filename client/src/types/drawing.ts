export type Message = {
  text: string;
  type: 'user' | 'bot';
};

export type Shape = {
  type: 'rect' | 'circle';
  x: number;
  y: number;
  color: string;
  width?: number;
  height?: number;
  radius?: number;
};

export interface Drawing {
  id: number;
  name: string;
  commandsJson: string; // ה-JSON הגולמי מה-DB
  createdAt: string;
  userId: number;
}