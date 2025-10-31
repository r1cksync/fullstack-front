import React from 'react';
import { useSelector } from 'react-redux';
import { 
  WiThermometer, 
  WiHumidity, 
  WiStrongWind, 
  WiBarometer,
  WiSunrise,
  WiSunset
} from 'react-icons/wi';
import { getWeatherIcon } from '../../utils/weatherIcons';
import './WeatherStats.css';

const WeatherStats = ({ weather }) => {
  const { preferences } = useSelector(state => state.preferences);
  const tempUnit = preferences.temperatureUnit === 'fahrenheit' ? '°F' : '°C';

  const formatTime = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const stats = [
    {
      icon: <WiThermometer size={48} />,
      label: 'Temperature',
      value: `${Math.round(weather.main.temp)}${tempUnit}`,
      subValue: `Feels like ${Math.round(weather.main.feels_like)}${tempUnit}`
    },
    {
      icon: <WiHumidity size={48} />,
      label: 'Humidity',
      value: `${weather.main.humidity}%`,
      subValue: `Dew point: ${Math.round(weather.main.temp - ((100 - weather.main.humidity) / 5))}${tempUnit}`
    },
    {
      icon: <WiStrongWind size={48} />,
      label: 'Wind Speed',
      value: `${weather.wind.speed} m/s`,
      subValue: weather.wind.deg ? `Direction: ${weather.wind.deg}°` : 'Variable'
    },
    {
      icon: <WiBarometer size={48} />,
      label: 'Pressure',
      value: `${weather.main.pressure} hPa`,
      subValue: weather.main.sea_level ? `Sea level: ${weather.main.sea_level} hPa` : ''
    },
    {
      icon: <WiSunrise size={48} />,
      label: 'Sunrise',
      value: formatTime(weather.sys.sunrise),
      subValue: ''
    },
    {
      icon: <WiSunset size={48} />,
      label: 'Sunset',
      value: formatTime(weather.sys.sunset),
      subValue: ''
    }
  ];

  return (
    <div className="weather-stats">
      <div className="main-weather">
        <div className="main-icon">
          {getWeatherIcon(weather.weather[0].main)}
        </div>
        <div className="main-temp">
          {Math.round(weather.main.temp)}
          <span className="temp-unit">{tempUnit}</span>
        </div>
      </div>

      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className="stat-icon">{stat.icon}</div>
            <div className="stat-content">
              <div className="stat-label">{stat.label}</div>
              <div className="stat-value">{stat.value}</div>
              {stat.subValue && <div className="stat-sub">{stat.subValue}</div>}
            </div>
          </div>
        ))}
      </div>

      {weather.visibility && (
        <div className="additional-info">
          <div className="info-item">
            <span className="info-label">Visibility:</span>
            <span className="info-value">{(weather.visibility / 1000).toFixed(1)} km</span>
          </div>
          {weather.clouds && (
            <div className="info-item">
              <span className="info-label">Cloudiness:</span>
              <span className="info-value">{weather.clouds.all}%</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default WeatherStats;
