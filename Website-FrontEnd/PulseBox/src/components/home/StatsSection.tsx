import { motion, useInView } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import {
    FiUsers,
    FiBook,
    FiClock,
    FiTrendingUp,
    FiAward,
    FiZap
} from 'react-icons/fi';
import StatsBackground from './StatsBackground';
import './StatsSection.css';

interface MetricCard {
    icon: React.ElementType;
    value: string;
    label: string;
    description: string;
    color: string;
    gradient: string;
}

const StatsSection = () => {
    const [counters, setCounters] = useState({
        teachers: 0,
        classes: 0,
        lessons: 0,
        hours: 0
    });

    const sectionRef = useRef<HTMLElement>(null);
    const isInView = useInView(sectionRef, { once: true, margin: "-200px" });

    const fadeInUp: Variants = {
        hidden: { opacity: 0, y: 60 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: [0.6, -0.05, 0.01, 0.99] as [number, number, number, number]
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

    const scaleIn: Variants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                duration: 0.5,
                ease: [0.6, -0.05, 0.01, 0.99] as [number, number, number, number]
            }
        }
    };

    const metrics: MetricCard[] = [
        {
            icon: FiUsers,
            value: '5K+',
            label: 'Active Teachers',
            description: 'Educators transforming their workflow',
            color: '#A060FF',
            gradient: 'linear-gradient(135deg, rgba(160, 96, 255, 0.2) 0%, rgba(138, 77, 230, 0.15) 100%)'
        },
        {
            icon: FiBook,
            value: '50K+',
            label: 'Classes Managed',
            description: 'Organized and streamlined daily',
            color: '#8A4DE6',
            gradient: 'linear-gradient(135deg, rgba(138, 77, 230, 0.2) 0%, rgba(160, 96, 255, 0.15) 100%)'
        },
        {
            icon: FiZap,
            value: '1M+',
            label: 'Lesson Plans',
            description: 'AI-generated in seconds',
            color: '#A060FF',
            gradient: 'linear-gradient(135deg, rgba(160, 96, 255, 0.2) 0%, rgba(138, 77, 230, 0.15) 100%)'
        },
        {
            icon: FiClock,
            value: '10+',
            label: 'Hours Saved',
            description: 'Per teacher every week',
            color: '#8A4DE6',
            gradient: 'linear-gradient(135deg, rgba(138, 77, 230, 0.2) 0%, rgba(160, 96, 255, 0.15) 100%)'
        }
    ];

    const achievements = [
        { icon: FiTrendingUp, text: '95% Time Reduction', subtext: 'In admin tasks' },
        { icon: FiAward, text: '4.9/5 Rating', subtext: 'From educators' },
        { icon: FiZap, text: 'Instant Generation', subtext: 'AI-powered tools' }
    ];

    useEffect(() => {
        if (isInView) {
            const duration = 2000;
            const steps = 60;
            const interval = duration / steps;

            const animateCounter = (
                start: number,
                end: number,
                setter: (val: number) => void
            ) => {
                let current = start;
                const increment = (end - start) / steps;
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= end) {
                        setter(end);
                        clearInterval(timer);
                    } else {
                        setter(Math.floor(current));
                    }
                }, interval);
            };

            animateCounter(0, 5000, (val) => setCounters(prev => ({ ...prev, teachers: val })));
            animateCounter(0, 50000, (val) => setCounters(prev => ({ ...prev, classes: val })));
            animateCounter(0, 1000000, (val) => setCounters(prev => ({ ...prev, lessons: val })));
            animateCounter(0, 10, (val) => setCounters(prev => ({ ...prev, hours: val })));
        }
    }, [isInView]);

    const formatNumber = (num: number, suffix: string): string => {
        if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M${suffix}`;
        if (num >= 1000) return `${(num / 1000).toFixed(0)}K${suffix}`;
        return `${num}${suffix}`;
    };

    return (
        <section ref={sectionRef} className="impact-showcase">
            <StatsBackground />

            <motion.div
                className="impact-container"
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                variants={staggerContainer}
            >
                <motion.div className="impact-header" variants={fadeInUp}>
                    <motion.span 
                        className="impact-badge"
                        variants={scaleIn}
                    >
                        <FiAward className="badge-icon" />
                        Real Impact, Real Results
                    </motion.span>
                    <h2 className="impact-title">
                        Transforming Education,
                        <span className="gradient-text"> One Teacher at a Time</span>
                    </h2>
                    <p className="impact-subtitle">
                        Join thousands of educators who've revolutionized their teaching workflow
                        with PulseBox's powerful automation and AI-driven tools
                    </p>
                </motion.div>

                <div className="metrics-grid">
                    {metrics.map((metric, index) => {
                        const IconComponent = metric.icon;
                        const displayValue = index === 0 ? formatNumber(counters.teachers, '+') :
                                           index === 1 ? formatNumber(counters.classes, '+') :
                                           index === 2 ? formatNumber(counters.lessons, '+') :
                                           `${counters.hours}+`;
                        
                        return (
                            <motion.div
                                key={index}
                                className="metric-card"
                                variants={fadeInUp}
                                whileHover={{ y: -8, scale: 1.02 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div 
                                    className="metric-card-bg"
                                    style={{ background: metric.gradient }}
                                ></div>
                                <div className="metric-icon-wrapper">
                                    <div 
                                        className="metric-icon-bg"
                                        style={{ 
                                            background: `linear-gradient(135deg, ${metric.color}20, ${metric.color}10)`,
                                            borderColor: `${metric.color}40`
                                        }}
                                    >
                                        <IconComponent 
                                            className="metric-icon"
                                            style={{ color: metric.color }}
                                        />
                                    </div>
                                </div>
                                <div className="metric-content">
                                    <div 
                                        className="metric-value"
                                        style={{ 
                                            background: `linear-gradient(135deg, ${metric.color}, ${metric.color}CC)`,
                                            WebkitBackgroundClip: 'text',
                                            WebkitTextFillColor: 'transparent',
                                            backgroundClip: 'text'
                                        }}
                                    >
                                        {displayValue}
                                    </div>
                                    <h3 className="metric-label">{metric.label}</h3>
                                    <p className="metric-description">{metric.description}</p>
                                </div>
                                <div className="metric-glow" style={{ background: `${metric.color}20` }}></div>
                            </motion.div>
                        );
                    })}
                </div>

                <motion.div 
                    className="achievements-bar"
                    variants={fadeInUp}
                >
                    {achievements.map((achievement, index) => {
                        const IconComponent = achievement.icon;
                        return (
                            <motion.div
                                key={index}
                                className="achievement-item"
                                variants={scaleIn}
                                whileHover={{ scale: 1.05 }}
                                transition={{ duration: 0.2 }}
                            >
                                <div className="achievement-icon">
                                    <IconComponent />
                                </div>
                                <div className="achievement-content">
                                    <div className="achievement-text">{achievement.text}</div>
                                    <div className="achievement-subtext">{achievement.subtext}</div>
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>
            </motion.div>
        </section>
    );
};

export default StatsSection;
