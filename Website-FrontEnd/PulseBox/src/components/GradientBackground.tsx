import { useEffect, useRef } from 'react';

const GradientBackground = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width = window.innerWidth;
        let height = window.innerHeight;

        const resize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        };

        window.addEventListener('resize', resize);
        resize();

        const orbs = [
            { x: width * 0.2, y: height * 0.3, r: 300, color: '#A060FF', vx: 0.5, vy: 0.3 },
            { x: width * 0.8, y: height * 0.7, r: 400, color: '#8A4DE6', vx: -0.4, vy: -0.2 },
            { x: width * 0.5, y: height * 0.5, r: 350, color: '#4D2A85', vx: 0.2, vy: -0.4 },
        ];

        const animate = () => {
            ctx.fillStyle = '#000000';
            ctx.fillRect(0, 0, width, height);

            // Blur effect
            ctx.filter = 'blur(80px)';

            orbs.forEach(orb => {
                orb.x += orb.vx;
                orb.y += orb.vy;

                // Bounce off edges
                if (orb.x < -100 || orb.x > width + 100) orb.vx *= -1;
                if (orb.y < -100 || orb.y > height + 100) orb.vy *= -1;

                ctx.beginPath();
                ctx.arc(orb.x, orb.y, orb.r, 0, Math.PI * 2);
                ctx.fillStyle = orb.color;
                ctx.fill();
            });

            ctx.filter = 'none';
            requestAnimationFrame(animate);
        };

        const animationId = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: 0,
                opacity: 0.6,
            }}
        />
    );
};

export default GradientBackground;
