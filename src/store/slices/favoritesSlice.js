import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchFavorites = createAsyncThunk(
  'favorites/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/favorites');
      return response.data.favorites;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch favorites');
    }
  }
);

export const addFavorite = createAsyncThunk(
  'favorites/add',
  async (city, { rejectWithValue }) => {
    try {
      const response = await api.post('/favorites', city);
      return response.data.favorites;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to add favorite');
    }
  }
);

export const removeFavorite = createAsyncThunk(
  'favorites/remove',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/favorites/${id}`);
      return response.data.favorites;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to remove favorite');
    }
  }
);

const favoritesSlice = createSlice({
  name: 'favorites',
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
      // Fetch Favorites
      .addCase(fetchFavorites.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFavorites.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchFavorites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add Favorite
      .addCase(addFavorite.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(addFavorite.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Remove Favorite
      .addCase(removeFavorite.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(removeFavorite.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearError } = favoritesSlice.actions;
export default favoritesSlice.reducer;
