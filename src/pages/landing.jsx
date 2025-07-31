import React from 'react';
import './landing.css';
import { useNavigate } from 'react-router-dom';

const features = [
  {
    iconClass: 'icon-purple',
    icon: '🎓',
    title: 'Create Sessions',
    desc: 'Share your expertise with quick, focused sessions.'
  },
  {
    iconClass: 'icon-blue',
    icon: '🔍',
    title: 'Discover Skills',
    desc: 'Explore hundreds of micro-skills from photography to programming.'
  },
  {
    iconClass: 'icon-green',
    icon: '⏰',
    title: 'Learn Anytime',
    desc: 'Access sessions on your schedule.'
  },
  {
    iconClass: 'icon-orange',
    icon: '💸',
    title: 'Completely Free',
    desc: 'Join our community at no cost and start learning or teaching today.'
  }
];

const LandingPage = () => {
    const navigate = useNavigate();
  return (
    <div className="landing-root">
      <nav className="navbar">
        <div className="navbar-container">
          <div className="logo">
            <span className="logo-icon">S</span>
            <span className="logo-text">SkillShare</span>
          </div>
          <div className="nav-links">
            <a href='#features'>Explore</a>
            <a href="#features">About</a>
            <button onClick={()=>navigate('/signin')} className="nav-btn">Get Started</button>
          </div>
        </div>
      </nav>
      <section className="hero">
        <div className="hero-content">
          <h1>
            Share Your <span className="highlight highlight-purple">Skills</span><br />
            Learn from <span className="highlight highlight-blue">Others</span>
          </h1>
          <p className="hero-subtitle">
            Join thousands of learners and teachers in our micro skill-sharing community. Create sessions, discover new talents, and grow together.
          </p>
          <div className="hero-buttons">
            <button onClick={()=>navigate('/signin')} className="primary-btn">Get Started Free</button>
            <button className="secondary-btn">Watch Demo</button>
          </div>
        </div>
      </section>
      <section id='features' className="features">
        <h2>Why Choose SkillShare?</h2>
        <p className="features-subtitle">
          Our platform makes it easy to share knowledge and learn new skills in bite-sized sessions.
        </p>
        <div className="feature-grid">
          {features.map((f, idx) => (
            <div className="feature-box" key={idx}>
              <div className={`feature-icon ${f.iconClass}`}>{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default LandingPage;