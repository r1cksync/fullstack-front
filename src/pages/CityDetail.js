import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FiArrowLeft } from 'react-icons/fi';
import { fetchForecast, fetchCurrentWeather } from '../store/slices/weatherSlice';
import { addToHistory } from '../store/slices/historySlice';
import TemperatureChart from '../components/Charts/TemperatureChart';
import HourlyForecast from '../components/Weather/HourlyForecast';
import DailyForecast from '../components/Weather/DailyForecast';
import WeatherStats from '../components/Weather/WeatherStats';
import './CityDetail.css';

const CityDetail = () => {
  const { cityName } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentWeather, forecast, loading } = useSelector(state => state.weather);
  const { isAuthenticated } = useSelector(state => state.auth);

  useEffect(() => {
    dispatch(fetchCurrentWeather({ city: cityName }));
    dispatch(fetchForecast({ city: cityName }));

    // Auto-refresh every 60 seconds
    const interval = setInterval(() => {
      dispatch(fetchCurrentWeather({ city: cityName }));
      dispatch(fetchForecast({ city: cityName }));
    }, 60000);

    return () => clearInterval(interval);
  }, [dispatch, cityName]);

  // Add to history when weather data is loaded
  useEffect(() => {
    if (currentWeather && isAuthenticated) {
      dispatch(addToHistory({
        city: currentWeather.name,
        country: currentWeather.sys.country,
        lat: currentWeather.coord.lat,
        lon: currentWeather.coord.lon,
      }));
    }
  }, [currentWeather, isAuthenticated, dispatch]);

  if (loading && !currentWeather) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="city-detail">
      <div className="container">
        <button className="back-btn" onClick={() => navigate('/')}>
          <FiArrowLeft /> Back to Dashboard
        </button>

        {currentWeather && (
          <>
            <div className="city-header">
              <h1>{currentWeather.name}, {currentWeather.sys.country}</h1>
              <p className="weather-condition">{currentWeather.weather[0].description}</p>
            </div>

            <WeatherStats weather={currentWeather} />

            {forecast && (
              <>
                <section className="chart-section">
                  <h2>Temperature Trends</h2>
                  <TemperatureChart data={forecast.list} />
                </section>

                <section className="forecast-section">
                  <h2>Hourly Forecast</h2>
                  <HourlyForecast data={forecast.list.slice(0, 8)} />
                </section>

                <section className="forecast-section">
                  <h2>7-Day Forecast</h2>
                  <DailyForecast data={forecast.list} />
                </section>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CityDetail;
