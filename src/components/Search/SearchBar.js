import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FiSearch } from 'react-icons/fi';
import { searchCities, clearSearchResults } from '../../store/slices/weatherSlice';
import { fetchCurrentWeather } from '../../store/slices/weatherSlice';
import './SearchBar.css';

const SearchBar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { searchResults } = useSelector(state => state.weather);
  const [query, setQuery] = useState('');
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    if (query.length >= 2) {
      const timeoutId = setTimeout(() => {
        dispatch(searchCities(query));
        setShowResults(true);
      }, 300);

      return () => clearTimeout(timeoutId);
    } else {
      dispatch(clearSearchResults());
      setShowResults(false);
    }
  }, [query, dispatch]);

  const handleSelectCity = (city) => {
    setQuery('');
    setShowResults(false);
    dispatch(clearSearchResults());
    
    // Navigate to city detail page
    navigate(`/city/${city.name}`, { state: { lat: city.lat, lon: city.lon } });
  };

  const handleBlur = () => {
    setTimeout(() => {
      setShowResults(false);
    }, 300);
  };

  return (
    <div className="search-bar">
      <div className="search-input-container">
        <FiSearch className="search-icon" />
        <input
          type="text"
          className="search-input"
          placeholder="Search for a city..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length >= 2 && setShowResults(true)}
          onBlur={handleBlur}
        />
      </div>

      {showResults && searchResults.length > 0 && (
        <div className="search-results">
          {searchResults.map((city, index) => (
            <div
              key={index}
              className="search-result-item"
              onMouseDown={() => handleSelectCity(city)}
            >
              <div className="city-name">
                {city.name}, {city.state && `${city.state}, `}{city.country}
              </div>
              <div className="city-coords">
                {city.lat.toFixed(2)}, {city.lon.toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
