import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import weatherReducer from './slices/weatherSlice';
import favoritesReducer from './slices/favoritesSlice';
import preferencesReducer from './slices/preferencesSlice';
import historyReducer from './slices/historySlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    weather: weatherReducer,
    favorites: favoritesReducer,
    preferences: preferencesReducer,
    history: historyReducer,
  },
});

export default store;
