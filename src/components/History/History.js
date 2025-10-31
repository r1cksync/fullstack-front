import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FiClock, FiTrash2 } from 'react-icons/fi';
import { fetchHistory, clearHistory } from '../../store/slices/historySlice';
import './History.css';

const History = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector(state => state.auth);
  const { items: history, loading } = useSelector(state => state.history);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchHistory());
    }
  }, [dispatch, isAuthenticated]);

  const handleCityClick = (city) => {
    navigate(`/city/${city.city}`);
  };

  const handleClearHistory = () => {
    if (window.confirm('Are you sure you want to clear your viewing history?')) {
      dispatch(clearHistory());
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  if (history.length === 0) {
    return null;
  }

  return (
    <div className="history-section">
      <div className="history-header">
        <h3>
          <FiClock className="history-icon" />
          Recently Viewed
        </h3>
        <button className="clear-history-btn" onClick={handleClearHistory} title="Clear history">
          <FiTrash2 size={16} />
        </button>
      </div>
      
      <div className="history-list">
        {history.map((item, index) => (
          <div
            key={index}
            className="history-item"
            onClick={() => handleCityClick(item)}
          >
            <div className="history-city-name">
              {item.city}, {item.country}
            </div>
            <div className="history-time">
              {new Date(item.viewedAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: 'numeric',
                minute: '2-digit'
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default History;
