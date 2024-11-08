import React, { useState, useEffect } from 'react';
import { AlertCircle, Upload } from 'lucide-react';
import { ErrorAlert, LoadingSpinner } from '@/components/ui/shared';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const TestPage = () => {
  const [models, setModels] = useState([]);
  const [evaluators, setEvaluators] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedTests, setSelectedTests] = useState([]);
  const [results, setResults] = useState(null);
  const [configuration, setConfiguration] = useState({
    model_name: 'gpt2',
    max_length: 100
  });

  // New state for prompts
  const [promptCategories, setPromptCategories] = useState([]);
  const [prompts, setPrompts] = useState({});
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedPrompt, setSelectedPrompt] = useState('');
  const [promptFilePath, setPromptFilePath] = useState('');


  // API Configuration
  const API_BASE_URL = 'http://localhost:8000/api';

  // Fetch models and evaluators
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [modelsRes, evaluatorsRes] = await Promise.all([
          fetch(`${API_BASE_URL}/models`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          }),
          fetch(`${API_BASE_URL}/evaluators`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          })
        ]);

        if (!modelsRes.ok || !evaluatorsRes.ok) {
          throw new Error('Failed to fetch data');
        }

        const modelsData = await modelsRes.json();
        const evaluatorsData = await evaluatorsRes.json();

        if (modelsData.success && evaluatorsData.success) {
          setModels(modelsData.data);
          setEvaluators(evaluatorsData.data);
        } else {
          throw new Error('Invalid data format received from API');
        }
      } catch (err) {
        setError(`Failed to load models and evaluators: ${err.message}`);
      }
    };

    fetchData();
  }, []);

  // Load prompts from file
  const loadPrompts = async (filepath) => {
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch(`${API_BASE_URL}/prompts/load`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ file_path: filepath }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail?.error?.message || 'Failed to load prompts');
      }

      if (data.success) {
        setPromptCategories(data.data.categories);
        setPrompts(data.data.prompts);
        setSelectedCategory(data.data.categories[0] || '');
        setSelectedPrompt('');
      } else {
        throw new Error('Invalid response format from API');
      }
    } catch (err) {
      setError(`Failed to load prompts: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Handle test submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedPrompt) {
      setError('Please select a prompt to test');
      return;
    }

    setLoading(true);
    setError('');
    setResults(null);

    try {
      const response = await fetch(`${API_BASE_URL}/test`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model_type: selectedModel,
          configuration,
          prompt: selectedPrompt,
          selected_tests: selectedTests
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail?.error?.message || 'Test request failed');
      }

      if (data.success) {
        setResults(data.data);
      } else {
        throw new Error('Invalid response format from API');
      }
    } catch (err) {
      setError(`Failed to run test: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4">
      <h2 className="text-2xl font-bold mb-6">Run Tests</h2>
      
      {error && <ErrorAlert message={error} />}

      <form onSubmit={handleSubmit} className="space-y-6 mb-8">
        {/* Prompt File Input */}
        <div>
          <label className="block mb-2 font-medium">Prompt File Path</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={promptFilePath}
              onChange={(e) => setPromptFilePath(e.target.value)}
              placeholder="Enter path to prompts file (e.g., framework/examples/prompts/agencyPrompts.txt)"
              className="flex-1 p-2 border rounded"
            />
            <button
              type="button"
              onClick={() => loadPrompts(promptFilePath)}
              disabled={!promptFilePath || loading}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50 flex items-center gap-2"
            >
              <Upload className="h-4 w-4" />
              Load Prompts
            </button>
          </div>
        </div>

        {/* Category Selection */}
        {promptCategories.length > 0 && (
          <div>
            <label className="block mb-2 font-medium">Select Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setSelectedPrompt('');
              }}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Choose a category...</option>
              {promptCategories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Prompt Selection */}
        {selectedCategory && prompts[selectedCategory] && (
          <div>
            <label className="block mb-2 font-medium">Select Prompt</label>
            <select
              value={selectedPrompt}
              onChange={(e) => setSelectedPrompt(e.target.value)}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Choose a prompt...</option>
              {prompts[selectedCategory].map((prompt) => (
                <option key={prompt.id} value={prompt.text}>
                  {prompt.text}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Model Selection */}
        <div>
          <label className="block mb-2 font-medium">Select Model</label>
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Choose a model...</option>
            {models.map((model) => (
              <option key={model.id} value={model.id}>
                {model.name}
              </option>
            ))}
          </select>
        </div>

        {/* Test Selection */}
        <div>
          <label className="block mb-2 font-medium">Select Tests</label>
          <div className="space-y-2">
            {evaluators.map((evaluator) => (
              <label key={evaluator.id} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selectedTests.includes(evaluator.id)}
                  onChange={(e) => {
                    setSelectedTests(e.target.checked
                      ? [...selectedTests, evaluator.id]
                      : selectedTests.filter(id => id !== evaluator.id)
                    );
                  }}
                  className="form-checkbox"
                />
                <span>{evaluator.name} - {evaluator.description}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || !selectedPrompt || !selectedModel || selectedTests.length === 0}
          className={`bg-blue-500 text-white px-6 py-2 rounded ${
            loading || !selectedPrompt || !selectedModel || selectedTests.length === 0
              ? 'opacity-50 cursor-not-allowed'
              : 'hover:bg-blue-600'
          }`}
        >
          {loading ? 'Running Test...' : 'Run Test'}
        </button>
      </form>

      {loading && <LoadingSpinner />}

      {/* Results Display */}
      {results && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Test Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium">Model Response:</h4>
                <p className="p-3 bg-gray-50 rounded">{results.response}</p>
              </div>
              
              {Object.entries(results.results).map(([testName, result]) => (
                <div key={testName} className="border-t pt-4">
                  <h4 className="font-medium">{testName}</h4>
                  <p className="whitespace-pre-wrap">{result.interpretation}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TestPage;