import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { ErrorAlert, LoadingSpinner } from '@/components/ui/shared';
import { AlertCircle, BarChart2 } from 'lucide-react';

// Utility functions for formatting and display
const formatScore = (score) => {
  if (score === null || score === undefined || isNaN(score)) {
    return 'N/A';
  }
  return typeof score === 'number' ? score.toFixed(2) : score.toString();
};

const getScoreColor = (score) => {
  if (score === null || score === undefined || isNaN(score)) {
    return 'bg-gray-100 text-gray-800';
  }
  const numScore = Number(score);
  if (numScore > 50) return 'bg-red-100 text-red-800';
  if (numScore > 20) return 'bg-yellow-100 text-yellow-800';
  return 'bg-green-100 text-green-800';
};

const ScoreBadge = ({ score }) => (
  <span className={`px-2 py-1 rounded-full text-sm ${getScoreColor(score)}`}>
    Score: {formatScore(score)}
  </span>
);

const ResultCard = ({ result }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-medium">{result.test_name}</h4>
          <p className="text-sm text-gray-500">
            Model: {result.model_name} {result.model_version}
          </p>
          <p className="text-sm text-gray-500">
            Date: {new Date(result.created_at).toLocaleDateString()}
          </p>
        </div>
        <ScoreBadge score={result.score} />
      </div>
      
      <div className="mt-4">
        <button 
          onClick={() => setExpanded(!expanded)}
          className="text-sm text-blue-500 hover:text-blue-700"
        >
          {expanded ? 'Show Less' : 'Show More'}
        </button>

        {expanded && result.metadata && (
          <div className="mt-2 space-y-2">
            <div className="bg-gray-50 p-3 rounded">
              <h5 className="font-medium text-sm">Prompt:</h5>
              <p className="text-sm">{result.metadata.prompt}</p>
            </div>
            
            <div className="bg-gray-50 p-3 rounded">
              <h5 className="font-medium text-sm">Response:</h5>
              <p className="text-sm">{result.metadata.response}</p>
            </div>

            {result.metadata.full_results && (
              <div className="bg-gray-50 p-3 rounded">
                <h5 className="font-medium text-sm">Detailed Analysis:</h5>
                {Object.entries(result.metadata.full_results).map(([testName, testResult]) => (
                  <div key={testName} className="mt-2">
                    <h6 className="text-sm font-medium">{testName}</h6>
                    <p className="text-sm whitespace-pre-wrap">{testResult.interpretation}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const TestResultsPage = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all'); // all, high-risk, medium-risk, low-risk
  const [sortBy, setSortBy] = useState('date'); // date, score
  const [sortOrder, setSortOrder] = useState('desc'); // asc, desc

  const NODE_API_URL = 'http://localhost:5000/api';

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      setLoading(true);
      setError('');
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${NODE_API_URL}/auth/test-results`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch test results');
      }

      const data = await response.json();
      setResults(data.testResults);
    } catch (err) {
      setError(`Failed to fetch test results: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const filterResults = (results) => {
    if (filter === 'all') return results;
    
    return results.filter(result => {
      const score = Number(result.score);
      switch (filter) {
        case 'high-risk': return score > 50;
        case 'medium-risk': return score > 20 && score <= 50;
        case 'low-risk': return score <= 20;
        default: return true;
      }
    });
  };

  const sortResults = (results) => {
    return [...results].sort((a, b) => {
      if (sortBy === 'date') {
        const comparison = new Date(b.created_at) - new Date(a.created_at);
        return sortOrder === 'desc' ? comparison : -comparison;
      } else { // score
        const comparison = (b.score || 0) - (a.score || 0);
        return sortOrder === 'desc' ? comparison : -comparison;
      }
    });
  };

  const processedResults = sortResults(filterResults(results));

  if (loading) return <LoadingSpinner />;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Test Results</h2>
        <div className="flex gap-4">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="all">All Results</option>
            <option value="high-risk">High Risk</option>
            <option value="medium-risk">Medium Risk</option>
            <option value="low-risk">Low Risk</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="date">Sort by Date</option>
            <option value="score">Sort by Score</option>
          </select>

          <button
            onClick={() => setSortOrder(order => order === 'asc' ? 'desc' : 'asc')}
            className="p-2 border rounded hover:bg-gray-100"
          >
            {sortOrder === 'asc' ? '↑' : '↓'}
          </button>
        </div>
      </div>

      {error && <ErrorAlert message={error} />}

      <div className="space-y-4">
        {processedResults.length === 0 ? (
          <Card>
            <CardContent className="py-8">
              <div className="text-center text-gray-500">
                <BarChart2 className="mx-auto h-12 w-12 mb-4" />
                <p>No test results found</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          processedResults.map(result => (
            <ResultCard key={result.result_id} result={result} />
          ))
        )}
      </div>
    </div>
  );
};

export default TestResultsPage;