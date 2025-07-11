// server/index.js
const express = require('express');
const cors = require('cors');
const { Configuration, OpenAIApi } = require('openai');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// اتصال به Supabase
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// اتصال به OpenAI
const openai = new OpenAIApi(new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
}));

app.post('/chat', async (req, res) => {
  const { message } = req.body;

  try {
    // گرفتن پاسخ از OpenAI
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: 'user', content: message }],
    });

    const botReply = response.data.choices[0].message.content;

    // ذخیره پیام‌ها در Supabase
    await supabase.from('messages').insert([
      {
        user_message: message,
        bot_response: botReply,
      },
    ]);

    res.json({ reply: botReply });
  } catch (err) {
    console.error(err);
    res.status(500).send("خطا در پردازش پیام");
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
