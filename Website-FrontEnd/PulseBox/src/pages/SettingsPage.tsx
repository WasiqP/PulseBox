import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Sidebar from '../components/dashboard/Sidebar';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { FiUser, FiBell, FiLock, FiGlobe } from 'react-icons/fi';
import './DashboardPage.css';

const SettingsPage = () => {
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    attendance: true,
    grades: false,
  });

  const toggleNotification = (key: keyof typeof notifications) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <main className="dashboard-main">
        <div className="dashboard-header">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="dashboard-title">Settings</h1>
            <p className="dashboard-subtitle">Manage your account and preferences</p>
          </motion.div>
        </div>

        <div className="settings-content">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="settings-card" glass={true}>
              <div className="settings-section-header">
                <FiUser />
                <h2 className="settings-section-title">Profile</h2>
              </div>
              <div className="settings-form">
                <div className="form-group">
                  <label>Full Name</label>
                  <input type="text" defaultValue="John Doe" />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" defaultValue="john.doe@school.edu" />
                </div>
                <div className="form-group">
                  <label>School</label>
                  <input type="text" defaultValue="Springfield High School" />
                </div>
                <Button variant="primary" size="md">Save Changes</Button>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="settings-card" glass={true}>
              <div className="settings-section-header">
                <FiBell />
                <h2 className="settings-section-title">Notifications</h2>
              </div>
              <div className="settings-options">
                {Object.entries(notifications).map(([key, value]) => (
                  <div key={key} className="settings-option">
                    <div className="settings-option-info">
                      <span className="settings-option-label">{key.charAt(0).toUpperCase() + key.slice(1)} Notifications</span>
                      <span className="settings-option-desc">Receive {key} notifications</span>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={() => toggleNotification(key as keyof typeof notifications)}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="settings-card" glass={true}>
              <div className="settings-section-header">
                <FiLock />
                <h2 className="settings-section-title">Security</h2>
              </div>
              <div className="settings-actions">
                <Button variant="outline" size="md">Change Password</Button>
                <Button variant="outline" size="md">Two-Factor Authentication</Button>
              </div>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default SettingsPage;

