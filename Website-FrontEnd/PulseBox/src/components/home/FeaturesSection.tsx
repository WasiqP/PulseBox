import React from 'react';
import { motion, type Variants } from 'framer-motion';
import {
    FiFileText,
    FiBarChart2,
    FiLink,
    FiSmartphone,
    FiLock,
    FiZap
} from 'react-icons/fi';
import Card from '../ui/Card';
import './FeaturesSection.css';

const FeaturesSection = () => {
    const fadeInUp: Variants = {
        hidden: { opacity: 0, y: 60 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: [0.6, -0.05, 0.01, 0.99] as any
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

    const features = [
        {
            icon: FiFileText,
            title: 'AI Lesson Planner',
            description: 'Generate comprehensive lesson plans in seconds with AI assistance. Customize for any subject, grade level, and duration.',
            style: 'gradient',
            gradient: 'linear-gradient(135deg, rgba(160, 96, 255, 0.15) 0%, rgba(138, 77, 230, 0.1) 100%)'
        },
        {
            icon: FiBarChart2,
            title: 'Class Management',
            description: 'Organize all your classes in one place. Track students, manage schedules, and access class details instantly.',
            style: 'outlined',
            accent: '#A060FF'
        },
        {
            icon: FiLink,
            title: 'Quick Attendance',
            description: 'Mark attendance with a simple tap. Track present, absent, and late students with real-time statistics.',
            style: 'solid',
            bgColor: '#A060FF'
        },
        {
            icon: FiSmartphone,
            title: 'Quizzes & Assignments',
            description: 'Create quizzes, assignments, and tests with our intuitive form builder. Share with students instantly.',
            style: 'minimal',
            borderStyle: 'dashed'
        },
        {
            icon: FiLock,
            title: 'Student Management',
            description: 'View student profiles, track progress, and manage all your students across multiple classes.',
            style: 'gradient',
            gradient: 'linear-gradient(135deg, rgba(160, 96, 255, 0.1) 0%, rgba(138, 77, 230, 0.15) 100%)'
        },
        {
            icon: FiZap,
            title: 'Time-Saving Automation',
            description: 'Save 10+ hours per week by automating admin tasks. Focus on what matters most—teaching.',
            style: 'highlighted',
            highlight: '#8A4DE6'
        }
    ];

    return (
        <section className="features-section">
            <motion.div
                className="features-container"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={staggerContainer}
            >
                <motion.h2
                    className="section-title"
                    variants={fadeInUp}
                >
                    Everything You Need to Teach Efficiently
                </motion.h2>

                <motion.p
                    className="section-subtitle"
                    variants={fadeInUp}
                >
                    Powerful tools designed specifically for teachers to reduce admin burden and maximize teaching time
                </motion.p>

                <div className="features-showcase">
                    {features.map((feature, index) => {
                        const IconComponent = feature.icon;
                        return (
                            <motion.div
                                key={index}
                                variants={fadeInUp}
                                className={`feature-wrapper feature-${feature.style}`}
                                style={{
                                    '--highlight-color': feature.highlight
                                } as React.CSSProperties}
                            >
                                <Card
                                    glass={feature.style !== 'solid'}
                                    hoverEffect={true}
                                    className="feature-card"
                                >
                                    <div className="feature-showcase-icon">
                                        <div className="feature-icon-bg">
                                            <IconComponent />
                                        </div>
                                    </div>
                                    <div className="feature-showcase-content">
                                        <h3 className="feature-showcase-title">{feature.title}</h3>
                                        <p className="feature-showcase-description">{feature.description}</p>
                                    </div>
                                    <div className="feature-showcase-accent"></div>
                                </Card>
                            </motion.div>
                        );
                    })}
                </div>
            </motion.div>
        </section>
    );
};

export default FeaturesSection;
