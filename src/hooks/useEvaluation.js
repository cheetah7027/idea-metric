import { useState, useCallback } from 'react';
import { factors } from '../data/factors';

const initialScores = factors.reduce((acc, factor) => {
  acc[factor.id] = 5; // Default score of 5 for everything
  return acc;
}, {});

export function useEvaluation() {
  const [ideas, setIdeas] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);

  // Generate unique ID
  const generateId = () => Math.random().toString(36).substr(2, 9);

  // Add a new idea
  const addIdea = useCallback((name = '', description = '') => {
    const newIdea = {
      id: generateId(),
      name: name || `Idea ${ideas.length + 1}`,
      description,
      scores: { ...initialScores }
    };
    setIdeas(prev => [...prev, newIdea]);
    return newIdea.id;
  }, [ideas]);

  // Remove an idea
  const removeIdea = useCallback((id) => {
    setIdeas(prev => prev.filter(idea => idea.id !== id));
  }, []);

  // Update idea details
  const updateIdeaName = useCallback((id, name, description) => {
    setIdeas(prev => prev.map(idea => {
      if (idea.id === id) {
        return { 
          ...idea, 
          name: name !== undefined ? name : idea.name,
          description: description !== undefined ? description : idea.description 
        };
      }
      return idea;
    }));
  }, []);

  // Update score
  const updateIdeaScore = useCallback((ideaId, factorId, score) => {
    setIdeas(prev => prev.map(idea => {
      if (idea.id === ideaId) {
        return {
          ...idea,
          scores: { ...idea.scores, [factorId]: score }
        };
      }
      return idea;
    }));
  }, []);

  // Navigation
  const nextStep = () => {
    if (currentStep < factors.length - 1) setCurrentStep(c => c + 1);
  };
  
  const prevStep = () => {
    if (currentStep > 0) setCurrentStep(c => c - 1);
  };

  // Helper Calculations
  const calculateTotal = (scores) => {
    return Object.values(scores).reduce((sum, val) => sum + val, 0);
  };

  const getInterpretation = (score) => {
    if (score < 50) return { label: 'Weak Idea', color: 'var(--low-score)', bgClass: 'bg-low' };
    if (score <= 75) return { label: 'Needs Improvement', color: 'var(--medium-score)', bgClass: 'bg-medium' };
    return { label: 'Strong Opportunity', color: 'var(--positive-score)', bgClass: 'bg-positive' };
  };

  const getInsights = (scores) => {
    let weakest = { id: '', val: 11 };
    let strongest = { id: '', val: -1 };

    factors.forEach(factor => {
      const val = scores[factor.id];
      if (val < weakest.val) weakest = { id: factor.title, val };
      if (val > strongest.val) strongest = { id: factor.title, val };
    });

    return {
      weakest: weakest.id,
      strongest: strongest.id,
      suggestion: weakest.val < 5 
        ? `Focus on improving your ${weakest.id} to increase overall viability.`
        : 'Solid foundation across the board. Validate with real users next.',
    };
  };

  return {
    ideas,
    addIdea,
    removeIdea,
    updateIdeaName,
    updateIdeaScore,
    calculateTotal,
    getInterpretation,
    getInsights,
    factors,
    currentStep,
    setCurrentStep,
    nextStep,
    prevStep,
    currentFactor: factors[currentStep],
  };
}
