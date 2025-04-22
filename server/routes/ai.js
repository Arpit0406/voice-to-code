const express = require('express');
const { OpenAI } = require('openai');
require('dotenv').config();

const router = express.Router();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

router.post('/generate', async (req, res) => {
  // console.log(req);
  console.log('audio', req.file);
  console.log('audio', req?.formData);
  const { prompt } = req;
  try {
    const completion = await openai.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'gpt-3.5-turbo',
    });
    const code = completion.choices[0].message.content;
    res.json({ code });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
