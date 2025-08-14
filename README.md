# Pocket Plants Backend 🌱

A Node.js backend service for managing a comprehensive plant database and garden management system. This API provides endpoints for tracking plants, managing gardens, accessing plant information based on biomes and growing seasons, and supporting React frontend integration.

## Features

- **Enhanced Plant Database**: Comprehensive plant information including planting/harvest times, care notes, difficulty levels, and biome compatibility
- **Advanced Filtering**: Filter plants by category, difficulty, biome, season, and care level
- **Search Functionality**: Search plants by name, description, or category
- **Seasonal Recommendations**: Get plant suggestions based on month and climate zone
- **Biome Support**: Plant recommendations based on USDA climate zones (6B, 7A, 7B, 8A)
- **Pagination**: Built-in pagination for large plant lists
- **Garden Management Ready**: API structure ready for user garden features

## Tech Stack

- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **CORS** - Cross-origin resource sharing support
- **ES Modules** - Modern JavaScript module system
- **File-based Database** - JSON-based plant data storage

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn package manager

## Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd pocket-plants-backend
```

2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
npm start
```

The server will run on `http://localhost:3000`

## API Endpoints

### Core Endpoints

#### GET `/`
Returns a comprehensive HTML page with links to all available API endpoints and interactive documentation.

#### GET `/plants`
Returns an enhanced plant list with advanced filtering and pagination.

**Query Parameters:**
- `category` - Filter by plant category (vegetables, herbs, fruits)
- `difficulty` - Filter by difficulty level (easy, medium, hard)
- `biome` - Filter by climate zone (zone_6b, zone_7a, etc.)
- `season` - Filter by growing season (spring, summer, fall, winter)
- `careLevel` - Filter by care level (beginner, intermediate, advanced)
- `page` - Page number for pagination (default: 1)
- `limit` - Items per page (default: 20)

**Example:**
```
GET /plants?category=vegetables&difficulty=easy&biome=zone_6b&page=1&limit=10
```

**Response:**
```json
{
  "plants": [/* filtered plant objects */],
  "pagination": {
    "currentPage": 1,
    "totalPages": 3,
    "totalPlants": 25,
    "hasNext": true,
    "hasPrev": false
  },
  "filters": {
    "category": "vegetables",
    "difficulty": "easy",
    "biome": "zone_6b"
  }
}
```

#### GET `/plants/:id`
Returns detailed information for a specific plant by ID.

**Example:**
```
GET /plants/carrot-001
```

**Response:** Complete plant object with all details

#### GET `/plants/search`
Search plants by name, description, or category.

**Query Parameters:**
- `q` - Search query (required)

**Example:**
```
GET /plants/search?q=tomato
```

**Response:**
```json
{
  "query": "tomato",
  "results": [/* matching plants */],
  "totalResults": 2
}
```

#### GET `/plants/seasonal`
Get seasonal plant recommendations based on month and biome.

**Query Parameters:**
- `month` - Month number (1-12, required)
- `biome` - Climate zone (required)

**Example:**
```
GET /plants/seasonal?month=6&biome=zone_6b
```

**Response:**
```json
{
  "month": 6,
  "season": "summer",
  "biome": "zone_6b",
  "plants": [/* seasonal plants */],
  "totalPlants": 8
}
```

#### GET `/biomes`
Returns all available climate zones and their characteristics.

#### GET `/categories`
Returns plant categories and their descriptions.

#### GET `/plants-data`
Returns the complete raw database structure (for development/debugging).

### Data Structure

#### Plant Object
```json
{
  "id": "carrot-001",
  "name": "Carrot",
  "emoji": "🥕",
  "category": "vegetables",
  "difficulty": "easy",
  "planting": "April–June",
  "harvest": "July–September",
  "growingTime": "60-80 days",
  "sunlight": "full",
  "water": "moderate",
  "soil": "loose, well-draining",
  "notes": "Care instructions and tips",
  "biomes": ["zone_6b", "zone_7a", "zone_7b"],
  "seasons": ["spring", "summer"],
  "images": ["carrot-seedling.jpg", "carrot-mature.jpg"],
  "careLevel": "beginner",
  "pests": ["carrot fly", "aphids"],
  "companions": ["onions", "rosemary"],
  "avoid": ["dill", "parsnips"]
}
```

#### Biome Information
```json
{
  "zone_6b": {
    "name": "Zone 6B",
    "description": "Cold winters, warm summers. Last frost: April 15-30, First frost: October 15-30",
    "climate": "temperate",
    "avgWinterTemp": "-5°F to 0°F",
    "avgSummerTemp": "70°F to 85°F"
  }
}
```

## Project Structure

```
pocket-plants-backend/
├── data/
│   └── plants.json          # Enhanced plant database with 10+ plants
├── server.js                # Enhanced server with all new endpoints
├── package.json             # Dependencies and scripts
└── README.md               # This comprehensive documentation
```

## Development

### Running in Development
```bash
npm start
```

### Testing Endpoints
Visit `http://localhost:3000` to see the interactive API documentation with clickable links to test all endpoints.

### Adding New Plants
Edit `data/plants.json` to add new plants following the established schema structure.

### Adding New Endpoints
Implement new routes in `server.js` following the existing pattern with proper error handling.

## Frontend Integration

This backend is designed to work seamlessly with React frontends:

- **Plant List Pages**: Use `/plants` with filtering for category/plant type pages
- **Product Detail Pages (PDPs)**: Use `/plants/:id` for individual plant pages
- **Search**: Use `/plants/search` for plant search functionality
- **Seasonal Recommendations**: Use `/plants/seasonal` for time-based suggestions
- **Filtering**: Use query parameters for advanced plant filtering

## Error Handling

All endpoints include comprehensive error handling:
- **400** - Bad Request (missing required parameters)
- **404** - Not Found (plant not found, invalid endpoint)
- **500** - Internal Server Error (server issues)

## Performance Features

- **Pagination**: Built-in pagination for large datasets
- **Efficient Filtering**: Optimized filtering algorithms
- **Error Recovery**: Graceful handling of data loading failures
- **CORS Ready**: Configured for frontend integration

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test your endpoints
5. Submit a pull request

## License

[Add your license here]

## Contact

[Add your contact information here]
