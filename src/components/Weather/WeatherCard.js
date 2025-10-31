import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FiHeart } from 'react-icons/fi';
import { FaHeart } from 'react-icons/fa';
import { addFavorite, removeFavorite } from '../../store/slices/favoritesSlice';
import { getWeatherIcon } from '../../utils/weatherIcons';
import './WeatherCard.css';

const WeatherCard = ({ weather, isFavorite }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector(state => state.auth);
  const { items: favorites } = useSelector(state => state.favorites);
  const { preferences } = useSelector(state => state.preferences);

  const handleCardClick = () => {
    navigate(`/city/${weather.name}`, { state: { weather } });
  };

  const handleFavoriteToggle = async (e) => {
    e.stopPropagation();
    
    if (!isAuthenticated) {
      alert('Please sign in to add favorites');
      return;
    }

    if (isFavorite) {
      const favorite = favorites.find(f => f.city === weather.name);
      if (favorite) {
        dispatch(removeFavorite(favorite._id));
      }
    } else {
      dispatch(addFavorite({
        city: weather.name,
        country: weather.sys.country,
        lat: weather.coord.lat,
        lon: weather.coord.lon,
      }));
    }
  };

  const tempUnit = preferences.temperatureUnit === 'fahrenheit' ? '°F' : '°C';

  return (
    <div className="weather-card" onClick={handleCardClick}>
      <button 
        className="favorite-btn"
        onClick={handleFavoriteToggle}
        title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
      >
        {isFavorite ? <FaHeart color="#ef4444" /> : <FiHeart />}
      </button>

      <div className="weather-main">
        <div className="weather-icon">
          {getWeatherIcon(weather.weather[0].main)}
        </div>
        <div className="temperature">
          <span className="temp-value">{Math.round(weather.main.temp)}</span>
          <span className="temp-unit">{tempUnit}</span>
        </div>
      </div>

      <div className="weather-info">
        <h3>{weather.name}, {weather.sys.country}</h3>
        <p className="weather-desc">{weather.weather[0].description}</p>
        
        <div className="weather-details">
          <div className="detail-item">
            <span className="detail-label">Feels like</span>
            <span className="detail-value">{Math.round(weather.main.feels_like)}{tempUnit}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Humidity</span>
            <span className="detail-value">{weather.main.humidity}%</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Wind</span>
            <span className="detail-value">{weather.wind.speed} m/s</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;
