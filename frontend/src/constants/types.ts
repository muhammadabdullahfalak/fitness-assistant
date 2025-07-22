// Types for the fitness chat application

export interface UserProfile {
  age: string;
  sex: 'Male' | 'Female';
  weight: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: Date;
}

export interface FitnessApiResponse {
  text: string;
  error?: string;
}

export interface ChatState {
  messages: ChatMessage[];
  isLoading: boolean;
  isStreaming: boolean;
  streamText: string;
}

export type ChatStep = 'profile' | 'chat';

export interface FitnessFormData {
  age: number;
  sex: 'Male' | 'Female';
  weight: number;
}