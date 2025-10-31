import React from 'react';
import { useSelector } from 'react-redux';
import { getWeatherIcon } from '../../utils/weatherIcons';
import './DailyForecast.css';

const DailyForecast = ({ data }) => {
  const { preferences } = useSelector(state => state.preferences);
  const tempUnit = preferences.temperatureUnit === 'fahrenheit' ? '°F' : '°C';

  // Group by day and get one entry per day
  const dailyData = [];
  const seenDates = new Set();

  data.forEach(item => {
    const date = new Date(item.dt * 1000).toLocaleDateString();
    if (!seenDates.has(date) && dailyData.length < 7) {
      seenDates.add(date);
      dailyData.push(item);
    }
  });

  return (
    <div className="daily-forecast">
      {dailyData.map((day, index) => {
        const date = new Date(day.dt * 1000);
        const dayName = index === 0 ? 'Today' : date.toLocaleDateString('en-US', { weekday: 'short' });
        const fullDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

        return (
          <div key={index} className="daily-item">
            <div className="daily-date">
              <div className="daily-day">{dayName}</div>
              <div className="daily-full-date">{fullDate}</div>
            </div>
            <div className="daily-icon">
              {getWeatherIcon(day.weather[0].main)}
            </div>
            <div className="daily-condition">
              {day.weather[0].description}
            </div>
            <div className="daily-temps">
              <span className="temp-high">{Math.round(day.main.temp_max)}{tempUnit}</span>
              <span className="temp-divider">/</span>
              <span className="temp-low">{Math.round(day.main.temp_min)}{tempUnit}</span>
            </div>
            <div className="daily-details">
              <div className="detail">
                <span>💧 {day.main.humidity}%</span>
              </div>
              <div className="detail">
                <span>💨 {day.wind.speed} m/s</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DailyForecast;
