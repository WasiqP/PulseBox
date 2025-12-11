import { useState } from 'react';
import { motion, type Variants } from 'framer-motion';
import FAQBackground from './FAQBackground';
import './FAQSection.css';

const FAQSection = () => {
    const [openFaq, setOpenFaq] = useState<number | null>(null);

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

    const faqs = [
        {
            question: 'How does the AI Lesson Planner work?',
            answer: 'Simply input your subject, topic, grade level, and duration. Our AI generates comprehensive lesson plans with learning objectives, activities, materials, and assessment suggestions. You can customize and refine the generated plans to match your teaching style.'
        },
        {
            question: 'Can I use PulseBox for multiple classes?',
            answer: 'Yes! PulseBox is designed to handle multiple classes simultaneously. You can organize classes by subject, grade level, or schedule. Each class has its own attendance tracking, student list, and assignment management.'
        },
        {
            question: 'How secure is student data?',
            answer: 'We take data security seriously. All student information is encrypted and stored securely. We comply with educational data protection regulations and ensure your students\' privacy is protected at all times.'
        },
        {
            question: 'Can I use PulseBox on my phone?',
            answer: 'Absolutely! PulseBox is available as a mobile app for iOS and Android, as well as a web application. You can mark attendance, create quizzes, and access your classes from anywhere, anytime.'
        },
        {
            question: 'How much time will PulseBox save me?',
            answer: 'Teachers using PulseBox report saving 10+ hours per week on administrative tasks. The AI lesson planner alone can save 2-3 hours per week, and automated attendance tracking saves additional time every day.'
        }
    ];

    return (
        <section className="faq-section">
            <FAQBackground />
            <motion.div
                className="faq-container"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={staggerContainer}
            >
                <motion.h2
                    className="section-title"
                    variants={fadeInUp}
                >
                    Frequently Asked Questions
                </motion.h2>
                <div className="faq-accordion">
                    {faqs.map((faq, index) => {
                        const isOpen = openFaq === index;
                        return (
                            <motion.div
                                key={index}
                                className={`faq-accordion-item ${isOpen ? 'open' : ''}`}
                                variants={fadeInUp}
                            >
                                <button
                                    className="faq-accordion-header"
                                    onClick={() => setOpenFaq(isOpen ? null : index)}
                                >
                                    <h3 className="faq-question">{faq.question}</h3>
                                    <span className="faq-toggle">{isOpen ? '−' : '+'}</span>
                                </button>
                                <motion.div
                                    className="faq-accordion-content"
                                    initial={false}
                                    animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <p>{faq.answer}</p>
                                </motion.div>
                            </motion.div>
                        );
                    })}
                </div>
            </motion.div>
        </section>
    );
};

export default FAQSection;
