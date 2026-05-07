import React, { useState } from 'react';

export function IdeaSetup({ onComplete }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      onComplete(name, description);
    }
  };

  return (
    <div className="container" style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
      minHeight: '100vh',
      animation: 'fade-enter 0.4s ease-out forwards'
    }}>
      <div className="card" style={{ maxWidth: '500px', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            background: 'var(--bg-color)',
            padding: '16px',
            borderRadius: 'var(--radius-full)',
            display: 'inline-flex',
            color: 'var(--primary-accent)',
            marginBottom: '16px'
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>description</span>
          </div>
          <h2 style={{ fontSize: '2rem', marginBottom: '8px' }}>Name Your Idea</h2>
          <p style={{ color: 'var(--text-secondary)' }}>
            Let's start by giving your first idea a name before we evaluate it.
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, fontSize: '0.95rem' }}>
              Idea Name <span style={{ color: 'var(--low-score)' }}>*</span>
            </label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. AI Content Generator"
              autoFocus
              className="text-input"
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-light)',
                fontSize: '1rem',
                outline: 'none',
                transition: 'border-color 0.2s ease',
              }}
              required
            />
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, fontSize: '0.95rem' }}>
              Short Description <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(Optional)</span>
            </label>
            <textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What does it do? Who is it for?"
              rows="3"
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-light)',
                fontSize: '1rem',
                fontFamily: 'inherit',
                outline: 'none',
                resize: 'none',
                transition: 'border-color 0.2s ease',
              }}
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            disabled={!name.trim()}
            style={{ marginTop: '12px', width: '100%' }}
          >
            Create Idea <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_forward</span>
          </button>
        </form>
      </div>
    </div>
  );
}
