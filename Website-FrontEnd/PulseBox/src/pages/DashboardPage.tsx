import { motion } from 'framer-motion';
import './DashboardPage.css';

const DashboardPage = () => {
  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        <motion.h1 
          className="dashboard-title"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Dashboard
        </motion.h1>
        
        <motion.div 
          className="dashboard-content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <p>Welcome to your PulseBox dashboard! This is where you'll manage your forms and view responses.</p>
          <p style={{ marginTop: '1rem', color: 'rgba(0,0,0,0.6)' }}>
            Form management features will be implemented here.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardPage;

