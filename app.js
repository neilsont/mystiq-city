import express from 'express';
import path from 'path';
import helmet from 'helmet';
import compression from 'compression';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.NODE_ENV === 'production' 
      ? 'https://mystiqcity.com' 
      : ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000'],
    methods: ['GET', 'POST']
  }
});

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "ws:", "wss:", "http://localhost:5173", "http://localhost:5174"]
    }
  }
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use('/api/', limiter);

// Middleware
app.use(cors());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files for production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'dist')));
}

// ===== API ROUTES =====

// Root endpoint - shows API info as HTML and JSON
app.get('/', (req, res) => {
  // Check if requesting JSON
  if (req.accepts('json')) {
    return res.json({
      name: 'MystiQ City Backend API',
      version: '2.0.0',
      description: 'Professional City Exploration Game Backend',
      endpoints: {
        health: 'GET /health',
        game: 'GET /api/game',
        players: 'GET /api/players',
        websocket: 'ws://localhost:8000'
      },
      status: 'online',
      timestamp: new Date().toISOString()
    });
  }

  // Send HTML response
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>MystiQ City Backend API</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
          background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
          color: #ecf0f1;
          margin: 0;
          padding: 20px;
          min-height: 100vh;
        }
        .container {
          max-width: 800px;
          margin: 0 auto;
          background: rgba(44, 62, 80, 0.8);
          border: 2px solid #f39c12;
          border-radius: 10px;
          padding: 40px;
          backdrop-filter: blur(10px);
        }
        h1 {
          color: #f39c12;
          margin: 0 0 10px 0;
          font-size: 2.5em;
        }
        .subtitle {
          color: #95a5a6;
          margin-bottom: 30px;
          font-size: 1.1em;
        }
        .status {
          background: rgba(46, 204, 113, 0.2);
          border: 1px solid #27ae60;
          border-radius: 5px;
          padding: 15px;
          margin-bottom: 20px;
        }
        .status-text {
          color: #2ecc71;
          font-weight: bold;
        }
        .endpoints {
          background: rgba(52, 152, 219, 0.1);
          border: 1px solid #3498db;
          border-radius: 5px;
          padding: 20px;
          margin-top: 20px;
        }
        .endpoints h2 {
          color: #3498db;
          margin-top: 0;
        }
        .endpoint {
          background: rgba(0, 0, 0, 0.3);
          border-left: 3px solid #f39c12;
          padding: 12px;
          margin-bottom: 10px;
          border-radius: 3px;
          font-family: 'Courier New', monospace;
        }
        .endpoint-method {
          color: #f39c12;
          font-weight: bold;
        }
        .endpoint-path {
          color: #3498db;
          margin-left: 10px;
        }
        .version {
          color: #95a5a6;
          font-size: 0.9em;
          margin-top: 30px;
          border-top: 1px solid #34495e;
          padding-top: 15px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>🏙️ MystiQ City</h1>
        <p class="subtitle">Backend API Server</p>
        
        <div class="status">
          <span class="status-text">✅ Server Online</span>
        </div>

        <div class="endpoints">
          <h2>Available Endpoints</h2>
          
          <div class="endpoint">
            <span class="endpoint-method">GET</span>
            <span class="endpoint-path">/health</span>
            <p style="margin: 5px 0 0 0; color: #95a5a6; font-size: 0.9em;">Check server health status</p>
          </div>

          <div class="endpoint">
            <span class="endpoint-method">GET</span>
            <span class="endpoint-path">/api/game</span>
            <p style="margin: 5px 0 0 0; color: #95a5a6; font-size: 0.9em;">Get game status</p>
          </div>

          <div class="endpoint">
            <span class="endpoint-method">GET</span>
            <span class="endpoint-path">/api/players</span>
            <p style="margin: 5px 0 0 0; color: #95a5a6; font-size: 0.9em;">Get online players</p>
          </div>

          <div class="endpoint">
            <span class="endpoint-method">WS</span>
            <span class="endpoint-path">ws://localhost:8000</span>
            <p style="margin: 5px 0 0 0; color: #95a5a6; font-size: 0.9em;">WebSocket connection</p>
          </div>
        </div>

        <div class="version">
          <strong>Version:</strong> 2.0.0<br>
          <strong>Environment:</strong> ${process.env.NODE_ENV || 'development'}<br>
          <strong>Uptime:</strong> ${Math.floor(process.uptime())}s
        </div>
      </div>
    </body>
    </html>
  `);
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: '2.0.0'
  });
});

// Game API
app.get('/api/game', (req, res) => {
  res.json({
    status: 'online',
    version: '2.0.0',
    message: 'MystiQ City API Ready'
  });
});

// Players API stub
app.get('/api/players', (req, res) => {
  res.json({
    players: [],
    message: 'Players endpoint'
  });
});

// Auth API stub
app.post('/api/auth/login', (req, res) => {
  res.json({ token: 'sample_token', message: 'Auth endpoint' });
});

// ===== WEBSOCKET CONNECTIONS =====

io.on('connection', (socket) => {
  console.log('✅ New player connected:', socket.id);
  
  socket.on('join-room', (roomId) => {
    socket.join(roomId);
    socket.to(roomId).emit('player-joined', socket.id);
    console.log(`Player ${socket.id} joined room ${roomId}`);
  });
  
  socket.on('player-move', (data) => {
    socket.to(data.roomId).emit('player-moved', {
      playerId: socket.id,
      position: data.position
    });
  });
  
  socket.on('chat-message', (data) => {
    io.to(data.roomId).emit('new-message', {
      playerId: socket.id,
      message: data.message,
      timestamp: Date.now()
    });
  });
  
  socket.on('disconnect', () => {
    console.log('🔌 Player disconnected:', socket.id);
    io.emit('player-left', socket.id);
  });
});

// ===== ERROR HANDLING =====

app.use((err, req, res, next) => {
  console.error('❌ Error:', err.stack);
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal Server Error',
      status: err.status || 500
    }
  });
});

// Serve React app in production
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
}

// ===== START SERVER =====

const PORT = process.env.PORT || 8000;
httpServer.listen(PORT, () => {
  console.log(`\n🚀 MystiQ City Server Running`);
  console.log(`📍 Port: ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔌 WebSocket: Ready`);
  console.log(`\n✨ Frontend: http://localhost:5173 or http://localhost:5174`);
  console.log(`✨ Backend: http://localhost:${PORT}\n`);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  httpServer.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});