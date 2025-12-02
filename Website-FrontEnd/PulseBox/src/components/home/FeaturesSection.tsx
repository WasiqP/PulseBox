import React from 'react';
import { motion } from 'framer-motion';
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
    const fadeInUp = {
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

    const staggerContainer = {
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
            title: 'Custom Forms',
            description: 'Create beautiful forms with multiple question types tailored to your needs.',
            style: 'gradient',
            gradient: 'linear-gradient(135deg, rgba(160, 96, 255, 0.15) 0%, rgba(138, 77, 230, 0.1) 100%)'
        },
        {
            icon: FiBarChart2,
            title: 'Analytics Dashboard',
            description: 'View responses and insights in real-time with our intuitive dashboard.',
            style: 'outlined',
            accent: '#A060FF'
        },
        {
            icon: FiLink,
            title: 'Easy Sharing',
            description: 'Share forms via links or QR codes with just one click.',
            style: 'solid',
            bgColor: '#A060FF'
        },
        {
            icon: FiSmartphone,
            title: 'Mobile & Web',
            description: 'Access your forms and responses from any device, anywhere.',
            style: 'minimal',
            borderStyle: 'dashed'
        },
        {
            icon: FiLock,
            title: 'Secure & Private',
            description: 'Your data is protected with enterprise-grade security.',
            style: 'gradient',
            gradient: 'linear-gradient(135deg, rgba(160, 96, 255, 0.1) 0%, rgba(138, 77, 230, 0.15) 100%)'
        },
        {
            icon: FiZap,
            title: 'Real-time Updates',
            description: 'Get instant notifications when responses are submitted.',
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
                    Powerful Features for Your Business
                </motion.h2>

                <motion.p
                    className="section-subtitle"
                    variants={fadeInUp}
                >
                    Everything you need to collect, analyze, and act on feedback
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
