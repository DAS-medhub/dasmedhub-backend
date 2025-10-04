const fetch = require('node-fetch');

module.exports = async (req, res) => {
  // Set CORS headers to allow calls from your GitHub Pages site
  res.setHeader('Access-Control-Allow-Origin', '*'); // Replace '*' with your GitHub Pages URL for better security, e.g., 'https://yourusername.github.io'
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end(); // Handle preflight requests
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { contents, system_instruction, generation_config } = req.body;
  const API_KEY = process.env.GOOGLE_API_KEY;
  const MODEL = 'gemini-2.5-flash-lite';
  const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents,
        system_instruction,
        generation_config,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Google API Error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('Proxy Error:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
};