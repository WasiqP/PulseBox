import React from 'react';
import { motion } from 'framer-motion';
import TestimonialsBento from '../TestimonialsBento';
import './TestimonialsSection.css';

const TestimonialsSection = () => {
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

    return (
        <section className="testimonials-section">
            <motion.div
                className="testimonials-container"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={staggerContainer}
            >
                <motion.h2
                    className="section-title"
                    variants={fadeInUp}
                >
                    What Teachers Are Saying
                </motion.h2>
                <motion.p
                    className="section-subtitle"
                    variants={fadeInUp}
                >
                    Join thousands of teachers who have transformed their workflow with PulseBox
                </motion.p>

                <motion.div
                    variants={fadeInUp}
                    style={{ marginTop: '4rem' }}
                >
                    <TestimonialsBento
                        textAutoHide={false}
                        enableStars={true}
                        enableSpotlight={true}
                        enableBorderGlow={true}
                        enableTilt={false}
                        enableMagnetism={false}
                        clickEffect={true}
                        spotlightRadius={300}
                        particleCount={12}
                        glowColor="160, 96, 255"
                        testimonials={[
                            {
                                name: 'Sarah Mitchell',
                                role: 'Mathematics Teacher',
                                company: 'Springfield High School',
                                content: 'PulseBox has completely transformed my workflow. The AI lesson planner saves me 3 hours every week, and I can mark attendance in seconds. I finally have time to focus on teaching!',
                                rating: 5,
                                color: '#FFFFFF'
                            },
                            {
                                name: 'Michael Chen',
                                role: 'Science Teacher',
                                company: 'Riverside Elementary',
                                content: 'Managing 5 different classes used to be overwhelming. With PulseBox, everything is organized and accessible. The class management features are a lifesaver!',
                                rating: 5,
                                color: '#FFFFFF'
                            },
                            {
                                name: 'Emily Rodriguez',
                                role: 'English Teacher',
                                company: 'Lincoln Middle School',
                                content: 'Creating quizzes and assignments is now so quick and easy. The form builder is intuitive, and my students love the interactive quizzes. Game changer!',
                                rating: 5,
                                color: '#FFFFFF'
                            },
                            {
                                name: 'David Thompson',
                                role: 'History Teacher',
                                company: 'Westfield Academy',
                                content: 'The AI lesson planner generates comprehensive plans that I can customize. It understands different grade levels and learning objectives perfectly. Highly recommend!',
                                rating: 5,
                                color: '#FFFFFF'
                            },
                            {
                                name: 'Lisa Wang',
                                role: 'Elementary Teacher',
                                company: 'Oakwood Primary',
                                content: 'As a teacher with 30 students, attendance used to take forever. Now I can mark it in under a minute. PulseBox has given me back so much time!',
                                rating: 5,
                                color: '#FFFFFF'
                            },
                            {
                                name: 'James Martinez',
                                role: 'Substitute Teacher',
                                company: 'Various Schools',
                                content: 'PulseBox makes substitute teaching so much easier. I can quickly access class information, continue lesson plans, and mark attendance seamlessly. Essential tool!',
                                rating: 5,
                                color: '#FFFFFF'
                            },
                            {
                                name: 'Rachel Green',
                                role: 'Language Arts Teacher',
                                company: 'Central High School',
                                content: 'The student management features help me track progress across all my classes. I can see who needs extra help and who\'s excelling. Data-driven teaching made easy!',
                                rating: 5,
                                color: '#FFFFFF'
                            },
                            {
                                name: 'Alex Kumar',
                                role: 'Physics Teacher',
                                company: 'Tech Prep High',
                                content: 'I\'ve tried many teacher apps, but PulseBox is the only one that truly understands what teachers need. The combination of AI assistance and practical tools is perfect.',
                                rating: 5,
                                color: '#FFFFFF'
                            }
                        ]}
                    />
                </motion.div>
            </motion.div>
        </section>
    );
};

export default TestimonialsSection;
