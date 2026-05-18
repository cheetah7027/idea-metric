import React, { useState } from 'react';

export function IdeaSetup({ onComplete }) {
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (description.trim()) {
      // Pass an empty string for name; the AI will generate it.
      onComplete({ name: '', description });
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--border-light)',
    fontSize: '1rem',
    outline: 'none',
    transition: 'border-color 0.2s ease',
    backgroundColor: '#fff',
    fontFamily: 'inherit'
  };

  const labelStyle = { 
    display: 'block', 
    marginBottom: '8px', 
    fontWeight: 500, 
    fontSize: '0.95rem' 
  };

  return (
    <div className="container" style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: '40px 24px',
      minHeight: '100vh',
      animation: 'fade-enter 0.4s ease-out forwards'
    }}>
      <div className="card" style={{ maxWidth: '600px', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            background: 'var(--bg-color)',
            padding: '16px',
            borderRadius: 'var(--radius-full)',
            display: 'inline-flex',
            color: 'var(--primary-accent)',
            marginBottom: '16px'
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: '28px' }}>smart_toy</span>
          </div>
          <h2 style={{ fontSize: '2rem', marginBottom: '8px' }}>AI Idea Evaluation</h2>
          <p style={{ color: 'var(--text-secondary)' }}>
            Tell us about your startup idea. Our AI will generate a catchy name, deduce the market context, and evaluate its potential across 10 key factors.
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div>
            <label style={labelStyle}>
              Detailed Description <span style={{ color: 'var(--low-score)' }}>*</span>
            </label>
            <textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Explain what the product does, the problem it solves, and how it works. The AI relies heavily on this description."
              rows="6"
              className="text-input"
              style={{ ...inputStyle, resize: 'none' }}
              required
              autoFocus
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            disabled={!description.trim()}
            style={{ 
              marginTop: '16px', 
              width: '100%', 
              padding: '16px', 
              fontSize: '1.1rem',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>auto_awesome</span>
            Generate AI Evaluation
          </button>
        </form>
      </div>
    </div>
  );
}
