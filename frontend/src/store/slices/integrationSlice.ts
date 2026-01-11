import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IntegrationsState, Integration } from '@/types';

const initialState: IntegrationsState = {
  integrations: [],
  isLoading: false,
  error: null,
};

const integrationSlice = createSlice({
  name: 'integrations',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    setIntegrations: (state, action: PayloadAction<Integration[]>) => {
      state.integrations = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    addIntegration: (state, action: PayloadAction<Integration>) => {
      state.integrations.push(action.payload);
    },
    updateIntegration: (state, action: PayloadAction<Integration>) => {
      const index = state.integrations.findIndex((i) => i.id === action.payload.id);
      if (index !== -1) {
        state.integrations[index] = action.payload;
      }
    },
    removeIntegration: (state, action: PayloadAction<string>) => {
      state.integrations = state.integrations.filter((i) => i.id !== action.payload);
    },
  },
});

export const {
  setLoading,
  setError,
  setIntegrations,
  addIntegration,
  updateIntegration,
  removeIntegration,
} = integrationSlice.actions;

export default integrationSlice.reducer;
