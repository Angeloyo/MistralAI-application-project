"use client";

import { MistralModel, getPremierModels, getOpenModels } from "@/types/models";

interface ModelCardsProps {
  selectedModels: MistralModel[];
  onModelsChange: (models: MistralModel[]) => void;
}

export function ModelCards({ selectedModels, onModelsChange }: ModelCardsProps) {
  const premierModels = getPremierModels();
  const openModels = getOpenModels();
  
  const isModelSelected = (model: MistralModel) => 
    selectedModels.some(selected => selected.apiEndpoint === model.apiEndpoint);
  
  const toggleModel = (model: MistralModel) => {
    if (isModelSelected(model)) {
      onModelsChange(selectedModels.filter(selected => selected.apiEndpoint !== model.apiEndpoint));
    } else {
      onModelsChange([...selectedModels, model]);
    }
  };

  const ModelCard = ({ model }: { model: MistralModel }) => {
    const selected = isModelSelected(model);
    
    return (
      <div
        onClick={() => toggleModel(model)}
        className={`p-4 border rounded-lg cursor-pointer transition-all ${
          selected
            ? model.category === 'premier'
              ? 'bg-orange-50 border-orange-200 ring-2 ring-orange-500'
              : 'bg-blue-50 border-blue-200 ring-2 ring-blue-500'
            : 'bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300'
        }`}
      >
        <div className="relative">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h4 className="font-medium text-gray-900">{model.name}</h4>
            </div>
            <p className="text-xs text-gray-500 mb-2">{model.apiEndpoint}</p>
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">{model.description}</p>
            <div className="flex gap-3 text-xs text-gray-500">
              <span>{model.maxTokens}</span>
              <span>v{model.version}</span>
            </div>
          </div>
          {selected && (
            <div className={`absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center ${
              model.category === 'premier' ? 'bg-orange-500' : 'bg-blue-500'
            }`}>
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Premier Models */}
      <div>
        <h3 className="text-sm font-semibold text-orange-800 uppercase tracking-wider mb-4">
          Premier Models
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {premierModels.map((model) => (
            <ModelCard key={model.apiEndpoint} model={model} />
          ))}
        </div>
      </div>

      {/* Open Models */}
      <div>
        <h3 className="text-sm font-semibold text-blue-800 uppercase tracking-wider mb-4">
          Open Models
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {openModels.map((model) => (
            <ModelCard key={model.apiEndpoint} model={model} />
          ))}
        </div>
      </div>
    </div>
  );
}