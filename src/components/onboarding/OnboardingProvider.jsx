import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const OnboardingContext = createContext();

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
};

export const OnboardingProvider = ({ children }) => {
  const { user } = useAuth();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);

  // Check if user has completed onboarding
  useEffect(() => {
    if (user) {
      const onboardingKey = `onboarding_completed_${user.id}`;
      const completed = localStorage.getItem(onboardingKey);
      
      if (!completed) {
        // New user - show onboarding after a short delay
        const timer = setTimeout(() => {
          setShowOnboarding(true);
        }, 1000);
        
        return () => clearTimeout(timer);
      } else {
        setHasCompletedOnboarding(true);
      }
    }
  }, [user]);

  const completeOnboarding = () => {
    if (user) {
      const onboardingKey = `onboarding_completed_${user.id}`;
      localStorage.setItem(onboardingKey, 'true');
      setHasCompletedOnboarding(true);
      setShowOnboarding(false);
    }
  };

  const resetOnboarding = () => {
    if (user) {
      const onboardingKey = `onboarding_completed_${user.id}`;
      localStorage.removeItem(onboardingKey);
      setHasCompletedOnboarding(false);
      setShowOnboarding(true);
    }
  };

  const value = {
    showOnboarding,
    hasCompletedOnboarding,
    completeOnboarding,
    resetOnboarding,
    setShowOnboarding
  };

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  );
};