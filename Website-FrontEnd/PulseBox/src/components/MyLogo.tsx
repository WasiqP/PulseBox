import React from 'react';
import './MyLogo.css';
import { Link } from 'react-router-dom';

const MyLogo = () => {
    return (
        <div className="my-logo">
        <Link to="/" className="navbar-logo">
          {/* <img src={removeBgLogo} alt="Raviro Logo" className="navbar-logo-image" /> */}
          <span className="navbar-brand-text">
            <span className="brand-r">R</span>aviro<span className="brand-dot">.</span>
          </span>
        </Link>
        </div>
    )
}



export default MyLogo;