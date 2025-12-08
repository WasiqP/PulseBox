import { motion, useInView } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { useRef } from 'react';
import {
    FiTarget,
    FiUsers,
    FiZap,
    FiHeart,
    FiAward,
    FiTrendingUp,
    FiShield,
    FiClock,
    FiBookOpen,
    FiCheckCircle
} from 'react-icons/fi';
import Button from '../components/ui/Button';
import { Link } from 'react-router-dom';
import './AboutPage.css';

const AboutPage = () => {
    const heroRef = useRef<HTMLElement>(null);
    const missionRef = useRef<HTMLDivElement>(null);
    const valuesRef = useRef<HTMLDivElement>(null);
    const statsRef = useRef<HTMLDivElement>(null);

    const isHeroInView = useInView(heroRef, { once: true, margin: "-100px" });
    const isMissionInView = useInView(missionRef, { once: true, margin: "-100px" });
    const isValuesInView = useInView(valuesRef, { once: true, margin: "-100px" });
    const isStatsInView = useInView(statsRef, { once: true, margin: "-100px" });

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

    const values = [
        {
            icon: FiTarget,
            title: 'Mission-Driven',
            description: 'Dedicated to reducing teacher stress and maximizing teaching time',
            color: '#A060FF'
        },
        {
            icon: FiZap,
            title: 'Innovation First',
            description: 'Leveraging cutting-edge AI to solve real teaching challenges',
            color: '#8A4DE6'
        },
        {
            icon: FiHeart,
            title: 'Teacher-Centric',
            description: 'Built by educators, for educators, with your needs at heart',
            color: '#A060FF'
        },
        {
            icon: FiShield,
            title: 'Secure & Private',
            description: 'Enterprise-grade security protecting your students\' data',
            color: '#8A4DE6'
        }
    ];

    const stats = [
        { number: '10+', label: 'Hours Saved Per Week', icon: FiClock },
        { number: '70%', label: 'Admin Tasks Automated', icon: FiZap },
        { number: '1000+', label: 'Teachers Empowered', icon: FiUsers },
        { number: '24/7', label: 'AI Support Available', icon: FiCheckCircle }
    ];

    const features = [
        {
            icon: FiBookOpen,
            title: 'AI Lesson Planner',
            description: 'Generate comprehensive lesson plans in seconds with AI assistance tailored to your curriculum',
            color: '#A060FF'
        },
        {
            icon: FiUsers,
            title: 'Class Management',
            description: 'Organize all your classes, students, and schedules in one intuitive dashboard',
            color: '#8A4DE6'
        },
        {
            icon: FiCheckCircle,
            title: 'Quick Attendance',
            description: 'Mark attendance in seconds with our innovative tap-to-mark system',
            color: '#A060FF'
        },
        {
            icon: FiTrendingUp,
            title: 'Analytics & Insights',
            description: 'Track student progress and gain insights to improve teaching outcomes',
            color: '#8A4DE6'
        }
    ];

    return (
        <div className="about-page">
            {/* Hero Section */}
            <motion.section
                ref={heroRef}
                className="about-hero"
                initial="hidden"
                animate={isHeroInView ? "visible" : "hidden"}
                variants={staggerContainer}
            >
                <div className="about-hero-background">
                    <div className="about-gradient-blob blob-1"></div>
                    <div className="about-gradient-blob blob-2"></div>
                </div>

                <div className="about-hero-content">
                    <motion.div
                        className="about-badge"
                        variants={fadeInUp}
                    >
                        <FiTarget className="badge-icon" />
                        <span>Our Story</span>
                    </motion.div>

                    <motion.h1
                        className="about-title"
                        variants={fadeInUp}
                    >
                        About <span className="gradient-text">PulseBox</span>
                    </motion.h1>

                    <motion.p
                        className="about-subtitle"
                        variants={fadeInUp}
                    >
                        Empowering teachers to save time, reduce stress, and focus on what matters most—inspiring and teaching students
                    </motion.p>

                    <motion.div
                        className="about-hero-actions"
                        variants={fadeInUp}
                    >
                        <Link to="/contact">
                            <Button variant="primary" size="lg">Get in Touch</Button>
                        </Link>
                        <Link to="/signup">
                            <Button variant="secondary" size="lg">Start Free Trial</Button>
                        </Link>
                    </motion.div>
                </div>
            </motion.section>

            {/* Mission Section */}
            <motion.section
                ref={missionRef}
                className="about-mission"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={staggerContainer}
            >
                <div className="about-container">
                    <motion.div
                        className="mission-card"
                        variants={fadeInUp}
                    >
                        <div className="mission-icon-wrapper">
                            <FiTarget className="mission-icon" />
                        </div>
                        <h2 className="mission-title">Our Mission</h2>
                        <p className="mission-text">
                            Teachers are the 2nd most stressed professionals in the world, largely due to overwhelming 
                            administrative tasks. At PulseBox, we're on a mission to change that. We provide teachers 
                            with an AI-powered personal assistant that automates administrative work, saves 10+ hours 
                            per week, and allows educators to focus on what they do best—inspiring and teaching students.
                        </p>
                    </motion.div>
                </div>
            </motion.section>

            {/* Stats Section */}
            <motion.section
                ref={statsRef}
                className="about-stats"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={staggerContainer}
            >
                <div className="about-container">
                    <motion.h2
                        className="section-heading"
                        variants={fadeInUp}
                    >
                        PulseBox by the <span className="gradient-text">Numbers</span>
                    </motion.h2>
                    <div className="stats-grid">
                        {stats.map((stat, index) => {
                            const IconComponent = stat.icon;
                            return (
                                <motion.div
                                    key={index}
                                    className="stat-card"
                                    variants={fadeInUp}
                                    whileHover={{ scale: 1.05, y: -5 }}
                                >
                                    <div className="stat-icon-wrapper">
                                        <IconComponent className="stat-icon" />
                                    </div>
                                    <div className="stat-number">{stat.number}</div>
                                    <div className="stat-label">{stat.label}</div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </motion.section>

            {/* Values Section */}
            <motion.section
                ref={valuesRef}
                className="about-values"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={staggerContainer}
            >
                <div className="about-container">
                    <motion.h2
                        className="section-heading"
                        variants={fadeInUp}
                    >
                        Our <span className="gradient-text">Values</span>
                    </motion.h2>
                    <div className="values-grid">
                        {values.map((value, index) => {
                            const IconComponent = value.icon;
                            return (
                                <motion.div
                                    key={index}
                                    className="value-card"
                                    variants={fadeInUp}
                                    whileHover={{ scale: 1.02, y: -5 }}
                                    style={{
                                        '--value-color': value.color
                                    } as React.CSSProperties}
                                >
                                    <div
                                        className="value-icon-wrapper"
                                        style={{
                                            background: `linear-gradient(135deg, ${value.color}25, ${value.color}15)`,
                                            borderColor: `${value.color}50`
                                        }}
                                    >
                                        <IconComponent
                                            className="value-icon"
                                            style={{ color: value.color }}
                                        />
                                    </div>
                                    <h3 className="value-title">{value.title}</h3>
                                    <p className="value-description">{value.description}</p>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </motion.section>

            {/* Features Section */}
            <motion.section
                className="about-features"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={staggerContainer}
            >
                <div className="about-container">
                    <motion.h2
                        className="section-heading"
                        variants={fadeInUp}
                    >
                        What We <span className="gradient-text">Offer</span>
                    </motion.h2>
                    <div className="features-grid">
                        {features.map((feature, index) => {
                            const IconComponent = feature.icon;
                            return (
                                <motion.div
                                    key={index}
                                    className="feature-card"
                                    variants={fadeInUp}
                                    whileHover={{ scale: 1.02, y: -5 }}
                                    style={{
                                        '--feature-color': feature.color
                                    } as React.CSSProperties}
                                >
                                    <div className="feature-card-glow"></div>
                                    <div
                                        className="feature-icon-wrapper"
                                        style={{
                                            background: `linear-gradient(135deg, ${feature.color}25, ${feature.color}15)`,
                                            borderColor: `${feature.color}50`
                                        }}
                                    >
                                        <IconComponent
                                            className="feature-icon"
                                            style={{ color: feature.color }}
                                        />
                                    </div>
                                    <h3 className="feature-title">{feature.title}</h3>
                                    <p className="feature-description">{feature.description}</p>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </motion.section>

            {/* CTA Section */}
            <motion.section
                className="about-cta"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={staggerContainer}
            >
                <div className="about-container">
                    <motion.div
                        className="cta-card"
                        variants={fadeInUp}
                    >
                        <FiAward className="cta-icon" />
                        <h2 className="cta-title">Ready to Transform Your Teaching?</h2>
                        <p className="cta-description">
                            Join thousands of educators who've revolutionized their workflow with PulseBox
                        </p>
                        <div className="cta-actions">
                            <Link to="/signup">
                                <Button variant="primary" size="lg">Get Started Free</Button>
                            </Link>
                            <Link to="/contact">
                                <Button variant="secondary" size="lg">Contact Us</Button>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </motion.section>
        </div>
    );
};

export default AboutPage;
