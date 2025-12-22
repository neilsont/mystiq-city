// MystiQCityServer.java - Java Backend Server
[file content begin]
package com.mystiqcity.server;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.socket.config.annotation.*;
import org.springframework.web.socket.*;
import org.springframework.stereotype.Component;

import java.util.*;
import java.util.concurrent.*;

@SpringBootApplication
@RestController
@RequestMapping("/api")
public class MystiQCityServer {
    
    private final GameStateManager gameStateManager = new GameStateManager();
    private final PlayerManager playerManager = new PlayerManager();
    private final QuestManager questManager = new QuestManager();
    
    public static void main(String[] args) {
        SpringApplication.run(MystiQCityServer.class, args);
        System.out.println("🚀 MystiQ City Server started on port 8080");
    }
    
    // Player endpoints
    @PostMapping("/player/register")
    public Player registerPlayer(@RequestBody PlayerRegistration request) {
        return playerManager.registerPlayer(
            request.getUsername(),
            request.getEmail(),
            request.getPassword()
        );
    }
    
    @PostMapping("/player/login")
    public Player login(@RequestBody LoginRequest request) {
        return playerManager.login(request.getUsername(), request.getPassword());
    }
    
    @GetMapping("/player/{id}")
    public Player getPlayer(@PathVariable String id) {
        return playerManager.getPlayer(id);
    }
    
    @PostMapping("/player/{id}/update")
    public Player updatePlayer(@PathVariable String id, @RequestBody PlayerUpdate update) {
        return playerManager.updatePlayer(id, update);
    }
    
    // Game state endpoints
    @GetMapping("/game/state")
    public GameState getGameState(@RequestParam String playerId) {
        return gameStateManager.getGameState(playerId);
    }
    
    @PostMapping("/game/save")
    public void saveGameState(@RequestBody GameStateSaveRequest request) {
        gameStateManager.saveGameState(
            request.getPlayerId(),
            request.getState()
        );
    }
    
    // Quest endpoints
    @GetMapping("/quests/available")
    public List<Quest> getAvailableQuests(@RequestParam String playerId) {
        return questManager.getAvailableQuests(playerId);
    }
    
    @PostMapping("/quests/accept")
    public Quest acceptQuest(@RequestBody QuestAcceptRequest request) {
        return questManager.acceptQuest(
            request.getPlayerId(),
            request.getQuestId()
        );
    }
    
    @PostMapping("/quests/complete")
    public QuestCompleteResponse completeQuest(@RequestBody QuestCompleteRequest request) {
        return questManager.completeQuest(
            request.getPlayerId(),
            request.getQuestId(),
            request.getResults()
        );
    }
    
    // Multiplayer endpoints
    @GetMapping("/multiplayer/rooms")
    public List<GameRoom> getAvailableRooms() {
        return gameStateManager.getAvailableRooms();
    }
    
    @PostMapping("/multiplayer/join")
    public GameRoom joinRoom(@RequestBody RoomJoinRequest request) {
        return gameStateManager.joinRoom(
            request.getPlayerId(),
            request.getRoomId()
        );
    }
    
    // Analytics endpoint
    @GetMapping("/analytics/player/{id}")
    public PlayerAnalytics getPlayerAnalytics(@PathVariable String id) {
        return playerManager.getAnalytics(id);
    }
    
    // Leaderboard endpoint
    @GetMapping("/leaderboard")
    public Leaderboard getLeaderboard(@RequestParam(defaultValue = "reputation") String sortBy) {
        return playerManager.getLeaderboard(sortBy);
    }
}

// WebSocket Configuration for real-time updates
@Configuration
@EnableWebSocket
class WebSocketConfig implements WebSocketConfigurer {
    
    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(new GameWebSocketHandler(), "/ws/game")
                .setAllowedOrigins("*");
    }
}

@Component
class GameWebSocketHandler implements WebSocketHandler {
    
    private final Map<String, WebSocketSession> sessions = new ConcurrentHashMap<>();
    private final GameStateManager gameStateManager = new GameStateManager();
    
    @Override
    public void afterConnectionEstablished(WebSocketSession session) {
        String playerId = extractPlayerId(session);
        sessions.put(playerId, session);
        
        System.out.println("Player connected: " + playerId);
        
        // Send initial game state
        sendGameState(session, playerId);
    }
    
    @Override
    public void handleMessage(WebSocketSession session, WebSocketMessage<?> message) {
        String payload = message.getPayload().toString();
        GameMessage gameMessage = parseMessage(payload);
        
        switch (gameMessage.getType()) {
            case "player_move":
                handlePlayerMove(gameMessage);
                break;
            case "player_action":
                handlePlayerAction(gameMessage);
                break;
            case "chat_message":
                handleChatMessage(gameMessage);
                break;
            case "game_event":
                handleGameEvent(gameMessage);
                break;
        }
    }
    
    @Override
    public void handleTransportError(WebSocketSession session, Throwable exception) {
        System.err.println("WebSocket error: " + exception.getMessage());
    }
    
    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus closeStatus) {
        String playerId = extractPlayerId(session);
        sessions.remove(playerId);
        
        System.out.println("Player disconnected: " + playerId);
        
        // Notify other players
        broadcastPlayerLeft(playerId);
    }
    
    @Override
    public boolean supportsPartialMessages() {
        return false;
    }
    
    private void handlePlayerMove(GameMessage message) {
        String playerId = message.getPlayerId();
        PlayerPosition position = message.getPosition();
        
        // Update player position
        gameStateManager.updatePlayerPosition(playerId, position);
        
        // Broadcast to other players in same location
        broadcastPlayerMove(playerId, position);
    }
    
    private void broadcastPlayerMove(String playerId, PlayerPosition position) {
        GameMessage moveMessage = new GameMessage();
        moveMessage.setType("player_moved");
        moveMessage.setPlayerId(playerId);
        moveMessage.setPosition(position);
        
        broadcastToLocation(playerId, moveMessage);
    }
    
    private void broadcastToLocation(String playerId, GameMessage message) {
        String locationId = gameStateManager.getPlayerLocation(playerId);
        
        sessions.forEach((id, session) -> {
            if (!id.equals(playerId) && 
                gameStateManager.getPlayerLocation(id).equals(locationId)) {
                sendMessage(session, message);
            }
        });
    }
    
    private void sendGameState(WebSocketSession session, String playerId) {
        GameState state = gameStateManager.getGameState(playerId);
        
        GameMessage message = new GameMessage();
        message.setType("game_state");
        message.setState(state);
        
        sendMessage(session, message);
    }
    
    private void sendMessage(WebSocketSession session, GameMessage message) {
        try {
            session.sendMessage(new TextMessage(message.toJson()));
        } catch (Exception e) {
            System.err.println("Failed to send message: " + e.getMessage());
        }
    }
    
    private String extractPlayerId(WebSocketSession session) {
        // Extract from session attributes or query parameters
        return session.getAttributes().get("playerId").toString();
    }
    
    private GameMessage parseMessage(String json) {
        // Parse JSON to GameMessage
        return new GameMessage(); // Simplified
    }
}

// Data Models
class Player {
    private String id;
    private String username;
    private String email;
    private int level;
    private int experience;
    private int reputation;
    private int currency;
    private Map<String, Integer> skills;
    private List<String> achievements;
    private List<String> activeQuests;
    private Date createdAt;
    private Date lastLogin;
    private int playTime;
    
    // Getters and setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    
    public int getLevel() { return level; }
    public void setLevel(int level) { this.level = level; }
    
    public int getExperience() { return experience; }
    public void setExperience(int experience) { this.experience = experience; }
    
    public int getReputation() { return reputation; }
    public void setReputation(int reputation) { this.reputation = reputation; }
    
    public int getCurrency() { return currency; }
    public void setCurrency(int currency) { this.currency = currency; }
}

class GameState {
    private String playerId;
    private String districtId;
    private String locationId;
    private Map<String, Object> playerState;
    private Map<String, Object> worldState;
    private List<Player> nearbyPlayers;
    private List<Quest> availableQuests;
    private Date timestamp;
    
    // Getters and setters
}

class Quest {
    private String id;
    private String title;
    private String description;
    private List<String> objectives;
    private Map<String, Integer> requirements;
    private Map<String, Integer> rewards;
    private boolean repeatable;
    private int timeLimit;
    private String category;
    
    // Getters and setters
}

class PlayerPosition {
    private double x;
    private double y;
    private String direction;
    private long timestamp;
    
    // Getters and setters
}

class GameMessage {
    private String type;
    private String playerId;
    private PlayerPosition position;
    private GameState state;
    private Object data;
    
    // Getters and setters
    
    public String toJson() {
        // Convert to JSON string
        return "{}"; // Simplified
    }
}

// Manager Classes
class GameStateManager {
    private final Map<String, GameState> gameStates = new ConcurrentHashMap<>();
    private final Map<String, String> playerLocations = new ConcurrentHashMap<>();
    private final Map<String, PlayerPosition> playerPositions = new ConcurrentHashMap<>();
    
    public GameState getGameState(String playerId) {
        return gameStates.getOrDefault(playerId, createDefaultGameState(playerId));
    }
    
    public void saveGameState(String playerId, GameState state) {
        gameStates.put(playerId, state);
    }
    
    public void updatePlayerPosition(String playerId, PlayerPosition position) {
        playerPositions.put(playerId, position);
    }
    
    public String getPlayerLocation(String playerId) {
        return playerLocations.getOrDefault(playerId, "business_district");
    }
    
    public List<GameRoom> getAvailableRooms() {
        // Return available multiplayer rooms
        return Arrays.asList(
            new GameRoom("city_center", "City Center", 45, 100),
            new GameRoom("business_district", "Business District", 23, 50),
            new GameRoom("arts_quarter", "Arts Quarter", 18, 50)
        );
    }
    
    public GameRoom joinRoom(String playerId, String roomId) {
        playerLocations.put(playerId, roomId);
        return new GameRoom(roomId, "Room", 1, 50); // Simplified
    }
    
    private GameState createDefaultGameState(String playerId) {
        GameState state = new GameState();
        state.setPlayerId(playerId);
        state.setDistrictId("business");
        state.setLocationId("corporate_hq");
        state.setTimestamp(new Date());
        return state;
    }
}

class PlayerManager {
    private final Map<String, Player> players = new ConcurrentHashMap<>();
    private final Map<String, String> passwords = new ConcurrentHashMap<>();
    
    public Player registerPlayer(String username, String email, String password) {
        String playerId = UUID.randomUUID().toString();
        
        Player player = new Player();
        player.setId(playerId);
        player.setUsername(username);
        player.setEmail(email);
        player.setLevel(1);
        player.setExperience(0);
        player.setReputation(0);
        player.setCurrency(1000);
        player.setCreatedAt(new Date());
        player.setLastLogin(new Date());
        
        // Initialize skills
        Map<String, Integer> skills = new HashMap<>();
        skills.put("business", 0);
        skills.put("arts", 0);
        skills.put("technology", 0);
        skills.put("history", 0);
        skills.put("entertainment", 0);
        player.setSkills(skills);
        
        // Store player
        players.put(playerId, player);
        passwords.put(playerId, hashPassword(password));
        
        System.out.println("New player registered: " + username);
        
        return player;
    }
    
    public Player login(String username, String password) {
        // Find player by username
        Player player = players.values().stream()
            .filter(p -> p.getUsername().equals(username))
            .findFirst()
            .orElse(null);
        
        if (player != null && verifyPassword(player.getId(), password)) {
            player.setLastLogin(new Date());
            return player;
        }
        
        throw new RuntimeException("Invalid credentials");
    }
    
    public Player getPlayer(String id) {
        return players.get(id);
    }
    
    public Player updatePlayer(String id, PlayerUpdate update) {
        Player player = players.get(id);
        if (player == null) {
            throw new RuntimeException("Player not found");
        }
        
        // Update allowed fields
        if (update.getExperience() != null) {
            player.setExperience(update.getExperience());
            
            // Check level up
            int newLevel = calculateLevel(player.getExperience());
            if (newLevel > player.getLevel()) {
                player.setLevel(newLevel);
                // Grant level up rewards
                player.setCurrency(player.getCurrency() + (newLevel - player.getLevel()) * 100);
            }
        }
        
        if (update.getReputation() != null) {
            player.setReputation(update.getReputation());
        }
        
        if (update.getCurrency() != null) {
            player.setCurrency(update.getCurrency());
        }
        
        if (update.getSkills() != null) {
            player.getSkills().putAll(update.getSkills());
        }
        
        return player;
    }
    
    public PlayerAnalytics getAnalytics(String playerId) {
        Player player = players.get(playerId);
        if (player == null) {
            throw new RuntimeException("Player not found");
        }
        
        PlayerAnalytics analytics = new PlayerAnalytics();
        analytics.setPlayerId(playerId);
        analytics.setPlayTime(player.getPlayTime());
        analytics.setAverageSessionTime(120); // minutes
        analytics.setFavoriteDistrict("business");
        analytics.setQuestsCompleted(12);
        analytics.setAchievementsUnlocked(5);
        analytics.setSkillDistribution(player.getSkills());
        
        return analytics;
    }
    
    public Leaderboard getLeaderboard(String sortBy) {
        List<Player> sortedPlayers = new ArrayList<>(players.values());
        
        switch (sortBy) {
            case "level":
                sortedPlayers.sort((a, b) -> Integer.compare(b.getLevel(), a.getLevel()));
                break;
            case "reputation":
                sortedPlayers.sort((a, b) -> Integer.compare(b.getReputation(), a.getReputation()));
                break;
            case "experience":
                sortedPlayers.sort((a, b) -> Integer.compare(b.getExperience(), a.getExperience()));
                break;
        }
        
        Leaderboard leaderboard = new Leaderboard();
        leaderboard.setSortBy(sortBy);
        leaderboard.setPlayers(sortedPlayers.stream()
            .limit(100)
            .collect(Collectors.toList()));
        
        return leaderboard;
    }
    
    private String hashPassword(String password) {
        // In production, use proper password hashing like BCrypt
        return Integer.toString(password.hashCode());
    }
    
    private boolean verifyPassword(String playerId, String password) {
        String storedHash = passwords.get(playerId);
        return storedHash != null && storedHash.equals(hashPassword(password));
    }
    
    private int calculateLevel(int experience) {
        return (int) Math.sqrt(experience / 100.0) + 1;
    }
}

class QuestManager {
    private final Map<String, Quest> quests = new HashMap<>();
    private final Map<String, List<PlayerQuest>> playerQuests = new ConcurrentHashMap<>();
    
    public QuestManager() {
        initializeQuests();
    }
    
    private void initializeQuests() {
        // Welcome Quest
        Quest welcomeQuest = new Quest();
        welcomeQuest.setId("welcome_to_city");
        welcomeQuest.setTitle("Welcome to MystiQ City");
        welcomeQuest.setDescription("Your journey begins! Explore the city map and choose your first destination.");
        welcomeQuest.setObjectives(Arrays.asList(
            "Visit the city map",
            "Select a district to explore"
        ));
        
        Map<String, Integer> requirements = new HashMap<>();
        requirements.put("level", 1);
        welcomeQuest.setRequirements(requirements);
        
        Map<String, Integer> rewards = new HashMap<>();
        rewards.put("experience", 100);
        rewards.put("reputation", 25);
        rewards.put("currency", 500);
        welcomeQuest.setRewards(rewards);
        
        quests.put(welcomeQuest.getId(), welcomeQuest);
        
        // Business District Quest
        Quest businessQuest = new Quest();
        businessQuest.setId("corporate_challenge");
        businessQuest.setTitle("The Corporate Challenge");
        businessQuest.setDescription("Help Victoria Johnson solve a strategic business puzzle.");
        businessQuest.setObjectives(Arrays.asList(
            "Talk to CEO Victoria Johnson",
            "Complete the business strategy mini-game",
            "Achieve a score of 500 or higher"
        ));
        
        requirements = new HashMap<>();
        requirements.put("level", 2);
        requirements.put("reputation", 50);
        businessQuest.setRequirements(requirements);
        
        rewards = new HashMap<>();
        rewards.put("experience", 250);
        rewards.put("reputation", 100);
        rewards.put("currency", 1000);
        rewards.put("skill_business", 10);
        businessQuest.setRewards(rewards);
        
        quests.put(businessQuest.getId(), businessQuest);
    }
    
    public List<Quest> getAvailableQuests(String playerId) {
        Player player = getPlayer(playerId); // Would need player service
        List<Quest> available = new ArrayList<>();
        
        for (Quest quest : quests.values()) {
            if (isQuestAvailable(player, quest)) {
                available.add(quest);
            }
        }
        
        return available;
    }
    
    public Quest acceptQuest(String playerId, String questId) {
        Quest quest = quests.get(questId);
        if (quest == null) {
            throw new RuntimeException("Quest not found");
        }
        
        PlayerQuest playerQuest = new PlayerQuest();
        playerQuest.setQuestId(questId);
        playerQuest.setAcceptedAt(new Date());
        playerQuest.setObjectivesCompleted(new boolean[quest.getObjectives().size()]);
        
        playerQuests.computeIfAbsent(playerId, k -> new ArrayList<>())
                   .add(playerQuest);
        
        return quest;
    }
    
    public QuestCompleteResponse completeQuest(String playerId, String questId, 
                                               Map<String, Object> results) {
        List<PlayerQuest> playerQuestList = playerQuests.get(playerId);
        if (playerQuestList == null) {
            throw new RuntimeException("Player has no active quests");
        }
        
        PlayerQuest playerQuest = playerQuestList.stream()
            .filter(pq -> pq.getQuestId().equals(questId))
            .findFirst()
            .orElse(null);
        
        if (playerQuest == null) {
            throw new RuntimeException("Quest not accepted by player");
        }
        
        Quest quest = quests.get(questId);
        
        // Check if all objectives are complete
        boolean allComplete = true;
        for (boolean completed : playerQuest.getObjectivesCompleted()) {
            if (!completed) {
                allComplete = false;
                break;
            }
        }
        
        if (!allComplete) {
            throw new RuntimeException("Not all quest objectives are complete");
        }
        
        // Mark as completed
        playerQuest.setCompletedAt(new Date());
        
        // Calculate rewards
        QuestCompleteResponse response = new QuestCompleteResponse();
        response.setQuestId(questId);
        response.setRewards(quest.getRewards());
        response.setCompletedAt(new Date());
        
        // Apply rewards to player (would update player in database)
        
        return response;
    }
    
    private boolean isQuestAvailable(Player player, Quest quest) {
        // Check level requirement
        if (player.getLevel() < quest.getRequirements().getOrDefault("level", 1)) {
            return false;
        }
        
        // Check reputation requirement
        if (player.getReputation() < quest.getRequirements().getOrDefault("reputation", 0)) {
            return false;
        }
        
        // Check if already completed (if not repeatable)
        if (!quest.isRepeatable()) {
            List<PlayerQuest> completed = playerQuests.getOrDefault(player.getId(), 
                Collections.emptyList())
                .stream()
                .filter(pq -> pq.getQuestId().equals(quest.getId()) && pq.getCompletedAt() != null)
                .collect(Collectors.toList());
            
            if (!completed.isEmpty()) {
                return false;
            }
        }
        
        return true;
    }
    
    private Player getPlayer(String playerId) {
        // This would fetch from database
        // For now, return a dummy player
        Player player = new Player();
        player.setId(playerId);
        player.setLevel(1);
        player.setReputation(0);
        return player;
    }
}

// DTO Classes
class PlayerRegistration {
    private String username;
    private String email;
    private String password;
    
    // Getters and setters
}

class LoginRequest {
    private String username;
    private String password;
    
    // Getters and setters
}

class PlayerUpdate {
    private Integer experience;
    private Integer reputation;
    private Integer currency;
    private Map<String, Integer> skills;
    
    // Getters and setters
}

class GameStateSaveRequest {
    private String playerId;
    private GameState state;
    
    // Getters and setters
}

class QuestAcceptRequest {
    private String playerId;
    private String questId;
    
    // Getters and setters
}

class QuestCompleteRequest {
    private String playerId;
    private String questId;
    private Map<String, Object> results;
    
    // Getters and setters
}

class QuestCompleteResponse {
    private String questId;
    private Map<String, Integer> rewards;
    private Date completedAt;
    
    // Getters and setters
}

class RoomJoinRequest {
    private String playerId;
    private String roomId;
    
    // Getters and setters
}

class PlayerAnalytics {
    private String playerId;
    private int playTime;
    private int averageSessionTime;
    private String favoriteDistrict;
    private int questsCompleted;
    private int achievementsUnlocked;
    private Map<String, Integer> skillDistribution;
    
    // Getters and setters
}

class Leaderboard {
    private String sortBy;
    private List<Player> players;
    
    // Getters and setters
}

class GameRoom {
    private String id;
    private String name;
    private int playerCount;
    private int maxPlayers;
    
    public GameRoom(String id, String name, int playerCount, int maxPlayers) {
        this.id = id;
        this.name = name;
        this.playerCount = playerCount;
        this.maxPlayers = maxPlayers;
    }
    
    // Getters and setters
}

class PlayerQuest {
    private String questId;
    private Date acceptedAt;
    private Date completedAt;
    private boolean[] objectivesCompleted;
    
    // Getters and setters
}
[file content end]