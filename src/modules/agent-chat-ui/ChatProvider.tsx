/**
 * ChatProvider - Consolidated provider for chat functionality
 * Wraps Stream, Thread, and Artifact providers with chat store initialization
 */

import React, { useEffect, type ReactNode } from 'react';
import { StreamProvider } from '@/providers/Stream';
import { ThreadProvider } from '@/providers/Thread';
import { ArtifactProvider } from '@/components/thread/artifact';
import { useChatStore } from '@/stores/agent-chat-ui';
import type { ChatStoreOptions } from '@/stores/agent-chat-ui';

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
  enableUrlSync = false,
  onConfigChange,
  onThreadChange,
}) => {
  const syncFromUrl = useChatStore((state) => state.syncFromUrl);
  const setSyncOptions = useChatStore((state) => state.setSyncOptions);
  const setThreadId = useChatStore((state) => state.setThreadId);
  const setConfig = useChatStore((state) => state.setConfig);
  const config = useChatStore((state) => state.config);
  const threadId = useChatStore((state) => state.threadId);

  // Initialize sync options
  useEffect(() => {
    if (options) {
      setSyncOptions({
        enableUrlSync: options.enableUrlSync ?? enableUrlSync,
        syncFromPath: options.syncFromPath,
        threadIdPathPattern: options.threadIdPathPattern,
      });
    } else {
      setSyncOptions({ enableUrlSync });
    }
  }, [enableUrlSync, options, setSyncOptions]);

  // Set initial thread ID if provided (runs when initialThreadId changes)
  useEffect(() => {
    if (options?.initialThreadId !== undefined && threadId !== options.initialThreadId) {
      setThreadId(options.initialThreadId);
    }
  }, [options?.initialThreadId, threadId, setThreadId]);

  // Apply default config from options (does not overwrite URL values later)
  useEffect(() => {
    if (options?.defaultConfig) {
      const { apiUrl, assistantId, apiKey } = options.defaultConfig;
      const updates: Partial<typeof config> = {};
      if (typeof apiUrl === 'string' && apiUrl.trim()) updates.apiUrl = apiUrl;
      if (typeof assistantId === 'string' && assistantId.trim()) updates.assistantId = assistantId;
      if (typeof apiKey === 'string' && apiKey.trim()) updates.apiKey = apiKey;
      if (Object.keys(updates).length > 0) {
        setConfig(updates);
      }
    }
  }, [options?.defaultConfig, setConfig]);

  // Sync from URL on mount if enabled (skip if URL sync is disabled)
  useEffect(() => {
    const shouldSync = options?.enableUrlSync ?? enableUrlSync;
    if (shouldSync) {
      syncFromUrl();
    }
  }, [enableUrlSync, options?.enableUrlSync, syncFromUrl]);

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
      <StreamProvider initialConfig={options?.defaultConfig}>
        <ArtifactProvider>{children}</ArtifactProvider>
      </StreamProvider>
    </ThreadProvider>
  );
};

ChatProvider.displayName = 'ChatProvider';

