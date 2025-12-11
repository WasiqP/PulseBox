import React from 'react';
import { motion } from 'framer-motion';
import { FiNavigation, FiList } from 'react-icons/fi';
import './QuestionDisplayMode.css';

interface QuestionDisplayModeProps {
  value: 'single' | 'form';
  onChange: (value: 'single' | 'form') => void;
}

const QuestionDisplayMode: React.FC<QuestionDisplayModeProps> = ({ value, onChange }) => {
  return (
    <div className="question-display-mode-section">
      <div className="section-header">
        <h2 className="section-title">Question Display Mode</h2>
        <p className="section-description">How should questions be presented to students?</p>
      </div>

      <div className="display-mode-row">
        <motion.label 
          className={`display-mode-option ${value === 'single' ? 'selected' : ''}`}
          whileHover={{ scale: 1.02, y: -4 }}
          whileTap={{ scale: 0.98 }}
        >
          <input
            type="radio"
            name="displayMode"
            value="single"
            checked={value === 'single'}
            onChange={() => onChange('single')}
            className="display-mode-radio"
          />
          <div className="display-mode-visual">
            <div className="visual-mockup single-view">
              <div className="mockup-top-bar">
                <div className="mockup-nav-back"></div>
                <div className="mockup-title">Mathematics</div>
                <div className="mockup-badges">
                  <div className="mockup-badge timer">29:56</div>
                  <div className="mockup-badge progress">1/3</div>
                </div>
              </div>
              <div className="mockup-progress-line">
                <div className="mockup-progress-fill" style={{ width: '33%' }}></div>
              </div>
              <div className="mockup-content-area">
                <div className="mockup-q-number">1/3</div>
                <div className="mockup-question-card">
                  <div className="mockup-q-type-badge">Short Text</div>
                  <div className="mockup-q-text-lines">
                    <div className="mockup-line" style={{ width: '85%' }}></div>
                    <div className="mockup-line" style={{ width: '60%' }}></div>
                  </div>
                  <div className="mockup-answer-box"></div>
                </div>
                <div className="mockup-nav-buttons">
                  <div className="mockup-nav-btn prev">Previous</div>
                  <div className="mockup-nav-btn next">Next</div>
                </div>
              </div>
            </div>
          </div>
          <div className="display-mode-label">
            <div className="label-icon">
              <FiNavigation />
            </div>
            <h3>One-by-One</h3>
            <p>Step-by-step navigation</p>
          </div>
        </motion.label>

        <motion.label 
          className={`display-mode-option ${value === 'form' ? 'selected' : ''}`}
          whileHover={{ scale: 1.02, y: -4 }}
          whileTap={{ scale: 0.98 }}
        >
          <input
            type="radio"
            name="displayMode"
            value="form"
            checked={value === 'form'}
            onChange={() => onChange('form')}
            className="display-mode-radio"
          />
          <div className="display-mode-visual">
            <div className="visual-mockup form-view">
              <div className="mockup-top-bar">
                <div className="mockup-nav-back"></div>
                <div className="mockup-title">Mathematics</div>
                <div className="mockup-badges">
                  <div className="mockup-badge progress">3/3</div>
                </div>
              </div>
              <div className="mockup-scroll-area">
                <div className="mockup-form-question">
                  <div className="mockup-q-header">
                    <span className="mockup-q-num">1</span>
                    <span className="mockup-q-type">Short Text</span>
                  </div>
                  <div className="mockup-q-text-line" style={{ width: '75%' }}></div>
                  <div className="mockup-answer-box"></div>
                </div>
                <div className="mockup-form-question">
                  <div className="mockup-q-header">
                    <span className="mockup-q-num">2</span>
                    <span className="mockup-q-type">Multiple Choice</span>
                  </div>
                  <div className="mockup-q-text-line" style={{ width: '80%' }}></div>
                  <div className="mockup-options">
                    <div className="mockup-option"></div>
                    <div className="mockup-option"></div>
                    <div className="mockup-option"></div>
                  </div>
                </div>
                <div className="mockup-form-question">
                  <div className="mockup-q-header">
                    <span className="mockup-q-num">3</span>
                    <span className="mockup-q-type">Long Text</span>
                  </div>
                  <div className="mockup-q-text-line" style={{ width: '70%' }}></div>
                  <div className="mockup-answer-box large"></div>
                </div>
                <div className="mockup-submit-section">
                  <div className="mockup-submit-btn">Submit Task</div>
                </div>
              </div>
            </div>
          </div>
          <div className="display-mode-label">
            <div className="label-icon">
              <FiList />
            </div>
            <h3>Show All</h3>
            <p>Complete form view</p>
          </div>
        </motion.label>
      </div>
    </div>
  );
};

export default QuestionDisplayMode;

