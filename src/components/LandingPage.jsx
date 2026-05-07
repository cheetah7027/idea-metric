import React from 'react';

export function LandingPage({ onStart }) {
  return (
    <div className="container" style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
      minHeight: '100vh',
      textAlign: 'center',
      animation: 'fade-enter 0.6s ease-out forwards'
    }}>
      <div style={{
        background: 'var(--card-bg)',
        padding: '24px',
        borderRadius: 'var(--radius-full)',
        marginBottom: '24px',
        boxShadow: 'var(--shadow-sm)',
        display: 'inline-flex',
        color: 'var(--primary-accent)'
      }}>
        <span className="material-symbols-outlined" style={{ fontSize: '32px' }}>lightbulb</span>
      </div>
      
      <h1 style={{ 
        fontSize: 'clamp(2.5rem, 5vw, 4rem)', 
        marginBottom: '16px',
        letterSpacing: '-0.02em',
        maxWidth: '800px'
      }}>
        Evaluate Your Business Idea in Minutes
      </h1>
      
      <p style={{ 
        fontSize: '1.25rem', 
        color: 'var(--text-secondary)',
        maxWidth: '600px',
        margin: '0 auto 48px auto'
      }}>
        Use the 10-factor market evaluation framework to score your idea, identify weak points, and discover your true potential.
      </p>
      
      <button className="btn btn-primary" onClick={onStart}>
        Start Evaluation <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>arrow_forward</span>
      </button>
    </div>
  );
}
