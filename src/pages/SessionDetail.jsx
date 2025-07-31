import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { auth, database } from '../config/firebase';
import { doc, getDoc, deleteDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import './sessionDetail.css';

const SessionDetail = () => {
  const navigate = useNavigate();
  const { sessionId } = useParams();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isOwner, setIsOwner] = useState(false);
  const [isParticipant, setIsParticipant] = useState(false);
  const [joining, setJoining] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchSession = async () => {
      if (!sessionId) {
        setError('Session ID is required');
        setLoading(false);
        return;
      }

      try {
        const sessionRef = doc(database, 'Sessions', sessionId);
        const sessionSnap = await getDoc(sessionRef);

        if (!sessionSnap.exists()) {
          setError('Session not found');
          setLoading(false);
          return;
        }

        const sessionData = sessionSnap.data();
        setSession({ id: sessionId, ...sessionData });
        const currentUser = auth.currentUser;
        if (currentUser) {
          setIsOwner(sessionData.createdBy === currentUser.uid);
          setIsParticipant(sessionData.participants?.includes(currentUser.uid) || false);
        }

        setLoading(false);
      } catch (err) {
        console.error('Error fetching session:', err);
        setError('Failed to load session');
        setLoading(false);
      }
    };

    fetchSession();
  }, [sessionId]);

  const handleJoinSession = async () => {
    if (!auth.currentUser) {
      navigate('/signin');
      return;
    }

    setJoining(true);
    try {
      const sessionRef = doc(database, 'Sessions', sessionId);
      await updateDoc(sessionRef, {
        participants: arrayUnion(auth.currentUser.uid)
      });
      setIsParticipant(true);
      setSession(prev => ({
        ...prev,
        participants: [...(prev.participants || []), auth.currentUser.uid]
      }));
    } catch (err) {
      console.error('Error joining session:', err);
      setError('Failed to join session');
    } finally {
      setJoining(false);
    }
  };

  const handleLeaveSession = async () => {
    setJoining(true);
    try {
      const sessionRef = doc(database, 'Sessions', sessionId);
      await updateDoc(sessionRef, {
        participants: arrayRemove(auth.currentUser.uid)
      });
      setIsParticipant(false);
      setSession(prev => ({
        ...prev,
        participants: prev.participants.filter(id => id !== auth.currentUser.uid)
      }));
    } catch (err) {
      console.error('Error leaving session:', err);
      setError('Failed to leave session');
    } finally {
      setJoining(false);
    }
  };

  const handleDeleteSession = async () => {
    if (!window.confirm('Are you sure you want to delete this session?')) {
      return;
    }

    setDeleting(true);
    try {
      await deleteDoc(doc(database, 'Sessions', sessionId));
      navigate('/home');
    } catch (err) {
      console.error('Error deleting session:', err);
      setError('Failed to delete session');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="session-detail-root">
        <div className="session-detail-container">
          <div style={{ padding: '40px', textAlign: 'center' }}>
            Loading session...
          </div>
        </div>
      </div>
    );
  }

  if (error && !session) {
    return (
      <div className="session-detail-root">
        <div className="session-detail-container">
          <div className="session-detail-header">
            <h1 className="session-detail-title">Error</h1>
            <p className="session-detail-subtitle">{error}</p>
          </div>
          <div style={{ padding: '32px', textAlign: 'center' }}>
            <button 
              onClick={() => navigate('/home')}
              className="primary-btn"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const sessionDate = new Date(session.date);
  const isPastSession = sessionDate < new Date();

  return (
    <div className="session-detail-root">
      <div className="session-detail-container">
        <div className="session-detail-header">
          <div className="session-detail-title-section">
            <h1 className="session-detail-title">{session.title}</h1>
            <div className="session-detail-meta">
              <span className={`difficulty-badge ${session.difficulty?.toLowerCase()}`}>
                {session.difficulty}
              </span>
              <span className="category-badge">{session.category}</span>
            </div>
          </div>
          
          {isOwner && (
            <div className="session-detail-actions">
              <button
                onClick={() => navigate(`/edit/${sessionId}`)}
                className="edit-btn"
                disabled={isPastSession}
              >
                Edit
              </button>
              <button
                onClick={handleDeleteSession}
                className="delete-btn"
                disabled={deleting}
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          )}
        </div>

        <div className="session-detail-content">
          <div className="session-detail-section">
            <h3 className="section-title">Description</h3>
            <p className="session-description">{session.description}</p>
          </div>

          <div className="session-detail-section">
            <h3 className="section-title">Session Details</h3>
            <div className="session-details-grid">
              <div className="detail-item">
                <span className="detail-label">Host:</span>
                <span className="detail-value">{session.hostName || 'Unknown'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Date & Time:</span>
                <span className="detail-value">
                  {sessionDate.toLocaleDateString()} at {sessionDate.toLocaleTimeString()}
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Participants:</span>
                <span className="detail-value">
                  {session.participants?.length || 0}/{session.maxParticipants}
                </span>
              </div>
              {session.tags && session.tags.length > 0 && (
                <div className="detail-item">
                  <span className="detail-label">Tags:</span>
                  <div className="tags-container">
                    {session.tags.map((tag, index) => (
                      <span key={index} className="tag">{tag}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {!isOwner && !isPastSession && (
            <div className="session-detail-section">
              <div className="join-section">
                {isParticipant ? (
                  <button
                    onClick={handleLeaveSession}
                    className="leave-btn"
                    disabled={joining}
                  >
                    {joining ? 'Leaving...' : 'Leave Session'}
                  </button>
                ) : (
                  <button
                    onClick={handleJoinSession}
                    className="join-btn"
                    disabled={joining || (session.participants?.length >= session.maxParticipants)}
                  >
                    {joining ? 'Joining...' : 'Join Session'}
                  </button>
                )}
                {session.participants?.length >= session.maxParticipants && !isParticipant && (
                  <p className="session-full-message">This session is full</p>
                )}
              </div>
            </div>
          )}

          {isPastSession && (
            <div className="session-detail-section">
              <div className="past-session-message">
                This session has already taken place
              </div>
            </div>
          )}
        </div>

        <div className="session-detail-footer">
          <button
            onClick={() => navigate('/home')}
            className="back-btn"
          >
            Back to Sessions
          </button>
        </div>
      </div>
    </div>
  );
};

export default SessionDetail; 