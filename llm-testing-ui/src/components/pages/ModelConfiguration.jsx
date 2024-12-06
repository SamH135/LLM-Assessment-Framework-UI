import React from 'react';
import { Info } from 'lucide-react';

const ModelConfiguration = ({ model, onChange }) => {
  if (!model?.configuration_options) {
    return null;
  }

  const handleInputChange = (key, value) => {
    onChange(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const renderField = (key, config) => {
    const baseClasses = "w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500";
    
    switch (config.type) {
      case 'number':
        return (
          <input
            type="number"
            min={config.min}
            max={config.max}
            defaultValue={config.default}
            onChange={(e) => handleInputChange(key, Number(e.target.value))}
            className={baseClasses}
            required={config.required}
          />
        );
      
      case 'string':
        if (config.sensitive) {
          return (
            <input
              type="password"
              defaultValue={config.default}
              onChange={(e) => handleInputChange(key, e.target.value)}
              className={baseClasses}
              required={config.required}
              autoComplete="off"
            />
          );
        }
        
        if (config.format === 'url') {
          return (
            <input
              type="url"
              defaultValue={config.default}
              onChange={(e) => handleInputChange(key, e.target.value)}
              className={baseClasses}
              required={config.required}
              placeholder="https://"
            />
          );
        }

        return (
          <input
            type="text"
            defaultValue={config.default}
            onChange={(e) => handleInputChange(key, e.target.value)}
            className={baseClasses}
            required={config.required}
          />
        );

      default:
        return (
          <input
            type="text"
            defaultValue={config.default}
            onChange={(e) => handleInputChange(key, e.target.value)}
            className={baseClasses}
            required={config.required}
          />
        );
    }
  };

  return (
    <div className="space-y-4 border rounded-lg p-4">
      <h3 className="font-medium text-lg">Model Configuration</h3>
      
      {Object.entries(model.configuration_options).map(([key, config]) => (
        <div key={key} className="space-y-2">
          <label className="block">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-medium">
                {key.split('_').map(word => 
                  word.charAt(0).toUpperCase() + word.slice(1)
                ).join(' ')}
                {config.required && <span className="text-red-500">*</span>}
              </span>
              {config.description && (
                <div className="group relative">
                  <Info className="h-4 w-4 text-gray-400" />
                  <div className="absolute bottom-full mb-2 hidden group-hover:block bg-gray-800 text-white text-sm p-2 rounded">
                    {config.description}
                  </div>
                </div>
              )}
            </div>
            {renderField(key, config)}
          </label>
          {config.examples && (
            <div className="text-sm text-gray-500">
              Examples: {config.examples.join(', ')}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ModelConfiguration;