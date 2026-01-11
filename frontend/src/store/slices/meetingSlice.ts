import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  MeetingsState,
  Meeting,
  MeetingSummary,
  Transcript,
  ActionItem,
  MeetingStats,
} from '@/types';

const initialState: MeetingsState = {
  meetings: [],
  currentMeeting: null,
  summary: null,
  transcript: null,
  actionItems: [],
  stats: null,
  isLoading: false,
  error: null,
};

const meetingSlice = createSlice({
  name: 'meetings',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    setMeetings: (state, action: PayloadAction<Meeting[]>) => {
      state.meetings = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    addMeeting: (state, action: PayloadAction<Meeting>) => {
      state.meetings.unshift(action.payload);
    },
    updateMeeting: (state, action: PayloadAction<Meeting>) => {
      const index = state.meetings.findIndex((m) => m.id === action.payload.id);
      if (index !== -1) {
        state.meetings[index] = action.payload;
      }
      if (state.currentMeeting?.id === action.payload.id) {
        state.currentMeeting = action.payload;
      }
    },
    removeMeeting: (state, action: PayloadAction<string>) => {
      state.meetings = state.meetings.filter((m) => m.id !== action.payload);
      if (state.currentMeeting?.id === action.payload) {
        state.currentMeeting = null;
      }
    },
    setCurrentMeeting: (state, action: PayloadAction<Meeting | null>) => {
      state.currentMeeting = action.payload;
      state.error = null;
    },
    setSummary: (state, action: PayloadAction<MeetingSummary | null>) => {
      state.summary = action.payload;
    },
    setTranscript: (state, action: PayloadAction<Transcript | null>) => {
      state.transcript = action.payload;
    },
    setActionItems: (state, action: PayloadAction<ActionItem[]>) => {
      state.actionItems = action.payload;
    },
    addActionItem: (state, action: PayloadAction<ActionItem>) => {
      state.actionItems.push(action.payload);
    },
    updateActionItem: (state, action: PayloadAction<ActionItem>) => {
      const index = state.actionItems.findIndex((a) => a.id === action.payload.id);
      if (index !== -1) {
        state.actionItems[index] = action.payload;
      }
    },
    removeActionItem: (state, action: PayloadAction<string>) => {
      state.actionItems = state.actionItems.filter((a) => a.id !== action.payload);
    },
    setStats: (state, action: PayloadAction<MeetingStats>) => {
      state.stats = action.payload;
    },
    clearCurrentMeeting: (state) => {
      state.currentMeeting = null;
      state.summary = null;
      state.transcript = null;
      state.actionItems = [];
    },
  },
});

export const {
  setLoading,
  setError,
  setMeetings,
  addMeeting,
  updateMeeting,
  removeMeeting,
  setCurrentMeeting,
  setSummary,
  setTranscript,
  setActionItems,
  addActionItem,
  updateActionItem,
  removeActionItem,
  setStats,
  clearCurrentMeeting,
} = meetingSlice.actions;

export default meetingSlice.reducer;
