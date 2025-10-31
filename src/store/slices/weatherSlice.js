import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchCurrentWeather = createAsyncThunk(
  'weather/fetchCurrent',
  async ({ city, lat, lon }, { getState, rejectWithValue }) => {
    try {
      const { preferences } = getState().preferences;
      const units = preferences.temperatureUnit === 'fahrenheit' ? 'imperial' : 'metric';
      
      let response;
      if (city) {
        response = await api.get(`/weather/current/${city}`, { params: { units } });
      } else {
        response = await api.get('/weather/current', { params: { lat, lon, units } });
      }
      
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch weather');
    }
  }
);

export const fetchForecast = createAsyncThunk(
  'weather/fetchForecast',
  async ({ city, lat, lon }, { getState, rejectWithValue }) => {
    try {
      const { preferences } = getState().preferences;
      const units = preferences.temperatureUnit === 'fahrenheit' ? 'imperial' : 'metric';
      
      let response;
      if (city) {
        response = await api.get(`/weather/forecast/${city}`, { params: { units } });
      } else {
        response = await api.get('/weather/forecast', { params: { lat, lon, units } });
      }
      
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch forecast');
    }
  }
);

export const searchCities = createAsyncThunk(
  'weather/searchCities',
  async (query, { rejectWithValue }) => {
    try {
      const response = await api.get('/weather/search', { params: { q: query } });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Search failed');
    }
  }
);

export const fetchBatchWeather = createAsyncThunk(
  'weather/fetchBatch',
  async (cities, { getState, rejectWithValue }) => {
    try {
      const { preferences } = getState().preferences;
      const units = preferences.temperatureUnit === 'fahrenheit' ? 'imperial' : 'metric';
      
      const response = await api.post('/weather/batch', 
        { cities },
        { params: { units } }
      );
      
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch batch weather');
    }
  }
);

const weatherSlice = createSlice({
  name: 'weather',
  initialState: {
    currentWeather: null,
    forecast: null,
    batchWeather: [],
    searchResults: [],
    loading: false,
    error: null,
    lastFetched: null,
  },
  reducers: {
    clearCurrentWeather: (state) => {
      state.currentWeather = null;
    },
    clearSearchResults: (state) => {
      state.searchResults = [];
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Current Weather
      .addCase(fetchCurrentWeather.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCurrentWeather.fulfilled, (state, action) => {
        state.loading = false;
        state.currentWeather = action.payload;
        state.lastFetched = new Date().toISOString();
      })
      .addCase(fetchCurrentWeather.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Forecast
      .addCase(fetchForecast.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchForecast.fulfilled, (state, action) => {
        state.loading = false;
        state.forecast = action.payload;
        state.lastFetched = new Date().toISOString();
      })
      .addCase(fetchForecast.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Search Cities
      .addCase(searchCities.fulfilled, (state, action) => {
        state.searchResults = action.payload;
      })
      // Fetch Batch Weather
      .addCase(fetchBatchWeather.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBatchWeather.fulfilled, (state, action) => {
        state.loading = false;
        state.batchWeather = action.payload.results;
        state.lastFetched = new Date().toISOString();
      })
      .addCase(fetchBatchWeather.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCurrentWeather, clearSearchResults, clearError } = weatherSlice.actions;
export default weatherSlice.reducer;
