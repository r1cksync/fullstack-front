import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchHistory = createAsyncThunk(
  'history/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/history');
      return response.data.history;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch history');
    }
  }
);

export const addToHistory = createAsyncThunk(
  'history/add',
  async (city, { rejectWithValue }) => {
    try {
      const response = await api.post('/history', city);
      return response.data.history;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to add to history');
    }
  }
);

export const clearHistory = createAsyncThunk(
  'history/clear',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.delete('/history');
      return response.data.history;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to clear history');
    }
  }
);

const historySlice = createSlice({
  name: 'history',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch History
      .addCase(fetchHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add to History
      .addCase(addToHistory.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      // Clear History
      .addCase(clearHistory.fulfilled, (state, action) => {
        state.items = action.payload;
      });
  },
});

export const { clearError } = historySlice.actions;
export default historySlice.reducer;
