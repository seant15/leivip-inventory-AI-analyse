
export enum AppStep {
  CAPTURE = 'CAPTURE',
  PROCESSING = 'PROCESSING',
  ANALYSIS = 'ANALYSIS',
  REORGANIZE = 'REORGANIZE',
  REPORT = 'REPORT'
}

export interface InventoryItem {
  id: string;
  category: string;
  color: string;
  pattern: string;
  quantity: number;
  styleTags: string[];
}

export interface MerchandisingSuggestion {
  id: string;
  title: string;
  description: string;
  impact: 'High' | 'Medium' | 'Low';
  reasoning: string;
  mockupImage?: string;
  isApplied?: boolean;
}

export interface AnalysisResult {
  items: InventoryItem[];
  suggestions: MerchandisingSuggestion[];
}

export interface CapturedPhoto {
  id: string;
  url: string;
  base64: string;
}
