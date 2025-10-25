/**
 * ChatInterface - Main entry point component for the chat module
 * Drop-in component that can be used in any React application
 */

import React, { type ReactNode } from 'react';
import { Thread } from '@/components/thread';
import { ChatProvider, type ChatProviderProps } from './ChatProvider';
import { Toaster } from '@/components/ui/sonner';
import type { ChatStoreOptions } from '@/stores/chat';

export interface ChatInterfaceProps extends Omit<ChatProviderProps, 'children'> {
  /** Default API URL */
  defaultApiUrl?: string;
  /** Default Assistant ID */
  defaultAssistantId?: string;
  /** Default API Key */
  defaultApiKey?: string;
  /** Enable URL synchronization (default: true) */
  enableUrlSync?: boolean;
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
  enableUrlSync = true,
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
    enableUrlSync,
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

