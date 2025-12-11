import { Link, useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiArrowLeft } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook } from 'react-icons/fa';
import ChatAnimation from '../components/ui/ChatAnimation';
import LottieAnimation from '../components/ui/LottieAnimation';
import educationAnimation from '../assets/education.json';
import './AuthPage.css';

const LoginPage = () => {
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Redirect to dashboard/overview
    navigate('/app');
  };

  const handleSocialLogin = () => {
    // Redirect to dashboard/overview
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
            <div className="auth-logo-inline">PulseBox</div>
          </div>
          
          <div className="auth-panel-header">
            <div className="auth-welcome">
              <p className="auth-greeting">Welcome back! Sign in to continue.</p>
            </div>
          </div>

          <form className="auth-form-compact" onSubmit={handleSubmit}>
            <label htmlFor="email">Email</label>
            <div className="auth-input">
              <FiMail />
              <input id="email" name="email" type="email" placeholder="your.email@example.com" required />
            </div>
            <label htmlFor="password">Password</label>
            <div className="auth-input">
              <FiLock />
              <input id="password" name="password" type="password" placeholder="Enter your password" required />
            </div>
            <div className="auth-actions-row">
              <label className="auth-checkbox">
                <input type="checkbox" />
                <span>Remember me</span>
              </label>
              <Link to="/forgot-password" className="auth-link">Forgot password?</Link>
            </div>
            <button type="submit" className="auth-cta primary">Sign In</button>
          </form>

          <div className="auth-divider">
            <span>or</span>
          </div>

          <div className="auth-social-buttons">
            <button type="button" className="auth-social-btn auth-social-google" onClick={handleSocialLogin}>
              <FcGoogle />
              <span>Sign in with Google</span>
            </button>
            <button type="button" className="auth-social-btn auth-social-facebook" onClick={handleSocialLogin}>
              <FaFacebook />
              <span>Sign in with Facebook</span>
            </button>
          </div>

          <div className="auth-switch">
            <span>New here?</span>
            <Link to="/signup">Create an account</Link>
          </div>

          <p className="auth-legal">By logging in, you agree to our terms of service and privacy policy.</p>
        </div>

        <div className="auth-hero">
          <div className="auth-hero-card auth-hero-login">
            <div className="auth-hero-lottie-background">
              <LottieAnimation animationData={educationAnimation} loop autoplay speed={1} />
            </div>
            <div className="auth-hero-chat-wrapper">
              <ChatAnimation />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
