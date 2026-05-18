import React, { useState } from 'react';
import './App.css';
import { useEvaluation } from './hooks/useEvaluation';
import { LandingPage } from './components/LandingPage';
import { IdeaSetup } from './components/IdeaSetup';
import { ResultsDashboard } from './components/ResultsDashboard';

function App() {
  const [view, setView] = useState('landing'); // 'landing', 'setup', 'dashboard'
  
  const evalState = useEvaluation();
  const { 
    ideas,
    addIdea,
    generateEvaluationForIdea,
  } = evalState;

  const handleStart = () => {
    setView('setup');
  };

  const handleSetupComplete = (formData) => {
    const newIdea = addIdea(formData);
    setView('dashboard');
    generateEvaluationForIdea(newIdea.id, newIdea);
  };

  return (
    <div className="app-container">
      <main className="main-content">
        {view === 'landing' && (
          <LandingPage onStart={handleStart} />
        )}

        {view === 'setup' && (
          <IdeaSetup onComplete={handleSetupComplete} />
        )}

        {view === 'dashboard' && (
          <ResultsDashboard 
            ideas={evalState.ideas}
            factors={evalState.factors}
            onAddIdea={() => addIdea({})}
            onRemoveIdea={evalState.removeIdea}
            onUpdateName={evalState.updateIdeaName}
            onUpdateScore={evalState.updateIdeaScore}
            calculateTotal={evalState.calculateTotal}
            getInterpretation={evalState.getInterpretation}
            getInsights={evalState.getInsights}
            generateEvaluationForIdea={evalState.generateEvaluationForIdea}
          />
        )}
      </main>
    </div>
  );
}

export default App;
