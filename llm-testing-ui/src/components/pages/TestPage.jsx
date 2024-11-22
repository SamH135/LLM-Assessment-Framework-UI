import React, { useState, useEffect } from 'react';
import { AlertCircle, Save } from 'lucide-react';
import { ErrorAlert, LoadingSpinner } from '@/components/ui/shared';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import ModelConfiguration from './ModelConfiguration';

const PromptSelection = ({ 
  promptFilePath,
  setPromptFilePath,
  prompts,
  selectedPrompts,
  setSelectedPrompts,
  loading,
  loadPrompts 
}) => {
  const handlePromptToggle = (prompt, category) => {
    setSelectedPrompts(prev => {
      const exists = prev.some(p => p.text === prompt && p.category === category);
      if (exists) {
        return prev.filter(p => !(p.text === prompt && p.category === category));
      } else {
        return [...prev, { text: prompt, category }];
      }
    });
  };

  return (
    <div className="space-y-4">
      {/* File Path Input */}
      <div>
        <label className="block mb-2 font-medium">Prompt File Path</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={promptFilePath}
            onChange={(e) => setPromptFilePath(e.target.value)}
            placeholder="Enter path to prompts file"
            className="flex-1 p-2 border rounded"
          />
          <button
            onClick={loadPrompts}
            disabled={loading || !promptFilePath}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            Load Prompts
          </button>
        </div>
      </div>

      {/* Categories and Prompts */}
      {Object.entries(prompts).map(([category, categoryPrompts]) => (
        <div key={category} className="border rounded-lg">
          <div className="bg-gray-50 p-4 font-medium border-b">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={categoryPrompts.every(prompt => 
                  selectedPrompts.some(p => p.text === prompt.text && p.category === category)
                )}
                onChange={(e) => {
                  if (e.target.checked) {
                    // Add all prompts from category
                    const newPrompts = categoryPrompts.map(prompt => ({
                      text: prompt.text,
                      category
                    }));
                    setSelectedPrompts(prev => [...prev, ...newPrompts]);
                  } else {
                    // Remove all prompts from category
                    setSelectedPrompts(prev => 
                      prev.filter(p => p.category !== category)
                    );
                  }
                }}
                className="mr-2"
              />
              {category}
            </label>
          </div>
          <div className="p-4 space-y-2">
            {categoryPrompts.map((prompt) => (
              <label key={prompt.id} className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedPrompts.some(p => p.text === prompt.text && p.category === category)}
                  onChange={() => handlePromptToggle(prompt.text, category)}
                  className="mt-1"
                />
                <span className="text-sm">{prompt.text}</span>
              </label>
            ))}
          </div>
        </div>
      ))}

      {/* Selected Prompts Summary */}
      {selectedPrompts.length > 0 && (
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-medium mb-2">Selected Prompts ({selectedPrompts.length})</h3>
          <div className="space-y-2">
            {selectedPrompts.map((prompt, index) => (
              <div key={index} className="flex justify-between items-center bg-white p-2 rounded">
                <div className="text-sm">
                  <span className="font-medium">{prompt.category}:</span> {prompt.text}
                </div>
                <button
                  onClick={() => handlePromptToggle(prompt.text, prompt.category)}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const TestPage = () => {
  const [models, setModels] = useState([]);
  const [evaluators, setEvaluators] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedTests, setSelectedTests] = useState([]);
  const [results, setResults] = useState(null);
  const [savingResult, setSavingResult] = useState(false);
  
  // Prompt-related state
  const [promptFilePath, setPromptFilePath] = useState('');
  const [prompts, setPrompts] = useState({});
  const [selectedPrompts, setSelectedPrompts] = useState([]);

  // Model selection states
  const [modelConfig, setModelConfig] = useState({
    model_name: 'gpt2',
    max_length: 100
  });

  const navigate = useNavigate();
  const API_BASE_URL = 'http://localhost:8000/api';
  const NODE_API_URL = 'http://localhost:5000/api';

  useEffect(() => {
    fetchModelsAndEvaluators();
  }, []);

  const fetchModelsAndEvaluators = async () => {
    try {
      const [modelsRes, evaluatorsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/models`),
        fetch(`${API_BASE_URL}/evaluators`)
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

  const loadPrompts = async () => {
    if (!promptFilePath) {
      setError('Please enter a prompt file path');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const response = await fetch(`${API_BASE_URL}/prompts/load`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ file_path: promptFilePath }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail?.error?.message || 'Failed to load prompts');
      }

      if (data.success) {
        setPrompts(data.data.prompts);
      } else {
        throw new Error('Invalid response format from API');
      }
    } catch (err) {
      setError(`Failed to load prompts: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const saveTestResult = async (testData) => {
    try {
      setSavingResult(true);
      const token = localStorage.getItem('token');
      
      const selectedModelData = models.find(m => m.id === selectedModel);
      const modelConfig = testData.metadata?.configuration || {};
  
      const testResultData = {
        model_name: selectedModelData.name,
        model_version: modelConfig.model_name || 'gpt2',
        test_name: "Agency Analysis",
        score: testData.results["Agency Analysis"].raw_results.agency_score,
        result: testData.results["Agency Analysis"].raw_results.risk_level,
        metadata: {
          prompt: testData.prompt,
          response: testData.response,
          configuration: modelConfig,
          full_results: testData.results
        }
      };
  
      const response = await fetch(`${NODE_API_URL}/auth/test-results`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(testResultData),
      });

      if (!response.ok) {
        throw new Error('Failed to save test result');
      }

      const data = await response.json();
      navigate('/results');
      return data.testResult;
    } catch (err) {
      setError(`Failed to save test result: ${err.message}`);
      return null;
    } finally {
      setSavingResult(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedPrompts.length === 0) {
      setError('Please select at least one prompt to test');
      return;
    }
  
    setLoading(true);
    setError('');
    setResults(null);
  
    try {
      const results = [];
      for (const prompt of selectedPrompts) {
        const response = await fetch(`${API_BASE_URL}/test`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model_type: selectedModel,
            configuration: modelConfig,  // Replace the hardcoded config with modelConfig
            prompt: prompt.text,
            selected_tests: selectedTests
          }),
        });
  
        const data = await response.json();
        if (data.success) {
          results.push({
            ...data.data,
            category: prompt.category,
            prompt: prompt.text
          });
        }
      }
      setResults({ results });
    } catch (err) {
      setError(`Failed to run test: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Run Tests</h2>
        <button
          onClick={() => navigate('/results')}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          View Test Results
        </button>
      </div>
      
      {error && <ErrorAlert message={error} />}

      <form onSubmit={handleSubmit} className="space-y-6 mb-8">
        <PromptSelection
          promptFilePath={promptFilePath}
          setPromptFilePath={setPromptFilePath}
          prompts={prompts}
          selectedPrompts={selectedPrompts}
          setSelectedPrompts={setSelectedPrompts}
          loading={loading}
          loadPrompts={loadPrompts}
        />

        {/* Model Selection and Configuration */}
        <div className="space-y-4">
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
          
          {selectedModel && (
            <ModelConfiguration
              model={models.find(m => m.id === selectedModel)}
              onChange={setModelConfig}
            />
          )}
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
          disabled={loading || !selectedModel || selectedTests.length === 0 || selectedPrompts.length === 0}
          className={`bg-blue-500 text-white px-6 py-2 rounded transition-colors ${
            loading || !selectedModel || selectedTests.length === 0 || selectedPrompts.length === 0
              ? 'opacity-50 cursor-not-allowed'
              : 'hover:bg-blue-600'
          }`}
        >
          {loading ? 'Running Tests...' : `Run Tests (${selectedPrompts.length} prompts)`}
        </button>
      </form>

      {loading && <LoadingSpinner />}

      {/* Results Display */}
      {results && (
        <div className="space-y-4">
          {results.results.map((result, index) => (
            <Card key={index} className="mb-4">
              <CardHeader>
                <CardTitle>
                  <div className="flex justify-between items-center">
                    <span>{result.category}</span>
                    <span className="text-sm text-gray-500">
                      Prompt {index + 1} of {results.results.length}
                    </span>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Prompt Display */}
                  <div>
                    <h4 className="font-medium mb-2">Prompt:</h4>
                    <div className="p-3 bg-gray-50 rounded">{result.prompt}</div>
                  </div>

                  {/* Response Display */}
                  <div>
                    <h4 className="font-medium mb-2">Response:</h4>
                    <div className="p-3 bg-gray-50 rounded">{result.response}</div>
                  </div>

                  {/* Test Results */}
                  {Object.entries(result.results).map(([testName, testResult]) => (
                    <div key={testName} className="border-t pt-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{testName}</h4>
                        <div className={`px-3 py-1 rounded text-sm ${
                          testResult.raw_results.agency_score > 50 
                            ? 'bg-red-100 text-red-800' 
                            : testResult.raw_results.agency_score > 20 
                              ? 'bg-yellow-100 text-yellow-800' 
                              : 'bg-green-100 text-green-800'
                        }`}>
                          Score: {testResult.raw_results.agency_score.toFixed(2)}
                        </div>
                      </div>
                      <div className="mt-2 p-3 bg-gray-50 rounded">
                        <p className="whitespace-pre-wrap text-sm">{testResult.interpretation}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <button
                  onClick={() => saveTestResult(result)}
                  disabled={savingResult}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50 flex items-center gap-2 transition-colors"
                >
                  <Save className="h-4 w-4" />
                  {savingResult ? 'Saving...' : 'Save Results'}
                </button>
              </CardFooter>
            </Card>
          ))}

          {/* Batch Actions */}
          {results.results.length > 1 && (
            <div className="sticky bottom-4 flex justify-center">
              <div className="bg-white shadow-lg rounded-lg p-4 flex gap-4 border">
                <button
                  onClick={() => {
                    Promise.all(results.results.map(saveTestResult))
                      .then(() => navigate('/results'))
                      .catch(err => setError('Failed to save some results'));
                  }}
                  disabled={savingResult}
                  className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 disabled:opacity-50 flex items-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  Save All Results
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TestPage;