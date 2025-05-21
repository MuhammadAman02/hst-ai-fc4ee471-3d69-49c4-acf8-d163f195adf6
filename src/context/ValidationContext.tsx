import React, { createContext, useContext, useState, ReactNode } from "react";
import { ValidationResult } from "../services/documentValidation";

interface ValidationContextType {
  validationResults: ValidationResult[];
  addValidationResult: (result: ValidationResult) => void;
  clearValidationResults: () => void;
}

const ValidationContext = createContext<ValidationContextType | undefined>(undefined);

export const ValidationProvider = ({ children }: { children: ReactNode }) => {
  const [validationResults, setValidationResults] = useState<ValidationResult[]>([]);

  const addValidationResult = (result: ValidationResult) => {
    setValidationResults(prev => [...prev, result]);
  };

  const clearValidationResults = () => {
    setValidationResults([]);
  };

  return (
    <ValidationContext.Provider value={{ validationResults, addValidationResult, clearValidationResults }}>
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