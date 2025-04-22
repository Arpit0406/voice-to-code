const express = require("express");
const multer = require("multer");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const { OpenAI } = require("openai");

const app = express();
const port = 5000;

require("dotenv").config();

app.use(cors());
app.use(express.json());

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Multer to handle file upload in memory
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post("/upload", upload.single("audio"), async (req, res) => {
  try {
    const audioBuffer = req.file.buffer;
    const tempFilePath = path.join(__dirname, "temp.webm");

    // Save audio to disk temporarily
    fs.writeFileSync(tempFilePath, audioBuffer);

    // Convert webm to mp3 using ffmpeg (OpenAI Whisper needs mp3/wav/mp4/mpeg)
    const { execSync } = require("child_process");
    const mp3Path = path.join(__dirname, "temp.mp3");
    const ffmpegPath =
      "C:/Users/as41084/ffmpeg/ffmpeg-7.1.1-essentials_build/bin/ffmpeg.exe";
    execSync(`ffmpeg -i ${tempFilePath} -ar 16000 -ac 1 -y ${mp3Path}`);

    // Send mp3 to OpenAI Whisper
    const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream(mp3Path),
      model: "whisper-1",
    });

    // Clean up files
    fs.unlinkSync(tempFilePath);
    fs.unlinkSync(mp3Path);

    // Log transcription to backend console
    console.log("🔊 Transcribed text:", transcription.text);

    // Send it to frontend as confirmation (optional)
    res.json({ text: transcription.text });
  } catch (err) {
    console.error("❌ Error:", err);
    res.status(500).send("Failed to process audio");
  }
});

app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
});
