import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import Particles from '../../components/Particles';
import { 
  FiFileText, 
  FiBarChart2, 
  FiLink, 
  FiSmartphone, 
  FiLock, 
  FiZap,
  FiStar,
  FiUpload,
  FiTrendingUp
} from 'react-icons/fi';
import { FaStar } from 'react-icons/fa';
import './HomePage.css';

const HomePage = () => {
  const heroRef = useRef<HTMLDivElement>(null);

  // Animation variants
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
    <div className="homepage">
      {/* Hero Section */}
      <motion.section 
        ref={heroRef}
        className="hero-section"
      >
        {/* Particles Background - Full Coverage */}
        <div className="particles-background" style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}>
          <Particles
            particleColors={['#FFFFFF', '#A060FF', '#FFFFFF', '#8A4DE6']}
            particleBaseSize={200}
            moveParticlesOnHover={true}
            particleHoverFactor={0.5}
          />
        </div>
        
        <motion.div 
          className="hero-background"
        >
          <div className="gradient-orb orb-2"></div>
          <div className="gradient-orb orb-3"></div>
        </motion.div>

        <div className="hero-content">
          <motion.div
            className="hero-text"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.p 
              className="hero-welcome"
              variants={fadeInUp}
            >
              welcome to
            </motion.p>
            
            <motion.h1 
              className="hero-title"
              variants={fadeInUp}
            >
              <span className="brand-pulse">Pulse</span>
              <span className="brand-box">Box</span>
            </motion.h1>
            
            <motion.p 
              className="hero-subtitle"
              variants={fadeInUp}
            >
              Collect feedback & grow your business.
            </motion.p>
            
            <motion.p 
              className="hero-description"
              variants={fadeInUp}
            >
              Create custom forms, gather client insights, and make data-driven decisions to improve your services.
            </motion.p>
            
            <motion.div 
              className="hero-actions"
              variants={fadeInUp}
            >
              <Link to="/signup" className="btn-primary">
                Get Started
              </Link>
              <Link to="/about" className="btn-secondary">
                Learn More
              </Link>
            </motion.div>
          </motion.div>

          <motion.div 
            className="hero-image"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <div className="hero-image-container">
              <div className="hero-logo-placeholder">
                <span className="logo-pulse">Pulse</span>
                <span className="logo-box">Box</span>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Features Section */}
      <section className="features-section">
        <motion.div
          className="features-container"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          <motion.h2 
            className="section-title"
            variants={fadeInUp}
          >
            Powerful Features for Your Business
          </motion.h2>
          
          <motion.p 
            className="section-subtitle"
            variants={fadeInUp}
          >
            Everything you need to collect, analyze, and act on feedback
          </motion.p>

          <div className="features-grid">
            {[
              {
                icon: FiFileText,
                title: 'Custom Forms',
                description: 'Create beautiful forms with multiple question types tailored to your needs.'
              },
              {
                icon: FiBarChart2,
                title: 'Analytics Dashboard',
                description: 'View responses and insights in real-time with our intuitive dashboard.'
              },
              {
                icon: FiLink,
                title: 'Easy Sharing',
                description: 'Share forms via links or QR codes with just one click.'
              },
              {
                icon: FiSmartphone,
                title: 'Mobile & Web',
                description: 'Access your forms and responses from any device, anywhere.'
              },
              {
                icon: FiLock,
                title: 'Secure & Private',
                description: 'Your data is protected with enterprise-grade security.'
              },
              {
                icon: FiZap,
                title: 'Real-time Updates',
                description: 'Get instant notifications when responses are submitted.'
              }
            ].map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <motion.div
                  key={index}
                  className="feature-card"
                  variants={fadeInUp}
                  whileHover={{ y: -10, scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="feature-icon">
                    <IconComponent />
                  </div>
                  <h3 className="feature-title">{feature.title}</h3>
                  <p className="feature-description">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
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
          <div className="stats-grid">
            {[
              { number: '10K+', label: 'Active Users' },
              { number: '500K+', label: 'Forms Created' },
              { number: '2M+', label: 'Responses Collected' },
              { number: '98%', label: 'Customer Satisfaction' }
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="stat-card"
                variants={fadeInUp}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <div className="stat-number">{stat.number}</div>
                <div className="stat-label">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section">
        <motion.div
          className="how-it-works-container"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          <motion.h2 
            className="section-title"
            variants={fadeInUp}
          >
            How It Works
          </motion.h2>
          <motion.p 
            className="section-subtitle"
            variants={fadeInUp}
          >
            Get started in minutes with our simple 3-step process
          </motion.p>
          <div className="steps-container">
            {[
              {
                step: '01',
                title: 'Create Your Form',
                description: 'Use our intuitive form builder to create custom forms with drag-and-drop ease. Choose from multiple question types and customize to match your brand.',
                icon: FiStar
              },
              {
                step: '02',
                title: 'Share & Collect',
                description: 'Share your form via link, QR code, or embed it on your website. Responses are collected automatically and securely stored.',
                icon: FiUpload
              },
              {
                step: '03',
                title: 'Analyze & Act',
                description: 'View real-time analytics, export data, and gain insights to make data-driven decisions that improve your business.',
                icon: FiTrendingUp
              }
            ].map((step, index) => {
              const IconComponent = step.icon;
              return (
                <motion.div
                  key={index}
                  className="step-card"
                  variants={fadeInUp}
                  whileHover={{ y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="step-number">{step.step}</div>
                  <div className="step-icon">
                    <IconComponent />
                  </div>
                  <h3 className="step-title">{step.title}</h3>
                  <p className="step-description">{step.description}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </section>

      {/* Use Cases Section */}
      <section className="use-cases-section">
        <motion.div
          className="use-cases-container"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          <motion.h2 
            className="section-title"
            variants={fadeInUp}
          >
            Perfect for Every Industry
          </motion.h2>
          <motion.p 
            className="section-subtitle"
            variants={fadeInUp}
          >
            See how businesses across industries use PulseBox to grow
          </motion.p>
          <div className="use-cases-grid">
            {[
              {
                industry: 'E-commerce',
                useCase: 'Product Feedback & Reviews',
                description: 'Collect customer reviews and product feedback to improve your offerings.',
                color: '#A060FF'
              },
              {
                industry: 'Healthcare',
                useCase: 'Patient Satisfaction Surveys',
                description: 'Gather patient feedback to enhance care quality and service delivery.',
                color: '#8A4DE6'
              },
              {
                industry: 'Education',
                useCase: 'Course Evaluations',
                description: 'Get student feedback on courses and teaching methods for continuous improvement.',
                color: '#A060FF'
              },
              {
                industry: 'Restaurants',
                useCase: 'Dining Experience Feedback',
                description: 'Understand customer satisfaction and improve your restaurant experience.',
                color: '#8A4DE6'
              },
              {
                industry: 'SaaS',
                useCase: 'Feature Requests & NPS',
                description: 'Collect user feedback and measure Net Promoter Score to guide product development.',
                color: '#A060FF'
              },
              {
                industry: 'Events',
                useCase: 'Event Feedback Forms',
                description: 'Gather attendee feedback to make your next event even better.',
                color: '#8A4DE6'
              }
            ].map((useCase, index) => (
              <motion.div
                key={index}
                className="use-case-card"
                variants={fadeInUp}
                whileHover={{ y: -10, scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <div className="use-case-header">
                  <h3 className="use-case-industry">{useCase.industry}</h3>
                  <div className="use-case-color" style={{ backgroundColor: useCase.color }}></div>
                </div>
                <h4 className="use-case-title">{useCase.useCase}</h4>
                <p className="use-case-description">{useCase.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Testimonials Section */}
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
          <div className="testimonials-grid">
            {[
              {
                name: 'Sarah Johnson',
                role: 'CEO, TechStart Inc.',
                content: 'PulseBox has transformed how we collect customer feedback. The analytics are incredible and the forms are so easy to create.',
                rating: 5
              },
              {
                name: 'Michael Chen',
                role: 'Marketing Director, RetailPlus',
                content: 'The best feedback collection tool we\'ve used. Our response rates increased by 40% since switching to PulseBox.',
                rating: 5
              },
              {
                name: 'Emily Rodriguez',
                role: 'Operations Manager, HealthCare Pro',
                content: 'Simple, powerful, and secure. Exactly what we needed for patient feedback. Highly recommend!',
                rating: 5
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                className="testimonial-card"
                variants={fadeInUp}
                whileHover={{ y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <div className="testimonial-rating">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <FaStar key={i} />
                  ))}
                </div>
                <p className="testimonial-content">"{testimonial.content}"</p>
                <div className="testimonial-author">
                  <div className="testimonial-name">{testimonial.name}</div>
                  <div className="testimonial-role">{testimonial.role}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Integrations Section */}
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
            Seamless Integrations
          </motion.h2>
          <motion.p 
            className="section-subtitle"
            variants={fadeInUp}
          >
            Connect PulseBox with your favorite tools and workflows
          </motion.p>
          <div className="integrations-grid">
            {[
              'Slack', 'Google Sheets', 'Zapier', 'Webhook', 'API', 'Email'
            ].map((integration, index) => (
              <motion.div
                key={index}
                className="integration-card"
                variants={fadeInUp}
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.3 }}
              >
                <div className="integration-name">{integration}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* FAQ Section */}
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
          <div className="faq-list">
            {[
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
            ].map((faq, index) => (
              <motion.div
                key={index}
                className="faq-item"
                variants={fadeInUp}
                whileHover={{ x: 10 }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="faq-question">{faq.question}</h3>
                <p className="faq-answer">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <motion.section 
        className="cta-section"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="cta-container">
          <h2 className="cta-title">Ready to Get Started?</h2>
          <p className="cta-description">
            Join thousands of businesses collecting valuable feedback with PulseBox
          </p>
          <Link to="/signup" className="btn-primary large">
            Start Free Trial
          </Link>
        </div>
      </motion.section>
    </div>
  );
};

export default HomePage;

