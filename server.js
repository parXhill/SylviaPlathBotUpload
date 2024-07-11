const express = require('express');
const axios = require('axios');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.post('/api/generate', async (req, res) => {
    const prompt = req.body.prompt;
    try {
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: prompt }],
            max_tokens: 50
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
            }
        });
        res.json(response.data);
    } catch (error) {
        res.status(500).send('Error generating response');
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});