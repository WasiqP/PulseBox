import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    FiHome,
    FiFileText,
    FiBarChart2,
    FiSettings,
    FiLogOut,
    FiPlusSquare
} from 'react-icons/fi';
import './Sidebar.css';

const Sidebar = () => {
    const location = useLocation();

    const menuItems = [
        { path: '/app', icon: FiHome, label: 'Overview' },
        { path: '/app/forms', icon: FiFileText, label: 'My Forms' },
        { path: '/app/analytics', icon: FiBarChart2, label: 'Analytics' },
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
                    <button className="create-form-btn">
                        <FiPlusSquare />
                        <span>New Form</span>
                    </button>
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
