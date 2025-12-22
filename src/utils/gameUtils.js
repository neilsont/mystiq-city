// MystiQ City - Game Utilities
// Helper functions and utilities for game operations

const GameUtils = {
    // DOM Manipulation
    showElement(elementId) {
        const element = document.getElementById(elementId);
        if (element) {
            element.style.display = 'block';
        }
    },

    hideElement(elementId) {
        const element = document.getElementById(elementId);
        if (element) {
            element.style.display = 'none';
        }
    },

    toggleElement(elementId) {
        const element = document.getElementById(elementId);
        if (element) {
            element.style.display = element.style.display === 'none' ? 'block' : 'none';
        }
    },

    // View Management
    setActiveView(viewId) {
        // Hide all views
        const views = document.querySelectorAll('.view');
        views.forEach(view => {
            view.classList.remove('active');
        });

        // Show target view
        const targetView = document.getElementById(viewId);
        if (targetView) {
            targetView.classList.add('active');
        }
    },

    // Local Storage Management
    saveGameData(key, data) {
        try {
            localStorage.setItem(`mystiQ_${key}`, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error('Failed to save game data:', error);
            return false;
        }
    },

    loadGameData(key, defaultValue = null) {
        try {
            const data = localStorage.getItem(`mystiQ_${key}`);
            return data ? JSON.parse(data) : defaultValue;
        } catch (error) {
            console.error('Failed to load game data:', error);
            return defaultValue;
        }
    },

    clearGameData(key) {
        try {
            localStorage.removeItem(`mystiQ_${key}`);
            return true;
        } catch (error) {
            console.error('Failed to clear game data:', error);
            return false;
        }
    },

    // Player Progress
    updatePlayerStats(stats) {
        const currentPlayer = this.loadGameData('player', GameData.player);
        const updatedPlayer = { ...currentPlayer, ...stats };
        this.saveGameData('player', updatedPlayer);
        this.updateUI();
        return updatedPlayer;
    },

    addExperience(amount) {
        const player = this.loadGameData('player', GameData.player);
        player.experience += amount;
        
        // Check for level up
        const newLevel = Math.floor(player.experience / 500) + 1;
        if (newLevel > player.level) {
            player.level = newLevel;
            this.showLevelUpNotification(newLevel);
        }
        
        this.saveGameData('player', player);
        this.updateUI();
        return player;
    },

    addReputation(amount) {
        const player = this.loadGameData('player', GameData.player);
        player.reputation += amount;
        this.saveGameData('player', player);
        this.updateUI();
        return player;
    },

    addSkill(skillType, amount) {
        const player = this.loadGameData('player', GameData.player);
        if (player.skills[skillType] !== undefined) {
            player.skills[skillType] += amount;
            this.saveGameData('player', player);
            this.updateUI();
        }
        return player;
    },

    // UI Updates
    updateUI() {
        const player = this.loadGameData('player', GameData.player);
        
        // Update header stats
        const levelElement = document.getElementById('playerLevel');
        const scoreElement = document.getElementById('playerScore');
        const reputationElement = document.getElementById('playerReputation');
        
        if (levelElement) levelElement.textContent = `Level: ${player.level}`;
        if (scoreElement) scoreElement.textContent = `Score: ${player.experience}`;
        if (reputationElement) reputationElement.textContent = `Reputation: ${player.reputation}`;
        
        // Update sidebar
        const sidebarLevel = document.getElementById('sidebarPlayerLevel');
        const sidebarName = document.getElementById('playerName');
        
        if (sidebarLevel) sidebarLevel.textContent = `Level ${player.level}`;
        if (sidebarName) sidebarName.textContent = player.name;
    },

    // Notifications
    showNotification(message, type = 'info', duration = 3000) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;
        
        // Add to page
        document.body.appendChild(notification);
        
        // Auto remove
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, duration);
        
        return notification;
    },

    showAchievement(achievement) {
        const notification = document.createElement('div');
        notification.className = 'achievement-notification';
        notification.innerHTML = `
            <div class="achievement-title">🏆 Achievement Unlocked!</div>
            <div class="achievement-name">${achievement.name}</div>
            <div class="achievement-description">${achievement.description}</div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    },

    showLevelUpNotification(newLevel) {
        const notification = document.createElement('div');
        notification.className = 'level-up-notification';
        notification.innerHTML = `
            <div class="level-up-content">
                <div class="level-up-title">🎉 Level Up!</div>
                <div class="level-up-text">You reached level ${newLevel}!</div>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 4000);
    },

    // Modal Management
    showModal(title, content, actions = []) {
        const modalOverlay = document.getElementById('modalOverlay');
        const modalTitle = document.getElementById('modalTitle');
        const modalBody = document.getElementById('modalBody');
        const modalClose = document.getElementById('modalClose');
        
        if (modalOverlay && modalTitle && modalBody && modalClose) {
            modalTitle.textContent = title;
            modalBody.innerHTML = content;
            
            // Add actions if provided
            if (actions.length > 0) {
                const actionsContainer = document.createElement('div');
                actionsContainer.className = 'modal-actions';
                actionsContainer.style.cssText = 'margin-top: 20px; display: flex; gap: 10px; justify-content: flex-end;';
                
                actions.forEach(action => {
                    const button = document.createElement('button');
                    button.textContent = action.text;
                    button.className = `modal-action-button ${action.type || 'secondary'}`;
                    button.onclick = action.handler || (() => this.hideModal());
                    actionsContainer.appendChild(button);
                });
                
                modalBody.appendChild(actionsContainer);
            }
            
            modalOverlay.style.display = 'flex';
            
            // Close modal on close button or overlay click
            modalClose.onclick = () => this.hideModal();
            modalOverlay.onclick = (e) => {
                if (e.target === modalOverlay) {
                    this.hideModal();
                }
            };
        }
    },

    hideModal() {
        const modalOverlay = document.getElementById('modalOverlay');
        if (modalOverlay) {
            modalOverlay.style.display = 'none';
        }
    },

    // Audio Management
    playSound(soundId, volume = 0.5) {
        const audio = document.getElementById('soundEffects');
        if (audio) {
            audio.volume = volume;
            // You can add different sound effects by setting different src or using audio sprites
            audio.currentTime = 0;
            audio.play().catch(e => console.warn('Audio play prevented:', e));
        }
    },

    toggleMusic() {
        const audio = document.getElementById('backgroundMusic');
        if (audio) {
            if (audio.paused) {
                audio.play().catch(e => console.warn('Audio play prevented:', e));
            } else {
                audio.pause();
            }
        }
    },

    // Character Management
    updateCharacterRelationship(characterId, change) {
        const characters = this.loadGameData('characters', {});
        if (!characters[characterId]) {
            characters[characterId] = { relationship: 0, ...GameData.characters[characterId] };
        }
        
        characters[characterId].relationship = Math.max(-100, Math.min(100, 
            characters[characterId].relationship + change));
        
        this.saveGameData('characters', characters);
        return characters[characterId];
    },

    // Quest Management
    updateQuestProgress(questId, objectiveIndex) {
        const quests = this.loadGameData('quests', {});
        if (!quests[questId]) {
            quests[questId] = { ...GameData.quests[questId], progress: [] };
        }
        
        if (!quests[questId].progress[objectiveIndex]) {
            quests[questId].progress[objectiveIndex] = true;
            this.checkQuestCompletion(questId);
        }
        
        this.saveGameData('quests', quests);
        this.updateQuestUI();
        return quests[questId];
    },

    checkQuestCompletion(questId) {
        const quests = this.loadGameData('quests', {});
        const quest = quests[questId];
        
        if (quest && quest.objectives && quest.progress) {
            const allCompleted = quest.objectives.every((_, index) => quest.progress[index]);
            
            if (allCompleted && !quest.completed) {
                quest.completed = true;
                this.completeQuest(quest);
            }
        }
        
        this.saveGameData('quests', quests);
    },

    completeQuest(quest) {
        if (quest.rewards) {
            if (quest.rewards.experience) {
                this.addExperience(quest.rewards.experience);
            }
            if (quest.rewards.reputation) {
                this.addReputation(quest.rewards.reputation);
            }
        }
        
        this.showNotification(`Quest Completed: ${quest.title}!`, 'success');
    },

    updateQuestUI() {
        const activeQuestsContainer = document.getElementById('activeQuests');
        if (activeQuestsContainer) {
            const quests = this.loadGameData('quests', {});
            const activeQuests = Object.values(quests).filter(q => !q.completed);
            
            if (activeQuests.length === 0) {
                activeQuestsContainer.innerHTML = '<div class="no-quests">No active quests</div>';
            } else {
                activeQuestsContainer.innerHTML = activeQuests.map(quest => `
                    <div class="quest-item">
                        <strong>${quest.title}</strong><br>
                        <small>${quest.description}</small>
                        <div class="quest-progress">
                            ${quest.objectives.map((obj, i) => 
                                quest.progress[i] ? '✓ ' + obj : '○ ' + obj
                            ).join('<br>')}
                        </div>
                    </div>
                `).join('');
            }
        }
    },

    // Activity Logging
    addActivity(message) {
        const activities = this.loadGameData('activities', []);
        const timestamp = new Date().toLocaleTimeString();
        activities.unshift({ message, timestamp });
        
        // Keep only last 10 activities
        if (activities.length > 10) {
            activities.splice(10);
        }
        
        this.saveGameData('activities', activities);
        this.updateActivityUI();
    },

    updateActivityUI() {
        const activityLog = document.getElementById('activityLog');
        if (activityLog) {
            const activities = this.loadGameData('activities', []);
            activityLog.innerHTML = activities.map(activity => `
                <div class="activity-item">
                    <div>${activity.message}</div>
                    <small style="opacity: 0.7;">${activity.timestamp}</small>
                </div>
            `).join('');
        }
    },

    // Random utilities
    randomChoice(array) {
        return array[Math.floor(Math.random() * array.length)];
    },

    randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    },

    // Formatting utilities
    formatNumber(num) {
        return num.toLocaleString();
    },

    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    },

    // Validation
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },

    sanitizeHTML(str) {
        const temp = document.createElement('div');
        temp.textContent = str;
        return temp.innerHTML;
    },

    // Animation helpers
    fadeIn(element, duration = 300) {
        element.style.opacity = '0';
        element.style.display = 'block';
        
        const start = performance.now();
        const animate = (timestamp) => {
            const elapsed = timestamp - start;
            const progress = Math.min(elapsed / duration, 1);
            element.style.opacity = progress;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    },

    fadeOut(element, duration = 300) {
        const start = performance.now();
        const initialOpacity = parseFloat(getComputedStyle(element).opacity);
        
        const animate = (timestamp) => {
            const elapsed = timestamp - start;
            const progress = Math.min(elapsed / duration, 1);
            element.style.opacity = initialOpacity * (1 - progress);
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                element.style.display = 'none';
            }
        };
        
        requestAnimationFrame(animate);
    },

    slideIn(element, direction = 'right', duration = 300) {
        element.style.transform = `translateX(${direction === 'right' ? '100%' : '-100%'})`;
        element.style.transition = `transform ${duration}ms ease`;
        element.style.display = 'block';
        
        requestAnimationFrame(() => {
            element.style.transform = 'translateX(0)';
        });
    },

    slideOut(element, direction = 'right', duration = 300) {
        element.style.transition = `transform ${duration}ms ease`;
        element.style.transform = `translateX(${direction === 'right' ? '100%' : '-100%'})`;
        
        setTimeout(() => {
            element.style.display = 'none';
        }, duration);
    }
};

// Export for use in other modules
window.GameUtils = GameUtils;