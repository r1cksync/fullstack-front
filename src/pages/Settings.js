import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { GoogleLogin } from '@react-oauth/google';
import { googleSignIn } from '../store/slices/authSlice';
import { updatePreferences } from '../store/slices/preferencesSlice';
import './Settings.css';

const Settings = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const { preferences } = useSelector(state => state.preferences);

  const handleGoogleSuccess = (credentialResponse) => {
    dispatch(googleSignIn(credentialResponse.credential));
  };

  const handleGoogleError = () => {
    console.error('Login Failed');
  };

  const handleTemperatureUnitChange = (unit) => {
    dispatch(updatePreferences({ temperatureUnit: unit }));
  };

  const handleThemeChange = (theme) => {
    dispatch(updatePreferences({ theme }));
  };

  return (
    <div className="settings">
      <div className="container">
        <h1>Settings</h1>

        {!isAuthenticated ? (
          <div className="settings-section">
            <h2>Authentication</h2>
            <p>Sign in to save your preferences and favorite cities across devices.</p>
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              theme="filled_blue"
              size="large"
              text="signin_with"
            />
          </div>
        ) : (
          <div className="settings-section">
            <h2>Account</h2>
            <div className="user-info">
              <img 
                src={user?.picture || 'https://via.placeholder.com/80'} 
                alt={user?.name}
                className="user-avatar-large"
              />
              <div>
                <h3>{user?.name}</h3>
                <p>{user?.email}</p>
              </div>
            </div>
          </div>
        )}

        <div className="settings-section">
          <h2>Temperature Unit</h2>
          <div className="setting-options">
            <button
              className={`setting-option ${preferences.temperatureUnit === 'celsius' ? 'active' : ''}`}
              onClick={() => handleTemperatureUnitChange('celsius')}
            >
              <div className="option-title">Celsius (°C)</div>
              <div className="option-desc">Metric system</div>
            </button>
            <button
              className={`setting-option ${preferences.temperatureUnit === 'fahrenheit' ? 'active' : ''}`}
              onClick={() => handleTemperatureUnitChange('fahrenheit')}
            >
              <div className="option-title">Fahrenheit (°F)</div>
              <div className="option-desc">Imperial system</div>
            </button>
          </div>
        </div>

        <div className="settings-section">
          <h2>Theme</h2>
          <div className="setting-options">
            <button
              className={`setting-option ${preferences.theme === 'light' ? 'active' : ''}`}
              onClick={() => handleThemeChange('light')}
            >
              <div className="option-title">☀️ Light</div>
              <div className="option-desc">Bright and clean</div>
            </button>
            <button
              className={`setting-option ${preferences.theme === 'dark' ? 'active' : ''}`}
              onClick={() => handleThemeChange('dark')}
            >
              <div className="option-title">🌙 Dark</div>
              <div className="option-desc">Easy on the eyes</div>
            </button>
          </div>
        </div>

        <div className="settings-section">
          <h2>Data Refresh</h2>
          <div className="info-box">
            <p>Weather data automatically refreshes every 60 seconds to ensure you have the most current information.</p>
            <p>All API calls are cached to optimize performance and reduce server load.</p>
          </div>
        </div>

        <div className="settings-section">
          <h2>About</h2>
          <div className="info-box">
            <p><strong>Weather Analytics Dashboard</strong></p>
            <p>Version 1.0.0</p>
            <p>Powered by OpenWeatherMap API</p>
            <p>Built with React, Redux, and Recharts</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
