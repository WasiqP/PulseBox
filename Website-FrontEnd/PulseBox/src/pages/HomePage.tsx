import { useEffect, useRef, useState } from 'react';
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
import TestimonialsBento from '../components/TestimonialsBento';
import Galaxy from '../components/Galaxy';
import './HomePage.css';

const HomePage = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const statsSectionRef = useRef<HTMLElement | null>(null);
  const [showStatsGalaxy, setShowStatsGalaxy] = useState(false);
  useEffect(() => {
    if (!statsSectionRef.current) return;
    const el = statsSectionRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setShowStatsGalaxy(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

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

  // Timeline-specific animation variants
  const timelineItemVariants: Variants = {
    hidden: { 
      opacity: 0, 
      x: -100,
      scale: 0.8
    },
    visible: { 
      opacity: 1, 
      x: 0,
      scale: 1,
      transition: { 
        duration: 0.8,
        ease: [0.6, -0.05, 0.01, 0.99] as [number, number, number, number],
        staggerChildren: 0.2
      }
    }
  };

  const timelineDotVariants: Variants = {
    hidden: { 
      scale: 0,
      rotate: -180,
      opacity: 0
    },
    visible: { 
      scale: 1,
      rotate: 0,
      opacity: 1,
      transition: { 
        duration: 0.6,
        ease: [0.34, 1.56, 0.64, 1] as [number, number, number, number]
      }
    }
  };

  const timelineContentVariants: Variants = {
    hidden: { 
      opacity: 0,
      y: 30
    },
    visible: { 
      opacity: 1,
      y: 0,
      transition: { 
        duration: 0.6,
        delay: 0.3,
        ease: "easeOut"
      }
    }
  };

  const timelineLineVariants: Variants = {
    hidden: { 
      scaleY: 0,
      opacity: 0
    },
    visible: { 
      scaleY: 1,
      opacity: 1,
      transition: { 
        duration: 0.8,
        ease: "easeInOut"
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
            particleColors={[ '#FFFFFF', '#A060FF', '#FFFFFF', '#8A4DE6' ]}
            particleCount={180}
            particleSpread={8}
            particleBaseSize={140}
            sizeRandomness={0.8}
            speed={0.08}
            moveParticlesOnHover={false}
            alphaParticles={false}
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

          <div className="features-showcase">
            {[
              {
                icon: FiFileText,
                title: 'Custom Forms',
                description: 'Create beautiful forms with multiple question types tailored to your needs.',
                style: 'gradient',
                gradient: 'linear-gradient(135deg, rgba(160, 96, 255, 0.15) 0%, rgba(138, 77, 230, 0.1) 100%)'
              },
              {
                icon: FiBarChart2,
                title: 'Analytics Dashboard',
                description: 'View responses and insights in real-time with our intuitive dashboard.',
                style: 'outlined',
                accent: '#A060FF'
              },
              {
                icon: FiLink,
                title: 'Easy Sharing',
                description: 'Share forms via links or QR codes with just one click.',
                style: 'solid',
                bgColor: '#A060FF'
              },
              {
                icon: FiSmartphone,
                title: 'Mobile & Web',
                description: 'Access your forms and responses from any device, anywhere.',
                style: 'minimal',
                borderStyle: 'dashed'
              },
              {
                icon: FiLock,
                title: 'Secure & Private',
                description: 'Your data is protected with enterprise-grade security.',
                style: 'gradient',
                gradient: 'linear-gradient(135deg, rgba(160, 96, 255, 0.1) 0%, rgba(138, 77, 230, 0.15) 100%)'
              },
              {
                icon: FiZap,
                title: 'Real-time Updates',
                description: 'Get instant notifications when responses are submitted.',
                style: 'highlighted',
                highlight: '#8A4DE6'
              }
            ].map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <motion.div
                  key={index}
                  className={`feature-showcase-card feature-${feature.style}`}
                  variants={fadeInUp}
                  whileHover={{ y: -8, scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    background: feature.gradient || feature.bgColor || 'transparent',
                    borderColor: feature.accent,
                    borderStyle: feature.borderStyle || 'solid',
                    '--highlight-color': feature.highlight
                  } as React.CSSProperties}
                >
                  <div className="feature-showcase-icon">
                    <div className="feature-icon-bg">
                      <IconComponent />
                    </div>
                  </div>
                  <div className="feature-showcase-content">
                    <h3 className="feature-showcase-title">{feature.title}</h3>
                    <p className="feature-showcase-description">{feature.description}</p>
                  </div>
                  <div className="feature-showcase-accent"></div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="stats-section" ref={(el) => { statsSectionRef.current = el; }}>
        <div className="stats-galaxy-background">
          {showStatsGalaxy && (
            <Galaxy
              transparent={false}
              density={1.0}
              starSpeed={0.25}
              speed={0.6}
              glowIntensity={0.3}
              twinkleIntensity={0.25}
              rotationSpeed={0.03}
              mouseInteraction={false}
              mouseRepulsion={false}
              hueShift={270}
              saturation={0.6}
            />
          )}
        </div>
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
            {[
              { number: '10K+', label: 'Active Users' },
              { number: '500K+', label: 'Forms Created' },
              { number: '2M+', label: 'Responses Collected' },
              { number: '98%', label: 'Customer Satisfaction' }
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="stat-item"
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="stat-content">
                  <div className="stat-number">{stat.number}</div>
                  <div className="stat-label">{stat.label}</div>
                </div>
                <div className="stat-divider"></div>
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
          <div className="timeline-container">
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
                  className="timeline-item"
                  variants={timelineItemVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.8, delay: index * 0.3 }}
                >
                  <motion.div 
                    className="timeline-line"
                    variants={timelineLineVariants}
                    style={{ transformOrigin: 'top' }}
                  ></motion.div>
                  <motion.div 
                    className="timeline-dot"
                    variants={timelineDotVariants}
                  >
                    <motion.div 
                      className="timeline-number"
                      initial={{ scale: 0, rotate: -180 }}
                      whileInView={{ scale: 1, rotate: 0 }}
                      viewport={{ once: true }}
                      transition={{ 
                        duration: 0.5, 
                        delay: index * 0.3 + 0.4,
                        ease: [0.34, 1.56, 0.64, 1] as [number, number, number, number]
                      }}
                    >
                      {step.step}
                    </motion.div>
                    <motion.div 
                      className="timeline-icon"
                      initial={{ scale: 0, rotate: 180 }}
                      whileInView={{ scale: 1, rotate: 0 }}
                      viewport={{ once: true }}
                      transition={{ 
                        duration: 0.5, 
                        delay: index * 0.3 + 0.5,
                        ease: [0.34, 1.56, 0.64, 1] as [number, number, number, number]
                      }}
                    >
                      <IconComponent />
                    </motion.div>
                  </motion.div>
                  <motion.div 
                    className="timeline-content"
                    variants={timelineContentVariants}
                  >
                    <motion.h3 
                      className="timeline-title"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ 
                        duration: 0.6, 
                        delay: index * 0.3 + 0.6,
                        ease: "easeOut"
                      }}
                    >
                      {step.title}
                    </motion.h3>
                    <motion.p 
                      className="timeline-description"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ 
                        duration: 0.6, 
                        delay: index * 0.3 + 0.8,
                        ease: "easeOut"
                      }}
                    >
                      {step.description}
                    </motion.p>
                  </motion.div>
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
          <div className="use-cases-masonry">
            {[
              {
                industry: 'E-commerce',
                useCase: 'Product Feedback & Reviews',
                description: 'Collect customer reviews and product feedback to improve your offerings.',
                color: '#A060FF',
                size: 'large'
              },
              {
                industry: 'Healthcare',
                useCase: 'Patient Satisfaction Surveys',
                description: 'Gather patient feedback to enhance care quality and service delivery.',
                color: '#8A4DE6',
                size: 'medium'
              },
              {
                industry: 'Education',
                useCase: 'Course Evaluations',
                description: 'Get student feedback on courses and teaching methods for continuous improvement.',
                color: '#A060FF',
                size: 'medium'
              },
              {
                industry: 'Restaurants',
                useCase: 'Dining Experience Feedback',
                description: 'Understand customer satisfaction and improve your restaurant experience.',
                color: '#8A4DE6',
                size: 'large'
              },
              {
                industry: 'SaaS',
                useCase: 'Feature Requests & NPS',
                description: 'Collect user feedback and measure Net Promoter Score to guide product development.',
                color: '#A060FF',
                size: 'small'
              },
              {
                industry: 'Events',
                useCase: 'Event Feedback Forms',
                description: 'Gather attendee feedback to make your next event even better.',
                color: '#8A4DE6',
                size: 'small'
              }
            ].map((useCase, index) => (
              <motion.div
                key={index}
                className={`use-case-brick use-case-${useCase.size}`}
                variants={fadeInUp}
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.3 }}
                style={{ '--accent-color': useCase.color } as React.CSSProperties}
              >
                <div className="use-case-badge" style={{ backgroundColor: useCase.color }}>
                  {useCase.industry}
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
          <div className="integrations-wall">
            <div className="integrations-scroll">
              {[
                'Slack', 'Google Sheets', 'Zapier', 'Webhook', 'API', 'Email',
                'Slack', 'Google Sheets', 'Zapier', 'Webhook', 'API', 'Email'
              ].map((integration, index) => (
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
          <div className="faq-accordion">
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
            ].map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <motion.div
                  key={index}
                  className={`faq-accordion-item ${isOpen ? 'open' : ''}`}
                  variants={fadeInUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
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
                    animate={{
                      height: isOpen ? 'auto' : 0,
                      opacity: isOpen ? 1 : 0
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <p className="faq-answer">{faq.answer}</p>
                  </motion.div>
                </motion.div>
              );
            })}
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
           Get Started
          </Link>
        </div>
      </motion.section>
    </div>
  );
};

export default HomePage;

