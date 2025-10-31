import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBatchWeather } from '../store/slices/weatherSlice';
import { fetchFavorites } from '../store/slices/favoritesSlice';
import WeatherCard from '../components/Weather/WeatherCard';
import SearchBar from '../components/Search/SearchBar';
import History from '../components/History/History';
import './Dashboard.css';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector(state => state.auth);
  const { batchWeather, loading, lastFetched } = useSelector(state => state.weather);
  const { items: favorites } = useSelector(state => state.favorites);
  const [defaultCities] = useState([
    { name: 'London', lat: 51.5074, lon: -0.1278 },
    { name: 'New York', lat: 40.7128, lon: -74.0060 },
    { name: 'Tokyo', lat: 35.6762, lon: 139.6503 },
    { name: 'Paris', lat: 48.8566, lon: 2.3522 },
  ]);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchFavorites());
    }
  }, [dispatch, isAuthenticated]);

  useEffect(() => {
    const cities = favorites.length > 0 ? favorites : defaultCities;
    dispatch(fetchBatchWeather(cities));

    // Auto-refresh every 60 seconds
    const interval = setInterval(() => {
      dispatch(fetchBatchWeather(cities));
    }, 60000);

    return () => clearInterval(interval);
  }, [dispatch, favorites, defaultCities]);

  const citiesToDisplay = favorites.length > 0 ? favorites : defaultCities;

  return (
    <div className="dashboard">
      <div className="container">
        <div className="dashboard-header">
          <h2>Weather Dashboard</h2>
          <SearchBar />
        </div>

        {lastFetched && (
          <p className="last-updated">
            Last updated: {new Date(lastFetched).toLocaleTimeString()}
          </p>
        )}

        <History />

        {loading && batchWeather.length === 0 ? (
          <div className="loading">
            <div className="spinner"></div>
          </div>
        ) : (
          <div className="weather-grid">
            {batchWeather.map((weather, index) => (
              <WeatherCard 
                key={weather.id || index} 
                weather={weather}
                isFavorite={favorites.some(f => f.city === weather.name)}
              />
            ))}
          </div>
        )}

        {!isAuthenticated && (
          <div className="auth-prompt">
            <p>Sign in to save your favorite cities and customize your dashboard</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
