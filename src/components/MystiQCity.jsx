import React, { useState, useEffect } from 'react';
import { MapPin, Users, Gamepad2, Settings, Menu, X, ChevronRight, Lock, Star, Zap, Clock, Heart } from 'lucide-react';

export default function MystiQCity() {
  const [currentView, setCurrentView] = useState('map');
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [playerLevel, setPlayerLevel] = useState(1);
  const [playerXP, setPlayerXP] = useState(0);
  const [playerRep, setPlayerRep] = useState(0);
  const [activeQuests, setActiveQuests] = useState([
    { id: 1, title: 'Welcome to MystiQ City', progress: 1, total: 3 },
    { id: 2, title: 'Meet Your First Character', progress: 0, total: 1 },
  ]);

  const districts = [
    {
      id: 'business',
      name: 'Business District',
      icon: '🏢',
      color: 'from-blue-600 to-blue-400',
      description: 'Corporate hubs and innovation centers',
      locked: false,
      level: 1,
      locations: [
        { id: 'corp-hq', name: 'TechCorp HQ', type: 'Corporate', characters: ['CEO Johnson', 'CTO Sarah'] },
        { id: 'innovation', name: 'Innovation Center', type: 'Lab', characters: ['Maya', 'David'] },
      ],
    },
    {
      id: 'arts',
      name: 'Arts Quarter',
      icon: '🎨',
      color: 'from-purple-600 to-purple-400',
      description: 'Museums, galleries, and creative spaces',
      locked: false,
      level: 2,
      locations: [
        { id: 'gallery', name: 'Modern Art Gallery', type: 'Museum', characters: ['Elena', 'Marco'] },
        { id: 'theater', name: 'Grand Theater', type: 'Venue', characters: ['Victoria', 'James'] },
      ],
    },
    {
      id: 'tech',
      name: 'Technology Hub',
      icon: '💻',
      color: 'from-green-600 to-green-400',
      description: 'Startups and AI research labs',
      locked: false,
      level: 3,
      locations: [
        { id: 'startup', name: 'Startup Incubator', type: 'Co-working', characters: ['Alex', 'Priya'] },
        { id: 'ai-lab', name: 'AI Research Lab', type: 'Research', characters: ['Dr. Wong', 'Nina'] },
      ],
    },
    {
      id: 'historical',
      name: 'Historical Center',
      icon: '🏛️',
      color: 'from-orange-600 to-orange-400',
      description: 'Museums, archives, and monuments',
      locked: false,
      level: 4,
      locations: [
        { id: 'museum', name: 'City Museum', type: 'Museum', characters: ['Prof. Henry', 'Sophia'] },
        { id: 'library', name: 'Ancient Library', type: 'Library', characters: ['Mr. Parker', 'Dr. Kim'] },
      ],
    },
    {
      id: 'entertainment',
      name: 'Entertainment',
      icon: '🎪',
      color: 'from-red-600 to-red-400',
      description: 'Casinos, clubs, and sports venues',
      locked: false,
      level: 5,
      locations: [
        { id: 'casino', name: 'Golden Phoenix Casino', type: 'Casino', characters: ['Vincent', 'Grace'] },
        { id: 'sports', name: 'Sports Arena', type: 'Venue', characters: ['Coach Brian', 'Samantha'] },
      ],
    },
    {
      id: 'residential',
      name: 'Residential',
      icon: '🏘️',
      color: 'from-gray-600 to-gray-400',
      description: 'Community centers and neighborhoods',
      locked: false,
      level: 6,
      locations: [
        { id: 'community', name: 'Community Center', type: 'Hub', characters: ['Pat', 'Sue'] },
        { id: 'cafe', name: 'Cornerstone Café', type: 'Café', characters: ['Mike', 'Jenny'] },
      ],
    },
  ];

  // View Renderers
  const MapView = () => (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-400/30 rounded-xl p-8 backdrop-blur">
        <h2 className="text-3xl font-bold mb-2">Welcome to MystiQ City</h2>
        <p className="text-gray-300 mb-4">Explore districts, meet characters, and complete quests to become a legend</p>
        <div className="flex gap-4">
          <div className="flex items-center gap-2 bg-black/40 px-4 py-2 rounded-lg">
            <Zap className="w-5 h-5 text-yellow-400" />
            <span>Level {playerLevel}</span>
          </div>
          <div className="flex items-center gap-2 bg-black/40 px-4 py-2 rounded-lg">
            <Star className="w-5 h-5 text-blue-400" />
            <span>Rep: {playerRep}</span>
          </div>
          <div className="flex items-center gap-2 bg-black/40 px-4 py-2 rounded-lg">
            <Clock className="w-5 h-5 text-purple-400" />
            <span>XP: {playerXP}</span>
          </div>
        </div>
      </div>

      {/* Districts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {districts.map((district) => (
          <div
            key={district.id}
            onClick={() => {
              setSelectedDistrict(district);
              setCurrentView('district');
            }}
            className="group relative overflow-hidden rounded-xl cursor-pointer transform transition-all duration-300 hover:scale-105"
          >
            {/* Background Gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br ${district.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

            {/* Content */}
            <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 p-6 border border-gray-700 group-hover:border-yellow-400/50 transition-colors rounded-xl">
              <div className="flex items-start justify-between mb-4">
                <div className="text-5xl">{district.icon}</div>
                {district.locked && <Lock className="w-5 h-5 text-red-400" />}
              </div>

              <h3 className="text-xl font-bold mb-2 group-hover:text-yellow-300 transition-colors">{district.name}</h3>
              <p className="text-gray-400 text-sm mb-4">{district.description}</p>

              <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                <div className="flex items-center gap-2 text-sm text-yellow-400">
                  <Zap className="w-4 h-4" />
                  Lv. {district.level}
                </div>
                <ChevronRight className="w-5 h-5 text-yellow-400 group-hover:translate-x-2 transition-transform" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const DistrictView = () => (
    <div className="space-y-8">
      <button
        onClick={() => setCurrentView('map')}
        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors mb-4"
      >
        ← Back to Map
      </button>

      {selectedDistrict && (
        <>
          <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-400/30 rounded-xl p-8 backdrop-blur">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-3xl font-bold mb-2 flex items-center gap-3">
                  {selectedDistrict.icon} {selectedDistrict.name}
                </h2>
                <p className="text-gray-300">{selectedDistrict.description}</p>
              </div>
              <div className="text-5xl opacity-20">{selectedDistrict.icon}</div>
            </div>
          </div>

          {/* Locations Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {selectedDistrict.locations.map((location) => (
              <div
                key={location.id}
                onClick={() => {
                  setSelectedLocation(location);
                  setCurrentView('location');
                }}
                className="bg-gradient-to-br from-slate-800 to-slate-900 border border-gray-700 hover:border-yellow-400/50 rounded-xl p-6 cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-yellow-400/20"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold mb-1">{location.name}</h3>
                    <p className="text-sm text-yellow-400">{location.type}</p>
                  </div>
                  <ChevronRight className="w-6 h-6 text-yellow-400" />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-400">
                    <Users className="w-4 h-4" />
                    <span className="text-sm">{location.characters.length} characters here</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {location.characters.map((char, idx) => (
                      <span key={idx} className="text-xs bg-blue-600/40 px-2 py-1 rounded">
                        {char}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );

  const LocationView = () => (
    <div className="space-y-8">
      <button
        onClick={() => setCurrentView('district')}
        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors mb-4"
      >
        ← Back to District
      </button>

      {selectedLocation && (
        <>
          <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-400/30 rounded-xl p-8 backdrop-blur">
            <h2 className="text-3xl font-bold mb-2">{selectedLocation.name}</h2>
            <p className="text-gray-300 mb-4">{selectedLocation.type}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Characters */}
            <div className="lg:col-span-2 space-y-4">
              <h3 className="text-2xl font-bold mb-4">Characters</h3>
              {selectedLocation.characters.map((char, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    setSelectedCharacter(char);
                    setCurrentView('character');
                  }}
                  className="bg-gradient-to-r from-slate-800 to-slate-900 border border-gray-700 hover:border-yellow-400/50 rounded-xl p-6 cursor-pointer transform transition-all duration-300 hover:shadow-xl hover:shadow-yellow-400/20"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-lg font-bold mb-2">{char}</h4>
                      <p className="text-gray-400">Click to interact</p>
                    </div>
                    <div className="text-3xl">👤</div>
                  </div>
                  <button className="mt-4 w-full bg-yellow-600 hover:bg-yellow-700 px-4 py-2 rounded-lg transition-colors font-semibold">
                    Start Dialogue
                  </button>
                </div>
              ))}
            </div>

            {/* Mini-Game */}
            <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 border border-purple-400/30 rounded-xl p-6 backdrop-blur h-fit">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Gamepad2 className="w-5 h-5" /> Mini-Game
              </h3>
              <p className="text-gray-300 mb-4">Test your skills in a mini-game to earn rewards</p>
              <button className="w-full bg-purple-600 hover:bg-purple-700 px-4 py-3 rounded-lg transition-colors font-semibold">
                Play Game
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );

  const CharacterView = () => (
    <div className="space-y-8">
      <button
        onClick={() => setCurrentView('location')}
        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors mb-4"
      >
        ← Back to Location
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Character Info */}
        <div className="lg:col-span-2">
          <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-blue-400/30 rounded-xl p-8 backdrop-blur mb-6">
            <div className="flex items-start gap-6 mb-6">
              <div className="text-6xl">👤</div>
              <div>
                <h2 className="text-3xl font-bold mb-2">{selectedCharacter}</h2>
                <p className="text-gray-400">Distinguished Professional</p>
              </div>
            </div>
            <p className="text-gray-300 leading-relaxed">
              A compelling character with depth, personality, and interesting dialogue options to explore their background and motivations.
            </p>
          </div>

          {/* Dialogue System */}
          <div className="bg-slate-800/50 border border-gray-700 rounded-xl p-8">
            <h3 className="text-xl font-bold mb-4">Dialogue</h3>
            <div className="bg-black/40 rounded-lg p-6 mb-6 border border-gray-700">
              <p className="text-gray-200 leading-relaxed">
                "Welcome! I've been expecting someone like you. The city has many opportunities for those willing to explore them. What would you like to know?"
              </p>
            </div>

            <div className="space-y-3">
              {['Tell me about yourself', 'What opportunities exist here?', 'Do you have any quests?', 'Goodbye'].map((option, idx) => (
                <button
                  key={idx}
                  className="w-full text-left px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 rounded-lg transition-all transform hover:translate-x-2 border border-blue-400/30"
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Stats & Relations */}
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-yellow-600/20 to-orange-600/20 border border-yellow-400/30 rounded-xl p-6 backdrop-blur">
            <h4 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Heart className="w-5 h-5" /> Relationship
            </h4>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2 text-sm">
                  <span>Friendship</span>
                  <span>45%</span>
                </div>
                <div className="w-full bg-black/40 rounded-full h-2">
                  <div className="bg-gradient-to-r from-yellow-400 to-red-400 h-2 rounded-full" style={{ width: '45%' }} />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 border border-green-400/30 rounded-xl p-6 backdrop-blur">
            <h4 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Star className="w-5 h-5" /> Quest Status
            </h4>
            <div className="bg-black/40 rounded-lg p-4 text-center">
              <p className="text-gray-400 mb-3">Quest Available!</p>
              <button className="w-full bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg transition-colors font-semibold">
                Accept Quest
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Header */}
      <header className="bg-black/40 backdrop-blur-lg border-b border-yellow-400/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
              🏙️ MystiQ City
            </div>
          </div>

          <div className="hidden md:flex items-center gap-6">
            <div className="flex items-center gap-2 bg-blue-600/20 px-4 py-2 rounded-lg border border-blue-400/30">
              <Zap className="w-5 h-5 text-yellow-400" />
              <span>Lvl {playerLevel}</span>
            </div>
            <div className="flex items-center gap-2 bg-blue-600/20 px-4 py-2 rounded-lg border border-blue-400/30">
              <Star className="w-5 h-5 text-blue-400" />
              <span>{playerRep} Rep</span>
            </div>
            <button className="p-2 hover:bg-blue-600/30 rounded-lg transition-colors">
              <Settings className="w-5 h-5" />
            </button>
          </div>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 hover:bg-blue-600/30 rounded-lg transition-colors"
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className={`max-w-7xl mx-auto px-4 py-8 transition-all duration-300 ${sidebarOpen ? 'lg:mr-80' : ''}`}>
        {currentView === 'map' && <MapView />}
        {currentView === 'district' && <DistrictView />}
        {currentView === 'location' && <LocationView />}
        {currentView === 'character' && <CharacterView />}
      </main>

      {/* Sidebar Quests - Desktop Only */}
      <aside className={`hidden lg:block fixed right-0 top-20 w-80 h-[calc(100vh-80px)] bg-gradient-to-b from-slate-800/80 to-slate-900/80 backdrop-blur-lg border-l border-yellow-400/20 p-6 overflow-y-auto pointer-events-auto transition-all duration-300 ${sidebarOpen ? 'translate-x-0' : 'translate-x-96'}`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <Clock className="w-5 h-5 text-yellow-400" /> Active Quests
          </h3>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
            title={sidebarOpen ? 'Hide' : 'Show'}
          >
            <X className="w-5 h-5 text-yellow-400" />
          </button>
        </div>
        <div className="space-y-3">
          {activeQuests.map((quest) => (
            <div key={quest.id} className="bg-black/40 border border-gray-700 rounded-lg p-4 hover:border-yellow-400/50 transition-colors">
              <p className="font-semibold text-sm mb-2">{quest.title}</p>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-yellow-400 to-yellow-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(quest.progress / quest.total) * 100}%` }}
                />
              </div>
              <p className="text-xs text-gray-400 mt-2">
                {quest.progress}/{quest.total}
              </p>
            </div>
          ))}
        </div>
      </aside>

      {/* Sidebar Toggle Button - When Closed */}
      {!sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="hidden lg:flex fixed right-4 top-24 bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-2 rounded-lg transition-colors items-center gap-2"
          title="Show Quests"
        >
          <Clock className="w-5 h-5" /> Quests
        </button>
      )}
    </div>
  );
}