# Integration Guide: Chat UI into Your App

This guide explains how to integrate the Chat Interface into your application, especially when you have a different URL structure (like path-based routing).

## 🏗️ Architecture Overview

### How the App Works

The chat UI is built as a **modular component** that can be dropped into any React app:

1. **ChatInterface** - Main entry point component (`src/modules/chat/ChatInterface.tsx`)
2. **ChatProvider** - Sets up stores and providers
3. **Zustand Store** - Manages all state (config, threadId, UI state)
4. **StreamProvider** - Connects to LangGraph SDK for streaming
5. **Thread Component** - The actual chat UI

### URL Parameter Significance

The app currently supports two ways to sync with URLs:

1. **Query Parameters** (default): `?threadId=xxx&apiUrl=yyy&assistantId=zzz`
2. **Path-Based** (new): Extract from URL path like `/workspaces/{id}/thread/{threadId}`

## 🚀 Integration Steps

### Option 1: Path-Based URL (Your Use Case)

For your URL structure: `http://localhost:4000/workspaces/3d9875e8-ea3b-4b37-b008-27622c1595a4/thread/8c70b578-6fb6-4ed3-812d-75d7d5df1349`

```tsx
import { ChatInterface } from '@/modules/chat';

function ThreadPage({ threadId, workspaceId }) {
  return (
    <ChatInterface
      // Required config
      defaultApiUrl="http://localhost:2024"  // Your LangGraph server
      defaultAssistantId="agent"             // Your assistant/graph ID
      
      // Path-based sync
      initialThreadId={threadId}             // Pass threadId from your router
      syncFromPath={true}                    // Enable path extraction
      threadIdPathPattern="/workspaces/:workspaceId/thread/:threadId"
      
      // Optional: Disable URL sync if your router manages URLs
      enableUrlSync={false}                  // Disable automatic URL updates
      
      // Optional: Disable localStorage if you manage state
      persistToLocalStorage={false}
      
      // Callbacks
      onThreadChange={(id) => {
        // Handle thread changes (e.g., navigate to new thread)
        console.log('Thread changed to:', id);
      }}
      onConfigChange={(config) => {
        console.log('Config changed:', config);
      }}
      
      className="h-screen"
    />
  );
}
```

### Option 2: Direct Thread ID Prop (Simplest)

If you're using React Router or similar and can extract the threadId:

```tsx
import { useParams } from 'react-router-dom';
import { ChatInterface } from '@/modules/chat';

function ThreadPage() {
  const { threadId } = useParams(); // Extract from URL
  
  return (
    <ChatInterface
      defaultApiUrl="http://localhost:2024"
      defaultAssistantId="agent"
      initialThreadId={threadId}      // Direct prop - simplest!
      enableUrlSync={false}            // Your router manages URLs
      persistToLocalStorage={false}
      className="h-screen"
    />
  );
}
```

### Option 3: Manual Store Control (Advanced)

For maximum control, use the store directly:

```tsx
import { ChatInterface, useChatStore } from '@/modules/chat';
import { useEffect } from 'react';

function ThreadPage({ threadId }) {
  const setThreadId = useChatStore((state) => state.setThreadId);
  
  useEffect(() => {
    // Set thread ID when it changes
    if (threadId) {
      setThreadId(threadId);
    }
  }, [threadId, setThreadId]);
  
  return (
    <ChatInterface
      defaultApiUrl="http://localhost:2024"
      defaultAssistantId="agent"
      enableUrlSync={false}
      persistToLocalStorage={false}
      className="h-screen"
    />
  );
}
```

## 📋 Complete Integration Example

Here's a full example for your URL structure:

```tsx
// In your routing setup (e.g., React Router, Next.js, etc.)
import { ChatInterface } from '@/modules/chat';

// Example with React Router
import { useParams } from 'react-router-dom';

function WorkspaceThreadPage() {
  const { workspaceId, threadId } = useParams();
  
  // Extract from: /workspaces/:workspaceId/thread/:threadId
  
  return (
    <div className="workspace-layout">
      {/* Your sidebar, header, etc. */}
      
      <div className="chat-container">
        <ChatInterface
          defaultApiUrl={process.env.VITE_LANGGRAPH_API_URL}
          defaultAssistantId="agent"
          initialThreadId={threadId || null}
          
          // Don't let chat UI manage URLs - your router does
          enableUrlSync={false}
          syncFromPath={false}
          
          // Optional: Persist config but not thread
          persistToLocalStorage={true}
          
          // Handle thread changes (e.g., when user creates new thread)
          onThreadChange={(newThreadId) => {
            if (newThreadId) {
              // Navigate to new thread
              navigate(`/workspaces/${workspaceId}/thread/${newThreadId}`);
            }
          }}
          
          onConfigChange={(config) => {
            // Optionally sync config to your backend/state
            console.log('Chat config:', config);
          }}
          
          className="h-full w-full"
        />
      </div>
    </div>
  );
}
```

## 🔧 Available Props

### ChatInterface Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `defaultApiUrl` | `string` | `''` | LangGraph server URL |
| `defaultAssistantId` | `string` | `''` | Assistant/Graph ID |
| `defaultApiKey` | `string` | `''` | API key (optional) |
| `initialThreadId` | `string \| null` | `undefined` | Initial thread ID from your router |
| `enableUrlSync` | `boolean` | `true` | Enable automatic URL parameter sync |
| `syncFromPath` | `boolean` | `false` | Extract threadId from URL path |
| `threadIdPathPattern` | `string` | `undefined` | Pattern like `/workspaces/:workspaceId/thread/:threadId` |
| `persistToLocalStorage` | `boolean` | `true` | Persist config to localStorage |
| `onConfigChange` | `function` | `undefined` | Callback when config changes |
| `onThreadChange` | `function` | `undefined` | Callback when thread changes |
| `className` | `string` | `undefined` | CSS class for container |

## 🎯 Path Pattern Examples

The `threadIdPathPattern` supports several formats:

```tsx
// Named parameters
"/workspaces/:workspaceId/thread/:threadId"

// Wildcards
"/workspaces/*/thread/:threadId"

// Multiple patterns supported via regex
"/chat/:threadId"
"/conversations/:threadId"
```

The extractor will automatically find `threadId` or `id` in the named groups.

## ⚠️ Important Notes

1. **URL Management**: If `enableUrlSync={false}`, the chat UI won't modify URLs. Your router handles navigation.

2. **Thread ID Changes**: When a new thread is created (user sends first message), `onThreadChange` fires. Use this to navigate to the new thread URL.

3. **State Persistence**: If `persistToLocalStorage={false}`, config won't persist across page refreshes. Consider syncing to your backend.

4. **Store Access**: You can access the store directly:
   ```tsx
   import { useChatStore, useThreadId } from '@/modules/chat';
   
   const threadId = useThreadId();
   const setThreadId = useChatStore((state) => state.setThreadId);
   ```

## 🔍 How URL Sync Works

### Query Params (Original)
- Reads: `?threadId=xxx` from URL search params
- Writes: Updates query params when thread changes
- Use when: URLs are managed by the chat UI

### Path-Based (New)
- Reads: Extracts threadId from URL path using pattern
- Writes: **Doesn't write** (let your router handle it)
- Use when: Integrating into existing apps with path-based routing

### Disabled
- Reads: Only from props/initial values
- Writes: Nothing
- Use when: You manage everything manually

## 🐛 Troubleshooting

**Thread ID not loading?**
- Check `initialThreadId` prop is set correctly
- Verify `syncFromPath` and `threadIdPathPattern` if using path extraction
- Check browser console for errors

**URL not updating?**
- If `enableUrlSync={false}`, URLs won't update (this is expected!)
- Use `onThreadChange` to handle navigation yourself

**Config not persisting?**
- Check `persistToLocalStorage` is `true`
- Note: `apiKey` is never persisted for security
- `threadId` is never persisted (too dynamic)

## 📚 Next Steps

1. **Copy the module**: Copy `src/modules/chat` to your app
2. **Copy dependencies**: Ensure all UI components in `src/components` are available
3. **Copy providers**: Copy `src/providers` directory
4. **Copy store**: Copy `src/stores/chat` directory
5. **Install dependencies**: Make sure Zustand, LangGraph SDK, etc. are installed

Or use this as a standalone package/component library!

