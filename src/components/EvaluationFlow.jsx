import React from 'react';

export function EvaluationFlow({ 
  currentStep, 
  totalSteps, 
  factor, 
  score, 
  onScoreChange, 
  onNext, 
  onPrev, 
  onComplete 
}) {
  return (
    <div className="container" style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      paddingTop: '80px', // Space for LiveScorePanel
      paddingBottom: '40px'
    }}>
      <div className="card" style={{ maxWidth: '700px', width: '100%', animation: 'fade-enter 0.4s ease-out' }} key={factor.id}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
            Factor {currentStep + 1} of {totalSteps}
          </div>
          <div style={{ display: 'flex', gap: '4px' }}>
            {Array.from({ length: totalSteps }).map((_, idx) => (
              <div key={idx} style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: idx === currentStep ? 'var(--primary-accent)' : idx < currentStep ? 'var(--text-muted)' : 'var(--border-light)',
                transition: 'var(--transition-normal)'
              }} />
            ))}
          </div>
        </div>

        <h2 style={{ fontSize: '2rem', marginBottom: '16px', color: 'var(--text-primary)' }}>
          {factor.title}
        </h2>
        
        <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: '40px' }}>
          {factor.description}
        </p>

        <div className="slider-container">
          <input 
            type="range" 
            min="0" 
            max="10" 
            value={score} 
            onChange={(e) => onScoreChange(factor.id, parseInt(e.target.value, 10))}
            className="slider-input"
          />
          <div className="slider-labels">
            <span>0</span>
            <span>10</span>
          </div>
          <div className="slider-value-display">
            {score}
          </div>
          <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '12px' }}>
            Hint: {factor.hint}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '48px' }}>
          <button 
            className="btn btn-secondary" 
            onClick={onPrev} 
            disabled={currentStep === 0}
            style={{ opacity: currentStep === 0 ? 0 : 1 }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_back</span> Back
          </button>
          
          {currentStep < totalSteps - 1 ? (
            <button className="btn btn-primary" onClick={onNext}>
              Next <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_forward</span>
            </button>
          ) : (
            <button className="btn btn-primary" onClick={onComplete} style={{ background: 'var(--positive-score)' }}>
              See Results <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>check</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
