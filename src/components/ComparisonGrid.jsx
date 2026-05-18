import React, { useState, useRef, useEffect } from 'react';

export function ComparisonGrid({ 
  ideas, 
  factors, 
  onAddIdea, 
  onRemoveIdea, 
  onUpdateName,
  onUpdateScore, 
  calculateTotal, 
  getInterpretation,
  generateEvaluationForIdea
}) {
  const [activePopover, setActivePopover] = useState(null); // { ideaId, factorId, rect }
  const [expandedFactors, setExpandedFactors] = useState([]);
  const popoverRef = useRef(null);

  // Close popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        setActivePopover(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCellClick = (ideaId, factorId, e) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    setActivePopover({ ideaId, factorId, rect });
  };

  const toggleFactor = (factorId) => {
    setExpandedFactors(prev => 
      prev.includes(factorId) ? prev.filter(id => id !== factorId) : [...prev, factorId]
    );
  };

  const getIdeaBgColor = (index) => {
    const colors = [
      'rgba(123, 140, 115, 0.08)', // Muted green
      'rgba(212, 184, 106, 0.08)', // Soft amber
      'rgba(115, 131, 140, 0.08)', // Muted blue
      'rgba(140, 115, 127, 0.08)', // Muted purple
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="grid-wrapper">
      <div className="grid-scroll-container">
        <table className="comparison-table">
          <thead>
            <tr>
              <th className="sticky-col-left factor-header">
                <div>Evaluation Factors</div>
              </th>
              {ideas.map((idea, idx) => (
                <th key={idea.id} className="idea-header" style={{ backgroundColor: getIdeaBgColor(idx) }}>
                  <div className="idea-header-content" style={{ flexDirection: 'column', gap: '4px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', width: '100%', position: 'relative' }}>
                      <input 
                        type="text"
                        className="idea-name-input"
                        value={idea.name}
                        onChange={(e) => onUpdateName(idea.id, e.target.value, idea.description)}
                        placeholder="Idea Name"
                      />
                      <button 
                        className="delete-idea-btn" 
                        onClick={() => onRemoveIdea(idea.id)}
                        title="Remove Idea"
                        style={{ position: 'absolute', right: '-12px' }}
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>delete</span>
                      </button>
                    </div>
                    <textarea
                      value={idea.description || ''}
                      onChange={(e) => onUpdateName(idea.id, idea.name, e.target.value)}
                      placeholder="Add a short description..."
                      rows={3}
                      style={{
                        width: '100%',
                        fontSize: '0.8rem',
                        color: 'var(--text-muted)',
                        background: 'transparent',
                        border: '1px solid transparent',
                        borderRadius: '4px',
                        textAlign: 'center',
                        resize: 'none',
                        outline: 'none',
                        padding: '4px',
                        fontFamily: 'inherit',
                        lineHeight: 1.4,
                        transition: 'background-color 0.2s, border-color 0.2s'
                      }}
                      onFocus={(e) => { e.target.style.background = 'rgba(255, 255, 255, 0.4)'; e.target.style.borderColor = 'var(--border-light)'; }}
                      onBlur={(e) => { e.target.style.background = 'transparent'; e.target.style.borderColor = 'transparent'; }}
                    />
                    {(!idea.aiScores || idea.isEvaluating) && idea.description?.trim().length > 0 && (
                      <button 
                        onClick={() => generateEvaluationForIdea(idea.id)}
                        className="btn btn-primary"
                        disabled={idea.isEvaluating}
                        style={{ 
                          padding: '6px 12px', 
                          fontSize: '0.8rem', 
                          marginTop: '4px', 
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px'
                        }}
                      >
                        {idea.isEvaluating ? (
                          <>
                            <span className="material-symbols-outlined" style={{ animation: 'spin 2s linear infinite', fontSize: '14px' }}>sync</span>
                            Generating...
                          </>
                        ) : (
                          <>
                            <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>auto_awesome</span>
                            Evaluate Idea
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </th>
              ))}
              <th className="add-idea-header">
                <button className="btn-add-idea-col" onClick={() => onAddIdea()}>
                  <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>add</span> Add Idea
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {factors.map((factor) => (
              <React.Fragment key={factor.id}>
                <tr>
                  <td className="sticky-col-left factor-cell">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <div className="factor-title">{factor.title}</div>
                        <div className="factor-desc">{factor.description}</div>
                      </div>
                      <button 
                        onClick={() => toggleFactor(factor.id)} 
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                      >
                        <span className="material-symbols-outlined">{expandedFactors.includes(factor.id) ? 'expand_less' : 'expand_more'}</span>
                      </button>
                    </div>
                  </td>
                  {ideas.map((idea, idx) => {
                    const isOverride = idea.aiScores && idea.scores[factor.id] !== idea.aiScores[factor.id];
                    return (
                      <td 
                        key={idea.id} 
                        className="score-cell"
                        style={{ backgroundColor: getIdeaBgColor(idx) }}
                        onClick={(e) => handleCellClick(idea.id, factor.id, e)}
                      >
                        <div className={`score-badge ${isOverride ? 'override' : ''}`} style={isOverride ? { borderStyle: 'dashed' } : {}}>
                          {idea.scores[factor.id]}
                          {isOverride && (
                            <div style={{ position: 'absolute', top: '-4px', right: '-4px', width: '10px', height: '10px', borderRadius: '50%', background: 'var(--primary-accent)', border: '2px solid #fff' }} />
                          )}
                        </div>
                      </td>
                    );
                  })}
                  <td className="empty-cell"></td>
                </tr>
                {expandedFactors.includes(factor.id) && (
                  <tr className="reasoning-row">
                    <td className="sticky-col-left reasoning-header" style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-light)', background: 'var(--bg-color)' }}>
                      <div style={{ fontSize: '0.85rem', color: 'var(--primary-accent)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>psychology</span> AI Reasoning
                      </div>
                    </td>
                    {ideas.map((idea, idx) => (
                      <td key={idea.id} style={{ backgroundColor: getIdeaBgColor(idx), padding: '16px', fontSize: '0.9rem', color: 'var(--text-secondary)', verticalAlign: 'top', borderBottom: '1px solid var(--border-light)' }}>
                        {idea.isEvaluating ? (
                           <span style={{color: 'var(--primary-accent)', fontStyle: 'italic', display: 'flex', alignItems: 'center', gap: '4px'}}>
                             <span className="material-symbols-outlined" style={{ animation: 'spin 2s linear infinite', fontSize: '16px' }}>sync</span> Generating...
                           </span>
                        ) : idea.reasonings && idea.reasonings[factor.id] ? (
                           <div style={{ lineHeight: 1.5 }}>{idea.reasonings[factor.id]}</div>
                        ) : (
                           <div>
                             <span style={{color: 'var(--text-muted)', fontStyle: 'italic', display: 'block', marginBottom: '8px'}}>No AI data yet.</span>
                             {!idea.aiScores && <button onClick={() => generateEvaluationForIdea(idea.id)} className="btn btn-primary" style={{ padding: '4px 8px', fontSize: '0.75rem' }}>Generate</button>}
                           </div>
                        )}
                      </td>
                    ))}
                    <td className="empty-cell" style={{ borderBottom: '1px solid var(--border-light)' }}></td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td className="sticky-col-left total-header">Total Score</td>
              {ideas.map((idea, idx) => {
                const total = calculateTotal(idea.scores);
                const interpretation = getInterpretation(total);
                return (
                  <td key={idea.id} className="total-cell" style={{ backgroundColor: getIdeaBgColor(idx) }}>
                    <div className={`total-score-display ${interpretation.bgClass}`}>
                      <span className="total-number" style={{ color: interpretation.color }}>{total}</span>
                    </div>
                  </td>
                );
              })}
              <td className="empty-cell"></td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Popover Slider */}
      {activePopover && (() => {
        const activeIdea = ideas.find(i => i.id === activePopover.ideaId);
        const activeAiScore = activeIdea?.aiScores?.[activePopover.factorId];
        const isOverride = activeAiScore !== undefined && activeAiScore !== activeIdea?.scores[activePopover.factorId];

        return (
          <div 
            ref={popoverRef}
            className="score-popover card"
            style={{
              position: 'fixed',
              top: `${activePopover.rect.bottom + 8}px`,
              left: `${activePopover.rect.left + (activePopover.rect.width / 2)}px`,
              transform: 'translateX(-50%)',
              zIndex: 1000,
              padding: '20px',
              width: '260px',
              animation: 'fade-enter 0.2s ease-out forwards'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>Adjust Score</span>
              <button onClick={() => setActivePopover(null)} style={{ color: 'var(--text-muted)', display: 'flex', background: 'none', border: 'none', cursor: 'pointer' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>close</span>
              </button>
            </div>
            
            {activeAiScore !== undefined && (
              <div style={{ fontSize: '0.85rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', padding: '8px', background: 'rgba(123, 140, 115, 0.1)', borderRadius: '4px' }}>
                <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '14px', color: 'var(--primary-accent)' }}>psychology</span> AI Suggested
                </span>
                <strong style={{ color: 'var(--primary-accent)' }}>{activeAiScore}</strong>
              </div>
            )}

            <input 
              type="range" 
              min="0" 
              max="10" 
              value={activeIdea?.scores[activePopover.factorId] || 0}
              onChange={(e) => onUpdateScore(activePopover.ideaId, activePopover.factorId, parseInt(e.target.value, 10))}
              className="slider-input"
            />
            
            <div style={{ textAlign: 'center', marginTop: '16px' }}>
              <div style={{ fontSize: '2rem', fontWeight: 700, color: isOverride ? 'var(--text-primary)' : 'var(--primary-accent)', lineHeight: 1 }}>
                 {activeIdea?.scores[activePopover.factorId]}
              </div>
              {isOverride && (
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px', fontStyle: 'italic' }}>
                  Manual Override
                </div>
              )}
            </div>
          </div>
        );
      })()}
    </div>
  );
}
