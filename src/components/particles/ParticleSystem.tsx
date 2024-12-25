import React, { useEffect, useRef, useState } from 'react';
import { createParticle, updateParticle, drawParticle } from './particleUtils';

const ParticleSystem = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Significantly reduce particle count on mobile
    const particleCount = isMobile ? 30 : 150;
    const particles = Array.from({ length: particleCount }, () => createParticle(canvas));
    let animationFrameId: number;

    const handleResize = () => {
      const container = canvas.parentElement;
      if (container) {
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
        setIsMobile(window.innerWidth < 768);
        
        // Redistribute particles when canvas is resized
        particles.forEach(particle => {
          particle.x = Math.random() * canvas.width;
          particle.y = Math.random() * canvas.height;
        });
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(particle => {
        updateParticle(particle, canvas);
        drawParticle(ctx, particle);
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isMobile]); // Add isMobile to dependency array

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full pointer-events-none"
      style={{ opacity: isMobile ? 0.6 : 0.8 }}
    />
  );
};

export default ParticleSystem;