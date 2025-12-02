import React, { useState } from 'react';
import { motion } from 'framer-motion';
import './FAQSection.css';

const FAQSection = () => {
    const [openFaq, setOpenFaq] = useState<number | null>(null);

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

    const faqs = [
        {
            question: 'How secure is my data?',
            answer: 'We use enterprise-grade encryption and security measures to protect your data. All information is stored securely and we comply with GDPR and other data protection regulations.'
        },
        {
            question: 'Can I customize the forms?',
            answer: 'Yes! PulseBox offers extensive customization options including branding, colors, fonts, and layout. You can create forms that perfectly match your brand identity.'
        },
        {
            question: 'What happens to the responses?',
            answer: 'All responses are stored securely in your dashboard. You can view them in real-time, export to CSV or Excel, and set up automated notifications for new submissions.'
        },
        {
            question: 'Is there a free plan?',
            answer: 'Yes! We offer a free plan with basic features. You can upgrade anytime to unlock advanced features like analytics, custom branding, and priority support.'
        },
        {
            question: 'Can I embed forms on my website?',
            answer: 'Absolutely! You can embed forms using our embed code, share via link, or generate QR codes. Forms are mobile-responsive and work on all devices.'
        }
    ];

    return (
        <section className="faq-section">
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
