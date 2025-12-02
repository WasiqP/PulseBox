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
                    What Our Customers Say
                </motion.h2>
                <motion.p
                    className="section-subtitle"
                    variants={fadeInUp}
                >
                    Join thousands of satisfied businesses using PulseBox
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
                                name: 'Sarah Johnson',
                                role: 'CEO',
                                company: 'TechStart Inc.',
                                content: 'PulseBox has transformed how we collect customer feedback. The analytics are incredible and the forms are so easy to create. Our team productivity increased significantly!',
                                rating: 5,
                                color: '#FFFFFF'
                            },
                            {
                                name: 'Michael Chen',
                                role: 'Marketing Director',
                                company: 'RetailPlus',
                                content: 'The best feedback collection tool we\'ve used. Our response rates increased by 40% since switching to PulseBox. Highly recommend!',
                                rating: 5,
                                color: '#FFFFFF'
                            },
                            {
                                name: 'Emily Rodriguez',
                                role: 'Operations Manager',
                                company: 'HealthCare Pro',
                                content: 'Simple, powerful, and secure. Exactly what we needed for patient feedback. The real-time analytics help us make data-driven decisions.',
                                rating: 5,
                                color: '#FFFFFF'
                            },
                            {
                                name: 'David Thompson',
                                role: 'Product Manager',
                                company: 'SaaS Innovations',
                                content: 'PulseBox\'s form builder is incredibly intuitive. We can create complex surveys in minutes. The integration capabilities are outstanding.',
                                rating: 5,
                                color: '#FFFFFF'
                            },
                            {
                                name: 'Lisa Wang',
                                role: 'Customer Success Lead',
                                company: 'E-commerce Solutions',
                                content: 'Our customer satisfaction scores improved dramatically after implementing PulseBox. The visual analytics make it easy to spot trends and act quickly.',
                                rating: 5,
                                color: '#FFFFFF'
                            },
                            {
                                name: 'James Martinez',
                                role: 'Founder',
                                company: 'EventPro',
                                content: 'We use PulseBox for all our event feedback. The QR code sharing feature is a game-changer. Setup takes minutes, not hours.',
                                rating: 5,
                                color: '#FFFFFF'
                            },
                            {
                                name: 'Rachel Green',
                                role: 'HR Director',
                                company: 'Global Tech Corp',
                                content: 'PulseBox streamlined our employee feedback process. The secure data handling gives us peace of mind, and the export features are perfect for reporting.',
                                rating: 5,
                                color: '#FFFFFF'
                            },
                            {
                                name: 'Alex Kumar',
                                role: 'Head of Product',
                                company: 'StartupHub',
                                content: 'As a startup, we needed something affordable yet powerful. PulseBox exceeded our expectations. The free tier is generous, and the paid features are worth every penny.',
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
