import { useState, useCallback } from 'react';
import { ChatMessage, ChatState, UserProfile, FitnessApiResponse } from '@/constants/types';
import { toast } from '@/hooks/use-toast';

export const useFitnessChat = () => {
  const [userProfile, setUserProfile] = useState<UserProfile>({
    age: '',
    sex: 'Male',
    weight: ''
  });

  const [chatState, setChatState] = useState<ChatState>({
    messages: [],
    isLoading: false,
    isStreaming: false,
    streamText: ''
  });

  const [chatStarted, setChatStarted] = useState(false);

  const generateMessageId = () => `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  const startChat = useCallback(() => {
    if (!userProfile.age || !userProfile.weight) {
      toast({
        title: "Missing Information",
        description: "Please fill in your age and weight to continue.",
        variant: "destructive"
      });
      return;
    }

    setChatStarted(true);
    const welcomeMessage: ChatMessage = {
      id: generateMessageId(),
      sender: 'ai',
      text: `🏋️ Welcome to your AI Fitness Assistant! I'm here to help you with personalized fitness advice based on your profile:\n\n👤 **Age:** ${userProfile.age}\n⚧ **Sex:** ${userProfile.sex}\n⚖️ **Weight:** ${userProfile.weight}kg\n\nFeel free to ask me anything about fitness, workouts, nutrition, or health! How can I help you today?`,
      timestamp: new Date()
    };

    setChatState(prev => ({
      ...prev,
      messages: [welcomeMessage]
    }));
  }, [userProfile]);

  const sendMessage = useCallback(async (userInput: string) => {
    if (!userInput.trim()) return;

    const userMessage: ChatMessage = {
      id: generateMessageId(),
      sender: 'user',
      text: userInput.trim(),
      timestamp: new Date()
    };

    // Add user message immediately
    setChatState(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      isLoading: true
    }));

    try {
      // Simulate API call - replace with your actual Gemini API call
      const prompt = `
You are a professional fitness and health expert. The user's profile:
- Age: ${userProfile.age}
- Sex: ${userProfile.sex}
- Weight: ${userProfile.weight} kg

Only answer fitness, health, nutrition, or workout-related questions. If the question is not related to fitness, politely redirect them to fitness topics.

User question: ${userInput}

Provide helpful, personalized advice based on their profile. Be encouraging and motivational!
`;

      const res = await fetch('http://localhost:5000/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      const data: FitnessApiResponse = await res.json();

      const aiMessage: ChatMessage = {
        id: generateMessageId(),
        sender: 'ai',
        text: data.text,
        timestamp: new Date()
      };

      setChatState(prev => ({
        ...prev,
        messages: [...prev.messages, aiMessage],
        isLoading: false
      }));

    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to get response. Please try again.",
        variant: "destructive"
      });

      setChatState(prev => ({
        ...prev,
        isLoading: false
      }));
    }
  }, [userProfile]);

  const updateProfile = useCallback((field: keyof UserProfile, value: string) => {
    setUserProfile(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const resetChat = useCallback(() => {
    setChatStarted(false);
    setChatState({
      messages: [],
      isLoading: false,
      isStreaming: false,
      streamText: ''
    });
  }, []);

  return {
    userProfile,
    chatState,
    chatStarted,
    updateProfile,
    startChat,
    sendMessage,
    resetChat
  };
};