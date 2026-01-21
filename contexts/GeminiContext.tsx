
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface GeminiContextType {
  apiKey: string | null;
  setApiKey: (key: string) => void;
  isConfigured: boolean;
}

const GeminiContext = createContext<GeminiContextType | undefined>(undefined);

export const GeminiProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [apiKey, setApiKeyState] = useState<string | null>(null);

  useEffect(() => {
    // 1. Try to get from environment (injected by Vite)
    // 0. Try standard Vite env var (Best practice for Vercel/Vite)
    const viteKey = import.meta.env.VITE_GEMINI_API_KEY;

    // 1. Try to get from environment (injected by Vite or fallback)
    const envKey = viteKey || process.env.GEMINI_API_KEY || process.env.API_KEY;
    
    // 2. Try to get from localStorage
    const storedKey = localStorage.getItem('gemini_api_key');

    if (envKey && envKey !== 'undefined') {
      setApiKeyState(envKey);
    } else if (storedKey) {
      setApiKeyState(storedKey);
    }
  }, []);

  const setApiKey = (key: string) => {
    setApiKeyState(key);
    localStorage.setItem('gemini_api_key', key);
  };

  const isConfigured = !!apiKey;

  return (
    <GeminiContext.Provider value={{ apiKey, setApiKey, isConfigured }}>
      {children}
    </GeminiContext.Provider>
  );
};

export const useGemini = () => {
  const context = useContext(GeminiContext);
  if (context === undefined) {
    throw new Error('useGemini must be used within a GeminiProvider');
  }
  return context;
};
