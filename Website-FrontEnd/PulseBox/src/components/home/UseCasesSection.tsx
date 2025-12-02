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
            industry: 'Elementary',
            useCase: 'Primary School Teachers',
            description: 'Manage multiple classes, track attendance, create age-appropriate quizzes, and generate engaging lesson plans.',
            color: '#A060FF',
            size: 'large'
        },
        {
            industry: 'Secondary',
            useCase: 'High School Teachers',
            description: 'Handle complex schedules, manage assignments across subjects, track student progress, and automate grading workflows.',
            color: '#8A4DE6',
            size: 'medium'
        },
        {
            industry: 'Subject-Specific',
            useCase: 'Specialized Teachers',
            description: 'Create subject-specific lesson plans, design custom quizzes for math, science, languages, and more.',
            color: '#A060FF',
            size: 'medium'
        },
        {
            industry: 'Substitute',
            useCase: 'Substitute Teachers',
            description: 'Quickly access class information, mark attendance, and continue lesson plans seamlessly.',
            color: '#8A4DE6',
            size: 'large'
        },
        {
            industry: 'Administration',
            useCase: 'School Administrators',
            description: 'Monitor teacher productivity, track class statistics, and manage school-wide resources efficiently.',
            color: '#A060FF',
            size: 'small'
        },
        {
            industry: 'Tutoring',
            useCase: 'Private Tutors',
            description: 'Organize student sessions, create personalized lesson plans, and track individual student progress.',
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
                    Perfect for Every Teacher
                </motion.h2>
                <motion.p
                    className="section-subtitle"
                    variants={fadeInUp}
                >
                    Whether you teach elementary, high school, or specialize in a subject, PulseBox adapts to your needs
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
