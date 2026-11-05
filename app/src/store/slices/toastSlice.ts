import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastItem {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration?: number;
}

export interface ToastState {
  toasts: ToastItem[];
}

const initialState: ToastState = {
  toasts: [],
};

export const toastSlice = createSlice({
  name: 'toast',
  initialState,
  reducers: {
    addToast: (
      state,
      action: PayloadAction<{
        id?: string;
        type?: ToastType;
        title?: string;
        message: string;
        duration?: number;
      }>
    ) => {
      const id = action.payload.id || `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      // Avoid duplicate messages if already present
      const existing = state.toasts.find((t) => t.message === action.payload.message);
      if (existing) {
        existing.id = id;
        return;
      }

      state.toasts.push({
        id,
        type: action.payload.type || 'info',
        title: action.payload.title,
        message: action.payload.message,
        duration: action.payload.duration ?? 3500,
      });
    },
    removeToast: (state, action: PayloadAction<string>) => {
      state.toasts = state.toasts.filter((t) => t.id !== action.payload);
    },
    clearAllToasts: (state) => {
      state.toasts = [];
    },
  },
});

export const { addToast, removeToast, clearAllToasts } = toastSlice.actions;

export default toastSlice.reducer;
