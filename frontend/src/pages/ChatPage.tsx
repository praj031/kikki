import { useState } from 'react';
import Header from '../components/layout/Header';
import ChatInterface from '../components/chat/ChatInterface';
import VoiceInput from '../components/chat/VoiceInput';

export default function ChatPage() {
  const [voiceInput, setVoiceInput] = useState('');

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1 flex flex-col max-w-5xl mx-auto w-full">
        <ChatInterface />
        <div className="border-t border-gray-200 p-4 bg-white">
          <div className="max-w-5xl mx-auto flex items-center gap-3">
            <VoiceInput onTranscript={setVoiceInput} />
            {voiceInput && (
              <div className="flex-1 text-sm text-gray-600 italic truncate">
                "{voiceInput}"
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
