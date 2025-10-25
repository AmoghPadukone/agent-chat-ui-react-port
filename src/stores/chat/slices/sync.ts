/**
 * Sync Slice - Manages URL and localStorage synchronization
 */

import type { StateCreator } from 'zustand';
import type { ChatStore, SyncSlice } from '../types';

export const createSyncSlice: StateCreator<
  ChatStore,
  [['zustand/persist', unknown]],
  [],
  SyncSlice
> = (set, get) => ({
  syncOptions: {
    enableUrlSync: true,
    persistToLocalStorage: true,
  },

  setSyncOptions: (options) => {
    set((state) => ({
      syncOptions: { ...state.syncOptions, ...options },
    }));
  },

  syncFromUrl: () => {
    if (typeof window === 'undefined') return;

    const { syncOptions } = get();
    if (!syncOptions.enableUrlSync) return;

    const urlParams = new URLSearchParams(window.location.search);
    const state = get();

    const updates: Partial<ChatStore> = {};

    // Sync config
    const apiUrl = urlParams.get('apiUrl');
    const assistantId = urlParams.get('assistantId');
    if (apiUrl || assistantId) {
      updates.config = {
        ...state.config,
        ...(apiUrl && { apiUrl }),
        ...(assistantId && { assistantId }),
      };
    }

    // Sync thread
    const threadId = urlParams.get('threadId');
    if (threadId !== null) {
      updates.threadId = threadId;
    }

    // Sync UI
    const chatHistoryOpen = urlParams.get('chatHistoryOpen');
    const hideToolCalls = urlParams.get('hideToolCalls');
    if (chatHistoryOpen !== null || hideToolCalls !== null) {
      updates.ui = {
        ...state.ui,
        ...(chatHistoryOpen !== null && { chatHistoryOpen: chatHistoryOpen === 'true' }),
        ...(hideToolCalls !== null && { hideToolCalls: hideToolCalls === 'true' }),
      };
    }

    if (Object.keys(updates).length > 0) {
      set(updates);
    }
  },

  syncToUrl: () => {
    if (typeof window === 'undefined') return;

    const { syncOptions } = get();
    if (!syncOptions.enableUrlSync) return;

    const state = get();
    const urlParams = new URLSearchParams();

    // Sync config
    if (state.config.apiUrl) {
      urlParams.set('apiUrl', state.config.apiUrl);
    }
    if (state.config.assistantId) {
      urlParams.set('assistantId', state.config.assistantId);
    }

    // Sync thread
    if (state.threadId) {
      urlParams.set('threadId', state.threadId);
    }

    // Sync UI (only if true to keep URL clean)
    if (state.ui.chatHistoryOpen) {
      urlParams.set('chatHistoryOpen', 'true');
    }
    if (state.ui.hideToolCalls) {
      urlParams.set('hideToolCalls', 'true');
    }

    const newUrl = `${window.location.pathname}${
      urlParams.toString() ? '?' + urlParams.toString() : ''
    }`;
    window.history.replaceState({}, '', newUrl);
  },
});

