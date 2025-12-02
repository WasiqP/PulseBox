import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              <span className="logo-pulse">Pulse</span>
              <span className="logo-box">Box</span>
            </Link>
            <p className="footer-tagline">
              Your AI Teaching Assistant. Save time, focus on teaching.
            </p>
          </div>

          <div className="footer-links">
            <div className="footer-column">
              <h4 className="footer-title">Product</h4>
              <Link to="/about" className="footer-link">About Us</Link>
              <Link to="/features" className="footer-link">Features</Link>
              <Link to="/pricing" className="footer-link">Pricing</Link>
            </div>

            <div className="footer-column">
              <h4 className="footer-title">Company</h4>
              <Link to="/contact" className="footer-link">Contact</Link>
              <Link to="/blog" className="footer-link">Blog</Link>
              <Link to="/careers" className="footer-link">Careers</Link>
            </div>

            <div className="footer-column">
              <h4 className="footer-title">Legal</h4>
              <Link to="/privacy" className="footer-link">Privacy Policy</Link>
              <Link to="/terms" className="footer-link">Terms of Service</Link>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copyright">
            © {new Date().getFullYear()} PulseBox. All rights reserved.
          </p>
          <div className="footer-social">
            {/* Add social media links here */}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

