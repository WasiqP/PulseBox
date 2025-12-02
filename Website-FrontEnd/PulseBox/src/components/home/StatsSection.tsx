import { motion } from 'framer-motion';
import './StatsSection.css';

const StatsSection = () => {
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

    const stats = [
        { number: '10K+', label: 'Active Users' },
        { number: '500K+', label: 'Forms Created' },
        { number: '2M+', label: 'Responses Collected' },
        { number: '98%', label: 'Customer Satisfaction' }
    ];

    return (
        <section className="stats-section">

            <motion.div
                className="stats-container"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={staggerContainer}
            >
                <motion.h2
                    className="section-title"
                    variants={fadeInUp}
                >
                    Trusted by Businesses Worldwide
                </motion.h2>
                <div className="stats-bar">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            className="stat-item"
                            variants={fadeInUp}
                        >
                            <div className="stat-content">
                                <div className="stat-number">{stat.number}</div>
                                <div className="stat-label">{stat.label}</div>
                            </div>
                            {index < stats.length - 1 && <div className="stat-divider"></div>}
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </section>
    );
};

export default StatsSection;
