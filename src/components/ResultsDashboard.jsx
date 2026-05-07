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
  getInsights
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
    maintainAspectRatio: false
  };

  return (
    <div className="container" style={{ padding: '40px 24px', animation: 'fade-enter 0.6s ease-out forwards', maxWidth: '1400px' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '2.5rem' }}>Evaluation Dashboard</h1>
      </div>

      {ideas.length > 0 && (
        <div className="card" style={{ marginBottom: '40px', padding: '24px' }}>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '24px', textAlign: 'center' }}>Idea Radar Comparison</h3>
          <div style={{ height: '350px', width: '100%', position: 'relative' }}>
            <Radar data={data} options={options} />
          </div>
        </div>
      )}

      {/* Idea Insights */}
      {ideas.length > 0 && (
        <div style={{ marginBottom: '40px' }}>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '24px' }}>Key Insights</h3>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: '24px' 
          }}>
            {ideas.map((idea, idx) => {
              const insights = getInsights(idea.scores);
              const total = calculateTotal(idea.scores);
              const interpretation = getInterpretation(total);
              const { border } = getIdeaColors(idx);

              return (
                <div key={idea.id} className="card" style={{ borderTop: `4px solid ${border}`, padding: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                    <h4 style={{ fontSize: '1.2rem', fontWeight: 700 }}>{idea.name}</h4>
                    <div style={{ background: interpretation.bgClass, color: interpretation.color, padding: '4px 8px', borderRadius: '4px', fontSize: '0.85rem', fontWeight: 700 }}>
                      Score: {total}
                    </div>
                  </div>
                  
                  <div style={{ marginBottom: '8px', fontSize: '0.95rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Strongest:</span>{' '}
                    <strong style={{ color: 'var(--positive-score)' }}>{insights.strongest}</strong>
                  </div>
                  <div style={{ marginBottom: '16px', fontSize: '0.95rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Weakest:</span>{' '}
                    <strong style={{ color: 'var(--low-score)' }}>{insights.weakest}</strong>
                  </div>
                  <div style={{ padding: '12px', background: 'var(--bg-color)', borderRadius: 'var(--radius-md)', fontSize: '0.9rem', lineHeight: 1.4 }}>
                    💡 {insights.suggestion}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

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
      />

    </div>
  );
}
