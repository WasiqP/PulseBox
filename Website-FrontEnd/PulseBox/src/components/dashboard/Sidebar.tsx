import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FiHome,
    FiBook,
    FiCalendar,
    FiUsers,
    FiBarChart2,
    FiSettings,
    FiLogOut,
    FiPlusCircle,
    FiFileText,
    FiUser,
    FiEdit,
    FiChevronDown,
    FiChevronUp,
    FiX
} from 'react-icons/fi';
import './Sidebar.css';

const Sidebar = () => {
    const location = useLocation();
    const [isQuickActionsOpen, setIsQuickActionsOpen] = useState(false);

    const menuItems = [
        { path: '/app', icon: FiHome, label: 'Overview' },
        { path: '/app/classes', icon: FiBook, label: 'My Classes' },
        { path: '/app/tasks', icon: FiFileText, label: 'My Tasks' },
        { path: '/app/lesson-plans', icon: FiCalendar, label: 'Lesson Plans' },
        { path: '/app/attendance', icon: FiUsers, label: 'Attendance' },
        { path: '/app/analytics', icon: FiBarChart2, label: 'Analytics' },
        { path: '/app/profile', icon: FiUser, label: 'Profile' },
        { path: '/app/settings', icon: FiSettings, label: 'Settings' },
    ];

    return (
        <motion.aside
            className="sidebar"
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
        >
            <div className="sidebar-header">
                <Link to="/" className="sidebar-logo">
                    <span className="logo-pulse">Pulse</span>
                    <span className="logo-box">Box</span>
                </Link>
            </div>

            <div className="sidebar-content">
                <div className="sidebar-action">
                    <button 
                        className="quick-actions-toggle"
                        onClick={() => setIsQuickActionsOpen(!isQuickActionsOpen)}
                    >
                        <FiPlusCircle />
                        <span>Quick Actions</span>
                        {isQuickActionsOpen ? <FiChevronUp /> : <FiChevronDown />}
                    </button>
                    
                    <AnimatePresence>
                        {isQuickActionsOpen && (
                            <motion.div
                                className="quick-actions-dropdown"
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3, ease: 'easeInOut' }}
                            >
                                <div className="quick-actions-header">
                                    <button 
                                        className="close-actions-btn"
                                        onClick={() => setIsQuickActionsOpen(false)}
                                    >
                                        <FiX />
                                        <span>Close</span>
                                    </button>
                                </div>
                                <div className="quick-actions-list">
                                    <Link 
                                        to="/app/classes/create" 
                                        className="quick-action-item"
                                        onClick={() => setIsQuickActionsOpen(false)}
                                    >
                                        <FiPlusCircle />
                                        <span>Create Class</span>
                                    </Link>
                                    <Link 
                                        to="/app/quizzes/create" 
                                        className="quick-action-item"
                                        onClick={() => setIsQuickActionsOpen(false)}
                                    >
                                        <FiPlusCircle />
                                        <span>Create Quiz</span>
                                    </Link>
                                    <Link 
                                        to="/app/mark-attendance" 
                                        className="quick-action-item"
                                        onClick={() => setIsQuickActionsOpen(false)}
                                    >
                                        <FiUsers />
                                        <span>Mark Attendance</span>
                                    </Link>
                                    <Link 
                                        to="/app/tasks/create" 
                                        className="quick-action-item"
                                        onClick={() => setIsQuickActionsOpen(false)}
                                    >
                                        <FiEdit />
                                        <span>Assign Task</span>
                                    </Link>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <nav className="sidebar-nav">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;

                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`sidebar-link ${isActive ? 'active' : ''}`}
                            >
                                <Icon className="sidebar-icon" />
                                <span className="sidebar-label">{item.label}</span>
                                {isActive && <motion.div className="active-indicator" layoutId="sidebar-active" />}
                            </Link>
                        );
                    })}
                </nav>
            </div>

            <div className="sidebar-footer">
                <button className="logout-btn">
                    <FiLogOut />
                    <span>Log Out</span>
                </button>
            </div>
        </motion.aside>
    );
};

export default Sidebar;
