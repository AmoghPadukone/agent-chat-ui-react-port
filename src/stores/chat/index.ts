/**
 * Main Chat Store
 * Consolidated store for all chat-related state
 * Following Zustand best practices with slices pattern
 */

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { createConfigSlice } from './slices/config';
import { createUISlice } from './slices/ui';
import { createThreadSlice } from './slices/thread';
import { createSyncSlice } from './slices/sync';
import type { ChatStore, ChatStoreOptions } from './types';

/**
 * Create the chat store with all slices and middleware
 * @param options - Store initialization options
 */
export const createChatStore = (options: ChatStoreOptions = {}) => {
  const {
    defaultConfig = {},
    enableUrlSync = true,
    persistToLocalStorage = true,
  } = options;

  return create<ChatStore>()(
    devtools(
      persist(
        (...args) => ({
          // Combine all slices
          ...createConfigSlice(...args),
          ...createUISlice(...args),
          ...createThreadSlice(...args),
          ...createSyncSlice(...args),

          // Initialize with default config
          config: {
            apiUrl: defaultConfig.apiUrl || '',
            assistantId: defaultConfig.assistantId || '',
            apiKey: defaultConfig.apiKey || '',
          },

          // Initialize sync options
          syncOptions: {
            enableUrlSync,
            persistToLocalStorage,
          },
        }),
        {
          name: 'chat-storage',
          // Only persist config (apiUrl, assistantId) - not UI state or threadId
          partialize: (state) =>
            persistToLocalStorage
              ? {
                  config: {
                    apiUrl: state.config.apiUrl,
                    assistantId: state.config.assistantId,
                    // Don't persist apiKey in localStorage for security
                  },
                }
              : {},
        }
      ),
      {
        name: 'ChatStore',
        enabled: process.env.NODE_ENV === 'development',
      }
    )
  );
};

/**
 * Default chat store instance
 * Can be used directly or create custom instances with createChatStore()
 */
export const useChatStore = createChatStore();

// ============================================================================
// Selectors - Use these for optimized component re-renders
// ============================================================================

/**
 * Select only config state
 */
export const useConfig = () => useChatStore((state) => state.config);

/**
 * Select only config actions
 */
export const useConfigActions = () =>
  useChatStore((state) => ({
    setApiUrl: state.setApiUrl,
    setAssistantId: state.setAssistantId,
    setApiKey: state.setApiKey,
    setConfig: state.setConfig,
    hasValidConfig: state.hasValidConfig,
  }));

/**
 * Select only UI state
 */
export const useUIState = () => useChatStore((state) => state.ui);

/**
 * Select only UI actions
 */
export const useUIActions = () =>
  useChatStore((state) => ({
    setChatHistoryOpen: state.setChatHistoryOpen,
    toggleChatHistory: state.toggleChatHistory,
    setHideToolCalls: state.setHideToolCalls,
    toggleHideToolCalls: state.toggleHideToolCalls,
  }));

/**
 * Select only thread state
 */
export const useThreadId = () => useChatStore((state) => state.threadId);

/**
 * Select only thread actions
 */
export const useThreadActions = () =>
  useChatStore((state) => ({
    setThreadId: state.setThreadId,
    clearThread: state.clearThread,
  }));

/**
 * Select sync functions
 */
export const useSyncActions = () =>
  useChatStore((state) => ({
    syncFromUrl: state.syncFromUrl,
    syncToUrl: state.syncToUrl,
    setSyncOptions: state.setSyncOptions,
  }));

// Export types
export type * from './types';

