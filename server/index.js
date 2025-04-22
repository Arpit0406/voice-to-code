require("dotenv").config();
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const express = require("express");
const multer = require("multer");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const { OpenAI } = require("openai");
const ffmpeg = require("fluent-ffmpeg");
const ffmpegPath = require("ffmpeg-static");

// Setup
const app = express();
const port = 5000;
app.use(cors());
app.use(express.json());

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

ffmpeg.setFfmpegPath(ffmpegPath);

// Multer config
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post("/upload", upload.single("audio"), async (req, res) => {
  const webmBuffer = req.file.buffer;
  const tempWebmPath = path.join(__dirname, "temp.webm");
  const tempMp3Path = path.join(__dirname, "temp.mp3");

  // Save incoming webm file temporarily
  fs.writeFileSync(tempWebmPath, webmBuffer);

  try {
    // Convert to mp3 using fluent-ffmpeg
    await new Promise((resolve, reject) => {
      ffmpeg(tempWebmPath)
        .audioChannels(1)
        .audioFrequency(16000)
        .format("mp3")
        .on("end", resolve)
        .on("error", reject)
        .save(tempMp3Path);
    });

    // Send to OpenAI Whisper
    const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream(tempMp3Path),
      model: "whisper-1",
    });

    // Cleanup
    fs.unlinkSync(tempWebmPath);
    fs.unlinkSync(tempMp3Path);

    // Log and respond
    console.log("🔊 You said:", transcription.text);
    res.json({ text: transcription.text });
  } catch (err) {
    console.error("❌ Error during processing:", err);
    res.status(500).send("Failed to process audio");
  }
});

app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
});
