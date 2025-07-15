import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import OpenAI from 'openai';

dotenv.config();

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', async (req, res) => {
  res.status(200).send({
    message: 'Hello from CodeFriend',
  });
});

app.post('/', async (req, res) => {
  try {
    const prompt = req.body.prompt;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
    });

    const reply = completion.choices?.[0]?.message?.content;

    if (!reply) {
      console.warn('Empty response from OpenAI:', completion);
      return res.status(500).send({ error: 'No response from OpenAI.' });
    }

    res.status(200).send({ bot: reply });
  } catch (error) {
    console.error('OpenAI API error:', error);
    res.status(500).send({ error: error.message || 'Something went wrong' });
  }
});

app.listen(5000, () => console.log('Server is running on port http://localhost:5000'));
