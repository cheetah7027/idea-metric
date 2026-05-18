import { GoogleGenAI } from '@google/genai';

export async function generateAIEvaluation(ideaDetails, factors) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey) {
    console.warn("No VITE_GEMINI_API_KEY found. Using mock AI evaluation for demo purposes.");
    return generateMockEvaluation(ideaDetails, factors);
  }

  try {
    const ai = new GoogleGenAI({ apiKey });

    const prompt = `You are an expert startup advisor and market analyst evaluating a new business idea.
    
Idea Details:
- Description: ${ideaDetails.description || 'Not provided'}

Based strictly on the description, deduce and infer the target audience, business model, likely competitors, and target geography. Then, evaluate this idea against the following ${factors.length} factors.
Factors:
${factors.map(f => `- ${f.title}: ${f.description}`).join('\n')}

For each factor, provide a score from 1 to 10 (10 being the absolute best, most favorable for the startup, and 1 being the absolute worst) and a short, insightful 1-2 sentence reasoning specific to this idea.

Provide the response as a JSON object matching this schema:
{
  "deducedContext": {
    "suggestedName": string (catchy, brandable startup name based on description),
    "targetAudience": string (short description),
    "businessModel": string (short description),
    "competitors": string (comma separated names),
    "geography": string (short description)
  },
  "scores": { "factor_id": number (1-10) },
  "reasonings": { "factor_id": string },
  "insights": {
    "biggestStrength": string (short label),
    "biggestWeakness": string (short label),
    "suggestedImprovement": string (1-2 sentences),
    "marketRisk": string (1-2 sentences),
    "competitivePressure": string (1-2 sentences)
  }
}

Important: The keys in "scores" and "reasonings" MUST match the exact IDs of the factors provided: ${factors.map(f => f.id).join(', ')}.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0,
      }
    });

    const data = JSON.parse(response.text);
    return data;
  } catch (error) {
    console.error("AI Evaluation failed:", error);
    console.warn("Falling back to mock evaluation due to error.");
    return generateMockEvaluation(ideaDetails, factors);
  }
}

// Fallback mock function for when API key is missing or request fails
function generateMockEvaluation(ideaDetails, factors) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const scores = {};
      const reasonings = {};
      
      factors.forEach(factor => {
        // Generate random score between 4 and 9 for mock
        const randomScore = Math.floor(Math.random() * 6) + 4; 
        scores[factor.id] = randomScore;
        reasonings[factor.id] = `This is a mock AI reasoning for ${factor.title} based on the input details for ${ideaDetails.name}. It highlights a potential opportunity or risk in this area.`;
      });

      resolve({
        deducedContext: {
          suggestedName: ["SynergyAI", "Nexus Market", "Aura Insights", "PivotFlow", "Catalyst", "Nova Ventures"][Math.floor(Math.random() * 6)],
          targetAudience: "Small to medium businesses",
          businessModel: "B2B SaaS Subscription",
          competitors: "Not clearly defined yet",
          geography: "Global online market"
        },
        scores,
        reasonings,
        insights: {
          biggestStrength: factors[Math.floor(Math.random() * factors.length)].title,
          biggestWeakness: factors[Math.floor(Math.random() * factors.length)].title,
          suggestedImprovement: "Consider validating your primary distribution channel before scaling.",
          marketRisk: "Market conditions may change rapidly, requiring agile adaptation.",
          competitivePressure: "Incumbents have strong brand moats, but your niche focus is an advantage."
        }
      });
    }, 2500); // Simulate API latency
  });
}
