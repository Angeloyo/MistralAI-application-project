export interface MistralModel {
  name: string;
  apiEndpoint: string;
  description: string;
  maxTokens: string;
  version: string;
  category: 'premier' | 'open';
}

export const MISTRAL_MODELS: MistralModel[] = [
  // Premier Models
  {
    name: "Mistral Medium 3.1",
    apiEndpoint: "mistral-medium-2508",
    description: "Our frontier-class multimodal model released August 2025. Improving tone and performance.",
    maxTokens: "128k",
    version: "25.08",
    category: "premier"
  },
  {
    name: "Magistral Medium 1.1",
    apiEndpoint: "magistral-medium-2507",
    description: "Our frontier-class reasoning model released July 2025.",
    maxTokens: "40k",
    version: "25.07",
    category: "premier"
  },
  {
    name: "Codestral 2508",
    apiEndpoint: "codestral-2508",
    description: "Our cutting-edge language model for coding released end of July 2025, specializes in low-latency, high-frequency tasks.",
    maxTokens: "256k",
    version: "25.08",
    category: "premier"
  },
  {
    name: "Devstral Medium",
    apiEndpoint: "devstral-medium-2507",
    description: "An enterprise grade text model, that excels at using tools to explore codebases, editing multiple files and power software engineering agents.",
    maxTokens: "128k",
    version: "25.07",
    category: "premier"
  },
  {
    name: "Ministral 3B",
    apiEndpoint: "ministral-3b-2410",
    description: "World's best edge model.",
    maxTokens: "128k",
    version: "24.10",
    category: "premier"
  },
  {
    name: "Ministral 8B",
    apiEndpoint: "ministral-8b-2410",
    description: "Powerful edge model with extremely high performance/price ratio.",
    maxTokens: "128k",
    version: "24.10",
    category: "premier"
  },
  {
    name: "Mistral Large 2.1",
    apiEndpoint: "mistral-large-2411",
    description: "Our top-tier large model for high-complexity tasks with the latest version released November 2024.",
    maxTokens: "128k",
    version: "24.11",
    category: "premier"
  },
  {
    name: "Mistral Small 2",
    apiEndpoint: "mistral-small-2407",
    description: "Our updated small version, released September 2024.",
    maxTokens: "32k",
    version: "24.07",
    category: "premier"
  },

  // Open Models
  {
    name: "Magistral Small 1.1",
    apiEndpoint: "magistral-small-2507",
    description: "Our small reasoning model released July 2025.",
    maxTokens: "40k",
    version: "25.07",
    category: "open"
  },
  {
    name: "Mistral Small 3.2",
    apiEndpoint: "mistral-small-2506",
    description: "An update to our previous small model, released June 2025.",
    maxTokens: "128k",
    version: "25.06",
    category: "open"
  },
  {
    name: "Devstral Small 1.1",
    apiEndpoint: "devstral-small-2507",
    description: "An update to our open source model that excels at using tools to explore codebases, editing multiple files and power software engineering agents.",
    maxTokens: "128k",
    version: "25.07",
    category: "open"
  },
  {
    name: "Mistral Small 3.1",
    apiEndpoint: "mistral-small-2503",
    description: "A new leader in the small models category with image understanding capabilities, released March 2025.",
    maxTokens: "128k",
    version: "25.03",
    category: "open"
  },
  {
    name: "Pixtral 12B",
    apiEndpoint: "pixtral-12b-2409",
    description: "A 12B model with image understanding capabilities in addition to text.",
    maxTokens: "128k",
    version: "24.09",
    category: "open"
  },
  {
    name: "Mistral Nemo 12B",
    apiEndpoint: "open-mistral-nemo",
    description: "Our best multilingual open source model released July 2024.",
    maxTokens: "128k",
    version: "24.07",
    category: "open"
  }
];

export const getPremierModels = () => MISTRAL_MODELS.filter(model => model.category === 'premier');
export const getOpenModels = () => MISTRAL_MODELS.filter(model => model.category === 'open');