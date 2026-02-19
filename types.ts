
export enum AppView {
  LOGIN = 'LOGIN',
  DASHBOARD = 'DASHBOARD',
  WARDROBE = 'WARDROBE',
  PLANNER = 'PLANNER',
  PROFILE = 'PROFILE'
}

export interface User {
  id: string;
  name: string;
  email: string;
  profileComplete: boolean;
}

export interface SkinProfile {
  hex: string;
  undertone: 'Warm' | 'Cool' | 'Neutral';
  labValues: { l: number; a: number; b: number };
  detectedTone: string;
}

export interface BodyProfile {
  type: 'Apple' | 'Pear' | 'Rectangle' | 'Hourglass' | 'Inverted Triangle';
  height?: string;
  preferences: string[];
}

export interface WardrobeItem {
  id: string;
  imageUrl: string;
  category: string;
  color: string;
  style: string;
  brand?: string;
  isEthnic?: boolean;
  region?: string;
  tags: string[];
  confidenceScore: number;
}

export interface EventDetails {
  title: string;
  type: 'Western' | 'Indian Ethnic' | 'Indo-Western' | 'Designer Couture';
  gender: 'Male' | 'Female' | 'Non-binary';
  stateContext?: string;
  moodGoal: string;
  description: string;
  weather?: string;
  location?: string;
}

export interface OutfitSuggestion {
  id: string;
  reasoning: string;
  visualPreviews: string[];
  recommendedBrands: Array<{ name: string; price: string; link: string }>;
  designerInspiration: string;
  culturalSignificance?: string;
  footwear: string;
  accessories: string[];
  colorPalette: string[];
  suitabilityScore: number;
  metrics: {
    confidence: number;
    comfort: number;
    socialImpact: number;
    skinResonance: number;
  };
}

export interface FeedbackRecord {
  suggestionId: string;
  rating: 'like' | 'dislike';
  timestamp: number;
}
