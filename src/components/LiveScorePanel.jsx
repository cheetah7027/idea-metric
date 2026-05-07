import React from 'react';

export function LiveScorePanel({ score, interpretation }) {
  return (
    <div style={{
      position: 'fixed',
      top: '24px',
      right: '24px',
      background: 'var(--card-bg)',
      padding: '16px 24px',
      borderRadius: 'var(--radius-md)',
      boxShadow: 'var(--shadow-md)',
      border: '1px solid var(--border-light)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end',
      zIndex: 100,
      animation: 'fade-enter 0.4s ease-out forwards'
    }}>
      <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
        Current Score
      </div>
      <div style={{ 
        fontSize: '2.5rem', 
        fontWeight: 700, 
        color: interpretation.color,
        lineHeight: 1.1,
        transition: 'color 0.3s ease'
      }}>
        {score}
      </div>
      <div style={{ 
        fontSize: '0.9rem', 
        color: interpretation.color,
        fontWeight: 500,
        marginTop: '4px',
        transition: 'color 0.3s ease'
      }}>
        {interpretation.label}
      </div>
    </div>
  );
}
