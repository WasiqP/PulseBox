import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, type Variants } from 'framer-motion';
import { FiZap, FiBookOpen, FiUsers, FiClock } from 'react-icons/fi';
import Button from '../ui/Button';
import './HeroSection.css';

const HeroSection = () => {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const sectionRef = useRef<HTMLElement>(null);

    const fadeInUp: Variants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: [0.6, -0.05, 0.01, 0.99]
            }
        }
    };

    const staggerContainer: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.2
            }
        }
    };

    const features = [
        { 
            icon: FiZap, 
            text: 'AI-Powered',
            description: 'Generate lesson plans, automate grading, and get intelligent assistance for all your teaching tasks with advanced AI technology.'
        },
        { 
            icon: FiBookOpen, 
            text: 'Lesson Planning',
            description: 'Create comprehensive lesson plans in seconds. Customize for any subject, grade level, and learning objectives with AI assistance.'
        },
        { 
            icon: FiUsers, 
            text: 'Class Management',
            description: 'Organize all your classes, students, and schedules in one place. Track progress and manage multiple classes effortlessly.'
        },
        { 
            icon: FiClock, 
            text: 'Save 10+ Hours/Week',
            description: 'Automate administrative tasks and reduce paperwork. Teachers report saving over 10 hours per week on routine tasks.'
        }
    ];

    // Generate positions for floating cards - spread across the screen
    const getRandomPosition = (index: number) => {
        const positions = [
            { top: '10%', left: '5%' },           // Top left corner
            { top: '12%', right: '5%' },          // Top right corner
            { bottom: '25%', left: '4%' },        // Bottom left corner
            { bottom: '22%', right: '6%' }         // Bottom right corner
        ];
        return positions[index] || { top: '50%', left: '50%' };
    };

    // Floating animation variants
    const floatingAnimation = (index: number) => ({
        y: [0, -20, 0],
        x: [0, Math.sin(index) * 15, 0],
        rotate: [0, Math.sin(index) * 5, 0],
        transition: {
            duration: 4 + index * 0.5,
            repeat: Infinity,
            ease: "easeInOut" as const
        }
    });

    return (
        <section ref={sectionRef} className="hero-section">
            {/* Animated Modern Background */}
            <AnimatedBackground />
            
            <div className="hero-content">
                <motion.div
                    className="hero-text"
                    initial="hidden"
                    animate="visible"
                    variants={staggerContainer}
                >
                    <motion.div
                        className="hero-badge"
                        variants={fadeInUp}
                    >
                        <FiZap className="badge-icon" />
                        <span>AI Teaching Assistant</span>
                    </motion.div>

                    <motion.h1
                        className="hero-title"
                        variants={fadeInUp}
                    >
                        Your AI Teaching Assistant
                        <br />
                        <span className="brand-pulse">Save Time, Focus on Teaching</span>
                    </motion.h1>

                    <motion.p
                        className="hero-description"
                        variants={fadeInUp}
                    >
                        Automate admin tasks, generate AI lesson plans, manage classes, and track attendance—all in one powerful app.
                    </motion.p>

                    <motion.div
                        className="hero-actions"
                        variants={fadeInUp}
                    >
                        <Link to="/signup">
                            <Button variant="primary" size="lg">Get Started Free</Button>
                        </Link>
                        <Link to="/about">
                            <Button variant="secondary" size="lg">Learn More</Button>
                        </Link>
                    </motion.div>
                </motion.div>
            </div>

            {/* Floating Feature Cards - Positioned absolutely across the screen */}
            <div className="hero-features-container">
                        {features.map((feature, index) => {
                            const Icon = feature.icon;
                            const position = getRandomPosition(index);
                            const isHovered = hoveredIndex === index;
                            
                            return (
                                <motion.div
                                    key={index}
                                    className="hero-feature-item-floating"
                                    style={position}
                                    animate={floatingAnimation(index)}
                                    onHoverStart={() => setHoveredIndex(index)}
                                    onHoverEnd={() => setHoveredIndex(null)}
                                    whileHover={{ scale: 1.1, zIndex: 10 }}
                                >
                                    <div className="feature-card-content">
                                        <Icon className="feature-icon" />
                                        <span className="feature-text">{feature.text}</span>
                                    </div>
                                    <motion.div
                                        className="feature-dropdown"
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{
                                            height: isHovered ? 'auto' : 0,
                                            opacity: isHovered ? 1 : 0
                                        }}
                                        transition={{ duration: 0.3, ease: "easeInOut" }}
                                    >
                                        <p className="feature-description">{feature.description}</p>
                                    </motion.div>
                                </motion.div>
                            );
                        })}
            </div>
        </section>
    );
};

// Animated Background Component - Advanced Particle Network
const AnimatedBackground = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationFrameRef = useRef<number | undefined>(undefined);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Initialize particles
        const particleCount = 25;
        const particles = Array.from({ length: particleCount }, () => ({
            x: Math.random() * 100,
            y: Math.random() * 100,
            vx: (Math.random() - 0.5) * 0.02,
            vy: (Math.random() - 0.5) * 0.02
        }));

        // Set canvas size
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        // Animation loop
        let time = 0;
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            time += 0.01;

            // Update particle positions
            particles.forEach(particle => {
                particle.x += particle.vx;
                particle.y += particle.vy;
                
                // Wrap around edges
                if (particle.x < 0) particle.x = 100;
                if (particle.x > 100) particle.x = 0;
                if (particle.y < 0) particle.y = 100;
                if (particle.y > 100) particle.y = 0;
            });

            // Draw connections between nearby particles
            ctx.lineWidth = 1;

            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = (particles[i].x - particles[j].x) * canvas.width / 100;
                    const dy = (particles[i].y - particles[j].y) * canvas.height / 100;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < 200) {
                        const opacity = (1 - distance / 200) * 0.15;
                        ctx.strokeStyle = `rgba(160, 96, 255, ${opacity})`;
                        ctx.beginPath();
                        ctx.moveTo(
                            particles[i].x * canvas.width / 100,
                            particles[i].y * canvas.height / 100
                        );
                        ctx.lineTo(
                            particles[j].x * canvas.width / 100,
                            particles[j].y * canvas.height / 100
                        );
                        ctx.stroke();
                    }
                }
            }

            // Draw particles with subtle animation
            ctx.fillStyle = 'rgba(160, 96, 255, 0.4)';
            particles.forEach((particle, i) => {
                const x = particle.x * canvas.width / 100 + Math.sin(time + i) * 15;
                const y = particle.y * canvas.height / 100 + Math.cos(time + i * 0.5) * 10;
                
                ctx.beginPath();
                ctx.arc(x, y, 3, 0, Math.PI * 2);
                ctx.fill();
            });

            animationFrameRef.current = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, []);

    return (
        <div className="hero-background-modern">
            {/* Particle Network Canvas */}
            <canvas ref={canvasRef} className="particle-network-canvas" />
            
            {/* Flowing Gradient Waves */}
            <motion.div
                className="flowing-wave wave-1"
                animate={{
                    x: ['-50%', '150%'],
                }}
                transition={{
                    duration: 25,
                    repeat: Infinity,
                    ease: "linear"
                }}
            />
            <motion.div
                className="flowing-wave wave-2"
                animate={{
                    x: ['150%', '-50%'],
                }}
                transition={{
                    duration: 30,
                    repeat: Infinity,
                    ease: "linear",
                    delay: 5
                }}
            />
            
            {/* Floating Geometric Shapes */}
            <motion.div
                className="geometric-shape shape-triangle"
                animate={{
                    rotate: [0, 360],
                    y: [0, -30, 0],
                    x: [0, 20, 0],
                }}
                transition={{
                    duration: 15,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            />
            <motion.div
                className="geometric-shape shape-hexagon"
                animate={{
                    rotate: [360, 0],
                    y: [0, 25, 0],
                    x: [0, -15, 0],
                }}
                transition={{
                    duration: 18,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 3
                }}
            />
        </div>
    );
};

export default HeroSection;
