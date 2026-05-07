import React, { useState, useRef, useEffect } from 'react';

export function ComparisonGrid({ 
  ideas, 
  factors, 
  onAddIdea, 
  onRemoveIdea, 
  onUpdateName,
  onUpdateScore, 
  calculateTotal, 
  getInterpretation 
}) {
  const [activePopover, setActivePopover] = useState(null); // { ideaId, factorId, rect }
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
                  <div className="idea-header-content">
                    <input 
                      type="text"
                      className="idea-name-input"
                      value={idea.name}
                      onChange={(e) => onUpdateName(idea.id, e.target.value)}
                      placeholder="Idea Name"
                    />
                    <button 
                      className="delete-idea-btn" 
                      onClick={() => onRemoveIdea(idea.id)}
                      title="Remove Idea"
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>delete</span>
                    </button>
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
              <tr key={factor.id}>
                <td className="sticky-col-left factor-cell">
                  <div className="factor-title">{factor.title}</div>
                  <div className="factor-desc">{factor.description}</div>
                </td>
                {ideas.map((idea, idx) => (
                  <td 
                    key={idea.id} 
                    className="score-cell"
                    style={{ backgroundColor: getIdeaBgColor(idx) }}
                    onClick={(e) => handleCellClick(idea.id, factor.id, e)}
                  >
                    <div className="score-badge">
                      {idea.scores[factor.id]}
                    </div>
                  </td>
                ))}
                <td className="empty-cell"></td>
              </tr>
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
      {activePopover && (
        <div 
          ref={popoverRef}
          className="score-popover card"
          style={{
            position: 'fixed',
            top: `${activePopover.rect.bottom + 8}px`,
            left: `${activePopover.rect.left + (activePopover.rect.width / 2)}px`,
            transform: 'translateX(-50%)',
            zIndex: 1000,
            padding: '16px',
            width: '240px',
            animation: 'fade-enter 0.2s ease-out forwards'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Adjust Score</span>
            <button onClick={() => setActivePopover(null)} style={{ color: 'var(--text-muted)', display: 'flex' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>close</span>
            </button>
          </div>
          <input 
            type="range" 
            min="0" 
            max="10" 
            value={ideas.find(i => i.id === activePopover.ideaId)?.scores[activePopover.factorId] || 0}
            onChange={(e) => onUpdateScore(activePopover.ideaId, activePopover.factorId, parseInt(e.target.value, 10))}
            className="slider-input"
          />
          <div style={{ textAlign: 'center', fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary-accent)', marginTop: '8px' }}>
             {ideas.find(i => i.id === activePopover.ideaId)?.scores[activePopover.factorId]}
          </div>
        </div>
      )}
    </div>
  );
}
