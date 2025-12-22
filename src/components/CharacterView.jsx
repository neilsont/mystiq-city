
import React, { useState } from 'react';

const CharacterView = ({ character, onBack, player }) => {
  const [currentDialogue, setCurrentDialogue] = useState('introduction');
  const [selectedOption, setSelectedOption] = useState(null);
  const [relationship, setRelationship] = useState(character?.relationship || 0);
  const [showQuestOffer, setShowQuestOffer] = useState(false);

  // Character dialogue system
  const getDialogueOptions = (character, dialogueType) => {
    const options = [];

    // Business topics
    if (player?.skills?.business > 0) {
      options.push({
        text: "Tell me about business opportunities",
        action: () => handleDialogueChoice('business')
      });
    }

    // Technology topics
    if (player?.skills?.technology > 0) {
      options.push({
        text: "What do you think about technology?",
        action: () => handleDialogueChoice('tech')
      });
    }

    // General conversation
    options.push({
      text: "Tell me about yourself",
      action: () => handleDialogueChoice('general')
    });

    // Quest offering
    if (character?.questAvailable) {
      options.push({
        text: "Do you have any tasks for me?",
        action: () => setShowQuestOffer(true)
      });
    }

    // Goodbye
    options.push({
      text: "It was nice meeting you",
      action: () => handleDialogueChoice('goodbye')
    });

    return options;
  };

  const handleDialogueChoice = (choice) => {
    setCurrentDialogue(choice);
    setSelectedOption(choice);
    
    // Update relationship based on choice
    const newRelationship = Math.min(100, relationship + 2);
    setRelationship(newRelationship);
    
    // Log the interaction
    console.log(`${character.name}: Chose ${choice}`);
  };

  const handleQuestAccept = (quest) => {
    console.log(`Accepted quest: ${quest.title}`);
    setShowQuestOffer(false);
    setCurrentDialogue('goodbye');
    
    // Update quest status
    if (character) {
      character.questAvailable = false;
    }
  };

  const formatRelationship = (relationship) => {
    if (relationship >= 75) return { emoji: '😊', text: 'Close Friends' };
    if (relationship >= 50) return { emoji: '😊', text: 'Good Friends' };
    if (relationship >= 25) return { emoji: '😐', text: 'Acquaintances' };
    if (relationship >= 0) return { emoji: '😐', text: 'Neutral' };
    return { emoji: '😔', text: 'Cold' };
  };

  const getRelationshipColor = (relationship) => {
    if (relationship >= 75) return 'var(--success-green)';
    if (relationship >= 50) return 'var(--secondary-blue)';
    if (relationship >= 25) return 'var(--accent-gold)';
    if (relationship >= 0) return 'var(--neutral-gray)';
    return 'var(--danger-red)';
  };

  if (!character) {
    return (
      <div className="character-view">
        <div className="error-message">
          No character selected. Please go back to the location.
        </div>
      </div>
    );
  }

  const relationshipStatus = formatRelationship(relationship);

  return (
    <div className="character-view">
      {/* Character Header */}
      <div className="character-header">
        <button className="back-button" onClick={onBack}>
          ← Back to Location
        </button>
        <div className="character-info">
          <div className="character-avatar-large">
            {character.avatar}
          </div>
          <div className="character-details">
            <h2 className="character-name">{character.name}</h2>
            <div className="character-title">{character.title}</div>
            <div className="character-district">{character.district?.charAt(0).toUpperCase() + character.district?.slice(1)} District</div>
          </div>
        </div>
      </div>

      {/* Character Description */}
      <div className="character-description-section">
        <h3>About</h3>
        <p>{character.description}</p>
      </div>

      {/* Character Stats */}
      <div className="character-stats-section">
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-label">Personality</div>
            <div className="stat-value">{character.personality}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Relationship</div>
            <div className="stat-value" style={{ color: getRelationshipColor(relationship) }}>
              {relationshipStatus.emoji} {relationshipStatus.text}
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Quest Available</div>
            <div className="stat-value">
              {character.questAvailable ? '🎯 Yes' : '❌ No'}
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Skills</div>
            <div className="stat-value">
              {character.skills?.slice(0, 2).join(', ')}
            </div>
          </div>
        </div>
      </div>

      {/* Dialogue Section */}
      <div className="dialogue-section">
        <div className="dialogue-header">
          <h3>Conversation</h3>
        </div>
        
        <div className="dialogue-box">
          <div className="dialogue-character">
            <div className="dialogue-avatar">{character.avatar}</div>
            <div className="dialogue-name">{character.name}</div>
          </div>
          
          <div className="dialogue-content">
            <div className="dialogue-text">
              {character.dialogues?.[currentDialogue] || 
               character.dialogues?.introduction || 
               "Hello there! It's nice to meet you."}
            </div>
            
            {/* Dialogue Options */}
            <div className="dialogue-options">
              {getDialogueOptions(character, currentDialogue).map((option, index) => (
                <button
                  key={index}
                  className={`dialogue-option ${selectedOption === option.text ? 'selected' : ''}`}
                  onClick={option.action}
                >
                  {option.text}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Character Skills */}
      <div className="character-skills-section">
        <h3>Expertise</h3>
        <div className="skills-grid">
          {character.skills?.map((skill, index) => (
            <div key={index} className="skill-tag">
              {skill}
            </div>
          ))}
        </div>
      </div>

      {/* Quest Offer Modal */}
      {showQuestOffer && character.quests && (
        <div className="quest-modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowQuestOffer(false)}>
          <div className="quest-modal-content">
            <div className="quest-modal-header">
              <h3>🎯 Quest Available</h3>
              <button 
                className="quest-modal-close"
                onClick={() => setShowQuestOffer(false)}
              >
                ×
              </button>
            </div>
            
            <div className="quest-modal-body">
              {Object.values(character.quests).map((quest, index) => (
                <div key={quest.id || index} className="quest-card">
                  <h4 className="quest-title">{quest.title}</h4>
                  <p className="quest-description">{quest.description}</p>
                  
                  <div className="quest-requirements">
                    <strong>Requirements:</strong><br/>
                    Level {quest.requirements?.level || 1}<br/>
                    Reputation {quest.requirements?.reputation || 0}
                  </div>
                  
                  <div className="quest-rewards">
                    <strong>Rewards:</strong><br/>
                    {quest.rewards?.experience || 0} Experience<br/>
                    {quest.rewards?.reputation || 0} Reputation<br/>
                    {quest.rewards?.relationship && `${quest.rewards.relationship} Relationship Points`}
                  </div>
                  
                  <div className="quest-actions">
                    <button 
                      className="accept-quest-button primary"
                      onClick={() => handleQuestAccept(quest)}
                    >
                      Accept Quest
                    </button>
                    <button 
                      className="decline-quest-button secondary"
                      onClick={() => setShowQuestOffer(false)}
                    >
                      Maybe Later
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Character Actions */}
      <div className="character-actions">
        <button className="action-button primary" onClick={() => handleDialogueChoice('introduction')}>
          Start Conversation
        </button>
        <button className="action-button secondary" onClick={() => console.log('Give gift')}>
          Give Gift
        </button>
        <button className="action-button secondary" onClick={() => console.log('View profile')}>
          View Profile
        </button>
      </div>
    </div>
  );
};

export default CharacterView;

