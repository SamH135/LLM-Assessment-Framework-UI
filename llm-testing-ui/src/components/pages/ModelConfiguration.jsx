import React, { useState } from 'react';

const ModelConfiguration = ({ model, onChange }) => {
  const [modelConfig, setModelConfig] = useState({
    model_name: model?.configuration_options?.model_name?.default || 'gpt2',
    max_length: model?.configuration_options?.max_length?.default || 100
  });

  const handleChange = (key, value) => {
    const newConfig = { ...modelConfig, [key]: value };
    setModelConfig(newConfig);
    onChange(newConfig);
  };

  if (!model) return null;

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Model Name
        </label>
        <input
          type="text"
          value={modelConfig.model_name}
          onChange={(e) => handleChange('model_name', e.target.value)}
          placeholder="Enter model name (e.g., gpt2, facebook/opt-350m)"
          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <p className="mt-1 text-sm text-gray-500">
          Enter the name of any compatible model from HuggingFace Hub
        </p>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Max Length
        </label>
        <input
          type="number"
          value={modelConfig.max_length}
          onChange={(e) => handleChange('max_length', parseInt(e.target.value))}
          min={10}
          max={1000}
          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <p className="mt-1 text-sm text-gray-500">
          Maximum length of generated responses (10-1000)
        </p>
      </div>
    </div>
  );
};

export default ModelConfiguration;