import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchPreferences = createAsyncThunk(
  'preferences/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/preferences');
      return response.data.preferences;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch preferences');
    }
  }
);

export const updatePreferences = createAsyncThunk(
  'preferences/update',
  async (preferences, { rejectWithValue, getState }) => {
    try {
      // Save to localStorage for persistence
      const currentPrefs = getState().preferences.preferences;
      const updatedPrefs = { ...currentPrefs, ...preferences };
      localStorage.setItem('userPreferences', JSON.stringify(updatedPrefs));
      
      // Try to save to backend if authenticated
      try {
        const response = await api.put('/preferences', preferences);
        return response.data.preferences;
      } catch (error) {
        // If not authenticated or error, just return the local preferences
        return updatedPrefs;
      }
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to update preferences');
    }
  }
);

// Load preferences from localStorage
const loadPreferencesFromStorage = () => {
  try {
    const stored = localStorage.getItem('userPreferences');
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Failed to load preferences:', error);
  }
  return {
    temperatureUnit: 'celsius',
    theme: 'light',
  };
};

const preferencesSlice = createSlice({
  name: 'preferences',
  initialState: {
    preferences: loadPreferencesFromStorage(),
    loading: false,
    error: null,
  },
  reducers: {
    setTemperatureUnit: (state, action) => {
      state.preferences.temperatureUnit = action.payload;
    },
    setTheme: (state, action) => {
      state.preferences.theme = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Preferences
      .addCase(fetchPreferences.fulfilled, (state, action) => {
        state.preferences = action.payload;
      })
      // Update Preferences
      .addCase(updatePreferences.fulfilled, (state, action) => {
        state.preferences = action.payload;
      })
      .addCase(updatePreferences.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { setTemperatureUnit, setTheme, clearError } = preferencesSlice.actions;
export default preferencesSlice.reducer;
