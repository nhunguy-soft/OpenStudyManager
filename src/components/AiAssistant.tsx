import { Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { useState } from 'react';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
}

export default function AiAssistant() {
  const [messages, setMessages] = useState<Message[]>([]);
  // ... other existing state

  const clearChatHistory = () => {
    setMessages([]);
    toast.success("Chat history cleared");
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">AI Study Assistant</h1>
        {messages.length > 0 && (
          <button
            onClick={clearChatHistory}
            className="flex items-center gap-2 px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 size={20} />
            Clear History
          </button>
        )}
      </div>
      {/* Chat messages will go here */}
    </div>
  );
}
