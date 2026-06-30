import { useEffect, useRef, useState } from 'react';

interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  size: number;
}

interface Point {
  x: number;
  y: number;
}

export default function CustomCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const pointsRef = useRef<Point[]>([]);
  const sparksRef = useRef<Spark[]>([]);
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const updateMouse = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
      if (!visible) setVisible(true);

      // Add trail point
      pointsRef.current.push({ x: e.clientX, y: e.clientY });
      if (pointsRef.current.length > 15) {
        pointsRef.current.shift();
      }

      // Add a couple of trail sparks
      for (let i = 0; i < 2; i++) {
        sparksRef.current.push({
          x: e.clientX,
          y: e.clientY,
          vx: (Math.random() - 0.5) * 1.5,
          vy: (Math.random() - 0.5) * 1.5,
          alpha: 1.0,
          size: Math.random() * 2 + 1,
        });
      }
    };

    const handleMouseLeave = () => {
      setVisible(false);
      mouseRef.current = { x: -1000, y: -1000 };
      pointsRef.current = [];
    };

    const handleMouseEnter = () => {
      setVisible(true);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      const isInteractive =
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.tagName === 'INPUT' ||
        target.tagName === 'SELECT' ||
        target.tagName === 'TEXTAREA' ||
        target.closest('a') ||
        target.closest('button') ||
        target.classList.contains('cursor-pointer') ||
        target.getAttribute('role') === 'button';

      setHovered(!!isInteractive);
    };

    const handleMouseDown = (e: MouseEvent) => {
      // Click burst: emit 15 high-speed sparks
      for (let i = 0; i < 18; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 3.5 + 1.5;
        sparksRef.current.push({
          x: e.clientX,
          y: e.clientY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          alpha: 1.0,
          size: Math.random() * 3 + 1.5,
        });
      }
    };

    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('mousemove', updateMouse);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    window.addEventListener('mouseover', handleMouseOver);
    window.addEventListener('mousedown', handleMouseDown);

    resizeCanvas();

    const drawTrail = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const mouse = mouseRef.current;
      const points = pointsRef.current;
      const sparks = sparksRef.current;

      // 1. Draw Bezier Ribbon mouse trail
      if (points.length > 1) {
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);

        for (let i = 1; i < points.length - 1; i++) {
          const xc = (points[i].x + points[i + 1].x) / 2;
          const yc = (points[i].y + points[i + 1].y) / 2;
          ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
        }

        ctx.lineTo(points[points.length - 1].x, points[points.length - 1].y);
        ctx.strokeStyle = 'rgba(13, 29, 63, 0.25)';
        ctx.lineWidth = hovered ? 4 : 2.5;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();

        // Secondary inner glowing trail line
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length - 1; i++) {
          const xc = (points[i].x + points[i + 1].x) / 2;
          const yc = (points[i].y + points[i + 1].y) / 2;
          ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
        }
        ctx.lineTo(points[points.length - 1].x, points[points.length - 1].y);
        ctx.strokeStyle = 'rgba(13, 29, 63, 0.6)';
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // 2. Update and draw path/click sparks
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.x += s.vx;
        s.y += s.vy;
        s.vy += 0.05; // soft gravity force pulling sparks downwards
        s.alpha -= 0.025; // fade out speed

        if (s.alpha <= 0) {
          sparks.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(13, 29, 63, ${s.alpha * 0.75})`;
        ctx.fill();
      }

      // 3. Draw static cursor coordinates helper (dot & ring)
      if (mouse.x > -500 && visible) {
        // Outer pulsing ring
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, hovered ? 14 : 7, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(13, 29, 63, 0.45)';
        ctx.lineWidth = 1.2;
        ctx.stroke();

        // Inner solid dot
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = '#0d1d3f';
        ctx.fill();
      }

      // Smooth decay of points when mouse is stationary
      if (points.length > 0) {
        // Slowly drop points from the beginning
        const timer = setTimeout(() => {
          if (points.length > 0) points.shift();
        }, 100);
        clearTimeout(timer);
      }

      animationFrameId = requestAnimationFrame(drawTrail);
    };

    drawTrail();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', updateMouse);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('mousedown', handleMouseDown);
      cancelAnimationFrame(animationFrameId);
    };
  }, [visible, hovered]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50 bg-transparent"
      style={{ mixBlendMode: 'multiply' }}
    />
  );
}
