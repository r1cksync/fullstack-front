import React from 'react';
import { useSelector } from 'react-redux';
import { getWeatherIcon } from '../../utils/weatherIcons';
import './HourlyForecast.css';

const HourlyForecast = ({ data }) => {
  const { preferences } = useSelector(state => state.preferences);
  const tempUnit = preferences.temperatureUnit === 'fahrenheit' ? '°F' : '°C';

  return (
    <div className="hourly-forecast">
      <div className="hourly-scroll">
        {data.map((hour, index) => (
          <div key={index} className="hourly-item">
            <div className="hourly-time">
              {new Date(hour.dt * 1000).toLocaleTimeString('en-US', {
                hour: 'numeric',
                hour12: true
              })}
            </div>
            <div className="hourly-icon">
              {getWeatherIcon(hour.weather[0].main)}
            </div>
            <div className="hourly-temp">
              {Math.round(hour.main.temp)}{tempUnit}
            </div>
            <div className="hourly-desc">
              {hour.weather[0].main}
            </div>
            <div className="hourly-wind">
              💨 {hour.wind.speed} m/s
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HourlyForecast;
