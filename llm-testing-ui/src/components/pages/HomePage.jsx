import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { TestTube2, AlertCircle } from 'lucide-react';

const HomePage = () => {
  const navigate = useNavigate();
  const [evaluators, setEvaluators] = React.useState([]);
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    const fetchEvaluators = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/evaluators');
        const data = await response.json();
        if (data.success) {
          setEvaluators(data.data);
        } else {
          throw new Error('Failed to fetch evaluators');
        }
      } catch (err) {
        setError('Failed to load evaluators. Please try again later.');
      }
    };

    fetchEvaluators();
  }, []);

  return (
    <div className="container mx-auto px-4 space-y-8">
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Welcome to the AI Guardian LLM Testing Framework</h2>
        <p className="text-gray-600">
          Test and evaluate Language Models across multiple dimensions including safety, 
          capability boundaries, and output quality. 
        </p>
      </section>

      <div className="w-full">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TestTube2 className="h-5 w-5" />
              Model Testing
            </CardTitle>
            <CardDescription>
              Test Language Models with various prompts and analyze their responses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Run comprehensive tests on language models to evaluate their responses
              across multiple dimensions including agency, safety, and quality.
            </p>
          </CardContent>
          <CardFooter>
            <button
              onClick={() => navigate('/test')}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
            >
              Start Testing
            </button>
          </CardFooter>
        </Card>
      </div>

      <section className="space-y-4">
        <h3 className="text-xl font-semibold">Available Evaluators</h3>
        {error && (
          <div className="flex items-center gap-2 text-red-500">
            <AlertCircle className="h-5 w-5" />
            <p>{error}</p>
          </div>
        )}
        <div className="grid md:grid-cols-2 gap-4">
          {evaluators.map((evaluator) => (
            <Card key={evaluator.id}>
              <CardHeader>
                <CardTitle className="text-lg">{evaluator.name}</CardTitle>
                <CardDescription>Version {evaluator.version}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium">Description</h4>
                  <p className="text-gray-600">{evaluator.description}</p>
                </div>
                <div>
                  <h4 className="font-medium">Category</h4>
                  <p className="text-gray-600">{evaluator.category}</p>
                </div>
                <div>
                  <h4 className="font-medium">Tags</h4>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {evaluator.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-gray-100 rounded-full text-sm text-gray-600"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;