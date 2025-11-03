/**
 * Sync Slice - Manages URL and localStorage synchronization
 */

import type { StateCreator } from 'zustand';
import type { ChatStore, SyncSlice } from '../types';

/**
 * Extract threadId from URL path using a pattern.
 * Supports named parameters and wildcards in path patterns.
 */
function extractThreadIdFromPath(
  pathname: string,
  pattern: string
): string | null {
  try {
    // Convert pattern to regex
    // Replace :paramName with named capture groups
    // Replace * with .+ (match any segment)
    const regexPattern = pattern
      .replace(/:[^/]+/g, (match) => {
        const paramName = match.slice(1); // Remove :
        return `(?<${paramName}>[^/]+)`;
      })
      .replace(/\*/g, '[^/]+');

    const regex = new RegExp(`^${regexPattern}$`);
    const match = pathname.match(regex);

    if (match && match.groups) {
      // Look for threadId in the named groups
      return match.groups.threadId || match.groups.id || null;
    }

    // Fallback: try to extract UUID from end of path if pattern doesn't match
    // Useful for patterns like '/workspaces/*/thread/:threadId'
    const uuidPattern = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i;
    const matches = pathname.match(uuidPattern);
    if (matches && pattern.includes('thread') && pathname.includes('/thread/')) {
      // Extract the UUID after '/thread/'
      const threadIndex = pathname.indexOf('/thread/');
      if (threadIndex !== -1) {
        const afterThread = pathname.slice(threadIndex + '/thread/'.length);
        const uuidMatch = afterThread.match(/^([0-9a-f-]{36})/i);
        return uuidMatch ? uuidMatch[1] : null;
      }
    }

    return null;
  } catch (error) {
    console.error('Error extracting threadId from path:', error);
    return null;
  }
}

export const createSyncSlice: StateCreator<
  ChatStore,
  [['zustand/persist', unknown]],
  [],
  SyncSlice
> = (set, get) => ({
  syncOptions: {
    enableUrlSync: false,
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

    const state = get();
    const updates: Partial<ChatStore> = {};

    // Extract threadId from path or query params
    let threadId: string | null = null;
    
    if (syncOptions.syncFromPath && syncOptions.threadIdPathPattern) {
      // Extract from path using pattern
      threadId = extractThreadIdFromPath(
        window.location.pathname,
        syncOptions.threadIdPathPattern
      );
    } else {
      // Fallback to query params (original behavior)
      const urlParams = new URLSearchParams(window.location.search);
      
      // Sync config from query params
      const apiUrl = urlParams.get('apiUrl');
      const assistantId = urlParams.get('assistantId');
      if (apiUrl || assistantId) {
        updates.config = {
          ...state.config,
          ...(apiUrl && { apiUrl }),
          ...(assistantId && { assistantId }),
        };
      }

      // Sync thread from query params
      threadId = urlParams.get('threadId');

      // Sync UI from query params
      const chatHistoryOpen = urlParams.get('chatHistoryOpen');
      const hideToolCalls = urlParams.get('hideToolCalls');
      if (chatHistoryOpen !== null || hideToolCalls !== null) {
        updates.ui = {
          ...state.ui,
          ...(chatHistoryOpen !== null && { chatHistoryOpen: chatHistoryOpen === 'true' }),
          ...(hideToolCalls !== null && { hideToolCalls: hideToolCalls === 'true' }),
        };
      }
    }

    // Set threadId if found
    if (threadId !== null) {
      updates.threadId = threadId;
    }

    if (Object.keys(updates).length > 0) {
      set(updates);
    }
  },

  syncToUrl: () => {
    if (typeof window === 'undefined') return;

    const { syncOptions } = get();
    if (!syncOptions.enableUrlSync) return;

    // If syncing from path, don't write to URL (let parent app manage it)
    if (syncOptions.syncFromPath) {
      return;
    }

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

