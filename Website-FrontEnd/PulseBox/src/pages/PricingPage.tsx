import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { useRef } from 'react';
import { useInView } from 'framer-motion';
import { FiCheck, FiZap, FiStar, FiTrendingUp } from 'react-icons/fi';
import Button from '../components/ui/Button';
import './PricingPage.css';

interface PricingTier {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  popular?: boolean;
  icon: React.ElementType;
  color: string;
  ctaText: string;
}

const PricingPage = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

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

  const scaleIn: Variants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: [0.6, -0.05, 0.01, 0.99] as [number, number, number, number]
      }
    }
  };

  const pricingTiers: PricingTier[] = [
    {
      name: 'Starter',
      price: 'Free',
      period: 'Forever',
      description: 'Perfect for individual teachers getting started',
      features: [
        'Up to 3 classes',
        'Basic lesson plan generation',
        'Attendance tracking',
        'Quiz creation (up to 10/month)',
        'Student management',
        'Basic analytics',
        'Email support'
      ],
      icon: FiZap,
      color: '#8A4DE6',
      ctaText: 'Get Started Free'
    },
    {
      name: 'Professional',
      price: '$9.99',
      period: 'per month',
      description: 'Best for active teachers managing multiple classes',
      features: [
        'Unlimited classes',
        'Advanced AI lesson planning',
        'Unlimited quizzes & assignments',
        'Advanced analytics & reports',
        'Priority email support',
        'Custom templates',
        'Export & backup data',
        'Integration with Google Classroom'
      ],
      popular: true,
      icon: FiStar,
      color: '#A060FF',
      ctaText: 'Start Free Trial'
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: 'per month',
      description: 'For schools and districts with advanced needs',
      features: [
        'Everything in Professional',
        'Unlimited teachers & students',
        'School-wide analytics dashboard',
        'Custom integrations',
        'Dedicated account manager',
        '24/7 priority support',
        'Advanced security & compliance',
        'Custom training & onboarding',
        'API access'
      ],
      icon: FiTrendingUp,
      color: '#8A4DE6',
      ctaText: 'Contact Sales'
    }
  ];

  return (
    <div className="pricing-page" ref={sectionRef}>
      {/* Hero Section */}
      <motion.section 
        className="pricing-hero"
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={staggerContainer}
      >
        <motion.div className="pricing-badge" variants={fadeInUp}>
          <FiZap className="badge-icon" />
          Simple, Transparent Pricing
        </motion.div>
        <motion.h1 className="pricing-title" variants={fadeInUp}>
          Choose the Perfect <span className="gradient-text">Plan</span> for You
        </motion.h1>
        <motion.p className="pricing-subtitle" variants={fadeInUp}>
          Start free, upgrade as you grow. All plans include our core features with no hidden fees.
        </motion.p>
      </motion.section>

      {/* Pricing Cards */}
      <section className="pricing-cards-section">
        <motion.div 
          className="pricing-cards-container"
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={staggerContainer}
        >
          {pricingTiers.map((tier, index) => {
            const IconComponent = tier.icon;
            return (
              <motion.div
                key={tier.name}
                className={`pricing-card ${tier.popular ? 'popular' : ''}`}
                variants={scaleIn}
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                {tier.popular && (
                  <div className="popular-badge">
                    <FiStar className="popular-icon" />
                    Most Popular
                  </div>
                )}
                
                <div className="card-header">
                  <div 
                    className="card-icon-wrapper"
                    style={{ 
                      background: `linear-gradient(135deg, ${tier.color}25, ${tier.color}15)`,
                      borderColor: `${tier.color}50`
                    }}
                  >
                    <IconComponent 
                      className="card-icon"
                      style={{ color: tier.color }}
                    />
                  </div>
                  <h3 className="card-name">{tier.name}</h3>
                  <p className="card-description">{tier.description}</p>
                </div>

                <div className="card-pricing">
                  <div className="price-wrapper">
                    {tier.price !== 'Free' && tier.price !== 'Custom' && (
                      <span className="price-currency">$</span>
                    )}
                    <span className="price-amount">
                      {tier.price === '$9.99' ? '9.99' : tier.price}
                    </span>
                  </div>
                  <span className="price-period">/{tier.period}</span>
                </div>

                <div className="card-features">
                  {tier.features.map((feature, idx) => (
                    <motion.div
                      key={idx}
                      className="feature-item"
                      initial={{ opacity: 0, x: -20 }}
                      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                      transition={{ delay: 0.3 + (index * 0.1) + (idx * 0.05) }}
                    >
                      <FiCheck className="check-icon" style={{ color: tier.color }} />
                      <span>{feature}</span>
                    </motion.div>
                  ))}
                </div>

                <div className="card-footer">
                  <Button
                    variant={tier.popular ? 'primary' : 'outline'}
                    size="lg"
                    fullWidth
                    style={tier.popular ? {
                      background: `linear-gradient(135deg, ${tier.color}, ${tier.color}CC)`,
                      borderColor: tier.color
                    } : {
                      borderColor: tier.color,
                      color: tier.color
                    }}
                  >
                    {tier.ctaText}
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* FAQ Section */}
      <motion.section 
        className="pricing-faq"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
      >
        <motion.h2 className="faq-title" variants={fadeInUp}>
          Frequently Asked Questions
        </motion.h2>
        <div className="faq-grid">
          <motion.div className="faq-item" variants={fadeInUp}>
            <h3>Can I change plans later?</h3>
            <p>Yes! You can upgrade, downgrade, or cancel your plan at any time. Changes take effect immediately.</p>
          </motion.div>
          <motion.div className="faq-item" variants={fadeInUp}>
            <h3>Is there a free trial?</h3>
            <p>Yes! Professional plan includes a 14-day free trial. No credit card required.</p>
          </motion.div>
          <motion.div className="faq-item" variants={fadeInUp}>
            <h3>What payment methods do you accept?</h3>
            <p>We accept all major credit cards, PayPal, and bank transfers for Enterprise plans.</p>
          </motion.div>
          <motion.div className="faq-item" variants={fadeInUp}>
            <h3>Do you offer discounts for schools?</h3>
            <p>Yes! Contact us for special pricing on Enterprise plans for schools and districts.</p>
          </motion.div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section 
        className="pricing-cta"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeInUp}
      >
        <h2>Still have questions?</h2>
        <p>Our team is here to help you find the perfect plan for your needs.</p>
        <Button variant="primary" size="lg">
          Contact Sales
        </Button>
      </motion.section>
    </div>
  );
};

export default PricingPage;
