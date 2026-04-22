export interface AIModel {
  id: string;
  provider: string;
  model: string;
  label: string;
  description: string;
}

export const AI_MODELS: AIModel[] = [
  {
    id: 'openai|gpt-5.4-nano',
    provider: 'openai',
    model: 'gpt-5.4-nano',
    label: 'GPT-5.4 Nano',
    description: 'Fast and cost-effective'
  },
  {
    id: 'openai|gpt-5.4-mini',
    provider: 'openai',
    model: 'gpt-5.4-mini',
    label: 'GPT-5.4 Mini',
    description: 'Optimized intelligence and performance'
  },
  {
    id: 'openai|gpt-5.4',
    provider: 'openai',
    model: 'gpt-5.4',
    label: 'GPT-5.4',
    description: 'State-of-the-art performance'
  }
];

export const DEFAULT_AI_MODEL = 'openai|gpt-5.4-nano';
