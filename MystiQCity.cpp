// MystiQCity.cpp - Professional City Exploration Game in C++
#include <iostream>
#include <vector>
#include <string>
#include <map>
#include <memory>
#include <random>
#include <chrono>
#include <thread>
#include <fstream>
#include <sstream>
#include <algorithm>
#include <ctime>
#include <iomanip>
#include <cmath>

using namespace std;

// Forward declarations
class GameEntity;
class Player;
class District;
class Location;
class Character;
class MiniGame;

// Core Enums
enum class TimeOfDay { MORNING, AFTERNOON, EVENING, NIGHT };
enum class Weather { SUNNY, CLOUDY, RAINY, STORMY, SNOWY };
enum class Season { SPRING, SUMMER, AUTUMN, WINTER };
enum class Difficulty { EASY, MEDIUM, HARD, EXPERT };

// Skill System
struct Skills {
    int leadership = 0;
    int creativity = 0;
    int technology = 0;
    int business = 0;
    int social = 0;
    int analytical = 0;
    
    int getTotal() const {
        return leadership + creativity + technology + business + social + analytical;
    }
    
    void levelUp(int skillType, int amount = 1) {
        switch(skillType) {
            case 0: leadership += amount; break;
            case 1: creativity += amount; break;
            case 2: technology += amount; break;
            case 3: business += amount; break;
            case 4: social += amount; break;
            case 5: analytical += amount; break;
        }
    }
};

// Achievement System
struct Achievement {
    string id;
    string name;
    string description;
    string icon;
    bool unlocked = false;
    time_t unlockDate;
    vector<pair<string, int>> requirements;
    map<string, int> rewards;
    
    bool checkRequirements(const Player& player) const;
    void unlock(Player& player);
};

// Quest System
struct Quest {
    string id;
    string title;
    string description;
    vector<string> objectives;
    vector<bool> objectiveStatus;
    map<string, int> requirements;
    map<string, int> rewards;
    bool completed = false;
    bool active = false;
    time_t startDate;
    time_t completeDate;
    vector<string> prerequisites;
    
    void start();
    void completeObjective(int index);
    void complete();
    bool isAvailable(const Player& player) const;
};

// Base Game Entity
class GameEntity {
protected:
    string id;
    string name;
    string description;
    time_t createdAt;
    time_t updatedAt;
    
public:
    GameEntity(const string& id, const string& name)
        : id(id), name(name), createdAt(time(nullptr)), updatedAt(time(nullptr)) {}
    
    virtual ~GameEntity() = default;
    
    virtual void update() { updatedAt = time(nullptr); }
    virtual string toJSON() const = 0;
    
    string getId() const { return id; }
    string getName() const { return name; }
    string getDescription() const { return description; }
    void setDescription(const string& desc) { description = desc; update(); }
    
    time_t getCreatedAt() const { return createdAt; }
    time_t getUpdatedAt() const { return updatedAt; }
};

// Player Class
class Player : public GameEntity {
private:
    int level = 1;
    int experience = 0;
    int reputation = 0;
    int currency = 1000;
    Skills skills;
    vector<string> inventory;
    vector<string> achievements;
    vector<string> activeQuests;
    vector<string> completedQuests;
    map<string, int> characterRelationships;
    time_t lastPlayed;
    int playTime = 0;
    
public:
    Player(const string& id, const string& name) 
        : GameEntity(id, name), lastPlayed(time(nullptr)) {
        skills = Skills();
    }
    
    // Experience and Leveling
    void addExperience(int amount) {
        experience += amount;
        int newLevel = calculateLevel();
        if (newLevel > level) {
            levelUp(newLevel);
        }
        update();
    }
    
    int calculateLevel() const {
        return static_cast<int>(sqrt(experience / 100.0)) + 1;
    }
    
    void levelUp(int newLevel) {
        int oldLevel = level;
        level = newLevel;
        
        // Grant level up rewards
        currency += (newLevel - oldLevel) * 100;
        reputation += (newLevel - oldLevel) * 10;
        
        cout << "🎉 Level Up! You reached level " << level << "!" << endl;
    }
    
    // Currency Management
    bool spendCurrency(int amount) {
        if (currency >= amount) {
            currency -= amount;
            update();
            return true;
        }
        return false;
    }
    
    void earnCurrency(int amount) {
        currency += amount;
        update();
    }
    
    // Skill Management
    void trainSkill(int skillType, int amount = 1) {
        skills.levelUp(skillType, amount);
        addExperience(amount * 10);
        update();
    }
    
    // Relationship Management
    void improveRelationship(const string& characterId, int amount = 1) {
        characterRelationships[characterId] += amount;
        characterRelationships[characterId] = min(characterRelationships[characterId], 100);
        update();
    }
    
    void decreaseRelationship(const string& characterId, int amount = 1) {
        characterRelationships[characterId] -= amount;
        characterRelationships[characterId] = max(characterRelationships[characterId], -100);
        update();
    }
    
    int getRelationship(const string& characterId) const {
        auto it = characterRelationships.find(characterId);
        return it != characterRelationships.end() ? it->second : 0;
    }
    
    // Quest Management
    void startQuest(const string& questId) {
        if (find(activeQuests.begin(), activeQuests.end(), questId) == activeQuests.end()) {
            activeQuests.push_back(questId);
            update();
        }
    }
    
    void completeQuest(const string& questId) {
        auto it = find(activeQuests.begin(), activeQuests.end(), questId);
        if (it != activeQuests.end()) {
            activeQuests.erase(it);
            completedQuests.push_back(questId);
            update();
        }
    }
    
    // Achievement Management
    void unlockAchievement(const string& achievementId) {
        if (find(achievements.begin(), achievements.end(), achievementId) == achievements.end()) {
            achievements.push_back(achievementId);
            update();
        }
    }
    
    // Getters
    int getLevel() const { return level; }
    int getExperience() const { return experience; }
    int getReputation() const { return reputation; }
    int getCurrency() const { return currency; }
    const Skills& getSkills() const { return skills; }
    const vector<string>& getInventory() const { return inventory; }
    const vector<string>& getActiveQuests() const { return activeQuests; }
    const vector<string>& getCompletedQuests() const { return completedQuests; }
    const vector<string>& getAchievements() const { return achievements; }
    
    // JSON Serialization
    string toJSON() const override {
        ostringstream json;
        json << "{";
        json << "\"id\":\"" << id << "\",";
        json << "\"name\":\"" << name << "\",";
        json << "\"level\":" << level << ",";
        json << "\"experience\":" << experience << ",";
        json << "\"reputation\":" << reputation << ",";
        json << "\"currency\":" << currency << ",";
        json << "\"skills\":{";
        json << "\"leadership\":" << skills.leadership << ",";
        json << "\"creativity\":" << skills.creativity << ",";
        json << "\"technology\":" << skills.technology << ",";
        json << "\"business\":" << skills.business << ",";
        json << "\"social\":" << skills.social << ",";
        json << "\"analytical\":" << skills.analytical;
        json << "},";
        json << "\"playTime\":" << playTime;
        json << "}";
        return json.str();
    }
};

// District Class
class District : public GameEntity {
private:
    string type;
    vector<shared_ptr<Location>> locations;
    int unlockLevel = 1;
    int unlockReputation = 0;
    bool unlocked = false;
    string icon;
    string color;
    vector<string> connections;
    
public:
    District(const string& id, const string& name, const string& type)
        : GameEntity(id, name), type(type) {}
    
    void addLocation(shared_ptr<Location> location) {
        locations.push_back(location);
        update();
    }
    
    bool isUnlocked(const Player& player) const {
        return player.getLevel() >= unlockLevel && 
               player.getReputation() >= unlockReputation;
    }
    
    void checkUnlock(const Player& player) {
        unlocked = isUnlocked(player);
    }
    
    // Getters
    const string& getType() const { return type; }
    const vector<shared_ptr<Location>>& getLocations() const { return locations; }
    bool isUnlocked() const { return unlocked; }
    int getUnlockLevel() const { return unlockLevel; }
    int getUnlockReputation() const { return unlockReputation; }
    const string& getIcon() const { return icon; }
    const string& getColor() const { return color; }
    const vector<string>& getConnections() const { return connections; }
    
    // Setters
    void setUnlockRequirements(int level, int reputation) {
        unlockLevel = level;
        unlockReputation = reputation;
        update();
    }
    
    void setIcon(const string& icon) { this->icon = icon; update(); }
    void setColor(const string& color) { this->color = color; update(); }
    void addConnection(const string& districtId) {
        connections.push_back(districtId);
        update();
    }
    
    string toJSON() const override {
        ostringstream json;
        json << "{";
        json << "\"id\":\"" << id << "\",";
        json << "\"name\":\"" << name << "\",";
        json << "\"type\":\"" << type << "\",";
        json << "\"description\":\"" << description << "\",";
        json << "\"unlockLevel\":" << unlockLevel << ",";
        json << "\"unlockReputation\":" << unlockReputation << ",";
        json << "\"unlocked\":" << (unlocked ? "true" : "false") << ",";
        json << "\"icon\":\"" << icon << "\",";
        json << "\"color\":\"" << color << "\",";
        json << "\"locationCount\":" << locations.size();
        json << "}";
        return json.str();
    }
};

// Location Class
class Location : public GameEntity {
private:
    string districtId;
    string type;
    vector<shared_ptr<Character>> characters;
    shared_ptr<MiniGame> miniGame;
    vector<string> activities;
    bool discovered = false;
    int discoveryLevel = 1;
    
public:
    Location(const string& id, const string& name, const string& districtId, const string& type)
        : GameEntity(id, name), districtId(districtId), type(type) {}
    
    void addCharacter(shared_ptr<Character> character) {
        characters.push_back(character);
        update();
    }
    
    void setMiniGame(shared_ptr<MiniGame> game) {
        miniGame = game;
        update();
    }
    
    void addActivity(const string& activity) {
        activities.push_back(activity);
        update();
    }
    
    void discover(const Player& player) {
        if (!discovered && player.getLevel() >= discoveryLevel) {
            discovered = true;
            update();
        }
    }
    
    // Getters
    const string& getDistrictId() const { return districtId; }
    const string& getType() const { return type; }
    const vector<shared_ptr<Character>>& getCharacters() const { return characters; }
    shared_ptr<MiniGame> getMiniGame() const { return miniGame; }
    const vector<string>& getActivities() const { return activities; }
    bool isDiscovered() const { return discovered; }
    
    string toJSON() const override {
        ostringstream json;
        json << "{";
        json << "\"id\":\"" << id << "\",";
        json << "\"name\":\"" << name << "\",";
        json << "\"districtId\":\"" << districtId << "\",";
        json << "\"type\":\"" << type << "\",";
        json << "\"description\":\"" << description << "\",";
        json << "\"discovered\":" << (discovered ? "true" : "false") << ",";
        json << "\"characterCount\":" << characters.size() << ",";
        json << "\"hasMiniGame\":" << (miniGame != nullptr ? "true" : "false");
        json << "}";
        return json.str();
    }
};

// Character Class
class Character : public GameEntity {
private:
    string occupation;
    string personality;
    vector<string> dialogueTopics;
    map<string, string> dialogues;
    vector<shared_ptr<Quest>> availableQuests;
    int baseRelationship = 0;
    int relationshipThreshold = 50;
    
public:
    Character(const string& id, const string& name, const string& occupation)
        : GameEntity(id, name), occupation(occupation) {}
    
    void addDialogueTopic(const string& topic, const string& dialogue) {
        dialogueTopics.push_back(topic);
        dialogues[topic] = dialogue;
        update();
    }
    
    void addQuest(shared_ptr<Quest> quest) {
        availableQuests.push_back(quest);
        update();
    }
    
    string getDialogue(const string& topic) const {
        auto it = dialogues.find(topic);
        return it != dialogues.end() ? it->second : "I don't have much to say about that.";
    }
    
    vector<shared_ptr<Quest>> getAvailableQuests(int playerLevel, int playerReputation) const {
        vector<shared_ptr<Quest>> available;
        for (const auto& quest : availableQuests) {
            if (quest->isAvailable(*this, playerLevel, playerReputation)) {
                available.push_back(quest);
            }
        }
        return available;
    }
    
    // Getters
    const string& getOccupation() const { return occupation; }
    const string& getPersonality() const { return personality; }
    const vector<string>& getDialogueTopics() const { return dialogueTopics; }
    int getBaseRelationship() const { return baseRelationship; }
    int getRelationshipThreshold() const { return relationshipThreshold; }
    
    // Setters
    void setPersonality(const string& personality) { this->personality = personality; update(); }
    void setBaseRelationship(int relationship) { baseRelationship = relationship; update(); }
    
    string toJSON() const override {
        ostringstream json;
        json << "{";
        json << "\"id\":\"" << id << "\",";
        json << "\"name\":\"" << name << "\",";
        json << "\"occupation\":\"" << occupation << "\",";
        json << "\"description\":\"" << description << "\",";
        json << "\"personality\":\"" << personality << "\",";
        json << "\"dialogueTopics\":" << dialogueTopics.size() << ",";
        json << "\"availableQuests\":" << availableQuests.size();
        json << "}";
        return json.str();
    }
};

// MiniGame Base Class
class MiniGame : public GameEntity {
protected:
    Difficulty difficulty;
    int baseReward = 100;
    int timeLimit = 0;
    bool completed = false;
    int highScore = 0;
    
public:
    MiniGame(const string& id, const string& name, Difficulty diff)
        : GameEntity(id, name), difficulty(diff) {}
    
    virtual void start() = 0;
    virtual void updateGame() = 0;
    virtual void end() = 0;
    virtual int calculateScore() const = 0;
    virtual string getInstructions() const = 0;
    
    virtual int play(Player& player) {
        start();
        // Game loop simulation
        int score = calculateScore();
        
        if (score > highScore) {
            highScore = score;
        }
        
        if (score > 0) {
            completed = true;
            player.addExperience(score);
            player.earnCurrency(score / 10);
        }
        
        end();
        return score;
    }
    
    // Getters
    Difficulty getDifficulty() const { return difficulty; }
    int getBaseReward() const { return baseReward; }
    int getTimeLimit() const { return timeLimit; }
    bool isCompleted() const { return completed; }
    int getHighScore() const { return highScore; }
    
    // Setters
    void setBaseReward(int reward) { baseReward = reward; update(); }
    void setTimeLimit(int limit) { timeLimit = limit; update(); }
    
    string toJSON() const override {
        ostringstream json;
        json << "{";
        json << "\"id\":\"" << id << "\",";
        json << "\"name\":\"" << name << "\",";
        json << "\"difficulty\":\"" << (difficulty == Difficulty::EASY ? "easy" : 
                                        difficulty == Difficulty::MEDIUM ? "medium" : 
                                        difficulty == Difficulty::HARD ? "hard" : "expert") << "\",";
        json << "\"completed\":" << (completed ? "true" : "false") << ",";
        json << "\"highScore\":" << highScore;
        json << "}";
        return json.str();
    }
};

// Hangman Game Implementation
class HangmanGame : public MiniGame {
private:
    string word;
    string category;
    vector<char> guessedLetters;
    int maxAttempts = 6;
    int attempts = 0;
    bool wordGuessed = false;
    
public:
    HangmanGame(const string& id, const string& name, const string& word, const string& category)
        : MiniGame(id, name, Difficulty::MEDIUM), word(word), category(category) {
        transform(this->word.begin(), this->word.end(), this->word.begin(), ::toupper);
    }
    
    void start() override {
        guessedLetters.clear();
        attempts = 0;
        wordGuessed = false;
        cout << "Starting Hangman Game: " << name << endl;
        cout << "Category: " << category << endl;
        cout << "Word: " << getMaskedWord() << endl;
    }
    
    void updateGame() override {
        // This would handle real-time updates in a graphical version
    }
    
    void end() override {
        if (wordGuessed) {
            cout << "Congratulations! You guessed the word: " << word << endl;
        } else {
            cout << "Game over! The word was: " << word << endl;
        }
    }
    
    bool guessLetter(char letter) {
        letter = toupper(letter);
        
        if (find(guessedLetters.begin(), guessedLetters.end(), letter) != guessedLetters.end()) {
            return false; // Already guessed
        }
        
        guessedLetters.push_back(letter);
        
        if (word.find(letter) == string::npos) {
            attempts++;
            return false;
        }
        
        wordGuessed = checkWordGuessed();
        return true;
    }
    
    bool guessWord(const string& guess) {
        string upperGuess = guess;
        transform(upperGuess.begin(), upperGuess.end(), upperGuess.begin(), ::toupper);
        
        if (upperGuess == word) {
            wordGuessed = true;
            return true;
        }
        
        attempts++;
        return false;
    }
    
    string getMaskedWord() const {
        string masked;
        for (char c : word) {
            if (c == ' ' || find(guessedLetters.begin(), guessedLetters.end(), c) != guessedLetters.end()) {
                masked += c;
                masked += ' ';
            } else {
                masked += "_ ";
            }
        }
        return masked;
    }
    
    int calculateScore() const override {
        if (!wordGuessed) return 0;
        
        int base = baseReward;
        int multiplier = maxAttempts - attempts;
        int categoryBonus = category == "business" ? 50 : 
                           category == "tech" ? 40 : 30;
        
        return base * multiplier + categoryBonus;
    }
    
    string getInstructions() const override {
        return "Guess the word by suggesting letters. You have " + 
               to_string(maxAttempts) + " incorrect attempts allowed.";
    }
    
    // Getters
    int getRemainingAttempts() const { return maxAttempts - attempts; }
    const vector<char>& getGuessedLetters() const { return guessedLetters; }
    bool isWordGuessed() const { return wordGuessed; }
};

// Match-3 Game Implementation
class Match3Game : public MiniGame {
private:
    vector<vector<int>> grid;
    int gridSize = 8;
    int score = 0;
    int moves = 0;
    int maxMoves = 20;
    time_t startTime;
    
public:
    Match3Game(const string& id, const string& name, int size = 8)
        : MiniGame(id, name, Difficulty::MEDIUM), gridSize(size) {
        initializeGrid();
    }
    
    void start() override {
        score = 0;
        moves = 0;
        startTime = time(nullptr);
        cout << "Starting Match-3 Game: " << name << endl;
        cout << "Grid Size: " << gridSize << "x" << gridSize << endl;
        cout << "Moves Remaining: " << maxMoves << endl;
    }
    
    void updateGame() override {
        // Game logic would go here
    }
    
    void end() override {
        time_t elapsed = time(nullptr) - startTime;
        cout << "Game ended! Score: " << score << " Time: " << elapsed << "s" << endl;
    }
    
    bool swapTiles(int x1, int y1, int x2, int y2) {
        if (!isValidPosition(x1, y1) || !isValidPosition(x2, y2)) {
            return false;
        }
        
        if (abs(x1 - x2) + abs(y1 - y2) != 1) {
            return false; // Not adjacent
        }
        
        // Swap tiles
        swap(grid[y1][x1], grid[y2][x2]);
        
        // Check for matches
        if (checkMatches()) {
            moves++;
            return true;
        }
        
        // Swap back if no matches
        swap(grid[y1][x1], grid[y2][x2]);
        return false;
    }
    
    int calculateScore() const override {
        int timeBonus = max(0, 300 - static_cast<int>(time(nullptr) - startTime));
        int moveBonus = max(0, maxMoves - moves) * 10;
        return score + timeBonus + moveBonus;
    }
    
    string getInstructions() const override {
        return "Swap adjacent tiles to create matches of 3 or more. You have " + 
               to_string(maxMoves) + " moves to score as high as possible.";
    }
    
private:
    void initializeGrid() {
        grid.resize(gridSize, vector<int>(gridSize));
        random_device rd;
        mt19937 gen(rd());
        uniform_int_distribution<> dis(0, 5);
        
        do {
            for (int y = 0; y < gridSize; y++) {
                for (int x = 0; x < gridSize; x++) {
                    grid[y][x] = dis(gen);
                }
            }
        } while (checkMatches()); // Ensure no initial matches
    }
    
    bool isValidPosition(int x, int y) const {
        return x >= 0 && x < gridSize && y >= 0 && y < gridSize;
    }
    
    bool checkMatches() {
        // Simplified match checking
        bool foundMatch = false;
        
        // Check horizontal matches
        for (int y = 0; y < gridSize; y++) {
            for (int x = 0; x < gridSize - 2; x++) {
                if (grid[y][x] == grid[y][x+1] && grid[y][x] == grid[y][x+2]) {
                    foundMatch = true;
                    score += 100;
                }
            }
        }
        
        // Check vertical matches
        for (int x = 0; x < gridSize; x++) {
            for (int y = 0; y < gridSize - 2; y++) {
                if (grid[y][x] == grid[y+1][x] && grid[y][x] == grid[y+2][x]) {
                    foundMatch = true;
                    score += 100;
                }
            }
        }
        
        return foundMatch;
    }
};

// Game World Manager
class GameWorld {
private:
    shared_ptr<Player> player;
    map<string, shared_ptr<District>> districts;
    map<string, shared_ptr<Location>> locations;
    map<string, shared_ptr<Character>> characters;
    map<string, shared_ptr<MiniGame>> miniGames;
    map<string, shared_ptr<Quest>> quests;
    map<string, Achievement> achievements;
    
    TimeOfDay currentTime = TimeOfDay::MORNING;
    Weather currentWeather = Weather::SUNNY;
    Season currentSeason = Season::SPRING;
    
    static GameWorld* instance;
    GameWorld() = default;
    
public:
    static GameWorld& getInstance() {
        if (!instance) {
            instance = new GameWorld();
        }
        return *instance;
    }
    
    void initialize() {
        createPlayer();
        createDistricts();
        createLocations();
        createCharacters();
        createMiniGames();
        createQuests();
        createAchievements();
        
        cout << "🎮 MystiQ City Game World Initialized!" << endl;
        cout << "Districts: " << districts.size() << endl;
        cout << "Locations: " << locations.size() << endl;
        cout << "Characters: " << characters.size() << endl;
        cout << "Mini Games: " << miniGames.size() << endl;
    }
    
    void createPlayer() {
        player = make_shared<Player>("player_1", "City Explorer");
        player->setDescription("A brave explorer discovering the secrets of MystiQ City");
    }
    
    void createDistricts() {
        // Business District
        auto business = make_shared<District>("business", "Business District", "corporate");
        business->setDescription("The heart of commerce and corporate innovation");
        business->setIcon("🏢");
        business->setColor("#3498db");
        business->setUnlockRequirements(1, 0);
        business->addConnection("tech");
        business->addConnection("entertainment");
        districts["business"] = business;
        
        // Technology Hub
        auto tech = make_shared<District>("tech", "Technology Hub", "innovation");
        tech->setDescription("Where the future is built one line of code at a time");
        tech->setIcon("💻");
        tech->setColor("#2ecc71");
        tech->setUnlockRequirements(3, 25);
        tech->addConnection("business");
        tech->addConnection("residential");
        districts["tech"] = tech;
        
        // Arts Quarter
        auto arts = make_shared<District>("arts", "Arts Quarter", "creative");
        arts->setDescription("Where creativity flows and culture thrives");
        arts->setIcon("🎨");
        arts->setColor("#9b59b6");
        arts->setUnlockRequirements(2, 15);
        arts->addConnection("entertainment");
        arts->addConnection("historical");
        districts["arts"] = arts;
        
        // Historical Center
        auto historical = make_shared<District>("historical", "Historical Center", "heritage");
        historical->setDescription("Where the past meets the present in every cobblestone");
        historical->setIcon("🏛️");
        historical->setColor("#e67e22");
        historical->setUnlockRequirements(4, 50);
        historical->addConnection("arts");
        historical->addConnection("residential");
        districts["historical"] = historical;
        
        // Entertainment District
        auto entertainment = make_shared<District>("entertainment", "Entertainment District", "leisure");
        entertainment->setDescription("Where fun never ends and memories are made");
        entertainment->setIcon("🎪");
        entertainment->setColor("#e74c3c");
        entertainment->setUnlockRequirements(5, 75);
        entertainment->addConnection("business");
        entertainment->addConnection("arts");
        entertainment->addConnection("residential");
        districts["entertainment"] = entertainment;
        
        // Residential Areas
        auto residential = make_shared<District>("residential", "Residential Areas", "community");
        residential->setDescription("Home sweet home in a diverse and welcoming community");
        residential->setIcon("🏘️");
        residential->setColor("#95a5a6");
        residential->setUnlockRequirements(6, 100);
        residential->addConnection("tech");
        residential->addConnection("historical");
        residential->addConnection("entertainment");
        districts["residential"] = residential;
    }
    
    void createLocations() {
        // Business District Locations
        auto corporateHQ = make_shared<Location>("corporate_hq", "TechCorp Headquarters", "business", "corporate");
        corporateHQ->setDescription("A modern glass tower housing one of the city's largest technology companies");
        corporateHQ->addActivity("business-strategy");
        corporateHQ->addActivity("networking");
        locations["corporate_hq"] = corporateHQ;
        districts["business"]->addLocation(corporateHQ);
        
        auto innovationCenter = make_shared<Location>("innovation_center", "Innovation Center", "business", "research");
        innovationCenter->setDescription("Where breakthrough ideas become reality through collaboration");
        innovationCenter->addActivity("code-breaking");
        innovationCenter->addActivity("pattern-recognition");
        locations["innovation_center"] = innovationCenter;
        districts["business"]->addLocation(innovationCenter);
        
        // Arts Quarter Locations
        auto modernGallery = make_shared<Location>("modern_gallery", "Modern Art Gallery", "arts", "cultural");
        modernGallery->setDescription("Showcasing contemporary masterpieces from local and international artists");
        modernGallery->addActivity("art-appreciation");
        modernGallery->addActivity("pattern-recognition");
        locations["modern_gallery"] = modernGallery;
        districts["arts"]->addLocation(modernGallery);
    }
    
    void createCharacters() {
        // CEO Johnson
        auto ceoJohnson = make_shared<Character>("ceo_johnson", "Victoria Johnson", "CEO of TechCorp");
        ceoJohnson->setDescription("A visionary leader who built TechCorp from a startup to a global corporation");
        ceoJohnson->setPersonality("Ambitious, Strategic, Decisive");
        ceoJohnson->addDialogueTopic("introduction", "Welcome to TechCorp! I hear you're making quite an impression around the city.");
        ceoJohnson->addDialogueTopic("business", "The business world is constantly evolving. Those who can't adapt get left behind.");
        characters["ceo_johnson"] = ceoJohnson;
        locations["corporate_hq"]->addCharacter(ceoJohnson);
        
        // Curator Elena
        auto curatorElena = make_shared<Character>("curator_elena", "Elena Rodriguez", "Chief Curator");
        curatorElena->setDescription("A passionate art historian dedicated to preserving and sharing beauty with the world");
        curatorElena->setPersonality("Creative, Thoughtful, Inspiring");
        curatorElena->addDialogueTopic("introduction", "Art speaks to the soul in ways words cannot. What draws you to explore our gallery today?");
        curatorElena->addDialogueTopic("arts", "True art cannot be bought, only appreciated.");
        characters["curator_elena"] = curatorElena;
        locations["modern_gallery"]->addCharacter(curatorElena);
    }
    
    void createMiniGames() {
        // Hangman Game
        auto hangman = make_shared<HangmanGame>("hangman_business", "Word Mystery: Business", "INNOVATION", "business");
        hangman->setDescription("Solve word puzzles by guessing letters");
        miniGames["hangman_business"] = hangman;
        locations["corporate_hq"]->setMiniGame(hangman);
        
        // Match-3 Game
        auto match3 = make_shared<Match3Game>("match3_arts", "Pattern Connect", 8);
        match3->setDescription("Connect matching patterns to clear the board");
        miniGames["match3_arts"] = match3;
        locations["modern_gallery"]->setMiniGame(match3);
    }
    
    void createQuests() {
        // Welcome Quest
        auto welcomeQuest = make_shared<Quest>();
        welcomeQuest->id = "welcome_to_city";
        welcomeQuest->title = "Welcome to MystiQ City";
        welcomeQuest->description = "Your journey begins! Explore the city map and choose your first destination.";
        welcomeQuest->objectives = {"Visit the city map", "Select a district to explore"};
        welcomeQuest->objectiveStatus = {false, false};
        welcomeQuest->requirements = {{"level", 1}};
        welcomeQuest->rewards = {{"experience", 100}, {"reputation", 25}};
        quests["welcome_to_city"] = welcomeQuest;
    }
    
    void createAchievements() {
        Achievement firstSteps;
        firstSteps.id = "first_steps";
        firstSteps.name = "First Steps";
        firstSteps.description = "Enter MystiQ City for the first time";
        firstSteps.icon = "👣";
        firstSteps.requirements = {{"visit_city", 1}};
        firstSteps.rewards = {{"experience", 50}};
        achievements["first_steps"] = firstSteps;
        
        Achievement districtExplorer;
        districtExplorer.id = "district_explorer";
        districtExplorer.name = "District Explorer";
        districtExplorer.description = "Visit all 6 districts of the city";
        districtExplorer.icon = "🗺️";
        districtExplorer.requirements = {{"visit_districts", 6}};
        districtExplorer.rewards = {{"experience", 200}, {"reputation", 100}};
        achievements["district_explorer"] = districtExplorer;
    }
    
    // Game Loop
    void update() {
        updateTime();
        updateWeather();
        updateDistrictUnlocks();
        updateQuestStatus();
        updateAchievements();
    }
    
    void updateTime() {
        time_t now = time(nullptr);
        tm* localTime = localtime(&now);
        int hour = localTime->tm_hour;
        
        if (hour >= 6 && hour < 12) currentTime = TimeOfDay::MORNING;
        else if (hour >= 12 && hour < 18) currentTime = TimeOfDay::AFTERNOON;
        else if (hour >= 18 && hour < 22) currentTime = TimeOfDay::EVENING;
        else currentTime = TimeOfDay::NIGHT;
    }
    
    void updateWeather() {
        // Simple weather simulation
        static random_device rd;
        static mt19937 gen(rd());
        uniform_int_distribution<> dis(1, 100);
        
        int chance = dis(gen);
        
        if (chance <= 60) currentWeather = Weather::SUNNY;
        else if (chance <= 80) currentWeather = Weather::CLOUDY;
        else if (chance <= 95) currentWeather = Weather::RAINY;
        else currentWeather = Weather::STORMY;
        
        // Winter snow
        if (currentSeason == Season::WINTER && chance > 90) {
            currentWeather = Weather::SNOWY;
        }
    }
    
    void updateSeason() {
        time_t now = time(nullptr);
        tm* localTime = localtime(&now);
        int month = localTime->tm_mon + 1;
        
        if (month >= 3 && month <= 5) currentSeason = Season::SPRING;
        else if (month >= 6 && month <= 8) currentSeason = Season::SUMMER;
        else if (month >= 9 && month <= 11) currentSeason = Season::AUTUMN;
        else currentSeason = Season::WINTER;
    }
    
    void updateDistrictUnlocks() {
        for (auto& [id, district] : districts) {
            district->checkUnlock(*player);
        }
    }
    
    void updateQuestStatus() {
        // Check and update quest objectives
    }
    
    void updateAchievements() {
        // Check and unlock achievements
    }
    
    // Game Actions
    void exploreDistrict(const string& districtId) {
        auto it = districts.find(districtId);
        if (it != districts.end()) {
            auto& district = it->second;
            if (district->isUnlocked()) {
                cout << "Exploring " << district->getName() << "..." << endl;
                player->addExperience(10);
                player->addReputation(5);
            } else {
                cout << district->getName() << " is locked. Requirements: Level " 
                     << district->getUnlockLevel() << ", Reputation " 
                     << district->getUnlockReputation() << endl;
            }
        }
    }
    
    void visitLocation(const string& locationId) {
        auto it = locations.find(locationId);
        if (it != locations.end()) {
            auto& location = it->second;
            location->discover(*player);
            cout << "Visiting " << location->getName() << "..." << endl;
            player->addExperience(5);
        }
    }
    
    void talkToCharacter(const string& characterId) {
        auto it = characters.find(characterId);
        if (it != characters.end()) {
            auto& character = it->second;
            cout << "Talking to " << character->getName() << "..." << endl;
            cout << character->getDialogue("introduction") << endl;
            player->improveRelationship(characterId, 5);
            player->addExperience(15);
        }
    }
    
    int playMiniGame(const string& gameId) {
        auto it = miniGames.find(gameId);
        if (it != miniGames.end()) {
            auto& game = it->second;
            cout << "Playing " << game->getName() << "..." << endl;
            return game->play(*player);
        }
        return 0;
    }
    
    // Getters
    shared_ptr<Player> getPlayer() { return player; }
    const map<string, shared_ptr<District>>& getDistricts() const { return districts; }
    const map<string, shared_ptr<Location>>& getLocations() const { return locations; }
    const map<string, shared_ptr<Character>>& getCharacters() const { return characters; }
    const map<string, shared_ptr<MiniGame>>& getMiniGames() const { return miniGames; }
    
    TimeOfDay getCurrentTime() const { return currentTime; }
    Weather getCurrentWeather() const { return currentWeather; }
    Season getCurrentSeason() const { return currentSeason; }
    
    string getGameStateJSON() const {
        ostringstream json;
        json << "{";
        json << "\"player\":" << player->toJSON() << ",";
        json << "\"time\":\"" << timeToString(currentTime) << "\",";
        json << "\"weather\":\"" << weatherToString(currentWeather) << "\",";
        json << "\"season\":\"" << seasonToString(currentSeason) << "\",";
        json << "\"districts\":[";
        bool first = true;
        for (const auto& [id, district] : districts) {
            if (!first) json << ",";
            json << district->toJSON();
            first = false;
        }
        json << "],";
        json << "\"locations\":[";
        first = true;
        for (const auto& [id, location] : locations) {
            if (!first) json << ",";
            json << location->toJSON();
            first = false;
        }
        json << "]";
        json << "}";
        return json.str();
    }
    
private:
    string timeToString(TimeOfDay time) const {
        switch(time) {
            case TimeOfDay::MORNING: return "morning";
            case TimeOfDay::AFTERNOON: return "afternoon";
            case TimeOfDay::EVENING: return "evening";
            case TimeOfDay::NIGHT: return "night";
            default: return "unknown";
        }
    }
    
    string weatherToString(Weather weather) const {
        switch(weather) {
            case Weather::SUNNY: return "sunny";
            case Weather::CLOUDY: return "cloudy";
            case Weather::RAINY: return "rainy";
            case Weather::STORMY: return "stormy";
            case Weather::SNOWY: return "snowy";
            default: return "unknown";
        }
    }
    
    string seasonToString(Season season) const {
        switch(season) {
            case Season::SPRING: return "spring";
            case Season::SUMMER: return "summer";
            case Season::AUTUMN: return "autumn";
            case Season::WINTER: return "winter";
            default: return "unknown";
        }
    }
};

// Initialize static instance
GameWorld* GameWorld::instance = nullptr;

// Main Game Engine
class GameEngine {
private:
    GameWorld& world;
    bool running = false;
    time_t lastUpdate = 0;
    const int UPDATE_INTERVAL = 60; // Update every minute
    
public:
    GameEngine() : world(GameWorld::getInstance()) {}
    
    void start() {
        cout << "🚀 Starting MystiQ City Game Engine..." << endl;
        
        world.initialize();
        running = true;
        lastUpdate = time(nullptr);
        
        mainLoop();
    }
    
    void stop() {
        running = false;
        cout << "🛑 Stopping game engine..." << endl;
        
        // Save game state
        saveGame();
    }
    
    void mainLoop() {
        while (running) {
            time_t now = time(nullptr);
            
            // Update game world periodically
            if (now - lastUpdate >= UPDATE_INTERVAL) {
                world.update();
                lastUpdate = now;
                
                // Display game state
                displayGameState();
            }
            
            // Process input (in a real game, this would be event-driven)
            processInput();
            
            // Sleep to prevent CPU overuse
            this_thread::sleep_for(chrono::milliseconds(100));
        }
    }
    
    void processInput() {
        // In a console version, we'd process keyboard input
        // For now, we'll simulate some actions
        
        static int actionCounter = 0;
        if (actionCounter++ % 10 == 0) {
            // Simulate random player action
            simulatePlayerAction();
        }
    }
    
    void simulatePlayerAction() {
        vector<string> actions = {
            "explore_business",
            "visit_corporate_hq",
            "talk_ceo_johnson",
            "play_hangman"
        };
        
        static random_device rd;
        static mt19937 gen(rd());
        uniform_int_distribution<> dis(0, actions.size() - 1);
        
        string action = actions[dis(gen)];
        
        if (action == "explore_business") {
            world.exploreDistrict("business");
        } else if (action == "visit_corporate_hq") {
            world.visitLocation("corporate_hq");
        } else if (action == "talk_ceo_johnson") {
            world.talkToCharacter("ceo_johnson");
        } else if (action == "play_hangman") {
            int score = world.playMiniGame("hangman_business");
            cout << "Mini-game score: " << score << endl;
        }
    }
    
    void displayGameState() {
        auto player = world.getPlayer();
        
        cout << "\n=== MystiQ City Game State ===" << endl;
        cout << "Player: " << player->getName() << endl;
        cout << "Level: " << player->getLevel() << endl;
        cout << "Experience: " << player->getExperience() << endl;
        cout << "Reputation: " << player->getReputation() << endl;
        cout << "Currency: $" << player->getCurrency() << endl;
        cout << "=============================\n" << endl;
    }
    
    void saveGame() {
        ofstream saveFile("mystiq_save.json");
        if (saveFile.is_open()) {
            saveFile << world.getGameStateJSON();
            saveFile.close();
            cout << "💾 Game saved successfully!" << endl;
        } else {
            cerr << "❌ Failed to save game!" << endl;
        }
    }
    
    void loadGame() {
        ifstream saveFile("mystiq_save.json");
        if (saveFile.is_open()) {
            string jsonData((istreambuf_iterator<char>(saveFile)),
                           istreambuf_iterator<char>());
            saveFile.close();
            cout << "📂 Game loaded successfully!" << endl;
            // Parse JSON and restore game state
        } else {
            cout << "No save file found. Starting new game." << endl;
        }
    }
};

// HTTP Server Integration (using CGI for web access)
class HTTPServer {
private:
    GameWorld& world;
    
public:
    HTTPServer() : world(GameWorld::getInstance()) {}
    
    string handleRequest(const string& method, const string& path, const string& query) {
        if (method == "GET") {
            if (path == "/api/game-state") {
                return world.getGameStateJSON();
            } else if (path == "/api/player") {
                return world.getPlayer()->toJSON();
            } else if (path == "/api/districts") {
                return getDistrictsJSON();
            } else if (path == "/api/locations") {
                return getLocationsJSON();
            }
        } else if (method == "POST") {
            if (path == "/api/explore") {
                // Parse district ID from query and explore
                size_t pos = query.find("district=");
                if (pos != string::npos) {
                    string districtId = query.substr(pos + 9);
                    world.exploreDistrict(districtId);
                    return "{\"status\":\"success\",\"message\":\"District explored\"}";
                }
            } else if (path == "/api/talk") {
                // Parse character ID from query and talk
                size_t pos = query.find("character=");
                if (pos != string::npos) {
                    string characterId = query.substr(pos + 10);
                    world.talkToCharacter(characterId);
                    return "{\"status\":\"success\",\"message\":\"Character talked to\"}";
                }
            }
        }
        
        return "{\"status\":\"error\",\"message\":\"Invalid request\"}";
    }
    
private:
    string getDistrictsJSON() const {
        ostringstream json;
        json << "[";
        bool first = true;
        for (const auto& [id, district] : world.getDistricts()) {
            if (!first) json << ",";
            json << district->toJSON();
            first = false;
        }
        json << "]";
        return json.str();
    }
    
    string getLocationsJSON() const {
        ostringstream json;
        json << "[";
        bool first = true;
        for (const auto& [id, location] : world.getLocations()) {
            if (!first) json << ",";
            json << location->toJSON();
            first = false;
        }
        json << "]";
        return json.str();
    }
};

// Main function
int main() {
    cout << "========================================" << endl;
    cout << "     MYSTIQ CITY - Professional Edition" << endl;
    cout << "========================================" << endl;
    cout << "A sophisticated city exploration game" << endl;
    cout << "with districts, characters, and mini-games" << endl;
    cout << "========================================\n" << endl;
    
    try {
        // Start the game engine
        GameEngine engine;
        
        // Run in a separate thread to allow console interaction
        thread gameThread([&engine]() {
            engine.start();
        });
        
        // Console interface
        string command;
        while (true) {
            cout << "\n> ";
            getline(cin, command);
            
            if (command == "quit" || command == "exit") {
                engine.stop();
                gameThread.join();
                break;
            } else if (command == "save") {
                engine.saveGame();
            } else if (command == "state") {
                // Display state
                auto& world = GameWorld::getInstance();
                cout << world.getGameStateJSON() << endl;
            } else if (command == "help") {
                cout << "Commands: quit, save, state, explore <district>, talk <character>" << endl;
            } else if (command.find("explore ") == 0) {
                string districtId = command.substr(8);
                GameWorld::getInstance().exploreDistrict(districtId);
            } else if (command.find("talk ") == 0) {
                string characterId = command.substr(5);
                GameWorld::getInstance().talkToCharacter(characterId);
            }
        }
        
    } catch (const exception& e) {
        cerr << "❌ Error: " << e.what() << endl;
        return 1;
    }
    
    cout << "\nThank you for playing MystiQ City!" << endl;
    return 0;
}