const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const path = require('path');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*", // Change this in production
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(helmet());
app.use(compression());
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/players', require('./routes/players'));
app.use('/api/game', require('./routes/game'));

// Game state storage (in production, use Redis or database)
const gameState = {
  players: new Map(),
  rooms: new Map(),
  locations: new Map()
};

// Routes
app.get('/', (req, res) => {
  res.json({
    message: 'MystiQ City Backend API',
    version: '1.0.0',
    endpoints: {
      game: '/api/game',
      players: '/api/players',
      stats: '/api/stats'
    }
  });
});

app.get('/api/game', (req, res) => {
  res.json({
    status: 'online',
    players: gameState.players.size,
    rooms: gameState.rooms.size,
    uptime: process.uptime()
  });
});

app.get('/api/players', (req, res) => {
  const players = Array.from(gameState.players.values()).map(player => ({
    id: player.id,
    name: player.name,
    level: player.level,
    location: player.location,
    online: player.online
  }));
  res.json(players);
});

app.get('/api/stats', (req, res) => {
  res.json({
    totalPlayers: gameState.players.size,
    activeRooms: gameState.rooms.size,
    systemLoad: process.cpuUsage(),
    memoryUsage: process.memoryUsage()
  });
});

// Socket.io event handlers
io.on('connection', (socket) => {
  console.log('New connection:', socket.id);

  // Player registration
  socket.on('register-player', (playerData) => {
    const player = {
      id: socket.id,
      socketId: socket.id,
      name: playerData.name || 'Explorer',
      level: playerData.level || 1,
      experience: playerData.experience || 0,
      reputation: playerData.reputation || 0,
      location: playerData.location || 'city-center',
      district: playerData.district || 'business',
      online: true,
      connectedAt: Date.now(),
      lastActivity: Date.now()
    };

    gameState.players.set(socket.id, player);
    
    // Send welcome message
    socket.emit('welcome', {
      message: `Welcome to MystiQ City, ${player.name}!`,
      player,
      gameState: {
        districts: ['business', 'arts', 'tech', 'historical', 'entertainment', 'residential'],
        locations: ['city-center', 'corporate-hq', 'modern-gallery', 'innovation-center']
      }
    });

    // Notify other players
    socket.broadcast.emit('player-joined', {
      playerId: socket.id,
      name: player.name,
      location: player.location
    });
  });

  // Player movement
  socket.on('player-move', (data) => {
    const player = gameState.players.get(socket.id);
    if (player) {
      player.location = data.location;
      player.district = data.district;
      player.lastActivity = Date.now();

      // Update player in storage
      gameState.players.set(socket.id, player);

      // Broadcast movement to other players in same location
      socket.broadcast.emit('player-moved', {
        playerId: socket.id,
        name: player.name,
        location: data.location,
        district: data.district
      });
    }
  });

  // Character interaction
  socket.on('character-interaction', (data) => {
    const player = gameState.players.get(socket.id);
    if (player) {
      console.log(`${player.name} interacting with ${data.characterId} at ${data.location}`);
      
      // Process interaction
      const response = {
        characterId: data.characterId,
        dialogue: getCharacterDialogue(data.characterId),
        options: ['Talk', 'Trade', 'Quest', 'Goodbye']
      };

      socket.emit('character-response', response);
    }
  });

  // Mini-game results
  socket.on('game-complete', (data) => {
    const player = gameState.players.get(socket.id);
    if (player) {
      // Calculate rewards
      const rewards = calculateRewards(data.gameId, data.score);
      
      // Update player stats
      player.experience += rewards.experience;
      player.reputation += rewards.reputation;
      
      // Check for level up
      const newLevel = Math.floor(player.experience / 1000) + 1;
      if (newLevel > player.level) {
        player.level = newLevel;
        socket.emit('level-up', { newLevel, rewards });
      }

      // Update player
      gameState.players.set(socket.id, player);

      socket.emit('game-rewards', rewards);
    }
  });

  // Chat messages
  socket.on('chat-message', (data) => {
    const player = gameState.players.get(socket.id);
    if (player) {
      const message = {
        playerId: socket.id,
        playerName: player.name,
        message: data.message,
        timestamp: Date.now(),
        location: player.location
      };

      // Broadcast to players in same location
      io.emit('new-chat-message', message);
    }
  });

  // Room management
  socket.on('join-room', (roomId) => {
    socket.join(roomId);
    const player = gameState.players.get(socket.id);
    if (player) {
      console.log(`${player.name} joined room ${roomId}`);
      socket.to(roomId).emit('player-joined-room', {
        playerId: socket.id,
        playerName: player.name
      });
    }
  });

  socket.on('leave-room', (roomId) => {
    socket.leave(roomId);
  });

  // Disconnect handling
  socket.on('disconnect', () => {
    const player = gameState.players.get(socket.id);
    if (player) {
      player.online = false;
      player.disconnectedAt = Date.now();
      gameState.players.set(socket.id, player);
      
      console.log(`${player.name} disconnected`);
      socket.broadcast.emit('player-left', {
        playerId: socket.id,
        name: player.name
      });
    }
  });
});

// Helper functions
function getCharacterDialogue(characterId) {
  const dialogues = {
    'ceo-johnson': "Welcome to TechCorp! I hear you're making quite an impression around the city.",
    'curator-elena': "Art speaks to the soul in ways words cannot.",
    'founder-alex': "Another entrepreneur in the making, I can see it in your eyes!",
    'historian-prof-henry': "History is not just the past - it's the foundation upon which we build our future."
  };
  return dialogues[characterId] || "Hello there, explorer!";
}

function calculateRewards(gameId, score) {
  const baseRewards = {
    'hangman': { experience: 50, reputation: 10 },
    'match-3': { experience: 75, reputation: 15 },
    'code-breaking': { experience: 100, reputation: 20 }
  };

  const game = baseRewards[gameId] || { experience: 30, reputation: 5 };
  const multiplier = Math.min(score / 1000, 3); // Cap at 3x

  return {
    experience: Math.floor(game.experience * multiplier),
    reputation: Math.floor(game.reputation * multiplier),
    currency: Math.floor(score / 10)
  };
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(`🚀 MystiQ City Backend Server running on port ${PORT}`);
  console.log(`📡 WebSocket server ready for connections`);
  console.log(`🌐 API available at http://localhost:${PORT}`);
  console.log(`🕹️  Game stats at http://localhost:${PORT}/api/game`);
});
