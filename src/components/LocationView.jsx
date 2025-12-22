import React, { useState } from 'react';

const LocationView = ({ location, onBack, onCharacterSelect, onGameStart }) => {
  const [selectedTab, setSelectedTab] = useState('characters');

  // Character data - in a real app, this would come from a separate data file
  const characters = {
    'ceo-johnson': {
      id: 'ceo-johnson',
      name: 'Victoria Johnson',
      title: 'CEO of TechCorp',
      avatar: '👩‍💼',
      description: 'A visionary leader who built TechCorp from a startup to a global corporation',
      district: 'business',
      personality: 'Ambitious, Strategic, Decisive',
      skills: ['Leadership', 'Strategic Planning', 'Business Development'],
      relationship: 0,
      questAvailable: true,
      dialogues: {
        introduction: "Welcome to TechCorp! I hear you're making quite an impression around the city. What brings you to my office today?",
        business: "The business world is constantly evolving. Those who can't adapt get left behind. Are you ready for the challenges ahead?",
        tech: "Technology is just a tool. True innovation comes from understanding people's needs and solving real problems.",
        goodbye: "Remember, in business and in life, it's not about having all the answers. It's about asking the right questions."
      },
      quests: {
        'first-meeting': {
          title: 'The Corporate Challenge',
          description: 'Help Victoria solve a strategic business puzzle to prove your worth in the corporate world.',
          requirements: { level: 1, reputation: 0 },
          rewards: { experience: 100, reputation: 50, relationship: 10 }
        }
      }
    },
    'curator-elena': {
      id: 'curator-elena',
      name: 'Elena Rodriguez',
      title: 'Chief Curator',
      avatar: '👩‍🎨',
      description: 'A passionate art historian dedicated to preserving and sharing beauty with the world',
      district: 'arts',
      personality: 'Creative, Thoughtful, Inspiring',
      skills: ['Art History', 'Cultural Analysis', 'Aesthetic Appreciation'],
      relationship: 0,
      questAvailable: true,
      dialogues: {
        introduction: "Art speaks to the soul in ways words cannot. What draws you to explore our gallery today?",
        business: "True art cannot be bought, only appreciated. But understanding the business of art is equally important.",
        tech: "Technology and art are not opposites. When combined thoughtfully, they create extraordinary experiences.",
        goodbye: "May the beauty you discover here inspire you to create something meaningful in your own life."
      },
      quests: {
        'art-appreciation': {
          title: 'The Curator\'s Challenge',
          description: 'Demonstrate your artistic understanding by solving a complex pattern recognition puzzle.',
          requirements: { level: 2, reputation: 25 },
          rewards: { experience: 150, reputation: 30, relationship: 15 }
        }
      }
    },
    'founder-alex': {
      id: 'founder-alex',
      name: 'Alex Chen',
      title: 'Serial Entrepreneur',
      avatar: '👨‍💻',
      description: 'A tech entrepreneur who has launched three successful startups and is working on his fourth',
      district: 'tech',
      personality: 'Innovative, Risk-taking, Visionary',
      skills: ['Innovation', 'Problem Solving', 'Technical Leadership'],
      relationship: 0,
      questAvailable: true,
      dialogues: {
        introduction: "Another entrepreneur in the making, I can see it in your eyes! What problem are you passionate about solving?",
        business: "Every great business starts with solving a real problem for real people. Focus on the problem, not the solution.",
        tech: "Code is poetry, but it's the impact of that code that changes the world. Always remember why you're building.",
        goodbye: "The best time to start was yesterday. The second best time is now. Keep building!"
      },
      quests: {
        'startup-challenge': {
          title: 'The Innovation Test',
          description: 'Prove your technical skills by cracking a complex coding challenge.',
          requirements: { level: 3, reputation: 50 },
          rewards: { experience: 200, reputation: 40, relationship: 20 }
        }
      }
    },
    'historian-prof-henry': {
      id: 'historian-prof-henry',
      name: 'Professor Henry Thompson',
      title: 'City Historian',
      avatar: '👨‍🏫',
      description: 'A scholarly expert on MystiQ City\'s rich history and cultural heritage',
      district: 'historical',
      personality: 'Wise, Methodical, Passionate about Knowledge',
      skills: ['Historical Research', 'Cultural Analysis', 'Academic Writing'],
      relationship: 0,
      questAvailable: true,
      dialogues: {
        introduction: "History is not just the past - it's the foundation upon which we build our future. What era interests you most?",
        business: "The great merchants and entrepreneurs of history were often visionaries who saw opportunities others missed.",
        tech: "We are living through one of the most rapid technological changes in human history. Fascinating times indeed!",
        goodbye: "Remember, those who cannot remember the past are condemned to repeat it. But those who understand it can shape the future."
      },
      quests: {
        'historical-research': {
          title: 'The Scholar\'s Quest',
          description: 'Help Professor Thompson decode a historical mystery using your analytical skills.',
          requirements: { level: 4, reputation: 75 },
          rewards: { experience: 250, reputation: 50, relationship: 25 }
        }
      }
    }
  };

  const handleCharacterClick = (characterId) => {
    const character = characters[characterId];
    if (character) {
      onCharacterSelect(character);
    }
  };

  const handleGameStart = () => {
    if (location.minigame) {
      onGameStart(location.minigame);
    }
  };

  const formatActivityName = (activity) => {
    return activity.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const getActivityDescription = (activity) => {
    const descriptions = {
      'networking': 'Connect with other professionals and build relationships',
      'business-meeting': 'Participate in strategic discussions and decision making',
      'art-appreciation': 'Study and understand various forms of artistic expression',
      'theater-workshop': 'Learn acting techniques and performance skills',
      'art-creation': 'Express your creativity through various artistic mediums',
      'hackathon': 'Collaborate on innovative technical projects',
      'pitch-presentation': 'Present your ideas to potential investors and partners',
      'ai-training': 'Learn about artificial intelligence and machine learning',
      'algorithm-design': 'Solve complex computational problems',
      'security-audit': 'Analyze and improve system security measures',
      'historical-research': 'Investigate historical events and artifacts',
      'artifact-analysis': 'Examine and interpret historical objects',
      'manuscript-study': 'Decode and translate ancient texts',
      'historical-tour': 'Explore the city\'s historical landmarks',
      'community-service': 'Contribute to the local community',
      'coffee-chat': 'Casual conversations with locals',
      'gardening': 'Learn about plant care and environmental stewardship',
      'outdoor-activities': 'Participate in recreational activities'
    };
    return descriptions[activity] || 'Engage in this activity';
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

  const getGameDescription = (gameId) => {
    const gameDescriptions = {
      'hangman': 'Solve word puzzles by guessing letters - perfect for detective work and research',
      'match-3': 'Connect matching patterns to clear the board - great for artistic and analytical thinking',
      'code-breaking': 'Decrypt coded messages using logical deduction - essential for tech and security work',
      'pattern-recognition': 'Identify and complete complex patterns - crucial for artistic and analytical work',
      'business-strategy': 'Make strategic business decisions to grow your company - learn real business principles'
    };
    return gameDescriptions[gameId] || 'Engage in this mini-game to earn experience and reputation.';
  };

  if (!location) {
    return (
      <div className="location-view">
        <div className="error-message">
          No location selected. Please go back to the district.
        </div>
      </div>
    );
  }

  return (
    <div className="location-view">
      {/* Location Header */}
      <div className="location-header">
        <button className="back-button" onClick={onBack}>
          ← Back to District
        </button>
        <div className="location-info">
          <h2 className="location-title">{location.name}</h2>
          <div className="location-type">{location.type}</div>
          <p className="location-description">{location.description}</p>
        </div>
      </div>

      {/* Content Tabs */}
      <div className="location-content">
        <div className="content-tabs">
          <button 
            className={`tab-button ${selectedTab === 'characters' ? 'active' : ''}`}
            onClick={() => setSelectedTab('characters')}
          >
            Characters ({location.characters.length})
          </button>
          <button 
            className={`tab-button ${selectedTab === 'activities' ? 'active' : ''}`}
            onClick={() => setSelectedTab('activities')}
          >
            Activities ({location.activities.length})
          </button>
          {location.minigame && (
            <button 
              className={`tab-button ${selectedTab === 'games' ? 'active' : ''}`}
              onClick={() => setSelectedTab('games')}
            >
              Mini-Games
            </button>
          )}
        </div>

        <div className="tab-content">
          {/* Characters Tab */}
          {selectedTab === 'characters' && (
            <div className="characters-section">
              <h3>People Here</h3>
              <div className="characters-list">
                {location.characters.map(characterId => {
                  const character = characters[characterId];
                  if (!character) return null;
                  
                  return (
                    <div
                      key={characterId}
                      className="character-card"
                      onClick={() => handleCharacterClick(characterId)}
                    >
                      <div className="character-avatar">{character.avatar}</div>
                      <div className="character-info">
                        <h4 className="character-name">{character.name}</h4>
                        <p className="character-title">{character.title}</p>
                        <div className="character-personality">{character.personality}</div>
                        <div className="character-skills">
                          {character.skills.slice(0, 2).map((skill, index) => (
                            <span key={index} className="skill-tag">{skill}</span>
                          ))}
                        </div>
                        <div className="character-relationship">
                          <span className="relationship-label">Relationship:</span>
                          <span className="relationship-value">
                            {character.relationship >= 50 ? '😊' : character.relationship >= 0 ? '😐' : '😔'} 
                            {character.relationship}
                          </span>
                        </div>
                        {character.questAvailable && (
                          <div className="quest-indicator">
                            <span className="quest-icon">🎯</span>
                            <span>Quest Available</span>
                          </div>
                        )}
                      </div>
                      <button className="talk-to-character-button">
                        Talk
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Activities Tab */}
          {selectedTab === 'activities' && (
            <div className="activities-section">
              <h3>Available Activities</h3>
              <div className="activities-list">
                {location.activities.map((activity, index) => (
                  <div key={index} className="activity-card">
                    <div className="activity-header">
                      <h4 className="activity-name">{formatActivityName(activity)}</h4>
                      <div className="activity-icon">
                        {getActivityIcon(activity)}
                      </div>
                    </div>
                    <p className="activity-description">
                      {getActivityDescription(activity)}
                    </p>
                    <div className="activity-benefits">
                      <span className="benefit">Experience: +10-20</span>
                      <span className="benefit">Reputation: +5-10</span>
                    </div>
                    <button className="activity-button">
                      Start Activity
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Games Tab */}
          {selectedTab === 'games' && location.minigame && (
            <div className="games-section">
              <h3>Mini-Games Available</h3>
              <div className="games-list">
                <div className="game-card featured">
                  <div className="game-header">
                    <div className="game-icon">🎮</div>
                    <div className="game-info">
                      <h4 className="game-name">{getGameDisplayName(location.minigame)}</h4>
                      <p className="game-description">{getGameDescription(location.minigame)}</p>
                    </div>
                  </div>
                  
                  <div className="game-stats">
                    <div className="game-stat">
                      <span className="stat-label">Difficulty:</span>
                      <span className="stat-value">{getGameDifficulty(location.minigame)}</span>
                    </div>
                    <div className="game-stat">
                      <span className="stat-label">Experience:</span>
                      <span className="stat-value">+50-100</span>
                    </div>
                    <div className="game-stat">
                      <span className="stat-label">Reputation:</span>
                      <span className="stat-value">+10-25</span>
                    </div>
                  </div>
                  
                  <button className="play-game-button primary" onClick={handleGameStart}>
                    Play Game
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Helper functions
const getActivityIcon = (activity) => {
  const iconMap = {
    'networking': '🤝',
    'business-meeting': '💼',
    'art-appreciation': '🎨',
    'theater-workshop': '🎭',
    'art-creation': '🖌️',
    'hackathon': '💻',
    'pitch-presentation': '📊',
    'ai-training': '🤖',
    'algorithm-design': '🧮',
    'security-audit': '🔒',
    'historical-research': '📚',
    'artifact-analysis': '🏺',
    'manuscript-study': '📜',
    'historical-tour': '🚶',
    'community-service': '🤲',
    'coffee-chat': '☕',
    'gardening': '🌱',
    'outdoor-activities': '🏃'
  };
  return iconMap[activity] || '⚡';
};

const getGameDifficulty = (gameId) => {
  const difficultyMap = {
    'hangman': 'Easy to Medium',
    'match-3': 'Medium to Hard',
    'code-breaking': 'Medium',
    'pattern-recognition': 'Medium to Hard',
    'business-strategy': 'Medium to Hard'
  };
  return difficultyMap[gameId] || 'Medium';
};

export default LocationView;
