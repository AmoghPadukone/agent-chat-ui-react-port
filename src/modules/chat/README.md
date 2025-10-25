# Chat Module

A complete, production-ready chat interface module for LangGraph agents that can be integrated into any React application.

 

### Basic Usage

```tsx
import { ChatInterface } from '@/modules/chat';

function App() {
  return (
    <ChatInterface
      defaultApiUrl="http://localhost:2024"
      defaultAssistantId="agent"
      className="h-screen"
    />
  );
}
```

### Advanced Usage with Store Access

```tsx
import { ChatInterface, useChatStore, useConfig } from '@/modules/chat';

function App() {
  // Access store from anywhere in your app
  const config = useConfig();
  const setApiUrl = useChatStore((state) => state.setApiUrl);

  return (
    <div>
      <header>
        <div>Connected to: {config.apiUrl}</div>
        <button onClick={() => setApiUrl('http://new-url:2024')}>
          Change URL
        </button>
      </header>
      
      <ChatInterface
        defaultApiUrl="http://localhost:2024"
        defaultAssistantId="agent"
        enableUrlSync={true}
        onConfigChange={(cfg) => console.log('Config:', cfg)}
        onThreadChange={(id) => console.log('Thread:', id)}
        className="flex-1"
      />
    </div>
  );
}
```

## API Reference

### ChatInterface Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `defaultApiUrl` | `string` | `''` | Default LangGraph API URL |
| `defaultAssistantId` | `string` | `''` | Default assistant/graph ID |
| `defaultApiKey` | `string` | `''` | Default API key |
| `enableUrlSync` | `boolean` | `true` | Enable URL parameter sync |
| `persistToLocalStorage` | `boolean` | `true` | Persist config to localStorage |
| `className` | `string` | - | CSS class for container |
| `onConfigChange` | `(config) => void` | - | Callback when config changes |
| `onThreadChange` | `(threadId) => void` | - | Callback when thread changes |
| `loadingComponent` | `ReactNode` | - | Custom loading component |

### Store Hooks

#### Main Store Hook

```tsx
import { useChatStore } from '@/modules/chat';

// Access entire store (causes re-render on any change)
const store = useChatStore();
```

#### Optimized Selectors (Recommended)

```tsx
import {
  useConfig,
  useConfigActions,
  useUIState,
  useUIActions,
  useThreadId,
  useThreadActions,
  useSyncActions,
} from '@/modules/chat';

// Only re-renders when config changes
const config = useConfig();
const { setApiUrl, setAssistantId } = useConfigActions();

// Only re-renders when UI state changes
const uiState = useUIState();
const { setChatHistoryOpen, toggleChatHistory } = useUIActions();

// Only re-renders when thread changes
const threadId = useThreadId();
const { setThreadId, clearThread } = useThreadActions();

// Sync functions
const { syncFromUrl, syncToUrl } = useSyncActions();
```

## Store Structure

The chat store follows Zustand best practices with a sliced architecture:

### Config Slice
```typescript
{
  config: {
    apiUrl: string;
    assistantId: string;
    apiKey: string;
  },
  setApiUrl: (url: string) => void;
  setAssistantId: (id: string) => void;
  setApiKey: (key: string) => void;
  hasValidConfig: () => boolean;
}
```

### UI Slice
```typescript
{
  ui: {
    chatHistoryOpen: boolean;
    hideToolCalls: boolean;
  },
  setChatHistoryOpen: (open: boolean) => void;
  toggleChatHistory: () => void;
  setHideToolCalls: (hide: boolean) => void;
  toggleHideToolCalls: () => void;
}
```

### Thread Slice
```typescript
{
  threadId: string | null;
  setThreadId: (id: string | null) => void;
  clearThread: () => void;
}
```

### Sync Slice
```typescript
{
  syncOptions: {
    enableUrlSync: boolean;
    persistToLocalStorage: boolean;
  },
  syncFromUrl: () => void;
  syncToUrl: () => void;
  setSyncOptions: (options) => void;
}
```

## Integration Examples

### With Existing Store

```tsx
// Your existing app store
import { create } from 'zustand';

interface AppStore {
  theme: string;
  // ... other state
}

export const useAppStore = create<AppStore>((set) => ({
  theme: 'light',
  // ... other state
}));

// Use chat store alongside your app store
import { useChatStore, ChatInterface } from '@/modules/chat';

function App() {
  const appTheme = useAppStore((state) => state.theme);
  const chatConfig = useChatStore((state) => state.config);

  return (
    <div className={appTheme}>
      <ChatInterface
        defaultApiUrl="http://localhost:2024"
        defaultAssistantId="agent"
      />
    </div>
  );
}
```

### Without URL Sync

```tsx
<ChatInterface
  defaultApiUrl="http://localhost:2024"
  defaultAssistantId="agent"
  enableUrlSync={false}  // Disable URL sync
  persistToLocalStorage={true}
/>
```

### Custom Loading

```tsx
<ChatInterface
  defaultApiUrl="http://localhost:2024"
  defaultAssistantId="agent"
  loadingComponent={
    <div className="flex items-center justify-center h-screen">
      <Spinner />
    </div>
  }
/>
```

## Environment Variables

Create a `.env.local` file:

```env
VITE_API_URL=http://localhost:2024
VITE_ASSISTANT_ID=agent
```

These will be used as defaults if props are not provided.
 

## File Structure

```
src/modules/chat/
├── README.md                   # This file
├── index.ts                    # Public API exports
├── ChatInterface.tsx           # Main entry component
├── ChatProvider.tsx            # Consolidated provider
└── ../../stores/chat/
    ├── index.ts                # Store creation & exports
    ├── types.ts                # TypeScript definitions
    └── slices/
        ├── config.ts           # Config state & actions
        ├── ui.ts               # UI state & actions
        ├── thread.ts           # Thread state & actions
        └── sync.ts             # URL/localStorage sync
```

## License

Same as parent project

