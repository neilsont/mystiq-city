# 🏙️ MystiQ City

A professional city exploration game where you navigate districts, meet characters, and complete quests to become a legend.

**Status:** Active | **Version:** 2.0.0 | **License:** MIT

## Features

- **Six Unique Districts** - Business, Arts, Tech, Historical, Entertainment, and Residential
- **Dynamic Characters** - Meet NPCs with dialogue and quests
- **Mini-Games** - Interactive challenges to earn rewards
- **Quest System** - Track active quests and progression
- **Modern UI** - Beautiful gradient design with animations
- **Real-time Updates** - WebSocket support for multiplayer
- **Responsive Design** - Works on desktop and mobile

## Quick Start

### Requirements

- Node.js 14.0+
- npm 6.0+

### Installation

```bash
git clone <repository-url>
cd mystiq-city
npm install
npm start
```

The app will open automatically. If not, visit:
- **Frontend:** http://localhost:5173
- **Backend:** http://localhost:8000

### Run Separately

```bash
# Terminal 1 - Backend
npm run server

# Terminal 2 - Frontend  
npm run dev
```

## Project Structure

```
mystiq-city/
├── src/
│   ├── components/
│   │   └── MystiQCity.jsx
│   ├── styles/
│   │   └── index.css
│   ├── index.jsx
│   └── App.jsx
├── public/
│   └── index.html
├── app.js
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

## How to Play

**Map View** - Explore all 6 districts and view your stats

**District View** - See locations and characters in each district

**Location View** - Meet NPCs and access mini-games

**Character View** - Have conversations and accept quests

## Technology Stack

**Frontend:**
- React 18
- Vite
- Tailwind CSS
- Lucide React

**Backend:**
- Express.js
- Socket.io
- Helmet
- CORS

## Available Commands

```bash
npm start              # Start frontend + backend
npm run dev            # Start frontend only
npm run server         # Start backend only
npm run build          # Build for production
npm run preview        # Preview build
npm run kill:ports     # Kill port 5173 & 8000
```

## API Endpoints

**GET /** - API dashboard and documentation

**GET /health** - Server health check

**GET /api/game** - Game status

**GET /api/players** - Online players list

**WebSocket:** ws://localhost:8000

## Customization

### Add a New District

Edit `src/components/MystiQCity.jsx` in the `districts` array:

```jsx
{
  id: 'new-id',
  name: 'District Name',
  icon: '🎯',
  color: 'from-indigo-600 to-indigo-400',
  description: 'Description',
  locked: false,
  level: 7,
  locations: []
}
```

### Change Colors

Edit `tailwind.config.js`:

```javascript
colors: {
  gold: '#f39c12',
  mystiq: {
    primary: '#2c3e50',
    secondary: '#3498db',
  }
}
```

## Security

- Helmet.js for HTTP headers
- CORS protection
- Rate limiting (100 requests per 15 min)
- Input validation
- Content Security Policy

## Troubleshooting

**Port Already in Use:**
```bash
npm run kill:ports
```

**Module Errors:**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Frontend Blank:**
- Check browser console (F12)
- Verify vite.config.js proxy settings
- Restart dev server

**Backend Not Responding:**
- Verify `npm run server` is running
- Check port 8000 is available
- Review app.js for errors

## Production Deployment

### Build

```bash
npm run build
```

Creates optimized `dist/` folder.

### Environment Variables

Create `.env` file:

```
NODE_ENV=production
PORT=8000
```

### Deploy to Heroku

```bash
heroku create mystiq-city
heroku config:set NODE_ENV=production
git push heroku main
```

### Deploy to Other Platforms

The app works on any platform supporting Node.js:
- Vercel (Frontend)
- Railway (Backend)
- Render
- Netlify
- AWS
- DigitalOcean

## Districts

| District | Level | Type | Features |
|----------|-------|------|----------|
| Business | 1 | Corporate | Offices, innovation |
| Arts | 2 | Creative | Museums, galleries |
| Tech | 3 | Research | Startups, labs |
| Historical | 4 | Cultural | Museums, archives |
| Entertainment | 5 | Leisure | Casinos, clubs |
| Residential | 6 | Community | Neighborhoods |

## Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/your-feature`
3. Commit: `git commit -m 'Add feature'`
4. Push: `git push origin feature/your-feature`
5. Open Pull Request

## Roadmap

- Mobile-optimized controls
- Multiplayer lobbies
- Advanced dialogue system
- Inventory system
- Trading system
- Leaderboards
- Achievements
- Seasonal events
- NPC AI improvements
- Voice chat

## Support

- **Issues:** Open GitHub issue
- **Email:** [cosmicpenguin2@gmail.com]
- **Documentation:** Check README

## License

MIT License - See LICENSE file for details

## Resources

- [React](https://react.dev)
- [Vite](https://vitejs.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Express.js](https://expressjs.com)
- [Socket.io](https://socket.io)

## Acknowledgments

Built with React, Tailwind CSS, and Lucide React. Thanks to all contributors!

---

Made with ❤️ for the gaming community

**Version 2.0.0** | Updated December 2025
