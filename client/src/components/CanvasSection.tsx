import React, { useEffect } from 'react';

/**
 * Interface for the shapes received from the App state.
 */
interface Shape {
  Type: 'circle' | 'rect';
  X: number;
  Y: number;
  Color: string;
  Radius?: number;
  Width?: number;
  Height?: number;
}


interface CanvasSectionProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  currentShapes: Shape[]; // Data passed down from App.tsx
}

/**
 * CanvasSection Component
 * Responsible for the actual rendering of shapes onto the HTML5 Canvas.
 */
const CanvasSection: React.FC<CanvasSectionProps> = ({ canvasRef, currentShapes }) => {

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    /**
     * 1. Clear Canvas
     * Resetting to a clean white background for each render.
     */
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    /**
     * 2. Draw Shapes
     * We iterate through the current state passed from the parent.
     */
    if (currentShapes && currentShapes.length > 0) {
      currentShapes.forEach((shape) => {
        ctx.fillStyle = shape.Color || 'blue';
        ctx.beginPath();

        if (shape.Type === 'circle') {
          // Drawing a circle using arc
          const radius = shape.Radius || 50;
          ctx.arc(shape.X, shape.Y, radius, 0, Math.PI * 2);
        } else {
          // Drawing a rectangle centered on its X,Y coordinates
          const w = shape.Width || 100;
          const h = shape.Height || 100;
          ctx.rect(shape.X - w / 2, shape.Y - h / 2, w, h);
        }

        ctx.fill();
        ctx.closePath();
      });
    }

    // For debugging: verify that the effect is triggered
    console.log(`Canvas rendered with ${currentShapes?.length || 0} shapes.`);

  }, [currentShapes, canvasRef]); // Effect triggers whenever shapes or ref changes

  return (
    <section className="canvas-section" style={{ 
      flex: 1, 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      backgroundColor: '#f8fafc' 
    }}>
      <div className="canvas-container" style={{ 
        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
        backgroundColor: '#fff'
      }}>
        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          style={{ display: 'block' }}
        />
      </div>
    </section>
  );
};

export default CanvasSection;