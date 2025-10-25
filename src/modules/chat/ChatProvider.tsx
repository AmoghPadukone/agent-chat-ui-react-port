/**
 * ChatProvider - Consolidated provider for chat functionality
 * Wraps Stream, Thread, and Artifact providers with chat store initialization
 */

import React, { useEffect, type ReactNode } from 'react';
import { StreamProvider } from '@/providers/Stream';
import { ThreadProvider } from '@/providers/Thread';
import { ArtifactProvider } from '@/components/thread/artifact';
import { useChatStore } from '@/stores/chat';
import type { ChatStoreOptions } from '@/stores/chat';

export interface ChatProviderProps {
  children: ReactNode;
  /** Initial configuration options */
  options?: ChatStoreOptions;
  /** Enable URL synchronization */
  enableUrlSync?: boolean;
  /** Callback when config changes */
  onConfigChange?: (config: { apiUrl: string; assistantId: string }) => void;
  /** Callback when thread changes */
  onThreadChange?: (threadId: string | null) => void;
}

/**
 * ChatProvider component
 * Sets up all necessary providers and initializes the chat store
 */
export const ChatProvider: React.FC<ChatProviderProps> = ({
  children,
  options,
  enableUrlSync = true,
  onConfigChange,
  onThreadChange,
}) => {
  const syncFromUrl = useChatStore((state) => state.syncFromUrl);
  const setSyncOptions = useChatStore((state) => state.setSyncOptions);
  const config = useChatStore((state) => state.config);
  const threadId = useChatStore((state) => state.threadId);

  // Initialize sync options
  useEffect(() => {
    setSyncOptions({ enableUrlSync });
  }, [enableUrlSync, setSyncOptions]);

  // Sync from URL on mount if enabled
  useEffect(() => {
    if (enableUrlSync) {
      syncFromUrl();
    }
  }, [enableUrlSync, syncFromUrl]);

  // Notify parent of config changes
  useEffect(() => {
    if (onConfigChange) {
      onConfigChange({
        apiUrl: config.apiUrl,
        assistantId: config.assistantId,
      });
    }
  }, [config.apiUrl, config.assistantId, onConfigChange]);

  // Notify parent of thread changes
  useEffect(() => {
    if (onThreadChange) {
      onThreadChange(threadId);
    }
  }, [threadId, onThreadChange]);

  return (
    <ThreadProvider>
      <StreamProvider>
        <ArtifactProvider>{children}</ArtifactProvider>
      </StreamProvider>
    </ThreadProvider>
  );
};

ChatProvider.displayName = 'ChatProvider';

