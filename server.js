
import express from 'express';
import cors from 'cors';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(cors());

// Load plant data
const loadPlantData = () => {
  try {
    const data = readFileSync(join(__dirname, 'data', 'plants.json'), 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading plant data:', error);
    return null;
  }
};

// Helper function to find plant by ID
const findPlantById = (plantId) => {
  const data = loadPlantData();
  if (!data || !data.plants) return null;
  return data.plants.find(plant => plant.id === plantId);
};

// Helper function to filter plants
const filterPlants = (plants, filters) => {
  return plants.filter(plant => {
    if (filters.category && plant.category !== filters.category) return false;
    if (filters.difficulty && plant.difficulty !== filters.difficulty) return false;
    if (filters.biome && !plant.biomes.includes(filters.biome)) return false;
    if (filters.season && !plant.seasons.includes(filters.season)) return false;
    if (filters.careLevel && plant.careLevel !== filters.careLevel) return false;
    return true;
  });
};

// Helper function to search plants
const searchPlants = (plants, query) => {
  const searchTerm = query.toLowerCase();
  return plants.filter(plant => 
    plant.name.toLowerCase().includes(searchTerm) ||
    plant.notes.toLowerCase().includes(searchTerm) ||
    plant.category.toLowerCase().includes(searchTerm)
  );
};

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
            .params { background: #e9ecef; padding: 5px; border-radius: 3px; font-family: monospace; }
        </style>
    </head>
    <body>
        <h1>🌱 Pocket Plants Backend API</h1>
        <p>Welcome to your enhanced plant database backend! Here are the available endpoints:</p>
        
        <div class="endpoint">
            <span class="method">GET</span> <span class="url">/</span> - This page
        </div>
        
        <div class="endpoint">
            <span class="method">GET</span> <span class="url">/plants</span> - Enhanced plant list with filtering
            <br><span class="params">Query params: ?category=vegetables&difficulty=easy&biome=zone_6b</span>
            <br><a href="/plants" target="_blank">View all plants →</a>
        </div>
        
        <div class="endpoint">
            <span class="method">GET</span> <span class="url">/plants/:id</span> - Individual plant details
            <br><span class="params">Example: /plants/carrot-001</span>
            <br><a href="/plants/carrot-001" target="_blank">View carrot details →</a>
        </div>
        
        <div class="endpoint">
            <span class="method">GET</span> <span class="url">/plants/search?q=query</span> - Search plants
            <br><span class="params">Example: /plants/search?q=tomato</span>
            <br><a href="/plants/search?q=tomato" target="_blank">Search for tomato →</a>
        </div>
        
        <div class="endpoint">
            <span class="method">GET</span> <span class="url">/plants/seasonal?month=6&biome=zone_6b</span> - Seasonal recommendations
            <br><span class="params">Month: 1-12, Biome: zone_6b, zone_7a, etc.</span>
            <br><a href="/plants/seasonal?month=6&biome=zone_6b" target="_blank">June recommendations for Zone 6B →</a>
        </div>
        
        <div class="endpoint">
            <span class="method">GET</span> <span class="url">/biomes</span> - All available biomes
            <br><a href="/biomes" target="_blank">View biomes →</a>
        </div>
        
        <div class="endpoint">
            <span class="method">GET</span> <span class="url">/categories</span> - Plant categories
            <br><a href="/categories" target="_blank">View categories →</a>
        </div>
        
        <div class="endpoint">
            <span class="method">GET</span> <span class="url">/plants-data</span> - Full database (raw)
            <br><a href="/plants-data" target="_blank">View raw data →</a>
        </div>
    </body>
    </html>
  `);
});

// GET /plants - Enhanced plant list with filtering
app.get('/plants', (req, res) => {
  try {
    const data = loadPlantData();
    if (!data || !data.plants) {
      return res.status(500).json({ error: 'Plant data not available' });
    }

    let plants = [...data.plants];
    
    // Apply filters
    const { category, difficulty, biome, season, careLevel } = req.query;
    if (category || difficulty || biome || season || careLevel) {
      plants = filterPlants(plants, { category, difficulty, biome, season, careLevel });
    }

    // Add pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedPlants = plants.slice(startIndex, endIndex);

    res.json({
      plants: paginatedPlants,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(plants.length / limit),
        totalPlants: plants.length,
        hasNext: endIndex < plants.length,
        hasPrev: page > 1
      },
      filters: { category, difficulty, biome, season, careLevel }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch plants', details: error.message });
  }
});

// GET /plants/:id - Individual plant details
app.get('/plants/:id', (req, res) => {
  try {
    const { id } = req.params;
    const plant = findPlantById(id);
    
    if (!plant) {
      return res.status(404).json({ error: 'Plant not found', plantId: id });
    }
    
    res.json(plant);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch plant', details: error.message });
  }
});

// GET /plants/search - Search plants
app.get('/plants/search', (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ error: 'Search query parameter "q" is required' });
    }

    const data = loadPlantData();
    if (!data || !data.plants) {
      return res.status(500).json({ error: 'Plant data not available' });
    }

    const results = searchPlants(data.plants, q);
    
    res.json({
      query: q,
      results: results,
      totalResults: results.length
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to search plants', details: error.message });
  }
});

// GET /plants/seasonal - Seasonal recommendations
app.get('/plants/seasonal', (req, res) => {
  try {
    const { month, biome } = req.query;
    
    if (!month || !biome) {
      return res.status(400).json({ 
        error: 'Both "month" and "biome" parameters are required' 
      });
    }

    const monthNum = parseInt(month);
    if (monthNum < 1 || monthNum > 12) {
      return res.status(400).json({ error: 'Month must be between 1 and 12' });
    }

    const data = loadPlantData();
    if (!data || !data.plants) {
      return res.status(500).json({ error: 'Plant data not available' });
    }

    // Map month to season
    const monthToSeason = {
      3: 'spring', 4: 'spring', 5: 'spring',
      6: 'summer', 7: 'summer', 8: 'summer',
      9: 'fall', 10: 'fall', 11: 'fall',
      12: 'winter', 1: 'winter', 2: 'winter'
    };

    const season = monthToSeason[monthNum];
    const seasonalPlants = data.plants.filter(plant => 
      plant.biomes.includes(biome) && plant.seasons.includes(season)
    );

    res.json({
      month: monthNum,
      season: season,
      biome: biome,
      plants: seasonalPlants,
      totalPlants: seasonalPlants.length
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch seasonal plants', details: error.message });
  }
});

// GET /biomes - All available biomes
app.get('/biomes', (req, res) => {
  try {
    const data = loadPlantData();
    if (!data || !data.biomes) {
      return res.status(500).json({ error: 'Biome data not available' });
    }
    
    res.json(data.biomes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch biomes', details: error.message });
  }
});

// GET /categories - Plant categories
app.get('/categories', (req, res) => {
  try {
    const data = loadPlantData();
    if (!data || !data.categories) {
      return res.status(500).json({ error: 'Category data not available' });
    }
    
    res.json(data.categories);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch categories', details: error.message });
  }
});

// GET /plants-data - Full database (raw)
app.get('/plants-data', (req, res) => {
  try {
    const data = loadPlantData();
    if (!data) {
      return res.status(500).json({ error: 'Plant data not available' });
    }
    
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to read plants data', details: error.message });
  }
});

// Error handling middleware
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found', path: req.path });
});

app.use((error, req, res, next) => {
  console.error('Server error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(3000, () => {
  console.log('🌱 Pocket Plants Backend running on http://localhost:3000');
  console.log('📚 API Documentation available at http://localhost:3000');
});
