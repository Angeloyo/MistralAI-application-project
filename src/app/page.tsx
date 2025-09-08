"use client";

import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import { SettingsModal } from "@/components/settings-modal";
import { ModelCards } from "@/components/model-cards";
import { MistralModel } from "@/types/models";
import { makeModelCall, judgeResponse, judgeResponseWithContext, ModelResponse } from "@/lib/mistral-api";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { InfoIcon } from "lucide-react";

const API_KEY_STORAGE_KEY = "mistral-api-key";

export default function Home() {
  const [selectedModels, setSelectedModels] = useState<MistralModel[]>([]);
  const [prompt, setPrompt] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [responses, setResponses] = useState<ModelResponse[]>([]);
  const [loadingModels, setLoadingModels] = useState<Set<string>>(new Set());
  const [expandedResponses, setExpandedResponses] = useState<Set<string>>(new Set());

  const toggleExpanded = (modelEndpoint: string) => {
    setExpandedResponses(prev => {
      const newSet = new Set(prev);
      if (newSet.has(modelEndpoint)) {
        newSet.delete(modelEndpoint);
      } else {
        newSet.add(modelEndpoint);
      }
      return newSet;
    });
  };

  const handleRunBenchmark = async () => {
    const apiKey = localStorage.getItem(API_KEY_STORAGE_KEY);
    if (!apiKey) {
      toast.error("Please set your API key in settings first");
      return;
    }

    if (selectedModels.length === 0) {
      toast.error("Please select at least one model");
      return;
    }

    if (!prompt.trim()) {
      toast.error("Please enter a prompt");
      return;
    }

    setIsRunning(true);
    setResponses([]);
    setExpandedResponses(new Set());
    const newLoadingModels = new Set(selectedModels.map(m => m.apiEndpoint));
    setLoadingModels(newLoadingModels);

    const promises = selectedModels.map(async (model) => {
      try {
        const response = await makeModelCall(model, prompt.trim(), apiKey);
        
        setLoadingModels(prev => {
          const newSet = new Set(prev);
          newSet.delete(model.apiEndpoint);
          return newSet;
        });
        
        if (response.error) {
          toast.error(`Error with ${model.name}: ${response.error}`);
          setResponses(prev => [...prev, response]);
        } else {
          // Add response first, then call judge
          setResponses(prev => [...prev, response]);
          
          // Call judge automatically
          const judgeResult = await judgeResponse(response.response, apiKey);
          
          // Update response with judge score
          setResponses(prev => prev.map(r => 
            r.model.apiEndpoint === model.apiEndpoint 
              ? { ...r, judgeScore: judgeResult.score, judgeError: judgeResult.error }
              : r
          ));
        }
        
        return response;
      } catch (error) {
        setLoadingModels(prev => {
          const newSet = new Set(prev);
          newSet.delete(model.apiEndpoint);
          return newSet;
        });
        
        const errorResponse: ModelResponse = {
          model,
          response: '',
          error: error instanceof Error ? error.message : 'Unknown error',
          duration: 0
        };
        
        setResponses(prev => [...prev, errorResponse]);
        toast.error(`Failed to call ${model.name}`);
        return errorResponse;
      }
    });

    try {
      const completedResponses = await Promise.all(promises);
      
      // Run Judge 2 after all models complete
      const successfulResponses = completedResponses.filter(r => !r.error);
      if (successfulResponses.length > 1) {
        // Judge each response with context of all others
        for (const response of successfulResponses) {
          const judge2Result = await judgeResponseWithContext(
            response.response,
            response.model.name,
            completedResponses,
            apiKey
          );
          
          setResponses(prev => prev.map(r => 
            r.model.apiEndpoint === response.model.apiEndpoint 
              ? { ...r, judge2Score: judge2Result.score, judge2Error: judge2Result.error }
              : r
          ));
        }
      }
      
    } catch (error) {
      toast.error("Some models failed to respond");
    } finally {
      setIsRunning(false);
      setLoadingModels(new Set());
    }
  };
  
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Image
              src="/logo.svg"
              alt="Mistral AI"
              width={120}
              height={40}
              priority
            />
            <div className="flex items-baseline gap-3">
              <h1 className="text-xl font-semibold text-gray-900">
                Models Benchmarking
              </h1>
              <p className="text-sm text-gray-600">
                Project for the Software Engineer Internship Application
              </p>
            </div>
          </div>
          
          <SettingsModal />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">

        <div className="bg-white border border-gray-200 rounded-lg shadow-sm mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Select Models</h2>
            <p className="text-sm text-gray-500 mt-1">
              Choose which Mistral AI models to include in the benchmark
            </p>
          </div>
          <div className="p-6">
            <ModelCards 
              selectedModels={selectedModels}
              onModelsChange={setSelectedModels}
            />
          </div>
        </div>

        {/* Prompt Input Area */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Test Prompt</h3>
          </div>
          <div className="p-6">
            <textarea
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none"
              rows={4}
              placeholder="Enter your prompt here to test all models..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={isRunning}
            />
            <div className="mt-4 flex justify-between items-center">
              <div className="text-sm text-gray-500">
                This will send the same prompt to all selected models
              </div>
              <button
                className="px-4 py-2 bg-orange-600 text-white text-sm font-medium rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isRunning || selectedModels.length === 0 || !prompt.trim()}
                onClick={handleRunBenchmark}
              >
                {isRunning ? "Running..." : "Run Benchmark"}
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Model Comparison</h2>
            <p className="text-sm text-gray-500 mt-1">
              Compare responses from different Mistral AI models
            </p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Model
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Response
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center gap-1">
                      Judge 1 (Unbiased)
                      <Tooltip>
                        <TooltipTrigger>
                          <InfoIcon className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Judge 1 rates with only one model&apos;s response as context.</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center gap-1">
                      Judge 2 (Biased)
                      <Tooltip>
                        <TooltipTrigger>
                          <InfoIcon className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Judge 2 rates with all models&apos; responses as context.</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {selectedModels.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                      No models selected. Use the model selector to add models for benchmarking.
                    </td>
                  </tr>
                ) : (
                  selectedModels.map((model) => {
                    const response = responses.find(r => r.model.apiEndpoint === model.apiEndpoint);
                    const isLoading = loadingModels.has(model.apiEndpoint);
                    const isExpanded = expandedResponses.has(model.apiEndpoint);
                    const shouldShowExpand = response && !response.error && response.response.length > 150;
                    
                    return (
                      <tr key={model.apiEndpoint}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{model.name}</div>
                          <div className="text-sm text-gray-500">{model.apiEndpoint}</div>
                        </td>
                        <td className="px-6 py-4">
                          {isLoading ? (
                            <div className="flex items-center gap-2">
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-600"></div>
                              <div className="text-sm text-gray-500 italic">Loading...</div>
                            </div>
                          ) : response ? (
                            response.error ? (
                              <div className="text-sm text-red-600">
                                Error: {response.error}
                              </div>
                            ) : (
                              <div className="text-sm text-gray-900">
                                <div className="max-w-md overflow-hidden">
                                  <div className={isExpanded ? "" : "line-clamp-3"}>
                                    {response.response}
                                  </div>
                                  {shouldShowExpand && (
                                    <button
                                      onClick={() => toggleExpanded(model.apiEndpoint)}
                                      className="text-xs text-blue-600 hover:text-blue-800 mt-1 underline"
                                    >
                                      {isExpanded ? "Show less" : "Read more"}
                                    </button>
                                  )}
                                  {response.response.length > 150 && (
                                    <div className="text-xs text-gray-500 mt-1">
                                      ({response.response.length} characters)
                                    </div>
                                  )}
                                </div>
                                <div className="text-xs text-gray-400 mt-1">
                                  {response.duration}ms
                                </div>
                              </div>
                            )
                          ) : (
                            <div className="text-sm text-gray-500 italic">
                              Waiting for prompt...
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          {response && !response.error ? (
                            response.judgeScore !== undefined ? (
                              <div className="text-sm font-medium text-gray-900">
                                {response.judgeScore}
                              </div>
                            ) : (
                              <div className="flex items-center justify-center gap-1">
                                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-orange-600"></div>
                                <div className="text-xs text-gray-500">Judging...</div>
                              </div>
                            )
                          ) : (
                            <div className="text-sm text-gray-500">-</div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          {response && !response.error ? (
                            response.judge2Score !== undefined ? (
                              <div className="text-sm font-medium text-gray-900">
                                {response.judge2Score}
                              </div>
                            ) : isRunning ? (
                              <div className="text-xs text-gray-500">Waiting...</div>
                            ) : (
                              <div className="text-sm text-gray-500">-</div>
                            )
                          ) : (
                            <div className="text-sm text-gray-500">-</div>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
