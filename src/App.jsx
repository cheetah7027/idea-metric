import React, { useState } from 'react';
import './App.css';
import { useEvaluation } from './hooks/useEvaluation';
import { LandingPage } from './components/LandingPage';
import { IdeaSetup } from './components/IdeaSetup';
import { EvaluationFlow } from './components/EvaluationFlow';
import { LiveScorePanel } from './components/LiveScorePanel';
import { ResultsDashboard } from './components/ResultsDashboard';

function App() {
  const [view, setView] = useState('landing'); // 'landing', 'setup', 'flow', 'dashboard'
  
  const evalState = useEvaluation();
  const { 
    ideas,
    addIdea,
    updateIdeaScore,
    currentStep,
    factors,
    currentFactor,
    nextStep,
    prevStep,
    calculateTotal,
    getInterpretation
  } = evalState;

  const firstIdea = ideas.length > 0 ? ideas[0] : null;
  const firstIdeaTotal = firstIdea ? calculateTotal(firstIdea.scores) : 0;
  const firstIdeaInterpretation = firstIdea ? getInterpretation(firstIdeaTotal) : null;

  const handleStart = () => {
    setView('setup');
  };

  const handleSetupComplete = (name, description) => {
    addIdea(name, description);
    setView('flow');
  };

  const handleCompleteFlow = () => {
    setView('dashboard');
  };

  return (
    <div className="app-container">
      {view === 'flow' && firstIdea && (
        <LiveScorePanel 
          score={firstIdeaTotal} 
          interpretation={firstIdeaInterpretation} 
        />
      )}

      <main className="main-content">
        {view === 'landing' && (
          <LandingPage onStart={handleStart} />
        )}

        {view === 'setup' && (
          <IdeaSetup onComplete={handleSetupComplete} />
        )}

        {view === 'flow' && firstIdea && (
          <EvaluationFlow 
            currentStep={currentStep}
            totalSteps={factors.length}
            factor={currentFactor}
            score={firstIdea.scores[currentFactor.id]}
            onScoreChange={(factorId, score) => updateIdeaScore(firstIdea.id, factorId, score)}
            onNext={nextStep}
            onPrev={prevStep}
            onComplete={handleCompleteFlow}
          />
        )}

        {view === 'dashboard' && (
          <ResultsDashboard 
            ideas={evalState.ideas}
            factors={evalState.factors}
            onAddIdea={() => addIdea('', '')}
            onRemoveIdea={evalState.removeIdea}
            onUpdateName={evalState.updateIdeaName}
            onUpdateScore={evalState.updateIdeaScore}
            calculateTotal={evalState.calculateTotal}
            getInterpretation={evalState.getInterpretation}
            getInsights={evalState.getInsights}
          />
        )}
      </main>
    </div>
  );
}

export default App;
