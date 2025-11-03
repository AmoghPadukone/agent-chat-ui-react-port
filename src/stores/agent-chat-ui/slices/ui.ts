/**
 * UI Slice - Manages UI state (chat history, tool calls visibility)
 */

import type { StateCreator } from 'zustand';
import type { ChatStore, UISlice } from '../types';

export const createUISlice: StateCreator<
  ChatStore,
  [['zustand/persist', unknown]],
  [],
  UISlice
> = (set, get) => ({
  ui: {
    chatHistoryOpen: false,
    hideToolCalls: false,
  },

  setChatHistoryOpen: (open: boolean) => {
    set((state) => ({
      ui: { ...state.ui, chatHistoryOpen: open },
    }));
    // Only sync to URL if enabled
    if (get().syncOptions.enableUrlSync) {
      get().syncToUrl();
    }
  },

  toggleChatHistory: () => {
    set((state) => ({
      ui: { ...state.ui, chatHistoryOpen: !state.ui.chatHistoryOpen },
    }));
    // Only sync to URL if enabled
    if (get().syncOptions.enableUrlSync) {
      get().syncToUrl();
    }
  },

  setHideToolCalls: (hide: boolean) => {
    set((state) => ({
      ui: { ...state.ui, hideToolCalls: hide },
    }));
    // Only sync to URL if enabled
    if (get().syncOptions.enableUrlSync) {
      get().syncToUrl();
    }
  },

  toggleHideToolCalls: () => {
    set((state) => ({
      ui: { ...state.ui, hideToolCalls: !state.ui.hideToolCalls },
    }));
    // Only sync to URL if enabled
    if (get().syncOptions.enableUrlSync) {
      get().syncToUrl();
    }
  },
});

