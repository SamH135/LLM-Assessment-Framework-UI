import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';

const HomePage = ({ setCurrentPage }) => (
  <div className="container mx-auto px-4">
    <h2 className="text-2xl font-bold mb-6">Welcome to the LLM Testing Framework</h2>
    <div className="grid md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Model Testing</CardTitle>
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
            onClick={() => setCurrentPage('test')}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Start Testing
          </button>
        </CardFooter>
      </Card>
    </div>
  </div>
);

export default HomePage;