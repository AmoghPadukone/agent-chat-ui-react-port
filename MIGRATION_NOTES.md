# Migration Notes: Next.js → React + Vite

## Quick Reference

### What Changed
- **Framework**: Next.js 15 → React 19 + Vite 6
- **State**: nuqs + scattered → Zustand store with slices
- **Routing**: Next.js App Router → Single Page App (no routing needed)
- **URL Sync**: Native browser APIs (`URLSearchParams`, `window.history`)
- **Env Vars**: `NEXT_PUBLIC_*` → `VITE_*`

### What Stayed the Same
- All UI components
- LangGraph integration
- Chat functionality
- File uploads
- Thread management
- Tool calls display

## Issues Fixed During Migration

### 1. Form Validation Bug
**Issue**: Button would enable before both fields were filled
**Fix**: Changed validation to `!apiUrl.trim() || !assistantId.trim()`

### 2. URL Parameter Sync
**Issue**: URL params weren't syncing properly
**Fix**: Created `syncFromUrl()` and `syncToUrl()` in sync slice

### 3. Theme Management
**Issue**: Removed `next-themes` dependency
**Fix**: Simplified to system preference detection in sonner.tsx

### 4. "use client" Directives
**Issue**: Left over from Next.js
**Fix**: Removed from all components (not needed in Vite)

## Store Architecture Decisions

### Why Zustand with Slices?
- **Performance**: Optimized selectors prevent unnecessary re-renders
- **Maintainability**: Clear separation of concerns
- **Flexibility**: Easy to extend with new slices
- **Best Practices**: Following Zustand documentation patterns

### Slice Breakdown
1. **Config Slice**: API URL, Assistant ID, API Key
2. **UI Slice**: Chat history open, hide tool calls
3. **Thread Slice**: Current thread ID
4. **Sync Slice**: URL and localStorage synchronization

### Why Not Context API?
- Performance: Context causes all consumers to re-render
- DevTools: Zustand has better debugging support
- Middleware: Need persist and devtools middleware
- Industry Standard: Zustand is widely adopted

## Module Design Decisions

### Why Create `/modules/chat`?
- **Reusability**: Can be dropped into any React app
- **Encapsulation**: All chat logic in one place
- **Clear API**: Single entry point with props
- **Documentation**: Self-contained with README

### Public API Design
```tsx
// Simple usage
<ChatInterface defaultApiUrl="..." defaultAssistantId="..." />

// Advanced usage
import { useChatStore, useConfig } from '@/modules/chat';
```

## Performance Considerations

### Optimized Selectors
```tsx
// ❌ Bad: Re-renders on ANY store change
const store = useChatStore();

// ✅ Good: Only re-renders when config changes
const config = useConfig();
```

### Memoization
- All store actions are stable references
- Selectors use shallow comparison
- Components only re-render when their data changes

## Known Limitations

1. **No SSR**: Purely client-side now (acceptable for chat UI)
2. **No API Routes**: Direct client-to-LangGraph calls
3. **Theme**: System detection only (user can add custom theme later)

## Future Improvements

### Could Be Added
1. **Custom Theme Store**: If theme switching needed
2. **Message Persistence**: Cache messages in localStorage
3. **Offline Support**: Service worker for offline mode
4. **Error Boundaries**: Better error handling UI
5. **Analytics Integration**: Track usage patterns

### Performance Optimizations
1. **Code Splitting**: Dynamic imports for large components
2. **Virtual Scrolling**: For long message lists
3. **Web Workers**: For heavy computations
4. **Suspense**: Better loading states

## Testing Notes

### What to Test
- [ ] Setup form validation
- [ ] Chat interface loads
- [ ] Messages send/receive
- [ ] Thread switching
- [ ] File uploads
- [ ] Tool calls display
- [ ] History panel
- [ ] URL sync (if enabled)
- [ ] localStorage persistence
- [ ] Error handling

### Edge Cases
- [ ] Empty API URL
- [ ] Invalid assistant ID
- [ ] Network errors
- [ ] Large file uploads
- [ ] Very long message history
- [ ] Multiple tabs (localStorage sync)

## Troubleshooting

### Build Fails
1. Check Node version (>= 18)
2. Delete `node_modules` and reinstall
3. Check for TypeScript errors: `npx tsc --noEmit`

### Store Not Syncing
1. Check `enableUrlSync` prop
2. Verify `syncFromUrl()` is called on mount
3. Check browser console for errors

### Components Not Re-rendering
1. Use optimized selectors (`useConfig()` not `useChatStore()`)
2. Check if selector is properly memoized
3. Verify zustand devtools for state changes

## Resources

- [Zustand Documentation](https://docs.pmnd.rs/zustand)
- [Vite Documentation](https://vitejs.dev)
- [React Router Documentation](https://reactrouter.com)
- [LangGraph SDK](https://langchain-ai.github.io/langgraphjs/)

## Questions?

For issues or questions about this migration:
1. Check `/src/modules/chat/README.md` for API docs
2. Review store slices in `/src/stores/chat/slices/`
3. Look at `PR_SUMMARY.md` for overview

