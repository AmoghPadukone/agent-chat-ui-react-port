/**
 * Config Slice - Manages chat configuration (API URL, Assistant ID, API Key)
 */

import type { StateCreator } from 'zustand';
import type { ChatStore, ConfigSlice } from '../types';

export const createConfigSlice: StateCreator<
  ChatStore,
  [['zustand/persist', unknown]],
  [],
  ConfigSlice
> = (set, get) => ({
  config: {
    apiUrl: '',
    assistantId: '',
    apiKey: '',
  },

  setApiUrl: (apiUrl: string) => {
    set((state) => ({
      config: { ...state.config, apiUrl },
    }));
    // Only sync to URL if enabled
    if (get().syncOptions.enableUrlSync) {
      get().syncToUrl();
    }
  },

  setAssistantId: (assistantId: string) => {
    set((state) => ({
      config: { ...state.config, assistantId },
    }));
    // Only sync to URL if enabled
    if (get().syncOptions.enableUrlSync) {
      get().syncToUrl();
    }
  },

  setApiKey: (apiKey: string) => {
    set((state) => ({
      config: { ...state.config, apiKey },
    }));
    // Note: API key is NOT persisted to localStorage via Zustand persist middleware
    // for security reasons. Store it separately if needed.
    if (typeof window !== 'undefined' && apiKey) {
      window.localStorage.setItem('lg:chat:apiKey', apiKey);
    } else if (typeof window !== 'undefined' && !apiKey) {
      // Remove from localStorage if apiKey is cleared
      window.localStorage.removeItem('lg:chat:apiKey');
    }
  },

  setConfig: (configUpdate) => {
    set((state) => ({
      config: { ...state.config, ...configUpdate },
    }));
    // Only sync to URL if enabled
    if (get().syncOptions.enableUrlSync) {
      get().syncToUrl();
    }
  },

  hasValidConfig: () => {
    const { config } = get();
    return Boolean(config.apiUrl.trim() && config.assistantId.trim());
  },
});

