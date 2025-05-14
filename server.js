const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// Middleware to serve static files (homepage)
app.use(express.static(path.join(__dirname, 'public')));

// API endpoint for Truth or Dare
app.get('/TorD', async (req, res) => {
    const { type, lang } = req.query;

    // Validate query parameters
    if (!type || !['T', 'D'].includes(type)) {
        return res.status(400).json({ error: 'Invalid or missing type parameter. Use T for Truth or D for Dare.' });
    }
    if (!lang || !['bn', 'en'].includes(lang)) {
        return res.status(400).json({ error: 'Invalid or missing lang parameter. Supported languages: bn, en.' });
    }

    try {
        // Load the appropriate database file based on language
        const dbPath = path.join(__dirname, 'database', `${lang}.json`);
        const data = JSON.parse(await fs.readFile(dbPath, 'utf8'));

        // Select a random item
        const items = type === 'T' ? data.truths : data.dares;
        if (items.length === 0) {
            return res.status(404).json({ error: `${type === 'T' ? 'Truth' : 'Dare'} not found for language ${lang}.` });
        }
        const randomItem = items[Math.floor(Math.random() * items.length)];

        res.json({ type: type === 'T' ? 'Truth' : 'Dare', content: randomItem });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
