/**
 * Thread Slice - Manages thread state
 */

import type { StateCreator } from 'zustand';
import type { ChatStore, ThreadSlice } from '../types';

export const createThreadSlice: StateCreator<
  ChatStore,
  [['zustand/persist', unknown]],
  [],
  ThreadSlice
> = (set, get) => ({
  threadId: null,

  setThreadId: (threadId: string | null) => {
    set({ threadId });
    // Only sync to URL if enabled
    if (get().syncOptions.enableUrlSync) {
      get().syncToUrl();
    }
  },

  clearThread: () => {
    set({ threadId: null });
    // Only sync to URL if enabled
    if (get().syncOptions.enableUrlSync) {
      get().syncToUrl();
    }
  },
});

