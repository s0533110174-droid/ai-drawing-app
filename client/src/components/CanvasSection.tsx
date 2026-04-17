import React, { useEffect } from 'react';
import { CanvasSectionProps } from '../types/drawing';
import './CanvasSection.css';

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

    // 1. Clear Canvas
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 2. Draw Shapes
    if (currentShapes && currentShapes.length > 0) {
      currentShapes.forEach((shape) => {
        ctx.fillStyle = shape.Color || 'blue';
        ctx.beginPath();

        if (shape.Type === 'circle') {
          const radius = shape.Radius || 50;
          ctx.arc(shape.X, shape.Y, radius, 0, Math.PI * 2);
        } else {
          const w = shape.Width || 100;
          const h = shape.Height || 100;
          ctx.rect(shape.X - w / 2, shape.Y - h / 2, w, h);
        }

        ctx.fill();
        ctx.closePath();
      });
    }

    console.log(`Canvas rendered with ${currentShapes?.length || 0} shapes.`);
  }, [currentShapes, canvasRef]);

  return (
    <section className="canvas-section">
      <div className="canvas-container">
        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          className="main-canvas"
        />
      </div>
    </section>
  );
};

export default CanvasSection;