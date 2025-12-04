import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Sidebar from '../components/dashboard/Sidebar';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useClasses } from '../context/ClassesContext';
import { useAttendance } from '../context/AttendanceContext';
import { 
  FiUser, 
  FiMail, 
  FiPhone, 
  FiMapPin, 
  FiCalendar, 
  FiEdit2,
  FiBook,
  FiUsers,
  FiCheckCircle,
  FiAward,
  FiTrendingUp,
  FiCamera
} from 'react-icons/fi';
import './DashboardPage.css';

const ProfilePage = () => {
  const { classes } = useClasses();
  const { records } = useAttendance();
  
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: 'Dr. Sarah Johnson',
    email: 'sarah.johnson@school.edu',
    phone: '+1 (555) 123-4567',
    location: 'New York, NY',
    bio: 'Experienced educator with 10+ years of teaching Mathematics and Science. Passionate about creating engaging learning experiences for students.',
    joinDate: '2020-09-01',
    department: 'Mathematics & Science',
    education: 'Ph.D. in Mathematics Education',
    specialization: 'Algebra, Calculus, Statistics'
  });

  const totalStudents = classes.reduce((sum, cls) => sum + cls.studentCount, 0);
  const totalClasses = classes.length;
  const totalAttendanceRecords = records.length;
  const recentAttendance = records.filter(r => {
    const recordDate = new Date(r.date);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return recordDate >= weekAgo;
  }).length;

  const stats = [
    { 
      label: 'Total Classes', 
      value: totalClasses.toString(), 
      icon: FiBook, 
      color: '#A060FF',
      description: 'Active classes'
    },
    { 
      label: 'Total Students', 
      value: totalStudents.toString(), 
      icon: FiUsers, 
      color: '#00E4E3',
      description: 'Students enrolled'
    },
    { 
      label: 'Attendance Records', 
      value: totalAttendanceRecords.toString(), 
      icon: FiCheckCircle, 
      color: '#4DFF88',
      description: 'Total records'
    },
    { 
      label: 'This Week', 
      value: recentAttendance.toString(), 
      icon: FiTrendingUp, 
      color: '#FFB84D',
      description: 'Recent records'
    },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = () => {
    // Here you would save to backend/localStorage
    setIsEditing(false);
    alert('Profile updated successfully!');
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
            <h1 className="dashboard-title">My Profile</h1>
            <p className="dashboard-subtitle">Manage your profile information and view your teaching statistics</p>
          </motion.div>
        </div>

        {/* Profile Header Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="profile-header-card" glass={true}>
            <div className="profile-header-content">
              <div className="profile-avatar-section">
                <div className="profile-avatar-large">
                  {profileData.name.charAt(0)}
                </div>
                <button className="avatar-edit-btn" title="Change Profile Picture">
                  <FiCamera />
                </button>
              </div>
              <div className="profile-header-info">
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={profileData.name}
                    onChange={handleInputChange}
                    className="profile-edit-input"
                    placeholder="Full Name"
                  />
                ) : (
                  <h2 className="profile-name">{profileData.name}</h2>
                )}
                <div className="profile-badge">
                  <FiAward />
                  <span>Senior Educator</span>
                </div>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={profileData.email}
                    onChange={handleInputChange}
                    className="profile-edit-input"
                    placeholder="Email Address"
                  />
                ) : (
                  <p className="profile-email">{profileData.email}</p>
                )}
              </div>
              <div className="profile-actions">
                {isEditing ? (
                  <>
                    <Button
                      variant="outline"
                      size="md"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="primary"
                      size="md"
                      onClick={handleSave}
                      leftIcon={<FiEdit2 />}
                    >
                      Save Changes
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="primary"
                    size="md"
                    onClick={() => setIsEditing(true)}
                    leftIcon={<FiEdit2 />}
                  >
                    Edit Profile
                  </Button>
                )}
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Statistics */}
        <motion.div
          className="stats-grid"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="stat-card" glass={true}>
                <div className="stat-icon-wrapper" style={{ background: `${stat.color}20`, color: stat.color }}>
                  <Icon />
                </div>
                <div className="stat-info">
                  <span className="stat-value">{stat.value}</span>
                  <span className="stat-label">{stat.label}</span>
                  <span className="stat-description">{stat.description}</span>
                </div>
              </Card>
            );
          })}
        </motion.div>

        <div className="profile-content-grid">
          {/* Personal Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="profile-info-card" glass={true}>
              <div className="card-header">
                <h3 className="card-title">
                  <FiUser />
                  Personal Information
                </h3>
              </div>
              <div className="profile-info-list">
                <div className="profile-info-item">
                  <div className="info-icon">
                    <FiMail />
                  </div>
                  <div className="info-content">
                    <span className="info-label">Email</span>
                    {isEditing ? (
                      <input
                        type="email"
                        name="email"
                        value={profileData.email}
                        onChange={handleInputChange}
                        className="profile-edit-input"
                      />
                    ) : (
                      <span className="info-value">{profileData.email}</span>
                    )}
                  </div>
                </div>
                <div className="profile-info-item">
                  <div className="info-icon">
                    <FiPhone />
                  </div>
                  <div className="info-content">
                    <span className="info-label">Phone</span>
                    {isEditing ? (
                      <input
                        type="tel"
                        name="phone"
                        value={profileData.phone}
                        onChange={handleInputChange}
                        className="profile-edit-input"
                      />
                    ) : (
                      <span className="info-value">{profileData.phone}</span>
                    )}
                  </div>
                </div>
                <div className="profile-info-item">
                  <div className="info-icon">
                    <FiMapPin />
                  </div>
                  <div className="info-content">
                    <span className="info-label">Location</span>
                    {isEditing ? (
                      <input
                        type="text"
                        name="location"
                        value={profileData.location}
                        onChange={handleInputChange}
                        className="profile-edit-input"
                      />
                    ) : (
                      <span className="info-value">{profileData.location}</span>
                    )}
                  </div>
                </div>
                <div className="profile-info-item">
                  <div className="info-icon">
                    <FiCalendar />
                  </div>
                  <div className="info-content">
                    <span className="info-label">Joined</span>
                    <span className="info-value">
                      {new Date(profileData.joinDate).toLocaleDateString('en-US', {
                        month: 'long',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Professional Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card className="profile-info-card" glass={true}>
              <div className="card-header">
                <h3 className="card-title">
                  <FiAward />
                  Professional Information
                </h3>
              </div>
              <div className="profile-info-list">
                <div className="profile-info-item">
                  <div className="info-icon">
                    <FiBook />
                  </div>
                  <div className="info-content">
                    <span className="info-label">Department</span>
                    {isEditing ? (
                      <input
                        type="text"
                        name="department"
                        value={profileData.department}
                        onChange={handleInputChange}
                        className="profile-edit-input"
                      />
                    ) : (
                      <span className="info-value">{profileData.department}</span>
                    )}
                  </div>
                </div>
                <div className="profile-info-item">
                  <div className="info-icon">
                    <FiAward />
                  </div>
                  <div className="info-content">
                    <span className="info-label">Education</span>
                    {isEditing ? (
                      <input
                        type="text"
                        name="education"
                        value={profileData.education}
                        onChange={handleInputChange}
                        className="profile-edit-input"
                      />
                    ) : (
                      <span className="info-value">{profileData.education}</span>
                    )}
                  </div>
                </div>
                <div className="profile-info-item">
                  <div className="info-icon">
                    <FiTrendingUp />
                  </div>
                  <div className="info-content">
                    <span className="info-label">Specialization</span>
                    {isEditing ? (
                      <input
                        type="text"
                        name="specialization"
                        value={profileData.specialization}
                        onChange={handleInputChange}
                        className="profile-edit-input"
                      />
                    ) : (
                      <span className="info-value">{profileData.specialization}</span>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Bio Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card className="profile-bio-card" glass={true}>
            <div className="card-header">
              <h3 className="card-title">
                <FiUser />
                About Me
              </h3>
            </div>
            {isEditing ? (
              <textarea
                name="bio"
                value={profileData.bio}
                onChange={handleInputChange}
                className="profile-bio-textarea"
                placeholder="Write a brief description about yourself..."
                rows={4}
              />
            ) : (
              <p className="profile-bio-text">{profileData.bio}</p>
            )}
          </Card>
        </motion.div>
      </main>
    </div>
  );
};

export default ProfilePage;

