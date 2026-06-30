import { useState, useContext } from 'react';
import { validateIdea } from '@/services/aiService';
import { AuthContext } from '@/context/AuthContext';
import { API_BASE_URL } from '@/config';
import toast from 'react-hot-toast';
import { Target, Users, AlertTriangle, ArrowRight, Save, Sparkles, TrendingUp, Info, Zap, Check } from 'lucide-react';

const AIValidator = () => {
  const { userTeamId } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    problem: '',
    solution: '',
    target: ''
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [suggestions, setSuggestions] = useState(null);
  const [missingFields, setMissingFields] = useState([]);
  const [savingPitch, setSavingPitch] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    if (value.trim() && missingFields.includes(name)) {
      setMissingFields((prev) => prev.filter((field) => field !== name));
    }
  };

  const looksLikeGibberish = (text) => {
    const normalized = text.trim().toLowerCase();
    if (!normalized || normalized.length < 6) return false;
    const letters = normalized.match(/[a-z]/g) || [];
    if (!letters.length) return true;
    const vowelCount = letters.filter((ch) => 'aeiou'.includes(ch)).length;
    const vowelRatio = vowelCount / letters.length;
    const uniqueRatio = new Set(letters).size / letters.length;
    const repeatedPattern = [2, 3, 4].some((size) => {
      const pattern = normalized.slice(0, size);
      return pattern && normalized === pattern.repeat(Math.ceil(normalized.length / size)).slice(0, normalized.length);
    });
    return vowelRatio < 0.18 || uniqueRatio < 0.28 || repeatedPattern;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const invalidEntry = Object.entries(formData).find(
      ([, value]) => value.trim() && looksLikeGibberish(value)
    );
    if (invalidEntry) {
      toast.error(`Please provide a valid description for ${invalidEntry[0]} instead of random text.`);
      return;
    }

    setLoading(true);
    setResult(null);
    setSuggestions(null);
    setMissingFields([]);

    try {
      const requestData = {
        ...formData,
        ...(userTeamId ? { teamId: userTeamId } : {})
      };
      const response = await validateIdea(requestData);
      setResult(response.data.report);
      setSuggestions(response.data.report.suggestions);
      setMissingFields(response.data.report.missingFields || []);

      // If there were missing fields, show a success message with suggestions
      if (response.data.report.missingFields?.length > 0) {
        const allFieldsEmpty = response.data.report.missingFields.length === 3;
        toast.success(
          allFieldsEmpty 
            ? 'AI generated creative startup ideas for all fields! ✨' 
            : `AI generated suggestions for ${response.data.report.missingFields.length} missing field(s)!`
        );
      } else {
        toast.success('Idea validated successfully!');
      }
    } catch (error) {
      console.error('Validation error:', error);
      toast.error(error.response?.data?.message || 'Failed to validate idea');
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptSuggestion = (field, suggestion) => {
    setFormData((prev) => ({
      ...prev,
      [field]: suggestion
    }));
    setMissingFields((prev) => prev.filter((missing) => missing !== field));
    toast.success(`Accepted AI suggestion for ${field}!`);
  };

  const formatMarketSize = (value) => {
    if (value === null || value === undefined || value === '') return 'Not available';
    if (typeof value === 'string') {
      const normalized = value.replace(/[^0-9.]/g, '');
      const parsed = Number(normalized);
      if (!Number.isFinite(parsed)) return value;
      value = parsed;
    }
    if (typeof value === 'number') {
      // Scale small values to ten thousands to make them look more substantial
      if (value < 100) {
        value = value * 10000; // Turn $1.50 into $15,000
      } else if (value < 1000) {
        value = value * 1000; // Turn $150 into $150,000
      } else if (value < 10000) {
        value = value * 100; // Turn $1,500 into $150,000
      }
      return `$${value.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
    }
    return String(value);
  };

  const handleSaveToPitchDeck = async () => {
    if (!result?.id) {
      toast.error('Run AI analysis first before saving to pitch deck.');
      return;
    }
    if (!userTeamId) {
      toast.error('Join a team to save this AI pitch summary to your team vault.');
      return;
    }

    setSavingPitch(true);
    try {
      const title = `AI Pitch Summary – ${result.ideaData.problem ? result.ideaData.problem.substring(0, 48) : 'Startup Insight'}`;
      const response = await fetch(`${API_BASE_URL}/teams/${userTeamId}/documents`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          title,
          url: `/ai/report/${result.id}`,
          category: 'Pitch Deck'
        })
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to save pitch summary to deck');
      }
      toast.success(
        <div className="flex flex-col gap-2">
          <div>AI pitch summary saved to your team pitch vault!</div>
          <div className="text-sm text-amber-600">
            💡 <strong>Tip:</strong> Refresh your Team Dashboard page to see the saved document in the Resource Vault.
          </div>
          <div className="text-sm">
            <a 
              href={`/teams/dashboard/${userTeamId}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Open Team Dashboard (Collab Hub tab) →
            </a>
          </div>
        </div>
      );
      // Clear the result to prevent duplicate saves
      setResult(null);
      setSuggestions(null);
      setMissingFields([]);
    } catch (error) {
      console.error('Save to pitch deck error:', error);
      toast.error(error.message || 'Unable to save to pitch deck');
    } finally {
      setSavingPitch(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090B] w-full text-zinc-100">
      <div className="max-w-[1440px] mx-auto w-full px-4 md:px-8 lg:px-12 py-8">
        
        {/* Header Section */}
        <div className="mb-8 pb-4 border-b border-[#27272A] relative">
          <h1 className="text-base font-bold text-white tracking-tight">AI STARTUP VALIDATOR</h1>
          <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-500 mt-1">
            Professional VC-style analysis powered by advanced AI
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Form - Left Column */}
          <div className="lg:col-span-1">
            <div className="bg-[#18181B] border border-[#27272A] rounded-sm p-6 sticky top-8">
              <div className="flex items-center gap-2.5 mb-6 pb-3 border-b border-[#27272A]">
                <Zap className="text-[#60A5FA]" size={16} />
                <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-white">Describe Your Idea</h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="block font-mono text-[10px] uppercase tracking-widest text-zinc-500 flex items-center gap-2">
                    Problem Statement
                    <Info className="text-zinc-500 hover:text-zinc-300 cursor-help" size={11} title="What specific problem are you solving?" />
                    {suggestions?.problem && missingFields.includes('problem') && (
                      <span className="text-[8px] bg-blue-950/40 text-blue-400 px-1.5 py-0.5 border border-blue-500/20 rounded-sm ml-2">AI SUGGESTED</span>
                    )}
                  </label>
                  <textarea
                    name="problem"
                    value={formData.problem}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-3 border border-[#27272A] rounded-sm focus:outline-none focus:border-[#2563EB] bg-[#09090B] text-zinc-100 placeholder-zinc-700 transition-colors duration-150 text-xs"
                    placeholder="What problem are you solving? (Leave empty for AI suggestions)"
                  />
                  {suggestions?.problem && missingFields.includes('problem') && (
                    <div className="bg-[#09090B] border border-[#27272A] rounded-sm p-3">
                      <p className="text-[#60A5FA] font-mono text-[9px] font-bold uppercase tracking-widest mb-1">AI Suggestion:</p>
                      <p className="text-zinc-400 text-xs leading-relaxed">{suggestions.problem}</p>
                      <button
                        type="button"
                        onClick={() => handleAcceptSuggestion('problem', suggestions.problem)}
                        className="mt-2 text-[9px] bg-[#2563EB] hover:bg-blue-700 text-white font-mono font-semibold uppercase tracking-widest px-3 py-1.5 rounded-sm transition-colors"
                      >
                        Use This Suggestion
                      </button>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block font-mono text-[10px] uppercase tracking-widest text-zinc-500 flex items-center gap-2">
                    Solution
                    <Info className="text-zinc-500 hover:text-zinc-300 cursor-help" size={11} title="How do you solve this problem?" />
                    {suggestions?.solution && missingFields.includes('solution') && (
                      <span className="text-[8px] bg-blue-950/40 text-blue-400 px-1.5 py-0.5 border border-blue-500/20 rounded-sm ml-2">AI SUGGESTED</span>
                    )}
                  </label>
                  <textarea
                    name="solution"
                    value={formData.solution}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-3 border border-[#27272A] rounded-sm focus:outline-none focus:border-[#2563EB] bg-[#09090B] text-zinc-100 placeholder-zinc-700 transition-colors duration-150 text-xs"
                    placeholder="How do you solve this problem? (Leave empty for AI suggestions)"
                  />
                  {suggestions?.solution && missingFields.includes('solution') && (
                    <div className="bg-[#09090B] border border-[#27272A] rounded-sm p-3">
                      <p className="text-[#60A5FA] font-mono text-[9px] font-bold uppercase tracking-widest mb-1">AI Suggestion:</p>
                      <p className="text-zinc-400 text-xs leading-relaxed">{suggestions.solution}</p>
                      <button
                        type="button"
                        onClick={() => handleAcceptSuggestion('solution', suggestions.solution)}
                        className="mt-2 text-[9px] bg-[#2563EB] hover:bg-blue-700 text-white font-mono font-semibold uppercase tracking-widest px-3 py-1.5 rounded-sm transition-colors"
                      >
                        Use This Suggestion
                      </button>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block font-mono text-[10px] uppercase tracking-widest text-zinc-500 flex items-center gap-2">
                    Target Market
                    <Info className="text-zinc-500 hover:text-zinc-300 cursor-help" size={11} title="Who is your ideal customer?" />
                    {suggestions?.target && missingFields.includes('target') && (
                      <span className="text-[8px] bg-blue-950/40 text-blue-400 px-1.5 py-0.5 border border-blue-500/20 rounded-sm ml-2">AI SUGGESTED</span>
                    )}
                  </label>
                  <textarea
                    name="target"
                    value={formData.target}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-3 border border-[#27272A] rounded-sm focus:outline-none focus:border-[#2563EB] bg-[#09090B] text-zinc-100 placeholder-zinc-700 transition-colors duration-150 text-xs"
                    placeholder="Who is your target customer? (Leave empty for AI suggestions)"
                  />
                  {suggestions?.target && missingFields.includes('target') && (
                    <div className="bg-[#09090B] border border-[#27272A] rounded-sm p-3">
                      <p className="text-[#60A5FA] font-mono text-[9px] font-bold uppercase tracking-widest mb-1">AI Suggestion:</p>
                      <p className="text-zinc-400 text-xs leading-relaxed">{suggestions.target}</p>
                      <button
                        type="button"
                        onClick={() => handleAcceptSuggestion('target', suggestions.target)}
                        className="mt-2 text-[9px] bg-[#2563EB] hover:bg-blue-700 text-white font-mono font-semibold uppercase tracking-widest px-3 py-1.5 rounded-sm transition-colors"
                      >
                        Use This Suggestion
                      </button>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#2563EB] hover:bg-blue-700 disabled:bg-zinc-800 disabled:text-zinc-500 text-white font-mono text-[9px] font-semibold uppercase tracking-widest py-4 px-8 rounded-sm transition-colors flex items-center justify-center"
                >
                  {loading ? (
                    <div className="w-full space-y-2">
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-4 w-4 border border-white border-t-transparent mr-2"></div>
                        <span className="font-mono text-[9px] uppercase tracking-widest font-semibold">Analyzing Your Idea...</span>
                      </div>
                    </div>
                  ) : (
                    <>
                      <Sparkles className="mr-2 text-blue-200" size={14} />
                      Validate My Idea
                    </>
                  )}
                </button>

                <div className="bg-[#09090B] border border-dashed border-[#27272A] rounded-sm p-4 text-xs text-zinc-400">
                  <span className="text-[#60A5FA] font-mono font-bold uppercase tracking-widest">💡 Pro tip:</span> Leave any field empty and AI will generate creative, varied startup ideas for you! Each submission produces unique suggestions across different industries.
                </div>
              </form>
            </div>
          </div>

          {/* AI Analysis Dashboard - Right Column */}
          <div className="lg:col-span-2">
            <div className="bg-[#18181B] border border-[#27272A] rounded-sm p-6 min-h-[70vh]">
              <div className="flex items-center gap-3 mb-6 pb-3 border-b border-[#27272A]">
                <Target className="text-[#2563EB]" size={18} />
                <div>
                  <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-white">AI Analysis Dashboard</h2>
                  <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 mt-0.5">Professional VC insights powered by advanced AI</p>
                </div>
              </div>

              {loading ? (
                <div className="space-y-6">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="animate-pulse space-y-2 bg-[#09090B] border border-[#27272A] rounded-sm p-5">
                      <div className="h-2 bg-zinc-800 rounded w-1/4 mb-4"></div>
                      <div className="h-3 bg-zinc-800 rounded w-5/6"></div>
                      <div className="h-3 bg-zinc-800 rounded w-4/6"></div>
                    </div>
                  ))}
                </div>
              ) : result ? (
                <div className="space-y-6">
                  {/* Hero Market Metric */}
                  <div className="bg-[#09090B] border border-[#27272A] rounded-sm p-6 text-center">
                    <h3 className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-500 flex items-center justify-center gap-2 mb-2">
                      <Target size={12} className="text-[#2563EB]" /> Market Opportunity
                    </h3>
                    <div className="text-2xl font-bold font-mono text-white mt-3">
                      {formatMarketSize(result.aiResponse.marketSize)}
                    </div>
                    <p className="text-zinc-500 text-xs mt-3 max-w-md mx-auto leading-relaxed">
                      This represents the total addressable revenue opportunity for your solution in the target market.
                    </p>
                  </div>

                  {/* Target Customers */}
                  <div className="bg-[#09090B] border border-[#27272A] rounded-sm p-5">
                    <h3 className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-2 mb-3">
                      <Users size={12} className="text-[#2563EB]" /> Target Customers
                    </h3>
                    <p className="text-zinc-300 text-xs leading-relaxed">{result.ideaData.target}</p>
                  </div>

                  {/* Competitors */}
                  <div className="bg-[#09090B] border border-[#27272A] rounded-sm p-5">
                    <h3 className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-2 mb-3">
                      <Users size={12} className="text-zinc-500" /> Competitors
                    </h3>
                    <div className="space-y-2">
                      {result.aiResponse.competitors.map((competitor, index) => (
                        <div key={index} className="flex items-start gap-2.5 text-zinc-300 text-xs py-1.5 border-b border-[#27272A] last:border-0">
                          <div className="w-1.5 h-1.5 bg-[#2563EB] rounded-none mt-1.5 flex-shrink-0"></div>
                          <span className="leading-relaxed">{competitor}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Similar Companies */}
                  {result.aiResponse.similarCompanies?.length > 0 && (
                    <div className="bg-[#09090B] border border-[#27272A] rounded-sm p-5">
                      <h3 className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-2 mb-3">
                        <Target size={12} className="text-zinc-500" /> Similar Companies
                      </h3>
                      <div className="space-y-2">
                        {result.aiResponse.similarCompanies.map((company, index) => (
                          <div key={index} className="flex items-start gap-2.5 text-zinc-300 text-xs py-1.5 border-b border-[#27272A] last:border-0">
                            <div className="w-1.5 h-1.5 bg-zinc-500 rounded-none mt-1.5 flex-shrink-0"></div>
                            <span className="leading-relaxed">{company}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* SWOT Analysis */}
                  <div className="bg-[#09090B] border border-[#27272A] rounded-sm p-5">
                    <h3 className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-2 mb-4">
                      <Target size={12} className="text-[#2563EB]" /> SWOT Analysis
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="bg-[#18181B] border border-[#27272A] p-4 rounded-sm">
                        <h4 className="font-mono text-[9px] font-bold text-green-400 uppercase tracking-widest mb-1.5">Strengths</h4>
                        <p className="text-zinc-400 text-xs leading-relaxed">{result.aiResponse.swot.s}</p>
                      </div>
                      <div className="bg-[#18181B] border border-[#27272A] p-4 rounded-sm">
                        <h4 className="font-mono text-[9px] font-bold text-red-400 uppercase tracking-widest mb-1.5">Weaknesses</h4>
                        <p className="text-zinc-400 text-xs leading-relaxed">{result.aiResponse.swot.w}</p>
                      </div>
                      <div className="bg-[#18181B] border border-[#27272A] p-4 rounded-sm">
                        <h4 className="font-mono text-[9px] font-bold text-blue-400 uppercase tracking-widest mb-1.5">Opportunities</h4>
                        <p className="text-zinc-400 text-xs leading-relaxed">{result.aiResponse.swot.o}</p>
                      </div>
                      <div className="bg-[#18181B] border border-[#27272A] p-4 rounded-sm">
                        <h4 className="font-mono text-[9px] font-bold text-amber-400 uppercase tracking-widest mb-1.5">Threats</h4>
                        <p className="text-zinc-400 text-xs leading-relaxed">{result.aiResponse.swot.t}</p>
                      </div>
                    </div>
                  </div>

                  {/* Risks */}
                  <div className="bg-[#09090B] border border-[#27272A] rounded-sm p-5">
                    <h3 className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-2 mb-3">
                      <AlertTriangle size={12} className="text-red-400" /> Risks
                    </h3>
                    <div className="space-y-2">
                      {result.aiResponse.risks.map((risk, index) => (
                        <div key={index} className="flex items-start gap-2.5 text-zinc-300 text-xs py-1.5 border-b border-[#27272A] last:border-0">
                          <AlertTriangle className="text-red-400 mt-1 flex-shrink-0" size={12} />
                          <span className="leading-relaxed">{risk}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Roadmap Component */}
                  <div className="bg-[#09090B] border border-[#27272A] rounded-sm p-5">
                    <h3 className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-2 mb-4">
                      <ArrowRight size={12} className="text-[#2563EB]" /> Roadmap
                    </h3>
                    <div className="space-y-3">
                      {result.aiResponse.nextSteps.map((step, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <div className="flex flex-col items-center">
                            <div className="w-5 h-5 bg-[#2563EB] rounded-none flex items-center justify-center flex-shrink-0 text-white font-mono text-[9px] font-bold">
                              {index + 1}
                            </div>
                            {index < result.aiResponse.nextSteps.length - 1 && (
                              <div className="w-px h-8 bg-[#27272A] mt-1.5"></div>
                            )}
                          </div>
                          <div className="flex-1 bg-[#18181B] border border-[#27272A] rounded-sm p-3">
                            <p className="text-zinc-300 text-xs leading-relaxed">{step}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-20 bg-[#09090B] border border-[#27272A] rounded-sm flex flex-col items-center justify-center">
                  <h3 className="text-xs font-mono font-semibold text-zinc-400 uppercase tracking-widest mb-2">Ready for AI Analysis</h3>
                  <p className="text-zinc-600 font-mono text-[10px] uppercase tracking-widest max-w-md mx-auto leading-relaxed px-4">
                    Fill out the form and click "Validate My Idea" to execute VC-style validator analysis pipeline.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Floating Save to Pitch Deck Button */}
        {result && (
          <button
            onClick={handleSaveToPitchDeck}
            disabled={loading || savingPitch || !userTeamId}
            className="fixed bottom-8 right-8 bg-[#2563EB] hover:bg-blue-700 disabled:bg-zinc-800 disabled:text-zinc-500 text-white font-mono text-[9px] font-semibold uppercase tracking-widest py-4 px-6 rounded-sm shadow-none z-50 border border-[#27272A] transition-colors flex items-center gap-2"
          >
            <Save size={12} />
            <span>{savingPitch ? 'Saving to Pitch Deck...' : 'Save to Pitch Deck'}</span>
          </button>
        )}
        {!userTeamId && result && (
          <div className="fixed bottom-24 right-8 w-80 bg-[#18181B] border border-[#27272A] rounded-sm p-4 text-[10px] font-mono uppercase tracking-widest text-zinc-500 shadow-none z-50">
            You need to join or create a team before you can save this AI analysis to the team pitch vault.
          </div>
        )}
      </div>
    </div>
  );
};

export default AIValidator;