# Pocket Plants Backend 🌱

A Node.js backend service for managing a virtual garden and plant database. This API provides endpoints for tracking plants, managing gardens, and accessing plant information based on biomes and growing seasons.

## Features

- **Plant Database**: Access plant information including planting/harvest times and care notes
- **Biome Support**: Plant recommendations based on climate zones (currently supports Zone 6B)
- **Garden Management**: Track your personal garden with plants
- **Seasonal Planting**: Get plant recommendations based on current month and growing season

## Tech Stack

- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **CORS** - Cross-origin resource sharing support
- **ES Modules** - Modern JavaScript module system

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

### Current Endpoints

#### GET `/`
Returns a simple HTML page with links to all available API endpoints and documentation.

#### GET `/plants`
Returns a list of available plants with basic information.

**Response:**
```json
[
  { "name": "Carrot", "emoji": "🥕" },
  { "name": "Zucchini", "emoji": "🥒" }
]
```

#### GET `/plants-data`
Returns the complete plants.json database with all biome and seasonal data.

**Response:** Full JSON structure from `data/plants.json`

### Planned Endpoints

The following endpoints are planned for future development:

#### Garden Management
- `GET /my-biome` - Get user's current biome/climate zone
- `GET /my-garden` - Get user's current plants
- `POST /garden/add` - Add a plant to user's garden
- `DELETE /garden/remove/:plantId` - Remove a plant from garden
- `PUT /garden/:plantId` - Edit plant status (harvest, grow, etc.)

#### Plant Information
- `GET /biomes` - Get all available biomes
- `GET /plants/:biome` - Get plants available in specific biome
- `GET /plants/:biome/:month` - Get plants for specific biome and month

## Data Structure

### Plant Object
```json
{
  "name": "Plant Name",
  "emoji": "🌱",
  "planting": "Planting Season",
  "harvest": "Harvest Season",
  "notes": "Care instructions and tips"
}
```

### Biome Data
Plants are organized by climate zones and months:
```json
{
  "zone_6b": {
    "June": [/* plants for June */],
    "July": [/* plants for July */]
  }
}
```

## Project Structure

```
pocket-plants-backend/
├── data/
│   └── plants.json          # Plant database by biome and month
├── server.js                # Main server file
├── package.json             # Dependencies and scripts
└── README.md               # This file
```

## Development

### Running in Development
```bash
npm start
```

### Adding New Plants
Edit `data/plants.json` to add new plants, biomes, or months.

### Adding New Endpoints
Implement new routes in `server.js` following the existing pattern.

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
