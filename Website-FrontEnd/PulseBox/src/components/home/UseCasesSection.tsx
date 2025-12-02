import React from 'react';
import { motion } from 'framer-motion';
import './UseCasesSection.css';

const UseCasesSection = () => {
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

    const useCases = [
        {
            industry: 'E-commerce',
            useCase: 'Product Feedback & Reviews',
            description: 'Collect customer reviews and product feedback to improve your offerings.',
            color: '#A060FF',
            size: 'large'
        },
        {
            industry: 'Healthcare',
            useCase: 'Patient Satisfaction Surveys',
            description: 'Gather patient feedback to enhance care quality and service delivery.',
            color: '#8A4DE6',
            size: 'medium'
        },
        {
            industry: 'Education',
            useCase: 'Course Evaluations',
            description: 'Get student feedback on courses and teaching methods for continuous improvement.',
            color: '#A060FF',
            size: 'medium'
        },
        {
            industry: 'Restaurants',
            useCase: 'Dining Experience Feedback',
            description: 'Understand customer satisfaction and improve your restaurant experience.',
            color: '#8A4DE6',
            size: 'large'
        },
        {
            industry: 'SaaS',
            useCase: 'Feature Requests & NPS',
            description: 'Collect user feedback and measure Net Promoter Score to guide product development.',
            color: '#A060FF',
            size: 'small'
        },
        {
            industry: 'Events',
            useCase: 'Event Feedback Forms',
            description: 'Gather attendee feedback to make your next event even better.',
            color: '#8A4DE6',
            size: 'small'
        }
    ];

    return (
        <section className="use-cases-section">
            <motion.div
                className="use-cases-container"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={staggerContainer}
            >
                <motion.h2
                    className="section-title"
                    variants={fadeInUp}
                >
                    Perfect for Every Industry
                </motion.h2>
                <motion.p
                    className="section-subtitle"
                    variants={fadeInUp}
                >
                    See how businesses across industries use PulseBox to grow
                </motion.p>
                <div className="use-cases-masonry">
                    {useCases.map((useCase, index) => (
                        <motion.div
                            key={index}
                            className={`use-case-brick use-case-${useCase.size}`}
                            variants={fadeInUp}
                            whileHover={{ scale: 1.03 }}
                            transition={{ duration: 0.3 }}
                            style={{ '--accent-color': useCase.color } as React.CSSProperties}
                        >
                            <div className="use-case-badge" style={{ backgroundColor: useCase.color }}>
                                {useCase.industry}
                            </div>
                            <h4 className="use-case-title">{useCase.useCase}</h4>
                            <p className="use-case-description">{useCase.description}</p>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </section>
    );
};

export default UseCasesSection;
