import React from 'react';
import FilePathInput from './FilePathInput';

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
      <div className="space-y-2">
        <label className="block font-medium">Prompt File Path</label>
        <div className="flex gap-2 items-center">
          <div className="flex-grow">
            <FilePathInput
              value={promptFilePath}
              onChange={(e) => setPromptFilePath(e.target.value)}
              disabled={loading}
            />
          </div>
          <button
            onClick={loadPrompts}
            disabled={loading || !promptFilePath}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50 whitespace-nowrap"
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

export default PromptSelection;