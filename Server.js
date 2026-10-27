const express = require('express');
const cors = require('cors');
const { OpenAI } = require('openai');

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    const response = await openai.chat.completions.create({
      model: "openrouter/free", // Ye universal free model hai
      messages: [{ role: "user", content: message }],
    });
    res.json({ reply: response.choices[0].message.content });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "AI se baat nahi ho paayi." });
  }
});

app.post('/api/pdf-action', async (req, res) => {
  try {
    const { text, action, lang } = req.body;
    let prompt = "";
    if (action === 'translate') prompt = `Translate this text to ${lang}:\n\n${text}`;
    if (action === 'spell') prompt = `Fix all spelling and grammar mistakes in this text and return only the corrected text:\n\n${text}`;
    if (action === 'rewrite') prompt = `Rewrite this text in a simple and clear way:\n\n${text}`;
    if (action === 'summarize') prompt = `Summarize this text in 5 bullet points:\n\n${text}`;

    const response = await openai.chat.completions.create({
      model: "openrouter/free",
      messages: [{ role: "user", content: prompt }],
    });
    res.json({ result: response.choices[0].message.content });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "PDF process fail ho gaya." });
  }
});

app.post('/api/study', async (req, res) => {
  try {
    const { subject, topic, type } = req.body;
    const prompt = `Act as a teacher. Create a ${type} for subject ${subject} on topic ${topic}. Keep it clear and helpful.`;

    const response = await openai.chat.completions.create({
      model: "openrouter/free",
      messages: [{ role: "user", content: prompt }],
    });
    res.json({ result: response.choices[0].message.content });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Study material fail ho gaya." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
