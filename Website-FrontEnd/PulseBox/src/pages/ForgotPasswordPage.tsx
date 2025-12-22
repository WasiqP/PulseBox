import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMail, FiArrowLeft, FiCheckCircle } from 'react-icons/fi';
import ChatAnimation from '../components/ui/ChatAnimation';
import LottieAnimation from '../components/ui/LottieAnimation';
import educationAnimation from '../assets/education.json';
import './AuthPage.css';

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 1500);
  };

  if (isSubmitted) {
    return (
      <div className="auth-shell">
        <div className="auth-card">
          <div className="auth-panel">
            <div className="auth-back-row">
              <Link to="/login" className="auth-back">
                <FiArrowLeft />
                <span>Back to Login</span>
              </Link>
              <div className="auth-logo-inline">Raviro</div>
            </div>
            
            <div className="auth-panel-header">
              <div className="auth-welcome">
                <div className="auth-success-icon">
                  <FiCheckCircle />
                </div>
                <h2 className="auth-title">Check Your Email</h2>
                <p className="auth-greeting">
                  We've sent a password reset link to <strong>{email}</strong>
                </p>
                <p className="auth-subtext">
                  Please check your inbox and click on the link to reset your password. 
                  If you don't see the email, check your spam folder.
                </p>
              </div>
            </div>

            <div className="auth-actions">
              <button 
                type="button" 
                className="auth-cta primary"
                onClick={() => navigate('/login')}
              >
                Back to Login
              </button>
              <button 
                type="button" 
                className="auth-cta secondary"
                onClick={() => {
                  setIsSubmitted(false);
                  setEmail('');
                }}
              >
                Resend Email
              </button>
            </div>

            <div className="auth-switch">
              <span>Remember your password?</span>
              <Link to="/login">Sign in</Link>
            </div>
          </div>

          <div className="auth-hero">
            <div className="auth-hero-card auth-hero-forgot">
              <div className="auth-hero-lottie-background">
                <LottieAnimation animationData={educationAnimation} loop autoplay speed={1} />
              </div>
              <div className="auth-hero-chat-wrapper">
                <ChatAnimation messages={[
                  { id: 1, sender: 'bot', text: 'No worries! We\'ll help you reset your password. 🔐', delay: 500 },
                  { id: 2, sender: 'bot', text: 'Check your email for the reset link.', delay: 2000 },
                  { id: 3, sender: 'bot', text: 'You\'ll be back in no time! ✨', delay: 3500 },
                ]} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <div className="auth-panel">
          <div className="auth-back-row">
            <Link to="/login" className="auth-back">
              <FiArrowLeft />
              <span>Back to Login</span>
            </Link>
            <div className="auth-logo-inline">Raviro</div>
          </div>
          
          <div className="auth-panel-header">
            <div className="auth-welcome">
              <h2 className="auth-title">Forgot Password?</h2>
              <p className="auth-greeting">
                No worries! Enter your email address and we'll send you a link to reset your password.
              </p>
            </div>
          </div>

          <form className="auth-form-compact" onSubmit={handleSubmit}>
            <label htmlFor="email">Email Address</label>
            <div className="auth-input">
              <FiMail />
              <input 
                id="email" 
                name="email" 
                type="email" 
                placeholder="your.email@example.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
                disabled={isLoading}
              />
            </div>
            <button 
              type="submit" 
              className="auth-cta primary"
              disabled={isLoading}
            >
              {isLoading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>

          <div className="auth-switch">
            <span>Remember your password?</span>
            <Link to="/login">Sign in</Link>
          </div>

          <p className="auth-legal">
            By requesting a password reset, you agree to our terms of service and privacy policy.
          </p>
        </div>

        <div className="auth-hero">
          <div className="auth-hero-card auth-hero-forgot">
            <div className="auth-hero-lottie-background">
              <LottieAnimation animationData={educationAnimation} loop autoplay speed={1} />
            </div>
            <div className="auth-hero-chat-wrapper">
              <ChatAnimation messages={[
                { id: 1, sender: 'bot', text: 'Forgot your password? No problem! 🔐', delay: 500 },
                { id: 2, sender: 'teacher', text: 'I need to reset my password.', delay: 2000 },
                { id: 3, sender: 'bot', text: 'Just enter your email and I\'ll send you a reset link right away!', delay: 3500 },
                { id: 4, sender: 'teacher', text: 'That sounds easy!', delay: 5000 },
                { id: 5, sender: 'bot', text: 'You\'ll be back to teaching in no time! ✨', delay: 6500 },
              ]} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;

