import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Code2, GitBranch, Package, Puzzle, Microscope, FileCode2 } from 'lucide-react';

const ContributePage = () => {
  return (
    <div className="container mx-auto px-4 space-y-8 pb-8">
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Contributing to the Framework</h2>
        <p className="text-gray-600">
          The LLM Testing Framework is designed to be modular and extensible. Learn how to contribute
          your own evaluators and help expand the framework's testing capabilities.
        </p>
      </section>

      {/* Quick Start Guide */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GitBranch className="h-5 w-5" />
            Quick Start Guide
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-medium">1. Clone the Repository</h4>
            <pre className="bg-gray-100 p-3 rounded-lg overflow-x-auto">
              <code>git clone https://github.com/your-org/llm-testing-framework.git
cd llm-testing-framework</code>
            </pre>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium">2. Install Dependencies</h4>
            <pre className="bg-gray-100 p-3 rounded-lg overflow-x-auto">
              <code>pip install -r requirements-core.txt
pip install -r requirements-api.txt</code>
            </pre>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium">3. Create Your Evaluator</h4>
            <pre className="bg-gray-100 p-3 rounded-lg overflow-x-auto">
              <code>mkdir framework/evaluators/your_evaluator
touch framework/evaluators/your_evaluator/__init__.py
touch framework/evaluators/your_evaluator/evaluator.py</code>
            </pre>
          </div>
        </CardContent>
      </Card>

      {/* Framework Structure */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Framework Structure
          </CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="bg-gray-100 p-3 rounded-lg overflow-x-auto">
            <code>{`framework/
├── core/
│   ├── base.py           # Base classes and interfaces
│   └── registry.py       # Component registry
├── evaluators/
│   └── your_evaluator/   # Your new evaluator directory
│       ├── __init__.py
│       └── evaluator.py  # Your evaluator implementation
└── utils/
    └── prompts.py        # Prompt management utilities`}</code>
          </pre>
        </CardContent>
      </Card>

      {/* Creating an Evaluator */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileCode2 className="h-5 w-5" />
            Creating an Evaluator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            Create a new evaluator by implementing the BaseEvaluator interface in your evaluator.py file:
          </p>
          <pre className="bg-gray-100 p-3 rounded-lg overflow-x-auto">
            <code>{`from framework.core.base import BaseEvaluator, EvaluatorMetadata
from typing import Dict, Any, List

class YourEvaluator(BaseEvaluator):
    @classmethod
    def get_metadata(cls) -> EvaluatorMetadata:
        return EvaluatorMetadata(
            name="Your Test Name",
            description="Description of what your test evaluates",
            version="1.0.0",
            category="Your Category",
            tags=["tag1", "tag2"]
        )

    def evaluate(self, text: str) -> Dict[str, Any]:
        # Implement your evaluation logic here
        results = {
            "score": 0.0,
            "findings": []
        }
        return results

    def interpret(self, results: Dict[str, Any]) -> str:
        # Convert results into human-readable format
        return "Interpretation of the results"

    def summarize_category_results(
        self, category_results: List[Dict[str, Any]]
    ) -> str:
        # Summarize multiple test results
        return "Summary of category results"`}</code>
          </pre>
        </CardContent>
      </Card>

      {/* Key Concepts */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Puzzle className="h-5 w-5" />
              Key Components
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li>
                <span className="font-medium">BaseEvaluator:</span> Abstract base class defining the interface for all evaluators
              </li>
              <li>
                <span className="font-medium">EvaluatorMetadata:</span> Class for storing evaluator metadata
              </li>
              <li>
                <span className="font-medium">Registry:</span> Automatic discovery and registration of evaluators
              </li>
              <li>
                <span className="font-medium">Prompt Management:</span> Utilities for handling test prompts
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Microscope className="h-5 w-5" />
              Best Practices
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li>
                <span className="font-medium">Documentation:</span> Include detailed docstrings and type hints
              </li>
              <li>
                <span className="font-medium">Testing:</span> Add unit tests for your evaluator
              </li>
              <li>
                <span className="font-medium">Error Handling:</span> Implement proper error handling and validation
              </li>
              <li>
                <span className="font-medium">Metadata:</span> Provide comprehensive metadata for the UI
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Development Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code2 className="h-5 w-5" />
            Development Tips
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>Modular Design:</strong> Keep your evaluator self-contained and focused on a specific testing aspect
            </li>
            <li>
              <strong>Clear Results:</strong> Return structured results that can be easily interpreted by the UI
            </li>
            <li>
              <strong>Comprehensive Testing:</strong> Include example prompts that demonstrate your evaluator's capabilities
            </li>
            <li>
              <strong>Documentation:</strong> Provide clear documentation about what your evaluator tests and how to interpret results
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContributePage;