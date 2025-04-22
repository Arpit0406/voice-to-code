// src/App.jsx
import React, { useState, useRef } from "react";
import axios from "axios";

function App() {
  const mediaRecorderRef = useRef(null);
  const [recording, setRecording] = useState(false);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    const audioChunks = [];

    mediaRecorder.ondataavailable = (event) => {
      audioChunks.push(event.data);
    };

    mediaRecorder.onstop = async () => {
      const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
      const formData = new FormData();
      formData.append("audio", audioBlob, "recording.webm");

      try {
        const response = await axios.post(
          "http://localhost:5000/upload",
          formData
        );
        alert("Transcribed text: " + response.data.text);
      } catch (err) {
        console.error(err);
        alert("Error uploading audio");
      }
    };

    mediaRecorder.start();
    setRecording(true);
    mediaRecorderRef.current = mediaRecorder;

    setTimeout(() => {
      mediaRecorder.stop();
      setRecording(false);
    }, 5000);
  };

  return (
    <div className="App">
      <h1>Voice Recorder</h1>
      <button onClick={startRecording} disabled={recording}>
        {recording ? "Recording..." : "Record 5 Seconds"}
      </button>
    </div>
  );
}

export default App;
