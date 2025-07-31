import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { auth, database } from '../config/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import './createSession.css';
import { suggestTagsWithGemini } from '../utils/geminiSuggestTags';

const categories = ['Tech', 'Music', 'Business', 'Art', 'Cooking', 'Fitness', 'Language', 'Other'];
const difficulties = ['Beginner', 'Intermediate', 'Expert'];

const EditSession = () => {
  const navigate = useNavigate();
  const { sessionId } = useParams();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Tech',
    date: '',
    time: '',
    difficulty: 'Beginner',
    tags: '',
    maxParticipants: 10
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [session, setSession] = useState(null);
  const [suggestingTags, setSuggestingTags] = useState(false);

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
        if (sessionData.createdBy !== auth.currentUser?.uid) {
          setError('You can only edit sessions you created');
          setLoading(false);
          return;
        }

        setSession(sessionData);
        const sessionDate = new Date(sessionData.date);
        const dateStr = sessionDate.toISOString().split('T')[0];
        const timeStr = sessionDate.toTimeString().slice(0, 5);

        setFormData({
          title: sessionData.title || '',
          description: sessionData.description || '',
          category: sessionData.category || 'Tech',
          date: dateStr,
          time: timeStr,
          difficulty: sessionData.difficulty || 'Beginner',
          tags: sessionData.tags ? sessionData.tags.join(', ') : '',
          maxParticipants: sessionData.maxParticipants || 10
        });

        setLoading(false);
      } catch (err) {
        console.error('Error fetching session:', err);
        setError('Failed to load session');
        setLoading(false);
      }
    };

    fetchSession();
  }, [sessionId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSuggestTags = async () => {
    setSuggestingTags(true);
    const tags = await suggestTagsWithGemini({
      title: formData.title,
      description: formData.description
    });
    setFormData(prev => ({
      ...prev,
      tags: tags.join(', ')
    }));
    setSuggestingTags(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.description.trim() || !formData.date || !formData.time) {
      setError('Please fill in all required fields');
      return;
    }

    setSaving(true);
    setError('');

    try {
      const sessionRef = doc(database, 'Sessions', sessionId);
      
      const updateData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category,
        date: new Date(`${formData.date}T${formData.time}`).toISOString(),
        difficulty: formData.difficulty,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        maxParticipants: parseInt(formData.maxParticipants),
        updatedAt: new Date().toISOString()
      };

      await updateDoc(sessionRef, updateData);
      navigate(`/session/${sessionId}`);
    } catch (err) {
      console.error('Error updating session:', err);
      setError('Failed to update session. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="create-session-root">
        <div className="create-session-container">
          <div style={{ padding: '40px', textAlign: 'center' }}>
            Loading session...
          </div>
        </div>
      </div>
    );
  }

  if (error && !session) {
    return (
      <div className="create-session-root">
        <div className="create-session-container">
          <div className="create-session-header">
            <h1 className="create-session-title">Error</h1>
            <p className="create-session-subtitle">{error}</p>
          </div>
          <div style={{ padding: '32px', textAlign: 'center' }}>
            <button 
              onClick={() => navigate('/home')}
              className="submit-btn"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="create-session-root">
      <div className="create-session-container">
        <div className="create-session-header">
          <h1 className="create-session-title">Edit Session</h1>
          <p className="create-session-subtitle">Update your session details</p>
        </div>

        <form onSubmit={handleSubmit} className="create-session-form">
          <div className="form-group">
            <label htmlFor="title" className="form-label">Session Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="form-input"
              placeholder="Enter session title"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description" className="form-label">Description *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="form-textarea"
              placeholder="Describe what you'll be teaching..."
              rows="4"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="category" className="form-label">Category</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="form-select"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="difficulty" className="form-label">Difficulty</label>
              <select
                id="difficulty"
                name="difficulty"
                value={formData.difficulty}
                onChange={handleChange}
                className="form-select"
              >
                {difficulties.map(diff => (
                  <option key={diff} value={diff}>{diff}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="tags" className="form-label">Tags (optional)</label>
              <input
                type="text"
                id="tags"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                className="form-input"
                placeholder="e.g., javascript, web development, react"
              />
              <button
                type="button"
                className="ai-suggest-btn"
                onClick={handleSuggestTags}
                disabled={suggestingTags || !formData.title || !formData.description}
              >
                {suggestingTags ? 'Suggesting...' : 'Suggest Tags with AI'}
              </button>
            </div>

            <div className="form-group">
              <label htmlFor="maxParticipants" className="form-label">Max Participants</label>
              <input
                type="number"
                id="maxParticipants"
                name="maxParticipants"
                value={formData.maxParticipants}
                onChange={handleChange}
                className="form-input"
                min="1"
                max="50"
              />
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate(`/session/${sessionId}`)}
              className="cancel-btn"
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="submit-btn"
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Update Session'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditSession; 