import { useState } from 'react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import './ContactPage.css';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
    alert('Thank you for your message! We\'ll get back to you soon.');
    setFormData({ name: '', email: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 60 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  return (
    <div className="contact-page">
      <motion.section 
        className="contact-hero"
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
      >
        <h1 className="contact-title">
          Get in <span className="highlight">Touch</span>
        </h1>
        <p className="contact-subtitle">
          Have a question? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
        </p>
      </motion.section>

      <section className="contact-content">
        <div className="contact-container">
          <motion.div 
            className="contact-form-wrapper"
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
          >
            <form className="contact-form" onSubmit={handleSubmit}>
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
                  placeholder="Your message..."
                />
              </div>

              <button type="submit" className="submit-button">
                Send Message
              </button>
            </form>
          </motion.div>

          <motion.div 
            className="contact-info"
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            transition={{ delay: 0.2 }}
          >
            <div className="info-item">
              <div className="info-icon">📧</div>
              <div>
                <h3>Email</h3>
                <p>support@pulsebox.app</p>
              </div>
            </div>

            <div className="info-item">
              <div className="info-icon">💬</div>
              <div>
                <h3>Chat Support</h3>
                <p>Available 24/7</p>
              </div>
            </div>

            <div className="info-item">
              <div className="info-icon">📱</div>
              <div>
                <h3>Response Time</h3>
                <p>Within 24 hours</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;

