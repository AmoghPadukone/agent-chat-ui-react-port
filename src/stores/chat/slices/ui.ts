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
    get().syncToUrl();
  },

  toggleChatHistory: () => {
    set((state) => ({
      ui: { ...state.ui, chatHistoryOpen: !state.ui.chatHistoryOpen },
    }));
    get().syncToUrl();
  },

  setHideToolCalls: (hide: boolean) => {
    set((state) => ({
      ui: { ...state.ui, hideToolCalls: hide },
    }));
    get().syncToUrl();
  },

  toggleHideToolCalls: () => {
    set((state) => ({
      ui: { ...state.ui, hideToolCalls: !state.ui.hideToolCalls },
    }));
    get().syncToUrl();
  },
});

