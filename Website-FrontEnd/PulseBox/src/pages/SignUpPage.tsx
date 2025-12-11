import { Link, useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiUser, FiArrowLeft } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook } from 'react-icons/fa';
import ChatAnimation from '../components/ui/ChatAnimation';
import LottieAnimation from '../components/ui/LottieAnimation';
import chatbotAnimation from '../assets/Chatbot With Character Animation.json';
import './AuthPage.css';

const SignUpPage = () => {
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Navigate to dashboard after signup
    navigate('/app');
  };

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <div className="auth-panel">
          <div className="auth-back-row">
            <Link to="/" className="auth-back">
              <FiArrowLeft />
              <span>Back to Home</span>
            </Link>
            <div className="auth-logo-inline">Raviro</div>
          </div>
          
          <div className="auth-panel-header">
            <div className="auth-welcome">
              <p className="auth-greeting">Create your account to get started.</p>
            </div>
          </div>

          <form className="auth-form-compact" onSubmit={handleSubmit}>
            <label htmlFor="name">Full Name</label>
            <div className="auth-input">
              <FiUser />
              <input id="name" name="name" type="text" placeholder="John Doe" required />
            </div>
            <label htmlFor="email">Email</label>
            <div className="auth-input">
              <FiMail />
              <input id="email" name="email" type="email" placeholder="your.email@example.com" required />
            </div>
            <label htmlFor="password">Password</label>
            <div className="auth-input">
              <FiLock />
              <input id="password" name="password" type="password" placeholder="Create a password" required />
            </div>
            <label htmlFor="confirmPassword">Confirm Password</label>
            <div className="auth-input">
              <FiLock />
              <input id="confirmPassword" name="confirmPassword" type="password" placeholder="Confirm password" required />
            </div>
            <div className="auth-actions-row">
              <label className="auth-checkbox">
                <input type="checkbox" required />
                <span>I agree to the Terms and Privacy Policy</span>
              </label>
            </div>
            <button type="submit" className="auth-cta primary">Sign Up</button>
          </form>

          <div className="auth-divider">
            <span>or</span>
          </div>

          <div className="auth-social-buttons">
            <button type="button" className="auth-social-btn auth-social-google">
              <FcGoogle />
              <span>Sign up with Google</span>
            </button>
            <button type="button" className="auth-social-btn auth-social-facebook">
              <FaFacebook />
              <span>Sign up with Facebook</span>
            </button>
          </div>

          <div className="auth-switch">
            <span>Already with us?</span>
            <Link to="/login">Sign in</Link>
          </div>

          <p className="auth-legal">By creating an account, you agree to our terms of service and privacy policy.</p>
        </div>

        <div className="auth-hero">
          <div className="auth-hero-card auth-hero-signup">
            <div className="auth-hero-lottie-background">
              <LottieAnimation animationData={chatbotAnimation} loop autoplay speed={1} />
            </div>
            <div className="auth-hero-chat-wrapper">
              <ChatAnimation messages={[
                { id: 1, sender: 'bot', text: 'Welcome! 🎉 Ready to start your teaching journey?', delay: 500 },
                    { id: 2, sender: 'teacher', text: 'Yes! I\'m excited to join Raviro.', delay: 2000 },
                { id: 3, sender: 'bot', text: 'Perfect! I\'ll help you create lesson plans, manage classes, and track everything in one place.', delay: 3500 },
                { id: 4, sender: 'teacher', text: 'That\'s exactly what I need! Let\'s get started.', delay: 5000 },
                { id: 5, sender: 'bot', text: 'Awesome! Create your account and I\'ll be your personal teaching assistant. Let\'s make teaching easier! ✨', delay: 6500 },
              ]} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
