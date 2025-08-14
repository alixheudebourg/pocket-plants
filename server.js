
import express from 'express';
import cors from 'cors';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(cors());

// Serve static HTML for the root route
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>Pocket Plants Backend API</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 40px; }
            .endpoint { background: #f5f5f5; padding: 15px; margin: 10px 0; border-radius: 5px; }
            .method { color: #007bff; font-weight: bold; }
            .url { color: #28a745; font-family: monospace; }
            h1 { color: #333; }
        </style>
    </head>
    <body>
        <h1>🌱 Pocket Plants Backend API</h1>
        <p>Welcome to your plant database backend! Here are the available endpoints:</p>
        
        <div class="endpoint">
            <span class="method">GET</span> <span class="url">/</span> - This page
        </div>
        
        <div class="endpoint">
            <span class="method">GET</span> <span class="url">/plants</span> - Basic plant list
            <br><a href="/plants" target="_blank">View plants →</a>
        </div>
        
        <div class="endpoint">
            <span class="method">GET</span> <span class="url">/plants-data</span> - Full database
            <br><a href="/plants-data" target="_blank">View full database →</a>
        </div>
        
        <p><strong>Note:</strong> The Content Security Policy errors you see in the console are from browser extensions (like Honey) and don't affect your backend functionality.</p>
    </body>
    </html>
  `);
});

app.get('/plants', (req, res) => {
  res.json([
    { name: 'Carrot', emoji: '🥕' },
    { name: 'Zucchini', emoji: '🥒' }
  ]);
});

// Endpoint to view the full plants.json database
app.get('/plants-data', (req, res) => {
  try {
    const plantsData = readFileSync(join(__dirname, 'data', 'plants.json'), 'utf8');
    const parsedData = JSON.parse(plantsData);
    res.json(parsedData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to read plants data', details: error.message });
  }
});

app.listen(3000, () => {
  console.log('Backend running on http://localhost:3000');
});

/* Endpoints i need:

- get my biome
- get my current plants (my garden)
- add a plant to my garden
- remove a plant from my garden
- edit crop in my garden (harvest, grow, etc.)


- get all biomes
- get all available plants in my area/biome
*/
