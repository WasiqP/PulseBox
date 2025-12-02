import React from 'react';
import { motion } from 'framer-motion';
import { FiStar, FiUpload, FiTrendingUp } from 'react-icons/fi';
import './HowItWorksSection.css';

const HowItWorksSection = () => {
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

    const steps = [
        {
            step: '01',
            title: 'Set Up Your Classes',
            description: 'Create and organize your classes in minutes. Add students, set schedules, and manage all your teaching responsibilities in one place.',
            icon: FiStar
        },
        {
            step: '02',
            title: 'Let AI Assist You',
            description: 'Generate lesson plans with AI, mark attendance quickly, create quizzes, and automate repetitive admin tasks. Save hours every week.',
            icon: FiUpload
        },
        {
            step: '03',
            title: 'Focus on Teaching',
            description: 'With administrative tasks automated, you can dedicate more time to what you love—teaching and inspiring your students.',
            icon: FiTrendingUp
        }
    ];

    return (
        <section className="how-it-works-section">
            <motion.div
                className="how-it-works-container"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={staggerContainer}
            >
                <motion.h2
                    className="section-title"
                    variants={fadeInUp}
                >
                    How It Works
                </motion.h2>
                <motion.p
                    className="section-subtitle"
                    variants={fadeInUp}
                >
                    Start saving time and reducing stress in just three simple steps
                </motion.p>

                <div className="timeline-container">
                    {steps.map((step, index) => {
                        const IconComponent = step.icon;
                        return (
                            <motion.div
                                key={index}
                                className="timeline-item"
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, amount: 0.3 }}
                                transition={{ duration: 0.8, delay: index * 0.3 }}
                            >
                                <motion.div
                                    className="timeline-line"
                                    initial={{ scaleY: 0, opacity: 0 }}
                                    whileInView={{ scaleY: 1, opacity: 1 }}
                                    transition={{ duration: 0.8, ease: "easeInOut" }}
                                ></motion.div>

                                <motion.div
                                    className="timeline-dot"
                                    initial={{ scale: 0, rotate: -180, opacity: 0 }}
                                    whileInView={{ scale: 1, rotate: 0, opacity: 1 }}
                                    transition={{ duration: 0.6, ease: "backOut" }}
                                >
                                    <div className="timeline-number">{step.step}</div>
                                    <div className="timeline-icon">
                                        <IconComponent />
                                    </div>
                                </motion.div>

                                <motion.div
                                    className="timeline-content"
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.6, delay: 0.3 }}
                                >
                                    <h3 className="timeline-title">{step.title}</h3>
                                    <p className="timeline-description">{step.description}</p>
                                </motion.div>
                            </motion.div>
                        );
                    })}
                </div>
            </motion.div>
        </section>
    );
};

export default HowItWorksSection;
