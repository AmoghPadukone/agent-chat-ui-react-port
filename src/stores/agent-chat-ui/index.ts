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
    initialThreadId,
    enableUrlSync = false,
    syncFromPath = false,
    threadIdPathPattern,
    persistToLocalStorage = false,
  } = options;

  const baseCreator: import('zustand').StateCreator<ChatStore, [], []> = (
    ...args
  ) => ({
    // Combine all slices (cast to any to bridge differing middleware typings)
    ...(createConfigSlice as any)(...args),
    ...(createUISlice as any)(...args),
    ...(createThreadSlice as any)(...args),
    ...(createSyncSlice as any)(...args),

    // Initialize with default config
    config: {
      apiUrl: defaultConfig.apiUrl || '',
      assistantId: defaultConfig.assistantId || '',
      apiKey: defaultConfig.apiKey || '',
    },

    // Initialize thread ID if provided
    threadId: initialThreadId ?? null,

    // Initialize sync options
    syncOptions: {
      enableUrlSync,
      persistToLocalStorage,
      syncFromPath,
      threadIdPathPattern,
    },
  });

  const withDevtools = (config: any) =>
    devtools(config as unknown as import('zustand').StateCreator<
      ChatStore,
      [],
      [["zustand/devtools", never]]
    >, {
      name: 'ChatStore',
      enabled: process.env.NODE_ENV === 'development',
    });

  if (persistToLocalStorage) {
    return create<ChatStore>()(
      withDevtools(
        persist(baseCreator as any, {
          name: 'chat-storage',
          partialize: (state: any) => ({
            config: {
              apiUrl: state.config.apiUrl,
              assistantId: state.config.assistantId,
            },
          }),
        }) as unknown as import('zustand').StateCreator<
          ChatStore,
          [],
          [["zustand/devtools", never]]
        >
      )
    );
  }

  return create<ChatStore>()(
    withDevtools(
      baseCreator as unknown as import('zustand').StateCreator<
        ChatStore,
        [],
        [["zustand/devtools", never]]
      >
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

