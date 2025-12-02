import React from 'react';
import { motion } from 'framer-motion';
import './IntegrationsSection.css';

const IntegrationsSection = () => {
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

    const integrations = [
        'iOS', 'Android', 'Web', 'Google Classroom', 'Microsoft Teams', 'Canvas',
        'iOS', 'Android', 'Web', 'Google Classroom', 'Microsoft Teams', 'Canvas'
    ];

    return (
        <section className="integrations-section">
            <motion.div
                className="integrations-container"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={staggerContainer}
            >
                <motion.h2
                    className="section-title"
                    variants={fadeInUp}
                >
                    Works Everywhere You Teach
                </motion.h2>
                <motion.p
                    className="section-subtitle"
                    variants={fadeInUp}
                >
                    Access PulseBox on any device—mobile app, web browser, or integrate with your existing teaching platforms
                </motion.p>
                <div className="integrations-wall">
                    <div className="integrations-scroll">
                        {integrations.map((integration, index) => (
                            <motion.div
                                key={index}
                                className="integration-badge"
                                whileHover={{ scale: 1.15, y: -5 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="integration-name">{integration}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.div>
        </section>
    );
};

export default IntegrationsSection;
