/**
 * ChatInterface - Main entry point component for the chat module
 * Drop-in component that can be used in any React application
 */

import React, { type ReactNode } from 'react';
import { Thread } from '@/components/thread';
import { ChatProvider, type ChatProviderProps } from './ChatProvider';
import { Toaster } from '@/components/ui/sonner';
import type { ChatStoreOptions } from '@/stores/agent-chat-ui';

export interface ChatInterfaceProps extends Omit<ChatProviderProps, 'children'> {
  /** Default API URL */
  defaultApiUrl?: string;
  /** Default Assistant ID */
  defaultAssistantId?: string;
  /** Default API Key */
  defaultApiKey?: string;
  /** Initial Thread ID (useful when integrating into apps with path-based routing) */
  initialThreadId?: string | null;
  /** Enable URL synchronization (default: false) */
  enableUrlSync?: boolean;
  /** Enable URL sync from path (extract threadId from URL path instead of query params) */
  syncFromPath?: boolean;
  /** Pattern to extract threadId from path (e.g., '/workspaces/:workspaceId/thread/:threadId') */
  threadIdPathPattern?: string;
  /** Persist to localStorage (default: true) */
  persistToLocalStorage?: boolean;
  /** Custom className for the container */
  className?: string;
  /** Callback when config changes */
  onConfigChange?: (config: { apiUrl: string; assistantId: string }) => void;
  /** Callback when thread changes */
  onThreadChange?: (threadId: string | null) => void;
  /** Custom loading component */
  loadingComponent?: ReactNode;
}

/**
 * ChatInterface Component
 * 
 * @example
 * ```tsx
 * import { ChatInterface } from '@/modules/chat';
 * 
 * function App() {
 *   return (
 *     <ChatInterface
 *       defaultApiUrl="http://localhost:2024"
 *       defaultAssistantId="agent"
 *       enableUrlSync={true}
 *       onConfigChange={(config) => console.log('Config:', config)}
 *       className="h-screen"
 *     />
 *   );
 * }
 * ```
 */
export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  defaultApiUrl,
  defaultAssistantId,
  defaultApiKey,
  initialThreadId,
  enableUrlSync = false,
  syncFromPath = false,
  threadIdPathPattern,
  persistToLocalStorage = true,
  className,
  onConfigChange,
  onThreadChange,
  loadingComponent = <div>Loading chat...</div>,
}) => {
  // Build store options
  const storeOptions: ChatStoreOptions = {
    defaultConfig: {
      apiUrl: defaultApiUrl || '',
      assistantId: defaultAssistantId || '',
      apiKey: defaultApiKey || '',
    },
    initialThreadId,
    enableUrlSync,
    syncFromPath,
    threadIdPathPattern,
    persistToLocalStorage,
  };

  return (
    <div className={className}>
      <React.Suspense fallback={loadingComponent}>
        <Toaster />
        <ChatProvider
          options={storeOptions}
          enableUrlSync={enableUrlSync}
          onConfigChange={onConfigChange}
          onThreadChange={onThreadChange}
        >
          <Thread />
        </ChatProvider>
      </React.Suspense>
    </div>
  );
};

ChatInterface.displayName = 'ChatInterface';

