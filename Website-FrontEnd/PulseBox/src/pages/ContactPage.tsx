import { useState } from 'react';
import { motion, useInView } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { useRef } from 'react';
import {
    FiMail,
    FiMessageCircle,
    FiClock,
    FiSend,
    FiMapPin,
    FiPhone,
    FiLinkedin,
    FiTwitter,
    FiGithub,
    FiCheckCircle
} from 'react-icons/fi';
import Button from '../components/ui/Button';
import './ContactPage.css';

const ContactPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const heroRef = useRef<HTMLElement>(null);
    const formRef = useRef<HTMLDivElement>(null);
    const infoRef = useRef<HTMLDivElement>(null);

    const isHeroInView = useInView(heroRef, { once: true, margin: "-100px" });
    const isFormInView = useInView(formRef, { once: true, margin: "-100px" });
    const isInfoInView = useInView(infoRef, { once: true, margin: "-100px" });

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        console.log('Form submitted:', formData);
        setIsSubmitting(false);
        setIsSubmitted(true);
        setFormData({ name: '', email: '', subject: '', message: '' });

        // Reset success message after 5 seconds
        setTimeout(() => {
            setIsSubmitted(false);
        }, 5000);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const contactInfo = [
        {
            icon: FiMail,
            title: 'Email',
            content: 'support@pulsebox.app',
            link: 'mailto:support@pulsebox.app',
            color: '#A060FF'
        },
        {
            icon: FiMessageCircle,
            title: 'Chat Support',
            content: 'Available 24/7',
            link: '#',
            color: '#8A4DE6'
        },
        {
            icon: FiClock,
            title: 'Response Time',
            content: 'Within 24 hours',
            link: '#',
            color: '#A060FF'
        }
    ];

    const socialLinks = [
        { icon: FiLinkedin, link: '#', label: 'LinkedIn' },
        { icon: FiTwitter, link: '#', label: 'Twitter' },
        { icon: FiGithub, link: '#', label: 'GitHub' }
    ];

    return (
        <div className="contact-page">
            {/* Hero Section */}
            <motion.section
                ref={heroRef}
                className="contact-hero"
                initial="hidden"
                animate={isHeroInView ? "visible" : "hidden"}
                variants={staggerContainer}
            >
                <div className="contact-hero-background">
                    <div className="contact-gradient-blob blob-1"></div>
                    <div className="contact-gradient-blob blob-2"></div>
                </div>

                <div className="contact-hero-content">
                    <motion.div
                        className="contact-badge"
                        variants={fadeInUp}
                    >
                        <FiMessageCircle className="badge-icon" />
                        <span>Get in Touch</span>
                    </motion.div>

                    <motion.h1
                        className="contact-title"
                        variants={fadeInUp}
                    >
                        Let's <span className="gradient-text">Connect</span>
                    </motion.h1>

                    <motion.p
                        className="contact-subtitle"
                        variants={fadeInUp}
                    >
                        Have a question, suggestion, or just want to say hello? We'd love to hear from you. 
                        Send us a message and we'll respond as soon as possible.
                    </motion.p>
                </div>
            </motion.section>

            {/* Contact Content */}
            <section className="contact-content">
                <div className="contact-container">
                    {/* Contact Form */}
                    <motion.div
                        ref={formRef}
                        className="contact-form-wrapper"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={staggerContainer}
                    >
                        <motion.div
                            className="form-card"
                            variants={fadeInUp}
                        >
                            <div className="form-header">
                                <h2 className="form-title">Send us a Message</h2>
                                <p className="form-subtitle">
                                    Fill out the form below and we'll get back to you within 24 hours
                                </p>
                            </div>

                            {isSubmitted && (
                                <motion.div
                                    className="form-success"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                >
                                    <FiCheckCircle className="success-icon" />
                                    <p>Thank you! Your message has been sent successfully.</p>
                                </motion.div>
                            )}

                            <form className="contact-form" onSubmit={handleSubmit}>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="name">Name</label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            placeholder="Your name"
                                            className="form-input"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="email">Email</label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            placeholder="your.email@example.com"
                                            className="form-input"
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="subject">Subject</label>
                                    <input
                                        type="text"
                                        id="subject"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        required
                                        placeholder="What's this about?"
                                        className="form-input"
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="message">Message</label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        rows={6}
                                        placeholder="Tell us more about your inquiry..."
                                        className="form-textarea"
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    variant="primary"
                                    size="lg"
                                    fullWidth
                                    isLoading={isSubmitting}
                                    leftIcon={<FiSend />}
                                >
                                    {isSubmitting ? 'Sending...' : 'Send Message'}
                                </Button>
                            </form>
                        </motion.div>
                    </motion.div>

                    {/* Contact Info */}
                    <motion.div
                        ref={infoRef}
                        className="contact-info-wrapper"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={staggerContainer}
                    >
                        <motion.div
                            className="info-card"
                            variants={fadeInUp}
                        >
                            <h2 className="info-title">Contact Information</h2>
                            <p className="info-subtitle">
                                Reach out to us through any of these channels
                            </p>

                            <div className="info-items">
                                {contactInfo.map((info, index) => {
                                    const IconComponent = info.icon;
                                    return (
                                        <motion.a
                                            key={index}
                                            href={info.link}
                                            className="info-item"
                                            variants={fadeInUp}
                                            whileHover={{ scale: 1.02, x: 5 }}
                                            style={{
                                                '--info-color': info.color
                                            } as React.CSSProperties}
                                        >
                                            <div
                                                className="info-icon-wrapper"
                                                style={{
                                                    background: `linear-gradient(135deg, ${info.color}25, ${info.color}15)`,
                                                    borderColor: `${info.color}50`
                                                }}
                                            >
                                                <IconComponent
                                                    className="info-icon"
                                                    style={{ color: info.color }}
                                                />
                                            </div>
                                            <div className="info-content">
                                                <h3 className="info-item-title">{info.title}</h3>
                                                <p className="info-item-content">{info.content}</p>
                                            </div>
                                        </motion.a>
                                    );
                                })}
                            </div>

                            <div className="social-section">
                                <h3 className="social-title">Follow Us</h3>
                                <div className="social-links">
                                    {socialLinks.map((social, index) => {
                                        const IconComponent = social.icon;
                                        return (
                                            <motion.a
                                                key={index}
                                                href={social.link}
                                                className="social-link"
                                                whileHover={{ scale: 1.1, y: -2 }}
                                                whileTap={{ scale: 0.95 }}
                                                aria-label={social.label}
                                            >
                                                <IconComponent className="social-icon" />
                                            </motion.a>
                                        );
                                    })}
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default ContactPage;
