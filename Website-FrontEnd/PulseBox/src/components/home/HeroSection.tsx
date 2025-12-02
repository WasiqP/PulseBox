import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, type Variants } from 'framer-motion';
import ThreeBackground from '../ThreeBackground';
import Button from '../ui/Button';
import './HeroSection.css';

const HeroSection = () => {
    const heroRef = useRef<HTMLDivElement>(null);

    const fadeInUp: Variants = {
        hidden: { opacity: 0, y: 60 },
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
                staggerChildren: 0.2,
                delayChildren: 0.3
            }
        }
    };

    return (
        <motion.section
            ref={heroRef}
            className="hero-section"
        >
            {/* 3D Background */}
            <div className="particles-background">
                <ThreeBackground />
            </div>

            <div className="hero-content">
                <motion.div
                    className="hero-text"
                    initial="hidden"
                    animate="visible"
                    variants={staggerContainer}
                >
                    <motion.p
                        className="hero-welcome"
                        variants={fadeInUp}
                    >
                        welcome to
                    </motion.p>

                    <motion.h1
                        className="hero-title"
                        variants={fadeInUp}
                    >
                        <span className="brand-pulse">Pulse</span>
                        <span className="brand-box">Box</span>
                    </motion.h1>

                    <motion.p
                        className="hero-subtitle"
                        variants={fadeInUp}
                    >
                        Collect feedback & grow your business.
                    </motion.p>

                    <motion.p
                        className="hero-description"
                        variants={fadeInUp}
                    >
                        Create custom forms, gather client insights, and make data-driven decisions to improve your services.
                    </motion.p>

                    <motion.div
                        className="hero-actions"
                        variants={fadeInUp}
                    >
                        <Link to="/signup">
                            <Button variant="primary" size="lg">Get Started</Button>
                        </Link>
                        <Link to="/about">
                            <Button variant="secondary" size="lg">Learn More</Button>
                        </Link>
                    </motion.div>
                </motion.div>

                <motion.div
                    className="hero-image"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                >
                    <div className="hero-image-container">
                        <div className="hero-logo-placeholder">
                            <span className="logo-pulse">Pulse</span>
                            <span className="logo-box">Box</span>
                        </div>
                    </div>
                </motion.div>
            </div>
        </motion.section>
    );
};

export default HeroSection;
