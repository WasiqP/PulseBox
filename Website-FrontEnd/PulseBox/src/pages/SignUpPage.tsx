import { useState, useCallback, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiEye, FiEyeOff } from 'react-icons/fi';
import Button from '../components/ui/Button';
import Ribbons from '../components/Ribbons';
import './AuthPage.css';

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const formRef = useRef<HTMLFormElement>(null);
  const formContainerRef = useRef<HTMLDivElement>(null);

  // Disable ribbons when mouse is on right container (form side)
  useEffect(() => {
    const formContainer = formContainerRef.current;
    if (!formContainer) return;

    const handleMouseEnter = () => {
      document.body.setAttribute('data-ribbons-disabled', 'true');
    };

    const handleMouseLeave = () => {
      document.body.removeAttribute('data-ribbons-disabled');
    };

    formContainer.addEventListener('mouseenter', handleMouseEnter);
    formContainer.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      formContainer.removeEventListener('mouseenter', handleMouseEnter);
      formContainer.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  // Pause ribbons when inputs are focused
  useEffect(() => {
    const form = formRef.current;
    if (!form) return;

    const handleFocus = () => {
      document.body.setAttribute('data-input-focused', 'true');
    };

    const handleBlur = () => {
      document.body.removeAttribute('data-input-focused');
    };

    const inputs = form.querySelectorAll('input');
    inputs.forEach(input => {
      input.addEventListener('focus', handleFocus);
      input.addEventListener('blur', handleBlur);
    });

    return () => {
      inputs.forEach(input => {
        input.removeEventListener('focus', handleFocus);
        input.removeEventListener('blur', handleBlur);
      });
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log('Signup:', formData);
    setIsLoading(false);
    navigate('/app');
  };

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  return (
    <div className="auth-page">
      {/* Full Screen Ribbons */}
      <div className="auth-ribbons-fullscreen">
        <Ribbons
          baseThickness={30}
          colors={['#A060FF']}
          speedMultiplier={0.5}
          maxAge={500}
          enableFade={false}
          enableShaderEffect={false}
        />
        <Ribbons
          baseThickness={30}
          colors={['#ffffff']}
          speedMultiplier={0.5}
          maxAge={500}
          enableFade={false}
          enableShaderEffect={false}
        />
      </div>
      <div className="auth-container">
        {/* Left Side - Visual */}
        <div className="auth-visual">
          <div className="auth-background-pattern"></div>
          <Link to="/" className="auth-back-button">
            <FiArrowLeft />
            <span>Back to Home</span>
          </Link>
          <motion.div
            className="auth-visual-content"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h2 className="auth-visual-title">Join <span className="auth-brand-highlight">PulseBox</span> Today</h2>
            <p className="auth-visual-text">
              Start saving time, automate admin tasks, and focus on what matters most—teaching.
            </p>
            <div className="auth-features-list">
              <div className="auth-feature-item">
                <div className="auth-feature-icon">✓</div>
                <span>Save 10+ Hours Per Week</span>
              </div>
              <div className="auth-feature-item">
                <div className="auth-feature-icon">✓</div>
                <span>AI Lesson Plan Generator</span>
              </div>
              <div className="auth-feature-item">
                <div className="auth-feature-icon">✓</div>
                <span>Complete Class Management</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Side - Form */}
        <div className="auth-form-container">
          <motion.div
            className="auth-form-wrapper"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="auth-header">
              <Link to="/" className="auth-logo">
                <span className="logo-pulse">Pulse</span>
                <span className="logo-box">Box</span>
              </Link>
              <h1 className="auth-title">Create Account</h1>
              <p className="auth-subtitle">Get started with your free account</p>
            </div>

            <form ref={formRef} className="auth-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="John Doe"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="your.email@example.com"
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <div className="password-input-wrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="Create a password"
                  />
                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <div className="password-input-wrapper">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </div>

              <div className="form-options">
                <label className="checkbox-label">
                  <input type="checkbox" required />
                  <span>I agree to the <Link to="/terms" style={{ color: '#A060FF' }}>Terms</Link> and <Link to="/privacy" style={{ color: '#A060FF' }}>Privacy Policy</Link></span>
                </label>
              </div>

              <Button
                type="submit"
                variant="primary"
                fullWidth
                size="lg"
                isLoading={isLoading}
              >
                Create Account
              </Button>
            </form>

            <p className="auth-footer">
              Already have an account? <Link to="/login">Sign in</Link>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
