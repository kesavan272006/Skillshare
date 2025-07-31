import React from 'react';
import { useNavigate } from 'react-router-dom';
import './SessionCard.css';

const SessionCard = ({ session }) => {
  const navigate = useNavigate();
  
  const handleCardClick = () => {
    navigate(`/session/${session.id}`);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' at ' + date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getParticipantCount = () => {
    const participants = session.participants?.length || 0;
    const maxParticipants = session.maxParticipants || 0;
    return `${participants}/${maxParticipants}`;
  };

  return (
    <div className="session-card" onClick={handleCardClick}>
      <div className="session-card-header">
        <h4 className="session-card-title">{session.title}</h4>
        <span className={`difficulty-badge ${session.difficulty?.toLowerCase()}`}>
          {session.difficulty}
        </span>
      </div>
      
      <div className="session-card-details">
        <div className="detail-item">
          <span className="detail-label">Host:</span>
          <span className="detail-value">{session.hostName || 'Unknown'}</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Date:</span>
          <span className="detail-value">{formatDate(session.date)}</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Category:</span>
          <span className="detail-value">{session.category}</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Participants:</span>
          <span className="detail-value">{getParticipantCount()}</span>
        </div>
      </div>
      
      {session.tags && session.tags.length > 0 && (
        <div className="session-card-tags">
          {session.tags.slice(0, 3).map((tag, index) => (
            <span key={index} className="tag">{tag}</span>
          ))}
          {session.tags.length > 3 && (
            <span className="tag-more">+{session.tags.length - 3} more</span>
          )}
        </div>
      )}
    </div>
  );
};

export default SessionCard; 