import { useEffect } from 'react';
import { useSpeechToText } from '../../hooks/useSpeechToText';

interface VoiceInputProps {
  onTranscript: (transcript: string) => void;
}

export default function VoiceInput({ onTranscript }: VoiceInputProps) {
  const { isListening, transcript, error, startListening, stopListening, resetTranscript, isSupported } = useSpeechToText();

  useEffect(() => {
    if (transcript) {
      onTranscript(transcript);
    }
  }, [transcript, onTranscript]);

  const handleToggle = () => {
    if (isListening) {
      stopListening();
    } else {
      resetTranscript();
      startListening();
    }
  };

  if (!isSupported) {
    return (
      <div className="text-xs text-gray-400" title="Speech recognition not supported">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
        </svg>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={handleToggle}
        className={`p-3 rounded-xl transition ${
          isListening
            ? 'bg-red-500 text-white animate-pulse'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }`}
        title={isListening ? 'Stop listening' : 'Start voice input'}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
        </svg>
      </button>
      {isListening && (
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-3 py-1.5 rounded-lg whitespace-nowrap">
          Listening...
        </div>
      )}
      {error && (
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-red-500 text-white text-xs px-3 py-1.5 rounded-lg whitespace-nowrap">
          {error}
        </div>
      )}
    </div>
  );
}
