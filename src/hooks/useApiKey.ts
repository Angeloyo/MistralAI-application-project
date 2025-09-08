"use client";

import { useState, useEffect } from "react";

const API_KEY_STORAGE_KEY = "mistral-api-key";

export function useApiKey() {
  const [apiKey, setApiKey] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const storedKey = localStorage.getItem(API_KEY_STORAGE_KEY);
      if (storedKey) {
        setApiKey(storedKey);
      }
    } catch (error) {
      console.error("Failed to load API key from localStorage:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveApiKey = (key: string): boolean => {
    try {
      if (key.trim()) {
        localStorage.setItem(API_KEY_STORAGE_KEY, key.trim());
        setApiKey(key.trim());
        return true;
      } else {
        localStorage.removeItem(API_KEY_STORAGE_KEY);
        setApiKey("");
        return true;
      }
    } catch (error) {
      console.error("Failed to save API key to localStorage:", error);
      return false;
    }
  };

  const clearApiKey = (): boolean => {
    try {
      localStorage.removeItem(API_KEY_STORAGE_KEY);
      setApiKey("");
      return true;
    } catch (error) {
      console.error("Failed to clear API key from localStorage:", error);
      return false;
    }
  };

  return {
    apiKey,
    isLoading,
    saveApiKey,
    clearApiKey,
    hasApiKey: !!apiKey
  };
}