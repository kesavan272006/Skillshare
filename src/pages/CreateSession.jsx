import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, database } from '../config/firebase';
import { collection, addDoc, doc, getDoc } from 'firebase/firestore';
import './createSession.css';
import { suggestTagsWithGemini } from '../utils/geminiSuggestTags';

const categories = ['Tech', 'Music', 'Business', 'Art', 'Cooking', 'Fitness', 'Language', 'Other'];
const difficulties = ['Beginner', 'Intermediate', 'Expert'];

const CreateSession = () => {
  const navigate = useNavigate();
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [suggestingTags, setSuggestingTags] = useState(false);
  const [username, setUsername]=useState('');
   useEffect(() => {
      const fetchUsername = async () => {
        if (auth.currentUser) {
          const userRef = doc(collection(database, 'Users'), auth.currentUser.uid);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            setUsername(userSnap.data().username || 'User');
          } else {
            setUsername(auth.currentUser.displayName || 'User');
          }
        }
      };
      fetchUsername();
    }, []);
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

    setLoading(true);
    setError('');

    try {
      const sessionData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category,
        date: new Date(`${formData.date}T${formData.time}`).toISOString(),
        difficulty: formData.difficulty,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        maxParticipants: parseInt(formData.maxParticipants),
        createdBy: auth.currentUser.uid,
        hostName: username || 'Unknown',
        createdAt: new Date().toISOString(),
        participants: []
      };

      await addDoc(collection(database, 'Sessions'), sessionData);
      navigate('/home');
    } catch (err) {
      console.error('Error creating session:', err);
      setError('Failed to create session. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-session-root">
      <div className="create-session-container">
        <div className="create-session-header">
          <h1 className="create-session-title">Create New Session</h1>
          <p className="create-session-subtitle">Share your skills with the community</p>
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
              <label htmlFor="date" className="form-label">Date *</label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="time" className="form-label">Time *</label>
              <input
                type="time"
                id="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>
          </div>

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

          {error && <div className="error-message">{error}</div>}

          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate('/home')}
              className="cancel-btn"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="submit-btn"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Session'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateSession; 