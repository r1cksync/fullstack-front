import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Header from './components/Layout/Header';
import Dashboard from './pages/Dashboard';
import CityDetail from './pages/CityDetail';
import Settings from './pages/Settings';
import GlobePage from './pages/GlobePage';
import Chatbot from './components/Chatbot/Chatbot';
import { fetchUserData } from './store/slices/authSlice';
import './App.css';

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector(state => state.auth);
  const { preferences } = useSelector(state => state.preferences);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      dispatch(fetchUserData());
    }
  }, [dispatch]);

  // Apply theme to body
  useEffect(() => {
    document.body.className = preferences.theme === 'dark' ? 'dark-theme' : 'light-theme';
  }, [preferences.theme]);

  return (
    <Router>
      <div className="App">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/globe" element={<GlobePage />} />
            <Route path="/city/:cityName" element={<CityDetail />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
        <Chatbot />
      </div>
    </Router>
  );
}

export default App;
