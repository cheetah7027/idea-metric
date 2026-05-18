import { useState, useCallback } from 'react';
import { factors } from '../data/factors';
import { generateAIEvaluation } from '../services/aiService';

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
  const addIdea = useCallback((details) => {
    const { name = '', description = '', targetAudience = '', businessModel = '', competitors = '', geography = '' } = details || {};
    const newIdea = {
      id: generateId(),
      name: name || `Idea ${ideas.length + 1}`,
      description,
      targetAudience,
      businessModel,
      competitors,
      geography,
      scores: { ...initialScores },
      aiScores: null,
      reasonings: null,
      aiInsights: null,
      isEvaluating: false
    };
    setIdeas(prev => [...prev, newIdea]);
    return newIdea;
  }, [ideas.length]);

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

  // Generate AI Evaluation for an idea
  const generateEvaluationForIdea = useCallback(async (ideaId, fallbackIdea) => {
    // Set isEvaluating to true
    setIdeas(prev => prev.map(idea => 
      idea.id === ideaId ? { ...idea, isEvaluating: true } : idea
    ));

    // Get idea details - use fallback if state hasn't updated yet
    const ideaToEvaluate = fallbackIdea || ideas.find(i => i.id === ideaId);
    if (!ideaToEvaluate) {
      console.error("Idea not found for evaluation", ideaId);
      return;
    }

    try {
      const evaluation = await generateAIEvaluation(ideaToEvaluate, factors);
      
      setIdeas(prev => prev.map(idea => {
        if (idea.id === ideaId) {
          return {
            ...idea,
            name: evaluation.deducedContext?.suggestedName || idea.name,
            targetAudience: evaluation.deducedContext?.targetAudience || idea.targetAudience,
            businessModel: evaluation.deducedContext?.businessModel || idea.businessModel,
            competitors: evaluation.deducedContext?.competitors || idea.competitors,
            geography: evaluation.deducedContext?.geography || idea.geography,
            scores: { ...evaluation.scores }, // Initialize manual scores with AI scores
            aiScores: evaluation.scores,
            reasonings: evaluation.reasonings,
            aiInsights: evaluation.insights,
            isEvaluating: false
          };
        }
        return idea;
      }));
    } catch (error) {
      console.error("Failed to generate evaluation", error);
      setIdeas(prev => prev.map(idea => 
        idea.id === ideaId ? { ...idea, isEvaluating: false } : idea
      ));
    }
  }, [ideas]);

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
    generateEvaluationForIdea,
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
