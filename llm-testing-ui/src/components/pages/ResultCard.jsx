import React, { useState, useEffect, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { ErrorAlert, LoadingSpinner } from '@/components/ui/shared';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const formatScore = (score) => {
  if (score === null || score === undefined || isNaN(score)) return 'N/A';
  return Number(score).toFixed(2);
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

const CustomTooltip = ({ active, payload }) => {
  if (active && payload?.[0]?.payload) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-2 border rounded shadow-sm text-xs">
        <p className="font-medium">{data.created_at}</p>
        <p className="text-blue-600">Score: {formatScore(data.score)}</p>
      </div>
    );
  }
  return null;
};

const ResultCard = ({ result }) => {
  const [expanded, setExpanded] = useState(false);
  const [historicalData, setHistoricalData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedDataPoint, setSelectedDataPoint] = useState(null);

  // Create a stable reference for the click handler
  const handleDataPointClick = useCallback((dataPoint) => {
    if (!dataPoint) return;
    setSelectedDataPoint(dataPoint);
  }, []);

  const fetchHistoricalData = async () => {
    if (!expanded || historicalData.length > 0) return;

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const params = new URLSearchParams({
        prompt: result.metadata.prompt,
        modelName: result.model_name,
        testName: result.test_name
      });

      const response = await fetch(
        `http://localhost:5000/api/auth/test-results/historical?${params}`,
        {
          headers: { 'Authorization': `Bearer ${token}` },
        }
      );

      if (!response.ok) throw new Error('Failed to fetch historical data');

      const data = await response.json();
      const formattedData = data.historicalResults
        .map(item => ({
          ...item,
          score: Number(item.score) || 0,
          created_at: new Date(item.created_at).toLocaleDateString()
        }))
        .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

      setHistoricalData(formattedData);
      setSelectedDataPoint(result);
    } catch (err) {
      setError('Failed to load historical data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistoricalData();
  }, [expanded]);

  // Custom dot component with click handling
  const CustomDot = ({ cx, cy, payload }) => {
    if (typeof cx !== 'number' || typeof cy !== 'number') return null;

    const isSelected = payload.result_id === selectedDataPoint?.result_id;
    const radius = isSelected ? 5 : 3;

    return (
      <g 
        transform={`translate(${cx},${cy})`}
        style={{ cursor: 'pointer' }}
        className="custom-dot"
        onClick={(e) => {
          e.stopPropagation();
          handleDataPointClick(payload);
        }}
      >
        <circle
          r={radius}
          fill={isSelected ? "#1e40af" : "#3b82f6"}
          stroke="white"
          strokeWidth={2}
        />
        {/* Larger invisible circle for easier clicking */}
        <circle
          r={10}
          fill="transparent"
          style={{ cursor: 'pointer' }}
          onClick={(e) => {
            e.stopPropagation();
            handleDataPointClick(payload);
          }}
        />
      </g>
    );
  };

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
          <div className="mt-4 space-y-4">
            {loading ? (
              <div className="h-32 flex items-center justify-center">
                <LoadingSpinner />
              </div>
            ) : error ? (
              <ErrorAlert message={error} />
            ) : historicalData.length > 1 ? (
              <div className="border-t pt-4">
                <div className="flex justify-between items-start">
                  <h5 className="font-medium text-sm">Historical Performance</h5>
                  <p className="text-xs text-gray-500">
                    {historicalData.length} tests run
                  </p>
                </div>
                <div className="h-32 mt-2 overflow-visible">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart 
                      data={historicalData}
                      margin={{ top: 5, right: 5, bottom: 5, left: 5 }}
                    >
                      <XAxis 
                        dataKey="created_at"
                        tick={false}
                        stroke="#94a3b8"
                      />
                      <YAxis 
                        stroke="#94a3b8"
                        tick={{ fontSize: 10 }}
                        width={20}
                        domain={['dataMin - 5', 'dataMax + 5']}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Line 
                        type="monotone" 
                        dataKey="score" 
                        stroke="#3b82f6"
                        strokeWidth={2}
                        dot={<CustomDot />}
                        activeDot={false}
                        isAnimationActive={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                  <p className="text-xs text-gray-500 text-center mt-2">
                    Click on any point to view details
                  </p>
                </div>
              </div>
            ) : null}

            <div className="border-t pt-4">
              <div className="bg-gray-50 p-3 rounded">
                <h5 className="font-medium text-sm">Prompt:</h5>
                <p className="text-sm">
                  {selectedDataPoint?.metadata?.prompt || result.metadata.prompt}
                </p>
              </div>
              
              <div className="bg-gray-50 p-3 rounded mt-2">
                <h5 className="font-medium text-sm">Response:</h5>
                <p className="text-sm">
                  {selectedDataPoint?.metadata?.response || result.metadata.response}
                </p>
              </div>

              {(selectedDataPoint?.metadata?.full_results || result.metadata.full_results) && (
                <div className="bg-gray-50 p-3 rounded mt-2">
                  <h5 className="font-medium text-sm">Detailed Analysis:</h5>
                  {Object.entries(
                    selectedDataPoint?.metadata?.full_results || result.metadata.full_results
                  ).map(([testName, testResult]) => (
                    <div key={testName} className="mt-2">
                      <h6 className="text-sm font-medium">{testName}</h6>
                      <p className="text-sm whitespace-pre-wrap">
                        {testResult.interpretation}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultCard;