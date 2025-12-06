import { motion, useInView } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import {
    FiUserPlus,
    FiBookOpen,
    FiCheckCircle,
    FiBarChart2,
    FiZap,
    FiArrowDown,
    FiPlay
} from 'react-icons/fi';
// Import Lottie Animation component
import LottieAnimation from '../ui/LottieAnimation';
// Import Lottie animations
import onboarding01Animation from '../../assets/Online Learning.json';
import onboarding02Animation from '../../assets/Learning.json';
import onboarding03Animation from '../../assets/Finance.json';
import onboarding04Animation from '../../assets/girl studying.json';
// Import onboarding images as fallback (if you want to use static images instead)
// import onboarding01 from '../../assets/onboarding-01.png';
// import onboarding02 from '../../assets/onboarding-02.png';
// import onboarding03 from '../../assets/onboarding-03.png';
// import onboarding04 from '../../assets/onboarding04.png';
import './HowItWorksSection.css';

interface ProcessStep {
    step: number;
    title: string;
    description: string;
    icon: React.ElementType;
    color: string;
    details: string[];
}

// Rocket SVG Component
const RocketIcon = ({ className }: { className?: string }) => (
    <svg
        className={className}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M4.5 16.5c0-1.5.5-3 1.5-4.5L12 4l6 8c1 1.5 1.5 3 1.5 4.5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M12 4v8m0 8v-8"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M8 20l4-4 4 4"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <circle cx="12" cy="8" r="1.5" fill="currentColor" opacity="0.8" />
    </svg>
);

// Step Card Component
interface StepCardProps {
    step: ProcessStep;
    index: number;
    totalSteps: number;
    isActive: boolean;
    setIsActive: (index: number) => void;
    nextStepColor?: string;
    onFirstCardRef?: (el: HTMLDivElement | null) => void;
    onboardingImage?: string; // Image path/URL
    onboardingAnimation?: object; // Lottie animation data
}

const StepCard: React.FC<StepCardProps> = ({ 
    step, 
    index, 
    totalSteps, 
    isActive, 
    setIsActive,
    nextStepColor,
    onFirstCardRef,
    onboardingImage,
    onboardingAnimation
}) => {
    const stepRef = useRef<HTMLDivElement>(null);
    const isStepInView = useInView(stepRef, { once: true, margin: "-150px" });
    const IconComponent = step.icon;
    const isEven = index % 2 === 0;

    const slideInLeft: Variants = {
        hidden: { opacity: 0, x: -80 },
        visible: {
            opacity: 1,
            x: 0,
            transition: {
                duration: 0.7,
                ease: [0.6, -0.05, 0.01, 0.99] as [number, number, number, number]
            }
        }
    };

    const slideInRight: Variants = {
        hidden: { opacity: 0, x: 80 },
        visible: {
            opacity: 1,
            x: 0,
            transition: {
                duration: 0.7,
                ease: [0.6, -0.05, 0.01, 0.99] as [number, number, number, number]
            }
        }
    };

    return (
        <motion.div
            ref={(el) => {
                stepRef.current = el;
                // Set first card ref if this is the first step
                if (index === 0 && onFirstCardRef) {
                    onFirstCardRef(el);
                }
            }}
            className={`process-step-wrapper ${isEven ? 'left' : 'right'}`}
            initial="hidden"
            animate={isStepInView ? "visible" : "hidden"}
            variants={isEven ? slideInLeft : slideInRight}
            onMouseEnter={() => setIsActive(index)}
            onMouseLeave={() => setIsActive(0)}
        >
            <div className="process-step-content">
                {/* Onboarding Animation/Image - on opposite side */}
                {(onboardingAnimation || onboardingImage) && (
                    <motion.div 
                        className={`onboarding-image-wrapper ${isEven ? 'right' : 'left'}`}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={isStepInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                        transition={{ delay: 0.3, duration: 0.6 }}
                    >
                        {onboardingAnimation ? (
                            <LottieAnimation
                                animationData={onboardingAnimation}
                                width="100%"
                                height="100%"
                                loop={true}
                                autoplay={true}
                                speed={1}
                                className="onboarding-lottie"
                            />
                        ) : onboardingImage ? (
                            <img 
                                src={onboardingImage} 
                                alt={`${step.title} illustration`}
                                className="onboarding-image"
                            />
                        ) : null}
                    </motion.div>
                )}
                {/* Step Number Badge */}
                <motion.div 
                    className="step-badge"
                    style={{ 
                        background: `linear-gradient(135deg, ${step.color}, ${step.color}CC)`,
                        boxShadow: `0 8px 32px ${step.color}40`
                    }}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                >
                    <span className="step-number">{step.step}</span>
                </motion.div>

                {/* Main Content Card */}
                <motion.div 
                    className={`process-card ${isActive ? 'active' : ''}`}
                    style={{
                        '--step-color': step.color
                    } as React.CSSProperties}
                    whileHover={{ scale: 1.02, y: -5 }}
                >
                    <div 
                        className="process-card-glow"
                        style={{ background: `${step.color}20` }}
                    ></div>
                    
                    <div className="process-card-header">
                        <div 
                            className="process-icon-wrapper"
                            style={{ 
                                background: `linear-gradient(135deg, ${step.color}25, ${step.color}15)`,
                                borderColor: `${step.color}50`
                            }}
                        >
                            <IconComponent 
                                className="process-icon"
                                style={{ color: step.color }}
                            />
                        </div>
                        <div className="process-card-title-group">
                            <h3 className="process-card-title">{step.title}</h3>
                            <p className="process-card-description">{step.description}</p>
                        </div>
                    </div>

                    <div className="process-details">
                        {step.details.map((detail, idx) => (
                            <motion.div
                                key={idx}
                                className="process-detail-item"
                                initial={{ opacity: 0, x: -20 }}
                                animate={isActive ? { opacity: 1, x: 0 } : { opacity: 0.6, x: 0 }}
                                transition={{ delay: idx * 0.1 }}
                            >
                                <div 
                                    className="detail-dot"
                                    style={{ background: step.color }}
                                ></div>
                                <span>{detail}</span>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Connector Line */}
            {index < totalSteps - 1 && (
                <motion.div 
                    className="process-connector"
                    initial={{ scaleY: 0, opacity: 0 }}
                    animate={isStepInView ? { scaleY: 1, opacity: 1 } : { scaleY: 0, opacity: 0 }}
                    transition={{ 
                        delay: 0.5 + (index * 0.2),
                        duration: 0.8
                    }}
                >
                    <div 
                        className="connector-line"
                        style={{ 
                            background: nextStepColor 
                                ? `linear-gradient(180deg, ${step.color}, ${nextStepColor})`
                                : `linear-gradient(180deg, ${step.color}, ${step.color})`
                        }}
                    ></div>
                    <FiArrowDown className="connector-icon" style={{ color: step.color }} />
                </motion.div>
            )}
        </motion.div>
    );
};

const HowItWorksSection = () => {
    const [activeStep, setActiveStep] = useState<number>(0);
    const sectionRef = useRef<HTMLElement>(null);
    const headerRef = useRef<HTMLDivElement>(null);
    const ctaRef = useRef<HTMLDivElement>(null);
    const firstCardRef = useRef<HTMLDivElement>(null);
    
    const isHeaderInView = useInView(headerRef, { once: true, margin: "-100px" });
    
    // Calculate rocket position based on scroll
    const [rocketY, setRocketY] = useState(400); // Initial fallback position
    const [trailHeight, setTrailHeight] = useState(0);
    const [trailStartY, setTrailStartY] = useState(400); // Initial fallback position
    const [hasLanded, setHasLanded] = useState(false);

    useEffect(() => {
        const updateRocketPosition = () => {
            if (!sectionRef.current || !ctaRef.current) {
                // If refs not ready, use fallback position
                const fallbackY = 400;
                setRocketY(fallbackY);
                setTrailStartY(fallbackY);
                return;
            }

            const section = sectionRef.current;
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const windowHeight = window.innerHeight;
            const scrollPosition = window.scrollY;

            // Calculate when section enters viewport
            const sectionStart = sectionTop - windowHeight;
            const sectionEnd = sectionTop + sectionHeight;
            const scrollProgress = Math.max(0, Math.min(1, 
                (scrollPosition - sectionStart) / (sectionEnd - sectionStart)
            ));

            // Get first card position (starting point) - use fallback if ref not ready
            let firstCardCenter: number;
            if (firstCardRef.current && firstCardRef.current.offsetTop > 0) {
                const firstCardTop = firstCardRef.current.offsetTop - sectionTop;
                firstCardCenter = firstCardTop + (firstCardRef.current.offsetHeight / 2);
            } else {
                // Fallback: position below header (ensure it's visible)
                const headerHeight = headerRef.current?.offsetHeight || 200;
                firstCardCenter = Math.max(400, headerHeight + 250);
            }
            
            // Get CTA position for final resting place
            const ctaTop = ctaRef.current.offsetTop - sectionTop;
            const ctaCenter = ctaTop + (ctaRef.current.offsetHeight / 2);
            
            // Rocket moves from first card center to CTA center
            const startY = firstCardCenter;
            const endY = ctaCenter;
            const maxTravel = endY - startY;
            const currentY = startY + (maxTravel * scrollProgress);
            
            // Check if rocket has reached CTA (landed)
            const landingThreshold = 50; // pixels from CTA center
            const isLanded = Math.abs(currentY - ctaCenter) < landingThreshold && scrollProgress > 0.85;
            
            if (isLanded && !hasLanded) {
                setHasLanded(true);
            } else if (!isLanded && hasLanded) {
                setHasLanded(false);
            }
            
            // Ensure rocket is always visible (minimum 200px from top)
            const visibleY = Math.max(200, currentY);
            setRocketY(visibleY);
            setTrailStartY(Math.max(200, startY));
            setTrailHeight(Math.max(0, visibleY - Math.max(200, startY)));
        };

        window.addEventListener('scroll', updateRocketPosition, { passive: true });
        window.addEventListener('resize', updateRocketPosition);
        
        // Initial update with delay to ensure refs are ready
        const timeoutId = setTimeout(() => {
            updateRocketPosition();
        }, 200);
        updateRocketPosition();

        return () => {
            window.removeEventListener('scroll', updateRocketPosition);
            window.removeEventListener('resize', updateRocketPosition);
            clearTimeout(timeoutId);
        };
    }, [hasLanded]);

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

    const processSteps: ProcessStep[] = [
        {
            step: 1,
            title: 'Get Started',
            description: 'Create your account and set up your teaching profile in under 2 minutes',
            icon: FiUserPlus,
            color: '#A060FF',
            details: [
                'Quick email sign-up',
                'Add your teaching subjects',
                'Import or create classes',
                'Customize preferences'
            ]
        },
        {
            step: 2,
            title: 'Generate with AI',
            description: 'Let AI create comprehensive lesson plans tailored to your needs',
            icon: FiBookOpen,
            color: '#8A4DE6',
            details: [
                'Input subject and topic',
                'AI generates full lesson plan',
                'Customize and refine',
                'Save for future use'
            ]
        },
        {
            step: 3,
            title: 'Manage Daily Tasks',
            description: 'Streamline attendance, assignments, and class management effortlessly',
            icon: FiCheckCircle,
            color: '#A060FF',
            details: [
                'One-tap attendance',
                'Create quizzes instantly',
                'Track student progress',
                'All in one dashboard'
            ]
        },
        {
            step: 4,
            title: 'Analyze & Improve',
            description: 'Gain insights from analytics and improve your teaching outcomes',
            icon: FiBarChart2,
            color: '#8A4DE6',
            details: [
                'View performance metrics',
                'Generate reports',
                'Identify improvement areas',
                'Track student engagement'
            ]
        }
    ];

    return (
        <section ref={sectionRef} className="process-journey">
            <div className="process-background">
                <div className="process-gradient-blob blob-1"></div>
                <div className="process-gradient-blob blob-2"></div>
            </div>

            {/* Rocket Animation */}
            <div className="rocket-container">
                <motion.div
                    className="rocket-trail"
                    style={{
                        top: `${trailStartY}px`,
                        height: `${trailHeight}px`,
                        opacity: trailHeight > 0 ? 0.6 : 0
                    }}
                >
                    <div className="trail-line"></div>
                </motion.div>
                <motion.div
                    className={`rocket-wrapper ${hasLanded ? 'landed' : ''}`}
                    style={{
                        top: `${rocketY}px`,
                    }}
                    animate={hasLanded ? {
                        scale: [1, 1.2, 1],
                        rotate: 0,
                    } : {
                        rotate: [0, 5, -5, 0],
                    }}
                    transition={hasLanded ? {
                        duration: 0.6,
                        ease: "easeOut"
                    } : {
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                >
                    <div className="rocket-icon">
                        <RocketIcon />
                    </div>
                    {!hasLanded && (
                        <div className="rocket-flame">
                            <div className="flame flame-1"></div>
                            <div className="flame flame-2"></div>
                            <div className="flame flame-3"></div>
                        </div>
                    )}
                </motion.div>
            </div>

            <motion.div
                className="process-container"
                initial="hidden"
                animate="visible"
            >
                {/* Header */}
                <motion.div 
                    ref={headerRef}
                    className="process-header" 
                    initial="hidden"
                    animate={isHeaderInView ? "visible" : "hidden"}
                    variants={fadeInUp}
                >
                    <motion.span 
                        className="process-badge"
                        variants={fadeInUp}
                    >
                        <FiPlay className="badge-icon" />
                        Your Journey
                    </motion.span>
                    <h2 className="process-title">
                        How PulseBox{' '}
                        <span className="gradient-text">Works</span>
                    </h2>
                    <p className="process-subtitle">
                        Experience the simplicity of AI-powered teaching tools. From setup to success,
                        see how PulseBox transforms your workflow in four seamless steps.
                    </p>
                </motion.div>

                {/* Process Flow */}
                <div className="process-flow">
                    {processSteps.map((step, index) => {
                        // Map Lottie animations
                        const onboardingAnimations = [
                            onboarding01Animation,
                            onboarding02Animation,
                            onboarding03Animation,
                            onboarding04Animation
                        ];
                        const onboardingAnimation = onboardingAnimations[index];
                        
                        // Map onboarding images as fallback (uncomment if you want to use static images)
                        // const onboardingImages: string[] = [
                        //     onboarding01 as string,
                        //     onboarding02 as string,
                        //     onboarding03 as string,
                        //     onboarding04 as string
                        // ];
                        // const onboardingImage = onboardingImages[index];
                        const onboardingImage: string | undefined = undefined; // Using Lottie animations instead
                        
                        return (
                            <StepCard
                                key={index}
                                step={step}
                                index={index}
                                totalSteps={processSteps.length}
                                isActive={activeStep === index}
                                setIsActive={setActiveStep}
                                nextStepColor={index < processSteps.length - 1 ? processSteps[index + 1].color : undefined}
                                onFirstCardRef={index === 0 ? (el) => { firstCardRef.current = el; } : undefined}
                                onboardingImage={onboardingImage}
                                onboardingAnimation={onboardingAnimation}
                            />
                        );
                    })}
                </div>

                {/* Call to Action */}
                <motion.div 
                    ref={ctaRef}
                    className="process-cta"
                    initial="hidden"
                    animate={isHeaderInView ? "visible" : "hidden"}
                    variants={fadeInUp}
                >
                    <div className="cta-content">
                        <FiZap className="cta-icon" />
                        <h3 className="cta-title">Ready to Transform Your Teaching?</h3>
                        <p className="cta-description">
                            Join thousands of educators who've revolutionized their workflow with PulseBox
                        </p>
                    </div>
                </motion.div>
            </motion.div>
        </section>
    );
};

export default HowItWorksSection;
