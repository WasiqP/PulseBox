import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import './AboutPage.css';

const AboutPage = () => {
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
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  return (
    <div className="about-page">
      <motion.section 
        className="about-hero"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        <motion.h1 className="about-title" variants={fadeInUp}>
          About <span className="highlight">PulseBox</span>
        </motion.h1>
        <motion.p className="about-subtitle" variants={fadeInUp}>
          Empowering businesses to collect valuable feedback and make data-driven decisions
        </motion.p>
      </motion.section>

      <section className="about-content">
        <div className="about-container">
          <motion.div 
            className="about-section"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.h2 className="section-heading" variants={fadeInUp}>
              Our Mission
            </motion.h2>
            <motion.p className="section-text" variants={fadeInUp}>
              At PulseBox, we believe that feedback is the foundation of growth. Our mission is to 
              provide businesses with powerful, easy-to-use tools that help them understand their 
              customers better and make informed decisions that drive success.
            </motion.p>
          </motion.div>

          <motion.div 
            className="about-section"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.h2 className="section-heading" variants={fadeInUp}>
              What We Offer
            </motion.h2>
            <motion.div className="features-list" variants={fadeInUp}>
              <div className="feature-item">
                <div className="feature-icon">🎯</div>
                <div>
                  <h3>Easy Form Creation</h3>
                  <p>Create custom forms with drag-and-drop simplicity</p>
                </div>
              </div>
              <div className="feature-item">
                <div className="feature-icon">📊</div>
                <div>
                  <h3>Real-time Analytics</h3>
                  <p>Track responses and insights as they come in</p>
                </div>
              </div>
              <div className="feature-item">
                <div className="feature-icon">🔒</div>
                <div>
                  <h3>Secure & Private</h3>
                  <p>Your data is protected with enterprise-grade security</p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          <motion.div 
            className="about-section"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.h2 className="section-heading" variants={fadeInUp}>
              Why Choose PulseBox?
            </motion.h2>
            <motion.p className="section-text" variants={fadeInUp}>
              We've built PulseBox with one goal in mind: to make feedback collection simple, 
              beautiful, and effective. Whether you're a small business or a large enterprise, 
              our platform scales with you.
            </motion.p>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;

