import { useEffect, useRef, useState } from 'react';

interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  size: number;
  hue: number;
}

interface Point {
  x: number;
  y: number;
  t: number;
}

const GOLD = '194, 153, 67'; // #c29943 in rgb
const GOLD_LIGHT = '224, 188, 110';

export default function CustomCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const smoothRef = useRef({ x: -1000, y: -1000 });
  const pointsRef = useRef<Point[]>([]);
  const sparksRef = useRef<Spark[]>([]);
  const angleRef = useRef(0);
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let lastSpawn = 0;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const updateMouse = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
      if (!visible) setVisible(true);

      const now = performance.now();
      pointsRef.current.push({ x: e.clientX, y: e.clientY, t: now });
      if (pointsRef.current.length > 22) pointsRef.current.shift();

      if (now - lastSpawn > 16) {
        lastSpawn = now;
        for (let i = 0; i < 2; i++) {
          sparksRef.current.push({
            x: e.clientX,
            y: e.clientY,
            vx: (Math.random() - 0.5) * 1.4,
            vy: (Math.random() - 0.5) * 1.4 - 0.3,
            alpha: 1,
            size: Math.random() * 2.2 + 0.8,
            hue: Math.random() > 0.5 ? 0 : 1,
          });
        }
      }
    };

    const handleMouseLeave = () => {
      setVisible(false);
      mouseRef.current = { x: -1000, y: -1000 };
      pointsRef.current = [];
    };

    const handleMouseEnter = () => setVisible(true);

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;
      const isInteractive =
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.tagName === 'INPUT' ||
        target.tagName === 'SELECT' ||
        target.tagName === 'TEXTAREA' ||
        !!target.closest('a') ||
        !!target.closest('button') ||
        target.classList.contains('cursor-pointer') ||
        target.getAttribute('role') === 'button';
      setHovered(isInteractive);
    };

    const handleMouseDown = (e: MouseEvent) => {
      setPressed(true);
      for (let i = 0; i < 24; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 4 + 2;
        sparksRef.current.push({
          x: e.clientX,
          y: e.clientY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          alpha: 1,
          size: Math.random() * 3 + 1.5,
          hue: Math.random() > 0.4 ? 0 : 1,
        });
      }
    };

    const handleMouseUp = () => setPressed(false);

    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('mousemove', updateMouse);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    window.addEventListener('mouseover', handleMouseOver);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    resizeCanvas();

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const mouse = mouseRef.current;
      const smooth = smoothRef.current;
      const points = pointsRef.current;
      const sparks = sparksRef.current;

      // Magnetic ease toward true mouse position (snappier when hovering interactive elements)
      const ease = hovered ? 0.32 : 0.22;
      smooth.x += (mouse.x - smooth.x) * ease;
      smooth.y += (mouse.y - smooth.y) * ease;

      angleRef.current += 0.05;

      // Flowing ribbon trail
      if (points.length > 1) {
        for (let pass = 0; pass < 2; pass++) {
          ctx.beginPath();
          ctx.moveTo(points[0].x, points[0].y);
          for (let i = 1; i < points.length - 1; i++) {
            const xc = (points[i].x + points[i + 1].x) / 2;
            const yc = (points[i].y + points[i + 1].y) / 2;
            ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
          }
          ctx.lineTo(points[points.length - 1].x, points[points.length - 1].y);
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
          if (pass === 0) {
            ctx.strokeStyle = `rgba(${GOLD}, 0.18)`;
            ctx.lineWidth = hovered ? 8 : 5;
          } else {
            ctx.strokeStyle = `rgba(${GOLD_LIGHT}, 0.55)`;
            ctx.lineWidth = hovered ? 2.2 : 1.4;
          }
          ctx.stroke();
        }
      }

      // Sparks
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.x += s.vx;
        s.y += s.vy;
        s.vy += 0.04;
        s.vx *= 0.985;
        s.alpha -= 0.022;
        if (s.alpha <= 0) {
          sparks.splice(i, 1);
          continue;
        }
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${s.hue === 0 ? GOLD : GOLD_LIGHT}, ${s.alpha * 0.85})`;
        ctx.fill();
      }

      // Cursor core: rotating orbit ring + pulsing halo + dot
      if (smooth.x > -500 && visible) {
        const baseR = hovered ? 16 : 9;
        const pulse = Math.sin(performance.now() / 220) * 1.5;

        // Outer soft halo
        const grad = ctx.createRadialGradient(smooth.x, smooth.y, 0, smooth.x, smooth.y, baseR + 14);
        grad.addColorStop(0, `rgba(${GOLD}, ${pressed ? 0.35 : 0.18})`);
        grad.addColorStop(1, `rgba(${GOLD}, 0)`);
        ctx.beginPath();
        ctx.fillStyle = grad;
        ctx.arc(smooth.x, smooth.y, baseR + 14, 0, Math.PI * 2);
        ctx.fill();

        // Rotating dashed orbit ring
        ctx.save();
        ctx.translate(smooth.x, smooth.y);
        ctx.rotate(angleRef.current);
        ctx.beginPath();
        ctx.setLineDash([4, 5]);
        ctx.strokeStyle = `rgba(${GOLD_LIGHT}, 0.75)`;
        ctx.lineWidth = 1.2;
        ctx.arc(0, 0, baseR + pulse, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();

        // Inner solid dot, scales on press
        ctx.beginPath();
        ctx.arc(smooth.x, smooth.y, pressed ? 4.5 : 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgb(${GOLD_LIGHT})`;
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', updateMouse);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      cancelAnimationFrame(animationFrameId);
    };
  }, [visible, hovered, pressed]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[60] bg-transparent"
      style={{ mixBlendMode: 'screen' }}
    />
  );
}