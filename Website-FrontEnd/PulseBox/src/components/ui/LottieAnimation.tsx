import React, { useRef, useEffect } from 'react';
import Lottie from 'lottie-react';
import type { LottieRefCurrentProps } from 'lottie-react';
import './LottieAnimation.css';

interface LottieAnimationProps {
    animationData: object;
    loop?: boolean;
    autoplay?: boolean;
    speed?: number;
    className?: string;
    style?: React.CSSProperties;
    width?: number | string;
    height?: number | string;
    onComplete?: () => void;
    onLoopComplete?: () => void;
}

/**
 * Reusable Lottie Animation Component
 * 
 * @example
 * import LottieAnimation from './components/ui/LottieAnimation';
 * import myAnimation from './assets/animations/animation.json';
 * 
 * <LottieAnimation
 *   animationData={myAnimation}
 *   width={400}
 *   height={400}
 *   loop={true}
 * />
 */
const LottieAnimation: React.FC<LottieAnimationProps> = ({
    animationData,
    loop = true,
    autoplay = true,
    speed = 1,
    className = '',
    style,
    width,
    height,
    onComplete,
    onLoopComplete
}) => {
    const lottieRef = useRef<LottieRefCurrentProps>(null);
    
    const containerStyle: React.CSSProperties = {
        width: width || '100%',
        height: height || '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...style
    };

    // Set animation speed using ref
    useEffect(() => {
        if (lottieRef.current && speed !== 1) {
            lottieRef.current.setSpeed(speed);
        }
    }, [speed]);

    return (
        <div className={`lottie-animation-wrapper ${className}`} style={containerStyle}>
            <Lottie
                lottieRef={lottieRef}
                animationData={animationData}
                loop={loop}
                autoplay={autoplay}
                style={{ width: '100%', height: '100%' }}
                onComplete={onComplete} 
                onLoopComplete={onLoopComplete}
            />
        </div>
    );
};

export default LottieAnimation;
