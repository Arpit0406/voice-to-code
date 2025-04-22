import React, { useState } from 'react';
import VoiceRecorder from './components/VoiceRecorder';
import CodeEditor from './components/CodeEditor';
import axios from 'axios';

function App() {
  const [code, setCode] = useState('');

  const handleTranscription = async (text) => {
    const res = await axios.post('http://localhost:5000/transcribe', { prompt: text });
    setCode(res.data.code);
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Voice to Code Assistant</h1>
      <VoiceRecorder onTranscription={handleTranscription} />
      <CodeEditor code={code} />
    </div>
  );
}

export default App;