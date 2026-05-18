import React from 'react';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';
import { ComparisonGrid } from './ComparisonGrid';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

export function ResultsDashboard({
  ideas,
  factors,
  onAddIdea,
  onRemoveIdea,
  onUpdateName,
  onUpdateScore,
  calculateTotal,
  getInterpretation,
  getInsights,
  generateEvaluationForIdea
}) {

  const getIdeaColors = (index) => {
    const colors = [
      { bg: 'rgba(123, 140, 115, 0.4)', border: 'rgba(123, 140, 115, 1)' }, // Muted green
      { bg: 'rgba(212, 184, 106, 0.4)', border: 'rgba(212, 184, 106, 1)' }, // Soft amber
      { bg: 'rgba(115, 131, 140, 0.4)', border: 'rgba(115, 131, 140, 1)' }, // Muted blue
      { bg: 'rgba(140, 115, 127, 0.4)', border: 'rgba(140, 115, 127, 1)' }, // Muted purple
    ];
    return colors[index % colors.length];
  };

  if (ideas.length === 0) {
    return (
      <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', animation: 'fade-enter 0.6s ease-out forwards' }}>
        <div className="card" style={{ maxWidth: '500px', textAlign: 'center', padding: '40px 24px' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '48px', color: 'var(--primary-accent)', marginBottom: '16px' }}>insights</span>
          <h2 style={{ fontSize: '2rem', marginBottom: '16px' }}>No Ideas Found</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>
            Evaluate your startup idea using AI-powered market analysis. Add your first idea to get started.
          </p>
          <button className="btn btn-primary" onClick={() => onAddIdea()} style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
            <span className="material-symbols-outlined">add</span>
            Add New Idea
          </button>
        </div>
      </div>
    );
  }

  const data = {
    labels: factors.map(f => f.title),
    datasets: ideas.map((idea, idx) => {
      const colors = getIdeaColors(idx);
      return {
        label: idea.name,
        data: factors.map(f => idea.scores[f.id]),
        backgroundColor: colors.bg,
        borderColor: colors.border,
        borderWidth: 2,
        pointBackgroundColor: colors.border,
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: colors.border,
      };
    })
  };

  const options = {
    scales: {
      r: {
        angleLines: { color: 'rgba(123, 140, 115, 0.2)' },
        grid: { color: 'rgba(123, 140, 115, 0.2)' },
        pointLabels: {
          font: { family: "'Outfit', sans-serif", size: 11 },
          color: 'var(--text-secondary)'
        },
        ticks: { display: false, min: 0, max: 10, stepSize: 2 }
      }
    },
    plugins: {
      legend: {
        position: 'bottom',
        labels: { font: { family: "'Outfit', sans-serif" }, color: 'var(--text-primary)' }
      }
    },
    maintainAspectRatio: false,
    animation: {
      duration: 800,
      easing: 'easeOutQuart'
    }
  };

  return (
    <div className="container" style={{ padding: '40px 24px', animation: 'fade-enter 0.6s ease-out forwards', maxWidth: '1400px' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '2.5rem' }}>AI Evaluation Dashboard</h1>
      </div>

      <div className="card" style={{ marginBottom: '40px', padding: '24px' }}>
        <h3 style={{ fontSize: '1.5rem', marginBottom: '24px', textAlign: 'center' }}>Idea Radar Comparison</h3>
        <div style={{ height: '400px', width: '100%', position: 'relative' }}>
          <Radar data={data} options={options} />
        </div>
      </div>

      {/* Idea Insights */}
      <div style={{ marginBottom: '40px' }}>
        <h3 style={{ fontSize: '1.5rem', marginBottom: '24px' }}>AI Market Insights</h3>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
          gap: '24px' 
        }}>
          {ideas.map((idea, idx) => {
            const total = calculateTotal(idea.scores);
            const interpretation = getInterpretation(total);
            const { border } = getIdeaColors(idx);

            if (idea.isEvaluating) {
              return (
                <div key={idea.id} className="card loading-shimmer" style={{ borderTop: `4px solid ${border}`, padding: '24px', minHeight: '300px' }}>
                  <div style={{ height: '24px', width: '60%', background: 'var(--bg-color)', borderRadius: '4px', marginBottom: '16px' }}></div>
                  <div style={{ height: '16px', width: '40%', background: 'var(--bg-color)', borderRadius: '4px', marginBottom: '24px' }}></div>
                  <div style={{ height: '60px', width: '100%', background: 'var(--bg-color)', borderRadius: '4px', marginBottom: '16px' }}></div>
                  <div style={{ height: '60px', width: '100%', background: 'var(--bg-color)', borderRadius: '4px' }}></div>
                </div>
              );
            }

            const ai = idea.aiInsights;
            if (!ai) return null;

            return (
              <div key={idea.id} className="card" style={{ borderTop: `4px solid ${border}`, padding: '24px', position: 'relative', overflow: 'hidden' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <h4 style={{ fontSize: '1.2rem', fontWeight: 700 }}>{idea.name}</h4>
                  <div style={{ background: interpretation.bgClass, color: interpretation.color, padding: '4px 10px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 700 }}>
                    Score: {total}
                  </div>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                  <div style={{ background: 'rgba(123, 140, 115, 0.1)', padding: '12px', borderRadius: 'var(--radius-md)' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Biggest Strength</div>
                    <div style={{ fontWeight: 600, color: 'var(--positive-score)' }}>{ai.biggestStrength}</div>
                  </div>
                  <div style={{ background: 'rgba(140, 115, 127, 0.1)', padding: '12px', borderRadius: 'var(--radius-md)' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Biggest Weakness</div>
                    <div style={{ fontWeight: 600, color: 'var(--low-score)' }}>{ai.biggestWeakness}</div>
                  </div>
                </div>

                {idea.targetAudience && (
                  <div style={{ marginBottom: '20px', padding: '16px', background: 'var(--bg-color)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary-accent)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>radar</span> AI Deduced Context
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Audience</div>
                        <div style={{ fontSize: '0.9rem', color: 'var(--text-primary)', lineHeight: 1.3 }}>{idea.targetAudience}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Business Model</div>
                        <div style={{ fontSize: '0.9rem', color: 'var(--text-primary)', lineHeight: 1.3 }}>{idea.businessModel}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Competitors</div>
                        <div style={{ fontSize: '0.9rem', color: 'var(--text-primary)', lineHeight: 1.3 }}>{idea.competitors}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Geography</div>
                        <div style={{ fontSize: '0.9rem', color: 'var(--text-primary)', lineHeight: 1.3 }}>{idea.geography}</div>
                      </div>
                    </div>
                  </div>
                )}

                <div style={{ marginBottom: '16px' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '16px', color: 'var(--primary-accent)' }}>trending_up</span> Suggestion
                  </div>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    {ai.suggestedImprovement}
                  </div>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '16px', color: 'var(--low-score)' }}>warning</span> Market Risk
                  </div>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    {ai.marketRisk}
                  </div>
                </div>
                
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '16px', color: 'var(--medium-score)' }}>group</span> Competitive Pressure
                  </div>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    {ai.competitivePressure}
                  </div>
                </div>

                {!idea.aiScores && (
                  <button 
                    onClick={() => generateEvaluationForIdea(idea.id)}
                    className="btn btn-primary" 
                    style={{ width: '100%', marginTop: '20px', padding: '10px' }}
                  >
                    Generate AI Evaluation
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Dynamic Comparison Grid */}
      <ComparisonGrid 
        ideas={ideas}
        factors={factors}
        onAddIdea={onAddIdea}
        onRemoveIdea={onRemoveIdea}
        onUpdateName={onUpdateName}
        onUpdateScore={onUpdateScore}
        calculateTotal={calculateTotal}
        getInterpretation={getInterpretation}
        generateEvaluationForIdea={generateEvaluationForIdea}
      />

    </div>
  );
}
