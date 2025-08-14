
import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());

app.get('/plants', (req, res) => {
  res.json([
    { name: 'Carrot', emoji: '🥕' },
    { name: 'Zucchini', emoji: '🥒' }
  ]);
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
