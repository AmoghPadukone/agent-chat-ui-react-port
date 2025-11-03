/**
 * Type definitions for the chat store
 * Following Zustand and TypeScript best practices
 */

// ============================================================================
// Config Slice Types
// ============================================================================

export interface ChatConfig {
  apiUrl: string;
  assistantId: string;
  apiKey: string;
}

export interface ConfigSlice {
  config: ChatConfig;
  setApiUrl: (apiUrl: string) => void;
  setAssistantId: (assistantId: string) => void;
  setApiKey: (apiKey: string) => void;
  setConfig: (config: Partial<ChatConfig>) => void;
  hasValidConfig: () => boolean;
}

// ============================================================================
// UI Slice Types
// ============================================================================

export interface UIState {
  chatHistoryOpen: boolean;
  hideToolCalls: boolean;
}

export interface UISlice {
  ui: UIState;
  setChatHistoryOpen: (open: boolean) => void;
  toggleChatHistory: () => void;
  setHideToolCalls: (hide: boolean) => void;
  toggleHideToolCalls: () => void;
}

// ============================================================================
// Thread Slice Types
// ============================================================================

export interface ThreadSlice {
  threadId: string | null;
  setThreadId: (threadId: string | null) => void;
  clearThread: () => void;
}

// ============================================================================
// Sync Slice Types
// ============================================================================

export interface SyncOptions {
  enableUrlSync: boolean;
  persistToLocalStorage: boolean;
  syncFromPath?: boolean;
  threadIdPathPattern?: string;
}

export interface SyncSlice {
  syncOptions: SyncOptions;
  setSyncOptions: (options: Partial<SyncOptions>) => void;
  syncFromUrl: () => void;
  syncToUrl: () => void;
}

// ============================================================================
// Combined Store Type
// ============================================================================

export type ChatStore = ConfigSlice & UISlice & ThreadSlice & SyncSlice;

// ============================================================================
// Store Creation Options
// ============================================================================

export interface ChatStoreOptions {
  defaultConfig?: Partial<ChatConfig>;
  initialThreadId?: string | null;
  enableUrlSync?: boolean;
  syncFromPath?: boolean;
  threadIdPathPattern?: string;
  persistToLocalStorage?: boolean;
}

