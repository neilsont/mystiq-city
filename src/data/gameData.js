// MystiQ City - Game Data
// Centralized data management for all game content

const GameData = {
    // Player starting data
    player: {
        name: "City Explorer",
        level: 1,
        experience: 0,
        reputation: 0,
        skills: {
            business: 0,
            arts: 0,
            technology: 0,
            history: 0,
            entertainment: 0
        },
        achievements: [],
        inventory: []
    },

    // City Districts
    districts: {
        business: {
            id: 'business',
            name: 'Business District',
            description: 'The heart of commerce and corporate innovation',
            color: '#3498db',
            icon: '🏢',
            unlockLevel: 1,
            connections: ['tech', 'entertainment'],
            locations: [
                {
                    id: 'corporate-hq',
                    name: 'TechCorp Headquarters',
                    type: 'Corporate Office',
                    description: 'A modern glass tower housing one of the city\'s largest technology companies',
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
            ]
        },
        arts: {
            id: 'arts',
            name: 'Arts Quarter',
            description: 'Where creativity flows and culture thrives',
            color: '#9b59b6',
            icon: '🎨',
            unlockLevel: 2,
            connections: ['entertainment', 'historical'],
            locations: [
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
            ]
        },
        tech: {
            id: 'tech',
            name: 'Technology Hub',
            description: 'Where the future is built one line of code at a time',
            color: '#2ecc71',
            icon: '💻',
            unlockLevel: 3,
            connections: ['business', 'residential'],
            locations: [
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
            ]
        },
        historical: {
            id: 'historical',
            name: 'Historical Center',
            description: 'Where the past meets the present in every cobblestone',
            color: '#e67e22',
            icon: '🏛️',
            unlockLevel: 4,
            connections: ['arts', 'residential'],
            locations: [
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
            ]
        },
        entertainment: {
            id: 'entertainment',
            name: 'Entertainment District',
            description: 'Where fun never ends and memories are made',
            color: '#e74c3c',
            icon: '🎪',
            unlockLevel: 5,
            connections: ['arts', 'business', 'residential'],
            locations: [
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
            ]
        },
        residential: {
            id: 'residential',
            name: 'Residential Areas',
            description: 'Home sweet home in a diverse and welcoming community',
            color: '#95a5a6',
            icon: '🏘️',
            unlockLevel: 6,
            connections: ['tech', 'historical', 'entertainment'],
            locations: [
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
        }
    },

    // Character Database
    characters: {
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
    },

    // Mini-Games
    miniGames: {
        'hangman': {
            id: 'hangman',
            name: 'Word Mystery',
            description: 'Solve word puzzles by guessing letters - perfect for detective work and research',
            difficulty: 'Easy to Medium',
            category: 'Word Games',
            words: {
                business: ['CORPORATE', 'STRATEGY', 'INNOVATION', 'LEADERSHIP', 'ENTREPRENEUR'],
                tech: ['ALGORITHM', 'COMPUTER', 'PROGRAMMING', 'DATABASE', 'ARTIFICIAL'],
                arts: ['CREATIVITY', 'MASTERPIECE', 'IMAGINATION', 'INSPIRATION', 'AESTHETIC'],
                historical: ['CIVILIZATION', 'ARCHAEOLOGY', 'CULTURAL', 'HERITAGE', 'TRADITION'],
                entertainment: ['PERFORMANCE', 'THEATRICAL', 'MUSICAL', 'CREATIVE', 'SPECTACULAR']
            }
        },
        'match-3': {
            id: 'match-3',
            name: 'Pattern Connect',
            description: 'Connect matching patterns to clear the board - great for artistic and analytical thinking',
            difficulty: 'Medium to Hard',
            category: 'Puzzle Games',
            gridSize: 8,
            tileTypes: 6,
            targetScore: 1000
        },
        'code-breaking': {
            id: 'code-breaking',
            name: 'Cipher Solver',
            description: 'Decrypt coded messages using logical deduction - essential for tech and security work',
            difficulty: 'Medium',
            category: 'Logic Games',
            ciphers: ['Caesar', 'Substitution', 'Vigenere', 'Morse'],
            codeLength: 8
        },
        'pattern-recognition': {
            id: 'pattern-recognition',
            name: 'Pattern Master',
            description: 'Identify and complete complex patterns - crucial for artistic and analytical work',
            difficulty: 'Medium to Hard',
            category: 'Logic Games',
            patternTypes: ['Geometric', 'Sequential', 'Color', 'Shape'],
            gridSize: 4
        },
        'business-strategy': {
            id: 'business-strategy',
            name: 'Corporate Decisions',
            description: 'Make strategic business decisions to grow your company - learn real business principles',
            difficulty: 'Medium to Hard',
            category: 'Strategy Games',
            scenarios: ['Market Expansion', 'Product Launch', 'Crisis Management', 'Partnership Deal']
        }
    },

    // Achievements
    achievements: [
        {
            id: 'first-steps',
            name: 'First Steps',
            description: 'Enter MystiQ City for the first time',
            icon: '👣',
            reward: { experience: 50 }
        },
        {
            id: 'district-explorer',
            name: 'District Explorer',
            description: 'Visit all 6 districts of the city',
            icon: '🗺️',
            reward: { experience: 200, reputation: 100 }
        },
        {
            id: 'character-friend',
            name: 'Character Friend',
            description: 'Reach a relationship level of 10 with any character',
            icon: '🤝',
            reward: { experience: 150, reputation: 75 }
        },
        {
            id: 'game-master',
            name: 'Game Master',
            description: 'Complete 50 mini-games successfully',
            icon: '🎮',
            reward: { experience: 300, reputation: 150 }
        },
        {
            id: 'reputation-leader',
            name: 'Reputation Leader',
            description: 'Achieve a reputation level of 500',
            icon: '⭐',
            reward: { experience: 500, title: 'City Legend' }
        }
    ],

    // Quests
    quests: {
        'welcome-to-city': {
            id: 'welcome-to-city',
            title: 'Welcome to MystiQ City',
            description: 'Your journey begins! Explore the city map and choose your first destination.',
            objectives: ['Visit the city map', 'Select a district to explore'],
            rewards: { experience: 100, reputation: 25 },
            completed: false
        },
        'first-interaction': {
            id: 'first-interaction',
            title: 'Making Connections',
            description: 'Meet your first character and have a conversation.',
            objectives: ['Find a character in any location', 'Complete a dialogue'],
            rewards: { experience: 150, reputation: 50 },
            completed: false
        },
        'game-champion': {
            id: 'game-champion',
            title: 'Game Champion',
            description: 'Master your first mini-game and prove your skills.',
            objectives: ['Play and win any mini-game'],
            rewards: { experience: 200, reputation: 75 },
            completed: false
        }
    }
};

// Export for global access
window.GameData = GameData;
