import { useEffect, useRef } from 'react';

interface InteractiveGridProps {
    color?: string;
    highlightColor?: string;
    gap?: number;
    size?: number;
}

const InteractiveGrid = ({
    color = 'rgba(255, 255, 255, 0.1)',
    highlightColor = '#A060FF',
    gap = 40,
    size = 2,
}: InteractiveGridProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const mouse = useRef<{ x: number; y: number }>({ x: -1000, y: -1000 });
    const animationRef = useRef<number>();

    useEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const resize = () => {
            canvas.width = container.offsetWidth;
            canvas.height = container.offsetHeight;
        };

        const handleMouseMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            mouse.current = {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
            };
        };

        const handleMouseLeave = () => {
            mouse.current = { x: -1000, y: -1000 };
        };

        const draw = () => {
            if (!ctx || !canvas) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const cols = Math.floor(canvas.width / gap);
            const rows = Math.floor(canvas.height / gap);

            for (let i = 0; i <= cols; i++) {
                for (let j = 0; j <= rows; j++) {
                    const x = i * gap;
                    const y = j * gap;

                    // Calculate distance to mouse
                    const dx = x - mouse.current.x;
                    const dy = y - mouse.current.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    // Interaction radius
                    const maxDist = 300;
                    const scale = Math.max(0, 1 - dist / maxDist);

                    // Draw dot
                    ctx.beginPath();
                    const currentSize = size + (scale * 2); // Grow slightly when near mouse
                    ctx.arc(x, y, currentSize, 0, Math.PI * 2);

                    if (scale > 0) {
                        ctx.fillStyle = highlightColor;
                        ctx.globalAlpha = scale; // Fade out based on distance
                    } else {
                        ctx.fillStyle = color;
                        ctx.globalAlpha = 0.2; // Base opacity
                    }

                    ctx.fill();
                    ctx.globalAlpha = 1;
                }
            }

            animationRef.current = requestAnimationFrame(draw);
        };

        window.addEventListener('resize', resize);
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseleave', handleMouseLeave);

        resize();
        draw();

        return () => {
            window.removeEventListener('resize', resize);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseleave', handleMouseLeave);
            if (animationRef.current) cancelAnimationFrame(animationRef.current);
        };
    }, [color, highlightColor, gap, size]);

    return (
        <div
            ref={containerRef}
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                overflow: 'hidden',
                pointerEvents: 'none', // Allow clicks to pass through
                zIndex: 0
            }}
        >
            <canvas ref={canvasRef} style={{ display: 'block' }} />
        </div>
    );
};

export default InteractiveGrid;
