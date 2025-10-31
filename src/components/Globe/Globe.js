import React, { useState, useEffect, useRef } from 'react';
import Globe from 'react-globe.gl';
import * as THREE from 'three';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FiCloud, FiCloudRain, FiWind, FiX } from 'react-icons/fi';
import './Globe.css';

const WeatherGlobe = () => {
  const globeEl = useRef();
  const navigate = useNavigate();
  const { preferences } = useSelector(state => state.preferences);
  
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Overlay toggles
  const [showClouds, setShowClouds] = useState(true);
  const [showRain, setShowRain] = useState(false);
  const [showWind, setShowWind] = useState(false);

  // Major world cities with coordinates
  const majorCities = [
    { name: 'New York', lat: 40.7128, lng: -74.0060, population: 8336817 },
    { name: 'London', lat: 51.5074, lng: -0.1278, population: 8982000 },
    { name: 'Tokyo', lat: 35.6762, lng: 139.6503, population: 13960000 },
    { name: 'Paris', lat: 48.8566, lng: 2.3522, population: 2161000 },
    { name: 'Dubai', lat: 25.2048, lng: 55.2708, population: 3331420 },
    { name: 'Sydney', lat: -33.8688, lng: 151.2093, population: 5312000 },
    { name: 'Mumbai', lat: 19.0760, lng: 72.8777, population: 20411000 },
    { name: 'Singapore', lat: 1.3521, lng: 103.8198, population: 5686000 },
    { name: 'Los Angeles', lat: 34.0522, lng: -118.2437, population: 3980000 },
    { name: 'Moscow', lat: 55.7558, lng: 37.6173, population: 12506000 },
    { name: 'Beijing', lat: 39.9042, lng: 116.4074, population: 21540000 },
    { name: 'São Paulo', lat: -23.5505, lng: -46.6333, population: 12326000 },
    { name: 'Cairo', lat: 30.0444, lng: 31.2357, population: 20900604 },
    { name: 'Mexico City', lat: 19.4326, lng: -99.1332, population: 21581000 },
    { name: 'Bangkok', lat: 13.7563, lng: 100.5018, population: 10539000 },
    { name: 'Istanbul', lat: 41.0082, lng: 28.9784, population: 15462000 },
    { name: 'Seoul', lat: 37.5665, lng: 126.9780, population: 9776000 },
    { name: 'Delhi', lat: 28.7041, lng: 77.1025, population: 30290000 },
    { name: 'Shanghai', lat: 31.2304, lng: 121.4737, population: 27058000 },
    { name: 'Lagos', lat: 6.5244, lng: 3.3792, population: 14368000 },
    { name: 'Buenos Aires', lat: -34.6037, lng: -58.3816, population: 15154000 },
    { name: 'Los Angeles', lat: 34.0522, lng: -118.2437, population: 3980000 },
    { name: 'Karachi', lat: 24.8607, lng: 67.0011, population: 16093000 },
    { name: 'Dhaka', lat: 23.8103, lng: 90.4125, population: 21006000 },
    { name: 'Toronto', lat: 43.6532, lng: -79.3832, population: 6197000 },
    { name: 'Hong Kong', lat: 22.3193, lng: 114.1694, population: 7482000 },
    { name: 'Berlin', lat: 52.5200, lng: 13.4050, population: 3645000 },
    { name: 'Madrid', lat: 40.4168, lng: -3.7038, population: 6642000 },
    { name: 'Rome', lat: 41.9028, lng: 12.4964, population: 4342000 },
    { name: 'Chicago', lat: 41.8781, lng: -87.6298, population: 2716000 },
  ];

  useEffect(() => {
    setCities(majorCities);
    
    // Auto-rotate globe
    if (globeEl.current) {
      globeEl.current.controls().autoRotate = true;
      globeEl.current.controls().autoRotateSpeed = 0.5;
    }
  }, []);

  // Generate overlay data for weather layers
  const generateCloudData = () => {
    const clouds = [];
    for (let i = 0; i < 400; i++) {
      clouds.push({
        lat: (Math.random() - 0.5) * 180,
        lng: (Math.random() - 0.5) * 360,
        altitude: 0.012 + Math.random() * 0.008,
        size: Math.random() * 1.2 + 0.5
      });
    }
    return clouds;
  };

  const generateRainData = () => {
    const rain = [];
    // Focus rain in typical rainy regions
    for (let i = 0; i < 500; i++) {
      rain.push({
        lat: (Math.random() - 0.5) * 120, // More concentrated near equator
        lng: (Math.random() - 0.5) * 360
      });
    }
    return rain;
  };

  const generateWindData = () => {
    const wind = [];
    // Generate wind pattern arcs
    for (let i = 0; i < 80; i++) {
      const startLat = (Math.random() - 0.5) * 160;
      const startLng = (Math.random() - 0.5) * 360;
      wind.push({
        startLat,
        startLng,
        endLat: startLat + (Math.random() - 0.5) * 30,
        endLng: startLng + (Math.random() - 0.5) * 40
      });
    }
    return wind;
  };

  // Fetch weather data for a city
  const fetchWeatherForCity = async (city) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `http://localhost:5000/api/weather/current/${city.name}`,
        token ? { headers: { Authorization: `Bearer ${token}` } } : {}
      );
      setWeatherData(response.data);
      setSelectedCity(city);
    } catch (error) {
      console.error('Error fetching weather:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle city click on globe
  const handleCityClick = (city) => {
    if (globeEl.current) {
      // Stop auto-rotation when user interacts
      globeEl.current.controls().autoRotate = false;
      
      // Point camera to the city
      globeEl.current.pointOfView(
        {
          lat: city.lat,
          lng: city.lng,
          altitude: 1.5
        },
        1000
      );
    }
    fetchWeatherForCity(city);
  };

  // Navigate to detailed city view
  const handleViewDetails = () => {
    if (selectedCity) {
      navigate(`/city/${selectedCity.name}`);
    }
  };

  // Close popup
  const handleClosePopup = () => {
    setSelectedCity(null);
    setWeatherData(null);
    if (globeEl.current) {
      globeEl.current.controls().autoRotate = true;
    }
  };

  // Get temperature in preferred unit
  const getTemperature = (tempInCelsius) => {
    if (preferences.temperatureUnit === 'fahrenheit') {
      return `${Math.round((tempInCelsius * 9/5) + 32)}°F`;
    }
    return `${Math.round(tempInCelsius)}°C`;
  };

  // Get weather icon
  const getWeatherIcon = (weatherCode) => {
    const code = weatherCode;
    if (code >= 200 && code < 300) return '⛈️';
    if (code >= 300 && code < 400) return '🌦️';
    if (code >= 500 && code < 600) return '🌧️';
    if (code >= 600 && code < 700) return '❄️';
    if (code >= 700 && code < 800) return '🌫️';
    if (code === 800) return '☀️';
    if (code > 800) return '☁️';
    return '🌡️';
  };

  return (
    <div className="globe-container">
      {/* Controls Panel */}
      <div className="globe-controls">
        <h3>Weather Layers</h3>
        <div className="control-group">
          <button
            className={`control-btn ${showClouds ? 'active' : ''}`}
            onClick={() => setShowClouds(!showClouds)}
            title="Toggle cloud layer visualization"
          >
            <FiCloud />
            <span>Clouds</span>
          </button>
          <button
            className={`control-btn ${showRain ? 'active' : ''}`}
            onClick={() => setShowRain(!showRain)}
            title="Toggle rain/precipitation layer"
          >
            <FiCloudRain />
            <span>Rain</span>
          </button>
          <button
            className={`control-btn ${showWind ? 'active' : ''}`}
            onClick={() => setShowWind(!showWind)}
            title="Toggle wind pattern visualization"
          >
            <FiWind />
            <span>Wind</span>
          </button>
        </div>
        <div className="layer-status">
          {showClouds && <div className="status-item">☁️ Clouds: ON</div>}
          {showRain && <div className="status-item">🌧️ Rain: ON</div>}
          {showWind && <div className="status-item">💨 Wind: ON</div>}
          {!showClouds && !showRain && !showWind && (
            <div className="status-item">No layers active</div>
          )}
        </div>
        <div className="globe-hint">
          <p>🌍 Click on any city to see weather</p>
          <p>🖱️ Drag to rotate • Scroll to zoom</p>
        </div>
      </div>

      {/* Globe */}
      <Globe
        ref={globeEl}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
        backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
        
        // Cities as points
        pointsData={cities}
        pointLat="lat"
        pointLng="lng"
        pointColor={() => '#ff6b6b'}
        pointAltitude={0.01}
        pointRadius={(city) => Math.sqrt(city.population) / 1000}
        pointLabel={(city) => `
          <div class="city-label">
            <strong>${city.name}</strong><br/>
            Population: ${(city.population / 1000000).toFixed(1)}M
          </div>
        `}
        onPointClick={handleCityClick}
        
        // Atmosphere
        atmosphereColor={preferences.theme === 'dark' ? '#3a3a52' : '#4a90e2'}
        atmosphereAltitude={0.15}
        
        // Animation
        animateIn={true}
        
        // Cloud layer - white translucent spheres
        customLayerData={showClouds ? generateCloudData() : []}
        customThreeObject={(d) => {
          const obj = new THREE.Mesh(
            new THREE.SphereGeometry(d.size || 0.5, 8, 8),
            new THREE.MeshBasicMaterial({ 
              color: 'white', 
              transparent: true, 
              opacity: 0.6 
            })
          );
          return obj;
        }}
        customThreeObjectUpdate={(obj, d) => {
          if (globeEl.current && d) {
            Object.assign(obj.position, globeEl.current.getCoords(d.lat, d.lng, d.altitude));
          }
        }}
        
        // Rain layer - blue hexagonal bins
        hexBinPointsData={showRain ? generateRainData() : []}
        hexBinPointLat="lat"
        hexBinPointLng="lng"
        hexAltitude={0.02}
        hexTopColor={() => '#4299e1'}
        hexSideColor={() => '#3182ce'}
        hexBinResolution={3}
        hexMargin={0.1}
        enablePointerInteraction={true}
        
        // Wind layer - animated arcs
        arcsData={showWind ? generateWindData() : []}
        arcStartLat="startLat"
        arcStartLng="startLng"
        arcEndLat="endLat"
        arcEndLng="endLng"
        arcColor={() => ['rgba(255, 215, 0, 0.6)', 'rgba(255, 165, 0, 0.3)']}
        arcDashLength={0.4}
        arcDashGap={0.2}
        arcDashAnimateTime={2000}
        arcStroke={0.5}
        arcsTransitionDuration={0}
      />

      {/* Weather Popup */}
      {selectedCity && weatherData && (
        <div className="weather-popup">
          <button className="close-popup" onClick={handleClosePopup}>
            <FiX />
          </button>
          
          <div className="popup-header">
            <h2>{selectedCity.name}</h2>
            <div className="weather-icon-large">
              {getWeatherIcon(weatherData.weather[0].id)}
            </div>
          </div>
          
          <div className="popup-content">
            <div className="temperature-main">
              {getTemperature(weatherData.main.temp)}
            </div>
            <div className="weather-description">
              {weatherData.weather[0].description}
            </div>
            
            <div className="weather-details-grid">
              <div className="detail-item">
                <span className="detail-label">Feels Like</span>
                <span className="detail-value">
                  {getTemperature(weatherData.main.feels_like)}
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Humidity</span>
                <span className="detail-value">{weatherData.main.humidity}%</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Wind Speed</span>
                <span className="detail-value">{weatherData.wind.speed} m/s</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Pressure</span>
                <span className="detail-value">{weatherData.main.pressure} hPa</span>
              </div>
            </div>
            
            <button className="view-details-btn" onClick={handleViewDetails}>
              View Detailed Report →
            </button>
          </div>
        </div>
      )}

      {/* Loading indicator */}
      {loading && (
        <div className="globe-loading">
          <div className="spinner"></div>
          <p>Loading weather data...</p>
        </div>
      )}
    </div>
  );
};

export default WeatherGlobe;
