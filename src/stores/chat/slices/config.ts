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
    get().syncToUrl();
  },

  setAssistantId: (assistantId: string) => {
    set((state) => ({
      config: { ...state.config, assistantId },
    }));
    get().syncToUrl();
  },

  setApiKey: (apiKey: string) => {
    set((state) => ({
      config: { ...state.config, apiKey },
    }));
    // Store API key in localStorage separately for security
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('lg:chat:apiKey', apiKey);
    }
  },

  setConfig: (configUpdate) => {
    set((state) => ({
      config: { ...state.config, ...configUpdate },
    }));
    get().syncToUrl();
  },

  hasValidConfig: () => {
    const { config } = get();
    return Boolean(config.apiUrl.trim() && config.assistantId.trim());
  },
});

