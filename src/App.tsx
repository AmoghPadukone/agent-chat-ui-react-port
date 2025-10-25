import React from "react";
import { ChatInterface } from "@/modules/chat";

function App() {
  return (
    <ChatInterface
      defaultApiUrl={import.meta.env.VITE_API_URL}
      defaultAssistantId={import.meta.env.VITE_ASSISTANT_ID}
      enableUrlSync={true}
      persistToLocalStorage={true}
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
