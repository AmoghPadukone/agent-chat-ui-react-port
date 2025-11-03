import React from "react";
import { ChatInterface } from "@/modules/agent-chat-ui";

function App() {
  const threadId = "8c70b578-6fb6-4ed3-812d-75d7d5df1349";


  return (
    <ChatInterface
    defaultApiUrl="http://localhost:2024"
    defaultAssistantId="agent"
      enableUrlSync={false}
      initialThreadId={threadId}

      persistToLocalStorage={false}
      className="h-screen w-screen"
      onConfigChange={(config) => {
        console.log('Chat config changed:', config);
      }}
      onThreadChange={(threadId) => {
        console.log('Thread changed:', threadId);
      }}
    />
  );
}

export default App;
