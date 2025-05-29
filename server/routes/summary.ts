import express from 'express';
import OpenAI from 'openai';

const router = express.Router();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

router.post('/generate-summary', async (req, res) => {
  const {
    companyName,
    adjustedEBITDA,
    valuationEstimate,
    driverScores,
    followUpIntent
  } = req.body;

  const prompt = `
Write a 200-word business valuation summary for ${companyName}. 
They reported an Adjusted EBITDA of $${adjustedEBITDA} and have an estimated valuation of $${valuationEstimate}.

Their self-assessed scores (1–10) for each driver are:
${Object.entries(driverScores).map(([k, v]) => `${k}: ${v}`).join(', ')}

Summarize strengths (top 3 scores), 2 weak areas (bottom scores), and conclude with a professional recommendation based on their interest in follow-up: "${followUpIntent}".

Keep tone objective, supportive, and M&A oriented.
`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o', // using the latest model
      messages: [{ role: 'user', content: prompt }],
    });

    const summary = completion.choices[0].message?.content;
    res.json({ summary });
  } catch (error) {
    console.error('OpenAI error:', error);
    res.status(500).json({ error: 'Failed to generate summary' });
  }
});

export default router;