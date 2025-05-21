import React, { createContext, useContext, useState } from "react";
import { ValidationResult } from "../services/documentValidation";

interface ValidationContextType {
  validationResults: ValidationResult[];
  addValidationResult: (result: ValidationResult) => void;
  updateValidationResult: (id: string, result: Partial<ValidationResult>) => void;
  removeValidationResult: (id: string) => void;
  clearValidationResults: () => void;
}

const ValidationContext = createContext<ValidationContextType | undefined>(undefined);

export const ValidationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [validationResults, setValidationResults] = useState<ValidationResult[]>([]);

  const addValidationResult = (result: ValidationResult) => {
    console.log("Adding validation result:", result);
    setValidationResults(prev => [...prev, result]);
  };

  const updateValidationResult = (id: string, result: Partial<ValidationResult>) => {
    console.log("Updating validation result:", id, result);
    setValidationResults(prev => 
      prev.map(item => item.id === id ? { ...item, ...result } : item)
    );
  };

  const removeValidationResult = (id: string) => {
    console.log("Removing validation result:", id);
    setValidationResults(prev => prev.filter(item => item.id !== id));
  };

  const clearValidationResults = () => {
    console.log("Clearing all validation results");
    setValidationResults([]);
  };

  return (
    <ValidationContext.Provider value={{
      validationResults,
      addValidationResult,
      updateValidationResult,
      removeValidationResult,
      clearValidationResults
    }}>
      {children}
    </ValidationContext.Provider>
  );
};

export const useValidation = () => {
  const context = useContext(ValidationContext);
  if (context === undefined) {
    throw new Error("useValidation must be used within a ValidationProvider");
  }
  return context;
};