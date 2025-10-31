import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { GoogleLogin } from '@react-oauth/google';
import { FiSettings, FiLogOut, FiGlobe } from 'react-icons/fi';
import { googleSignIn, logout } from '../../store/slices/authSlice';
import './Header.css';

const Header = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector(state => state.auth);

  const handleGoogleSuccess = (credentialResponse) => {
    dispatch(googleSignIn(credentialResponse.credential));
  };

  const handleGoogleError = () => {
    console.error('Login Failed');
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          <h1>🌤️ Weather Dashboard</h1>
        </Link>
        
        <nav className="nav">
          <Link to="/globe" className="nav-link">
            <FiGlobe size={20} />
            <span>Globe View</span>
          </Link>
          
          {isAuthenticated ? (
            <div className="user-menu">
              <img 
                src={user?.picture || 'https://via.placeholder.com/40'} 
                alt={user?.name}
                className="user-avatar"
              />
              <span className="user-name">{user?.name}</span>
              <Link to="/settings" className="icon-btn" title="Settings">
                <FiSettings size={20} />
              </Link>
              <button onClick={handleLogout} className="icon-btn" title="Logout">
                <FiLogOut size={20} />
              </button>
            </div>
          ) : (
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              theme="filled_blue"
              size="large"
              text="signin_with"
            />
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
