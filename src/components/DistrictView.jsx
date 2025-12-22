import React, { useState, useEffect } from 'react';

const DistrictView = ({ district, onBack, onLocationSelect }) => {
  const [locations, setLocations] = useState([]);

  // Game data - in a real app, this would come from a separate data file
  const gameLocations = {
    business: [
      {
        id: 'corporate-hq',
        name: 'TechCorp Headquarters',
        type: 'Corporate Office',
        description: 'A modern glass tower housing one of the largest technology companies',
        characters: ['ceo-johnson', 'cto-sarah'],
        activities: ['business-strategy', 'networking'],
        minigame: 'business-strategy'
      },
      {
        id: 'innovation-center',
        name: 'Innovation Center',
        type: 'Research Facility',
        description: 'Where breakthrough ideas become reality through collaboration',
        characters: ['innovator-maya', 'researcher-david'],
        activities: ['code-breaking', 'pattern-recognition'],
        minigame: 'code-breaking'
      },
      {
        id: 'business-lounge',
        name: 'Executive Lounge',
        type: 'Networking Space',
        description: 'An exclusive venue for high-level business connections',
        characters: ['investor-robert', 'consultant-lisa'],
        activities: ['networking', 'business-meeting'],
        minigame: 'hangman'
      }
    ],
    tech: [
      {
        id: 'startup-incubator',
        name: 'Startup Incubator',
        type: 'Co-working Space',
        description: 'A bustling hub where ambitious entrepreneurs launch their dreams',
        characters: ['founder-alex', 'developer-priya'],
        activities: ['hackathon', 'pitch-presentation'],
        minigame: 'code-breaking'
      },
      {
        id: 'ai-research-lab',
        name: 'AI Research Laboratory',
        type: 'Research Institute',
        description: 'Cutting-edge facility developing tomorrow\'s intelligent systems',
        characters: ['ai-researcher-dr-wong', 'data-scientist-nina'],
        activities: ['ai-training', 'algorithm-design'],
        minigame: 'pattern-recognition'
      },
      {
        id: 'cyber-security-firm',
        name: 'CyberGuard Security',
        type: 'Security Firm',
        description: 'Protecting the digital infrastructure of the entire city',
        characters: ['security-expert-tom', 'hacker-ethan'],
        activities: ['security-audit', 'threat-analysis'],
        minigame: 'hangman'
      }
    ],
    arts: [
      {
        id: 'modern-gallery',
        name: 'Modern Art Gallery',
        type: 'Art Museum',
        description: 'Showcasing contemporary masterpieces from local and international artists',
        characters: ['curator-elena', 'artist-marco'],
        activities: ['art-appreciation', 'pattern-recognition'],
        minigame: 'pattern-recognition'
      },
      {
        id: 'theater-district',
        name: 'Grand Theater',
        type: 'Performance Venue',
        description: 'A historic venue for world-class theatrical performances',
        characters: ['director-victoria', 'actor-james'],
        activities: ['theater-workshop', 'audition'],
        minigame: 'hangman'
      },
      {
        id: 'artist-studios',
        name: 'Artist Studios Complex',
        type: 'Creative Workspace',
        description: 'A converted warehouse filled with working artists and their creations',
        characters: ['painter-anna', 'sculptor-carlos'],
        activities: ['art-creation', 'collaboration'],
        minigame: 'match-3'
      }
    ],
    historical: [
      {
        id: 'city-museum',
        name: 'City Museum',
        type: 'Historical Museum',
        description: 'Chronicling the rich history and evolution of MystiQ City',
        characters: ['historian-prof-henry', 'archivist-sophia'],
        activities: ['historical-research', 'artifact-analysis'],
        minigame: 'hangman'
      },
      {
        id: 'ancient-library',
        name: 'Ancient Library',
        type: 'Research Library',
        description: 'A treasure trove of ancient texts and forgotten knowledge',
        characters: ['librarian-mr-parker', 'scholar-dr-kim'],
        activities: ['manuscript-study', 'translation'],
        minigame: 'pattern-recognition'
      },
      {
        id: 'heritage-site',
        name: 'Founders Monument',
        type: 'Historic Landmark',
        description: 'A memorial to the visionary founders who built this great city',
        characters: ['tour-guide-maria', 'preservationist-john'],
        activities: ['historical-tour', 'monument-study'],
        minigame: 'match-3'
      }
    ],
    entertainment: [
      {
        id: 'luxury-casino',
        name: 'Golden Phoenix Casino',
        type: 'Entertainment Complex',
        description: 'The city\'s most exclusive gaming and entertainment destination',
        characters: ['casino-owner-vincent', 'poker-champion-grace'],
        activities: ['high-stakes-gaming', 'vip-entertainment'],
        minigame: 'hangman'
      },
      {
        id: 'sports-complex',
        name: 'Metropolitan Sports Arena',
        type: 'Sports Venue',
        description: 'State-of-the-art facility hosting major sporting events',
        characters: ['coach-brian', 'athlete-samantha'],
        activities: ['sports-training', 'competition'],
        minigame: 'match-3'
      },
      {
        id: 'nightclub-district',
        name: 'Neon Nights Club',
        type: 'Entertainment Venue',
        description: 'The hottest spot for music, dancing, and social networking',
        characters: ['dj-alex', 'entertainer-crystal'],
        activities: ['dance-off', 'networking'],
        minigame: 'pattern-recognition'
      }
    ],
    residential: [
      {
        id: 'community-center',
        name: 'Neighborhood Community Center',
        type: 'Community Hub',
        description: 'The heart of local community life and social activities',
        characters: ['community-leader-pat', 'neighbor-sue'],
        activities: ['community-service', 'local-meeting'],
        minigame: 'hangman'
      },
      {
        id: 'local-cafe',
        name: 'Cornerstone Café',
        type: 'Local Business',
        description: 'A cozy neighborhood café serving the best coffee in the city',
        characters: ['cafe-owner-mike', 'barista-jenny'],
        activities: ['coffee-chat', 'local-gossip'],
        minigame: 'pattern-recognition'
      },
      {
        id: 'park-gardens',
        name: 'Central Park Gardens',
        type: 'Public Space',
        description: 'A beautiful green oasis in the heart of the residential area',
        characters: ['gardener-rob', 'jogger-lee'],
        activities: ['gardening', 'outdoor-activities'],
        minigame: 'match-3'
      }
    ]
  };

  useEffect(() => {
    if (district?.id) {
      setLocations(gameLocations[district.id] || []);
    }
  }, [district]);

  const handleLocationClick = (location) => {
    onLocationSelect(location);
  };

  if (!district) {
    return (
      <div className="district-view">
        <div className="error-message">
          No district selected. Please go back to the map.
        </div>
      </div>
    );
  }

  return (
    <div className="district-view">
      {/* District Header */}
      <div className="district-header">
        <button className="back-button" onClick={onBack}>
          ← Back to Map
        </button>
        <div className="district-info">
          <h2 className="district-title">{district.name}</h2>
          <p className="district-description">{district.description}</p>
        </div>
        <div className="district-stats">
          <div className="stat">
            <span className="stat-label">Locations:</span>
            <span className="stat-value">{locations.length}</span>
          </div>
          <div className="stat">
            <span className="stat-label">District ID:</span>
            <span className="stat-value">{district.id}</span>
          </div>
        </div>
      </div>

      {/* Locations Grid */}
      <div className="district-content">
        <div className="locations-grid">
          {locations.map(location => (
            <div
              key={location.id}
              className="location-card"
              onClick={() => handleLocationClick(location)}
            >
              <div className="location-header">
                <h3 className="location-name">{location.name}</h3>
                <div className="location-type-badge">{location.type}</div>
              </div>
              
              <div className="location-description">
                {location.description}
              </div>
              
              <div className="location-stats">
                <div className="location-stat">
                  <span className="stat-icon">👥</span>
                  <span>{location.characters.length} characters</span>
                </div>
                <div className="location-stat">
                  <span className="stat-icon">🎮</span>
                  <span>{location.minigame ? 'Game available' : 'No games'}</span>
                </div>
                <div className="location-stat">
                  <span className="stat-icon">⚡</span>
                  <span>{location.activities.length} activities</span>
                </div>
              </div>
              
              <div className="location-preview">
                <div className="character-avatars">
                  {location.characters.slice(0, 3).map((characterId, index) => (
                    <div key={characterId} className="character-avatar-preview">
                      {getCharacterEmoji(characterId)}
                    </div>
                  ))}
                  {location.characters.length > 3 && (
                    <div className="character-more">+{location.characters.length - 3}</div>
                  )}
                </div>
                
                {location.minigame && (
                  <div className="minigame-indicator">
                    <span className="game-icon">🎮</span>
                    <span className="game-name">{getGameDisplayName(location.minigame)}</span>
                  </div>
                )}
              </div>
              
              <button className="visit-location-button primary">
                Visit Location
              </button>
            </div>
          ))}
        </div>

        {/* Empty state if no locations */}
        {locations.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">🏢</div>
            <h3>No Locations Available</h3>
            <p>This district doesn't have any locations yet. Check back soon!</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Helper functions
const getCharacterEmoji = (characterId) => {
  const emojiMap = {
    'ceo-johnson': '👩‍💼',
    'cto-sarah': '👩‍💻',
    'innovator-maya': '👩‍🔬',
    'researcher-david': '👨‍🔬',
    'investor-robert': '👨‍💼',
    'consultant-lisa': '👩‍💼',
    'founder-alex': '👨‍💻',
    'developer-priya': '👩‍💻',
    'ai-researcher-dr-wong': '👨‍🔬',
    'data-scientist-nina': '👩‍🔬',
    'security-expert-tom': '👨‍💻',
    'hacker-ethan': '👨‍💻',
    'curator-elena': '👩‍🎨',
    'artist-marco': '👨‍🎨',
    'director-victoria': '👩‍🎭',
    'actor-james': '👨‍🎭',
    'painter-anna': '👩‍🎨',
    'sculptor-carlos': '👨‍🎨',
    'historian-prof-henry': '👨‍🏫',
    'archivist-sophia': '👩‍🏫',
    'librarian-mr-parker': '👨‍💼',
    'scholar-dr-kim': '👩‍🏫',
    'tour-guide-maria': '👩‍🏫',
    'preservationist-john': '👨‍🏫',
    'casino-owner-vincent': '👨‍💼',
    'poker-champion-grace': '👩‍💼',
    'coach-brian': '👨‍🏫',
    'athlete-samantha': '👩‍🏃',
    'dj-alex': '👨‍🎵',
    'entertainer-crystal': '👩‍🎵',
    'community-leader-pat': '👨‍🏫',
    'neighbor-sue': '👩‍🏠',
    'cafe-owner-mike': '👨‍🍳',
    'barista-jenny': '👩‍🍳',
    'gardener-rob': '👨‍🌾',
    'jogger-lee': '👨‍🏃'
  };
  return emojiMap[characterId] || '👤';
};

const getGameDisplayName = (gameId) => {
  const gameNames = {
    'hangman': 'Word Mystery',
    'match-3': 'Pattern Connect',
    'code-breaking': 'Cipher Solver',
    'pattern-recognition': 'Pattern Master',
    'business-strategy': 'Corporate Decisions'
  };
  return gameNames[gameId] || 'Mini-Game';
};

export default DistrictView;
