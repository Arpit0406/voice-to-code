import React, { useState } from 'react';
import axios from 'axios';

const VoiceRecorder = ({ onTranscription }) => {
  const [recording, setRecording] = useState(false);

  const startRecording = async () => {
    setRecording(true);
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    const audioChunks = [];

    mediaRecorder.ondataavailable = (event) => {
      audioChunks.push(event.data);
    };

    mediaRecorder.onstop = async () => {
      const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
      const formData = new FormData();
      formData.append('audio', audioBlob);
      setTimeout(()=> {
        console.log(formData)
        
      },5000)
      console.log(JSON.stringify(formData))

      const res = await axios.post('http://localhost:5000/generate', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      onTranscription(res.data.transcription);
    };

    mediaRecorder.start();

    setTimeout(() => {
      mediaRecorder.stop();
      setRecording(false);
    }, 5000);
  };

  return (
    <button onClick={startRecording} className="p-2 bg-blue-500 text-white rounded">
      {recording ? 'Recording...' : 'Start Voice Command'}
    </button>
  );
};

export default VoiceRecorder;