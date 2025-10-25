/**
 * Chat Module - Public API
 * 
 * This module provides a complete chat interface that can be integrated
 * into any React application. It includes:
 * - State management via Zustand
 * - URL synchronization (optional)
 * - localStorage persistence (optional)
 * - LangGraph integration
 * - Full TypeScript support
 * 
 * @example Basic Usage
 * ```tsx
 * import { ChatInterface, useChatStore } from '@/modules/chat';
 * 
 * function App() {
 *   return (
 *     <ChatInterface
 *       defaultApiUrl="http://localhost:2024"
 *       defaultAssistantId="agent"
 *       className="h-screen"
 *     />
 *   );
 * }
 * ```
 * 
 * @example Advanced Usage with Store Access
 * ```tsx
 * import { ChatInterface, useChatStore, useConfig } from '@/modules/chat';
 * 
 * function App() {
 *   const config = useConfig();
 *   
 *   return (
 *     <div>
 *       <div>Connected to: {config.apiUrl}</div>
 *       <ChatInterface
 *         defaultApiUrl="http://localhost:2024"
 *         defaultAssistantId="agent"
 *         onConfigChange={(cfg) => console.log('Config changed:', cfg)}
 *         onThreadChange={(id) => console.log('Thread changed:', id)}
 *       />
 *     </div>
 *   );
 * }
 * ```
 */

// ============================================================================
// Main Components
// ============================================================================

export { ChatInterface } from './ChatInterface';
export type { ChatInterfaceProps } from './ChatInterface';

export { ChatProvider } from './ChatProvider';
export type { ChatProviderProps } from './ChatProvider';

// ============================================================================
// Store & Hooks
// ============================================================================

export {
  useChatStore,
  createChatStore,
  // Optimized selectors
  useConfig,
  useConfigActions,
  useUIState,
  useUIActions,
  useThreadId,
  useThreadActions,
  useSyncActions,
} from '@/stores/chat';

// ============================================================================
// Types
// ============================================================================

export type {
  ChatStore,
  ChatConfig,
  ConfigSlice,
  UIState,
  UISlice,
  ThreadSlice,
  SyncSlice,
  SyncOptions,
  ChatStoreOptions,
} from '@/stores/chat';

