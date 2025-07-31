import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, database } from '../config/firebase';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import './home.css';

const categories = ['All', 'Tech', 'Music', 'Business', 'Art', 'Cooking'];
const difficulties = ['All', 'Beginner', 'Intermediate', 'Expert'];

const Home = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [sessions, setSessions] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [difficulty, setDifficulty] = useState('All');
  const [loading, setLoading] = useState(true);
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
  useEffect(() => {
    const fetchSessions = async () => {
      setLoading(true);
      const sessionsRef = collection(database, 'Sessions');
      const snapshot = await getDocs(sessionsRef);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSessions(data);
      setLoading(false);
    };
    fetchSessions();
  }, []);
  const filteredSessions = sessions.filter(session => {
    const matchesSearch =
      session.title.toLowerCase().includes(search.toLowerCase()) ||
      (session.hostName && session.hostName.toLowerCase().includes(search.toLowerCase()));
    const matchesCategory = category === 'All' || session.category === category;
    const matchesDifficulty = difficulty === 'All' || session.difficulty === difficulty;
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  return (
    <div className="home-root">
      <header className="home-header">
        <div className="header-content">
          <div className="logo-section">
            <div className="logo-icon">S</div>
            <h1 className="logo-text">SkillShare</h1>
          </div>
          <div className="welcome-section">
            <h2 className="welcome-text">Welcome, {username}!</h2>
            <p className="welcome-subtitle">Ready to learn or share something new?</p>
          </div>
          <button className="logout-btn" onClick={() => {auth.signOut(); navigate('/')}}>Logout</button>
        </div>
      </header>
      <main className="home-main">
        <section className="search-section">
          <div className="search-container">
            <div className="search-input-group">
              <input
                type="text"
                placeholder="Search sessions..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="search-input"
              />
            </div>
            <div className="filters-group">
              <select value={category} onChange={e => setCategory(e.target.value)} className="filter-select">
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <select value={difficulty} onChange={e => setDifficulty(e.target.value)} className="filter-select">
                {difficulties.map(diff => (
                  <option key={diff} value={diff}>{diff}</option>
                ))}
              </select>
            </div>
          </div>
        </section>
        <section className="sessions-section">
          <div className="sessions-header">
            <h3 className="sessions-title">Available Sessions</h3>
            <button className="create-session-btn" onClick={() => navigate('/create')}>+ Create New Session</button>
          </div>
          <div className="sessions-grid">
            {loading ? (
              <div style={{textAlign: 'center', width: '100%'}}>Loading...</div>
            ) : filteredSessions.length === 0 ? (
              <div style={{textAlign: 'center', width: '100%'}}>No sessions found.</div>
            ) : filteredSessions.map(session => (
              <div key={session.id} className="session-card" onClick={() => navigate(`/session/${session.id}`)} style={{cursor: 'pointer'}}>
                <div className="session-header">
                  <h4 className="session-title">{session.title}</h4>
                  <span className={`difficulty-badge ${session.difficulty ? session.difficulty.toLowerCase() : ''}`}>{session.difficulty}</span>
                </div>
                <div className="session-details">
                  <div className="detail-item">
                    <span className="detail-label">Host:</span>
                    <span className="detail-value">{session.hostName || 'Unknown'}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Date:</span>
                    <span className="detail-value">{session.date ? new Date(session.date).toLocaleString() : '-'}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Category:</span>
                    <span className="detail-value">{session.category}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;
