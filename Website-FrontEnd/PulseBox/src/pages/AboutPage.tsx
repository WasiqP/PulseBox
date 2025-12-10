import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import './AboutPage.css';

const AboutPage = () => {
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
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  return (
    <div className="about-page">
      <motion.section 
        className="about-hero"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        <motion.h1 className="about-title" variants={fadeInUp}>
          About <span className="highlight">Raviro</span>
        </motion.h1>
        <motion.p className="about-subtitle" variants={fadeInUp}>
          Empowering teachers to save time, reduce stress, and focus on what matters most—teaching
        </motion.p>
      </motion.section>

      <section className="about-content">
        <div className="about-container">
          <motion.div 
            className="about-section"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.h2 className="section-heading" variants={fadeInUp}>
              Our Mission
            </motion.h2>
            <motion.p className="section-text" variants={fadeInUp}>
              At Raviro, we understand that teachers are the 2nd most stressed professionals in the world, 
              largely due to overwhelming administrative tasks. Our mission is to provide teachers with an 
              AI-powered personal assistant that automates these tasks, saves 10+ hours per week, and allows 
              educators to focus on what they do best—inspiring and teaching students.
            </motion.p>
          </motion.div>

          <motion.div 
            className="about-section"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.h2 className="section-heading" variants={fadeInUp}>
              What We Offer
            </motion.h2>
            <motion.div className="features-list" variants={fadeInUp}>
              <div className="feature-item">
                <div className="feature-icon">✨</div>
                <div>
                  <h3>AI Lesson Planner</h3>
                  <p>Generate comprehensive lesson plans in seconds with AI assistance</p>
                </div>
              </div>
              <div className="feature-item">
                <div className="feature-icon">📚</div>
                <div>
                  <h3>Class Management</h3>
                  <p>Organize all your classes, students, and schedules in one place</p>
                </div>
              </div>
              <div className="feature-item">
                <div className="feature-icon">✅</div>
                <div>
                  <h3>Quick Attendance</h3>
                  <p>Mark attendance in seconds with our intuitive tap-to-mark system</p>
                </div>
              </div>
              <div className="feature-item">
                <div className="feature-icon">📝</div>
                <div>
                  <h3>Quizzes & Assignments</h3>
                  <p>Create and share quizzes, assignments, and tests effortlessly</p>
                </div>
              </div>
              <div className="feature-item">
                <div className="feature-icon">👥</div>
                <div>
                  <h3>Student Management</h3>
                  <p>Track student progress and manage all your students efficiently</p>
                </div>
              </div>
              <div className="feature-item">
                <div className="feature-icon">🔒</div>
                <div>
                  <h3>Secure & Private</h3>
                  <p>Student data is protected with enterprise-grade security</p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          <motion.div 
            className="about-section"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.h2 className="section-heading" variants={fadeInUp}>
              Why Choose Raviro?
            </motion.h2>
            <motion.p className="section-text" variants={fadeInUp}>
              We've built Raviro specifically for teachers, with one goal in mind: to reduce 
              administrative burden and maximize teaching time. Whether you teach elementary, 
              middle, or high school, whether you have one class or ten, Raviro adapts to your 
              needs. Our AI-powered features automate 70% of admin tasks, saving you 10+ hours 
              per week and allowing you to focus on what truly matters—your students.
            </motion.p>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;

