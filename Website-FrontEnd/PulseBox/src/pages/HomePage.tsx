import React from 'react';
import HeroSection from '../components/home/HeroSection';
import FeaturesSection from '../components/home/FeaturesSection';
import StatsSection from '../components/home/StatsSection';
import HowItWorksSection from '../components/home/HowItWorksSection';
import UseCasesSection from '../components/home/UseCasesSection';
import TestimonialsSection from '../components/home/TestimonialsSection';
import IntegrationsSection from '../components/home/IntegrationsSection';
import FAQSection from '../components/home/FAQSection';
import './HomePage.css';

const HomePage = () => {
  return (
    <div className="homepage">
      <HeroSection />
      <FeaturesSection />
      <StatsSection />
      <HowItWorksSection />
      <UseCasesSection />
      <TestimonialsSection />
      <IntegrationsSection />
      <FAQSection />
    </div>
  );
};

export default HomePage;
