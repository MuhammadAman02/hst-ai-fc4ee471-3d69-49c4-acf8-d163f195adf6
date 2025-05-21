import { toast } from "sonner";

// Types for our validation system
export type ValidationStatus = "passed" | "failed" | "pending";
export type DocumentStatus = "success" | "warning" | "error" | "pending";
export type IssueType = "error" | "warning" | "info";

export interface ValidationCheck {
  name: string;
  status: ValidationStatus;
  details?: string;
}

export interface ValidationIssue {
  type: IssueType;
  message: string;
  details: string;
  location?: string;
}

export interface ValidationResult {
  id: string;
  name: string;
  type: string;
  status: DocumentStatus;
  score: number;
  issues: ValidationIssue[];
  validations: ValidationCheck[];
  metadata?: Record<string, any>;
}

// Mock bank statement data structure
interface BankTransaction {
  date: Date;
  description: string;
  amount: number;
  type: "credit" | "debit";
  balance: number;
  location?: string;
}

interface BankStatement {
  accountNumber: string;
  accountName: string;
  bankName: string;
  startDate: Date;
  endDate: Date;
  openingBalance: number;
  closingBalance: number;
  transactions: BankTransaction[];
  metadata: {
    creationDate?: Date;
    modificationDate?: Date;
    author?: string;
    producer?: string;
    fonts?: string[];
    hasDigitalSignature?: boolean;
    checksum?: string;
  };
}

// Utility functions for validation
const generateId = (): string => {
  return `doc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

const calculateScore = (validations: ValidationCheck[]): number => {
  if (validations.length === 0) return 0;
  
  const passedChecks = validations.filter(check => check.status === "passed").length;
  return Math.round((passedChecks / validations.length) * 100);
};

const determineStatus = (score: number, issues: ValidationIssue[]): DocumentStatus => {
  const hasErrors = issues.some(issue => issue.type === "error");
  const hasWarnings = issues.some(issue => issue.type === "warning");
  
  if (hasErrors) return "error";
  if (hasWarnings) return "warning";
  if (score >= 80) return "success";
  return "warning";
};

// Mock function to parse a bank statement from a file
// In a real application, this would use OCR or parse a structured format
const parseBankStatement = async (file: File): Promise<BankStatement> => {
  console.log("Parsing bank statement:", file.name);
  
  // In a real app, we would extract this data from the file
  // For demo purposes, we'll create mock data
  const mockTransactions: BankTransaction[] = [
    {
      date: new Date("2023-05-01"),
      description: "SALARY PAYMENT",
      amount: 3000,
      type: "credit",
      balance: 5000
    },
    {
      date: new Date("2023-05-03"),
      description: "GROCERY STORE",
      amount: 85.75,
      type: "debit",
      balance: 4914.25
    },
    {
      date: new Date("2023-05-05"),
      description: "RENT PAYMENT",
      amount: 1200,
      type: "debit",
      balance: 3714.25
    },
    {
      date: new Date("2023-05-10"),
      description: "COFFEE SHOP",
      amount: 4.50,
      type: "debit",
      balance: 3709.75
    },
    {
      date: new Date("2023-05-15"),
      description: "ONLINE PURCHASE",
      amount: 59.99,
      type: "debit",
      balance: 3649.76 // Intentional error for demo
    },
    {
      date: new Date("2023-05-20"),
      description: "ATM WITHDRAWAL",
      amount: 200,
      type: "debit",
      balance: 3449.76
    },
    {
      date: new Date("2023-05-20"),
      description: "ATM WITHDRAWAL",
      amount: 200,
      type: "debit", // Duplicate transaction for demo
      balance: 3249.76
    },
    {
      date: new Date("2023-05-18"), // Out of order date for demo
      description: "RESTAURANT",
      amount: 45.50,
      type: "debit",
      balance: 3204.26
    },
    {
      date: new Date("2023-05-25"),
      description: "TRANSFER",
      amount: 1000,
      type: "credit",
      balance: 4204.26
    },
    {
      date: new Date("2023-05-30"),
      description: "UTILITY BILL",
      amount: 120,
      type: "debit",
      balance: 4084.26
    }
  ];

  return {
    accountNumber: "IE29AIBK93115212345678",
    accountName: "John Smith",
    bankName: "Example Bank",
    startDate: new Date("2023-05-01"),
    endDate: new Date("2023-05-31"),
    openingBalance: 2000,
    closingBalance: 4084.26,
    transactions: mockTransactions,
    metadata: {
      creationDate: new Date("2023-06-01"),
      modificationDate: new Date("2023-06-02"), // Modified after creation for demo
      author: "Example Bank Statement Generator",
      producer: "PDF Creator 2.0",
      fonts: ["Arial", "Helvetica", "TimesNewRoman"],
      hasDigitalSignature: false
    }
  };
};

// Validation functions for bank statements
const validateArithmeticConsistency = (statement: BankStatement): ValidationCheck => {
  console.log("Validating arithmetic consistency");
  
  let calculatedBalance = statement.openingBalance;
  const issues: string[] = [];
  
  statement.transactions.forEach((transaction, index) => {
    if (transaction.type === "credit") {
      calculatedBalance += transaction.amount;
    } else {
      calculatedBalance -= transaction.amount;
    }
    
    // Check if the calculated balance matches the reported balance
    if (Math.abs(calculatedBalance - transaction.balance) > 0.01) {
      issues.push(`Transaction ${index + 1}: Calculated balance (${calculatedBalance.toFixed(2)}) doesn't match reported balance (${transaction.balance.toFixed(2)})`);
    }
  });
  
  // Check if final calculated balance matches closing balance
  if (Math.abs(calculatedBalance - statement.closingBalance) > 0.01) {
    issues.push(`Final calculated balance (${calculatedBalance.toFixed(2)}) doesn't match reported closing balance (${statement.closingBalance.toFixed(2)})`);
  }
  
  return {
    name: "Arithmetic consistency",
    status: issues.length === 0 ? "passed" : "failed",
    details: issues.length > 0 ? issues.join("; ") : undefined
  };
};

const validateDateSequence = (statement: BankStatement): ValidationCheck => {
  console.log("Validating date sequence");
  
  const issues: string[] = [];
  let previousDate: Date | null = null;
  
  statement.transactions.forEach((transaction, index) => {
    // Check if transaction date is within statement period
    if (transaction.date < statement.startDate || transaction.date > statement.endDate) {
      issues.push(`Transaction ${index + 1}: Date (${transaction.date.toISOString().split('T')[0]}) is outside statement period`);
    }
    
    // Check if transactions are in chronological order
    if (previousDate && transaction.date < previousDate) {
      issues.push(`Transaction ${index + 1}: Date (${transaction.date.toISOString().split('T')[0]}) is earlier than previous transaction (${previousDate.toISOString().split('T')[0]})`);
    }
    
    previousDate = transaction.date;
  });
  
  return {
    name: "Date sequence validity",
    status: issues.length === 0 ? "passed" : "failed",
    details: issues.length > 0 ? issues.join("; ") : undefined
  };
};

const detectRepetitionAnomalies = (statement: BankStatement): ValidationCheck => {
  console.log("Detecting repetition anomalies");
  
  const issues: string[] = [];
  const descriptionCounts: Record<string, number> = {};
  const amountCounts: Record<number, number> = {};
  
  // Count occurrences of descriptions and amounts
  statement.transactions.forEach(transaction => {
    descriptionCounts[transaction.description] = (descriptionCounts[transaction.description] || 0) + 1;
    amountCounts[transaction.amount] = (amountCounts[transaction.amount] || 0) + 1;
  });
  
  // Check for unusual repetitions
  Object.entries(descriptionCounts).forEach(([description, count]) => {
    if (count > 2) {
      issues.push(`Unusual repetition: "${description}" appears ${count} times`);
    }
  });
  
  // Check for round numbers that appear frequently
  Object.entries(amountCounts).forEach(([amount, count]) => {
    const numAmount = parseFloat(amount);
    if (count > 2 && (numAmount % 100 === 0 || numAmount % 1000 === 0)) {
      issues.push(`Suspicious pattern: Amount ${numAmount} appears ${count} times`);
    }
  });
  
  return {
    name: "Repetition anomalies",
    status: issues.length === 0 ? "passed" : "failed",
    details: issues.length > 0 ? issues.join("; ") : undefined
  };
};

const validateDocumentIntegrity = (statement: BankStatement): ValidationCheck => {
  console.log("Validating document integrity");
  
  const issues: string[] = [];
  
  // Check for suspicious metadata
  if (statement.metadata.modificationDate && 
      statement.metadata.creationDate && 
      statement.metadata.modificationDate > statement.metadata.creationDate) {
    issues.push("Document was modified after creation");
  }
  
  // Check for digital signature
  if (!statement.metadata.hasDigitalSignature) {
    issues.push("Document lacks digital signature");
  }
  
  // Check for consistent fonts (simplified)
  if (statement.metadata.fonts && statement.metadata.fonts.length > 3) {
    issues.push(`Unusual number of fonts (${statement.metadata.fonts.length}) detected`);
  }
  
  return {
    name: "Document integrity",
    status: issues.length === 0 ? "passed" : "failed",
    details: issues.length > 0 ? issues.join("; ") : undefined
  };
};

const detectAnomalousTransactions = (statement: BankStatement): ValidationCheck => {
  console.log("Detecting anomalous transactions");
  
  const issues: string[] = [];
  
  // Calculate average transaction amount
  const totalAmount = statement.transactions.reduce((sum, transaction) => sum + transaction.amount, 0);
  const avgAmount = totalAmount / statement.transactions.length;
  
  // Check for unusually large transactions
  statement.transactions.forEach((transaction, index) => {
    if (transaction.amount > avgAmount * 3) {
      issues.push(`Transaction ${index + 1}: Amount (${transaction.amount.toFixed(2)}) is unusually large`);
    }
  });
  
  // Check for round number transactions
  const roundNumberTransactions = statement.transactions.filter(
    transaction => transaction.amount % 100 === 0 || transaction.amount % 1000 === 0
  );
  
  if (roundNumberTransactions.length > statement.transactions.length * 0.3) {
    issues.push(`High frequency of round number transactions (${roundNumberTransactions.length} out of ${statement.transactions.length})`);
  }
  
  return {
    name: "Anomalous transactions",
    status: issues.length === 0 ? "passed" : "failed",
    details: issues.length > 0 ? issues.join("; ") : undefined
  };
};

const detectMissingTransactions = (statement: BankStatement): ValidationCheck => {
  console.log("Detecting missing transactions");
  
  const issues: string[] = [];
  
  // Check for gaps in transaction dates
  const sortedTransactions = [...statement.transactions].sort((a, b) => a.date.getTime() - b.date.getTime());
  
  for (let i = 1; i < sortedTransactions.length; i++) {
    const daysBetween = (sortedTransactions[i].date.getTime() - sortedTransactions[i-1].date.getTime()) / (1000 * 60 * 60 * 24);
    
    if (daysBetween > 7) {
      issues.push(`Unusual gap of ${Math.round(daysBetween)} days between transactions on ${sortedTransactions[i-1].date.toISOString().split('T')[0]} and ${sortedTransactions[i].date.toISOString().split('T')[0]}`);
    }
  }
  
  // Check for missing regular expenses (simplified)
  const hasRent = statement.transactions.some(t => 
    t.description.toLowerCase().includes("rent") && t.type === "debit"
  );
  
  const hasUtility = statement.transactions.some(t => 
    t.description.toLowerCase().includes("utility") && t.type === "debit"
  );
  
  if (!hasRent) {
    issues.push("No rent payment found in statement period");
  }
  
  if (!hasUtility) {
    issues.push("No utility payment found in statement period");
  }
  
  return {
    name: "Missing transactions",
    status: issues.length === 0 ? "passed" : "failed",
    details: issues.length > 0 ? issues.join("; ") : undefined
  };
};

const simulateMLDetection = (statement: BankStatement): ValidationCheck => {
  console.log("Simulating ML-based detection");
  
  // In a real application, this would use actual ML models
  // For demo purposes, we'll use a simple heuristic
  
  // Calculate some features that would be used in ML
  const creditToDebitRatio = statement.transactions.reduce(
    (ratio, transaction) => {
      if (transaction.type === "credit") return ratio + 1;
      if (transaction.type === "debit") return ratio - 1;
      return ratio;
    }, 
    0
  ) / statement.transactions.length;
  
  const avgTimeBetweenTransactions = statement.transactions.length > 1 ? 
    (statement.endDate.getTime() - statement.startDate.getTime()) / (1000 * 60 * 60 * 24 * (statement.transactions.length - 1)) : 
    0;
  
  // Simple "model" output
  const fraudScore = Math.random() * 0.3; // Random score between 0 and 0.3 for demo
  const threshold = 0.7;
  
  return {
    name: "ML fraud detection",
    status: fraudScore < threshold ? "passed" : "failed",
    details: `Fraud score: ${(fraudScore * 100).toFixed(1)}% (Credit/Debit ratio: ${creditToDebitRatio.toFixed(2)}, Avg days between transactions: ${avgTimeBetweenTransactions.toFixed(1)})`
  };
};

// Main validation function for bank statements
const validateBankStatement = async (file: File): Promise<ValidationResult> => {
  console.log("Starting bank statement validation for:", file.name);
  
  try {
    // Parse the bank statement
    const statement = await parseBankStatement(file);
    
    // Run all validation checks
    const validations: ValidationCheck[] = [
      validateArithmeticConsistency(statement),
      validateDateSequence(statement),
      detectRepetitionAnomalies(statement),
      validateDocumentIntegrity(statement),
      detectAnomalousTransactions(statement),
      detectMissingTransactions(statement),
      simulateMLDetection(statement)
    ];
    
    // Collect issues from failed validations
    const issues: ValidationIssue[] = validations
      .filter(validation => validation.status === "failed")
      .map(validation => ({
        type: validation.name.includes("ML") ? "warning" : "error",
        message: `Failed: ${validation.name}`,
        details: validation.details || "No details provided"
      }));
    
    // Calculate overall score
    const score = calculateScore(validations);
    
    // Determine overall status
    const status = determineStatus(score, issues);
    
    // Create and return the validation result
    const result: ValidationResult = {
      id: generateId(),
      name: file.name,
      type: "bank_statement",
      status,
      score,
      issues,
      validations,
      metadata: {
        accountNumber: statement.accountNumber,
        accountName: statement.accountName,
        period: `${statement.startDate.toISOString().split('T')[0]} to ${statement.endDate.toISOString().split('T')[0]}`
      }
    };
    
    console.log("Bank statement validation completed:", result);
    return result;
  } catch (error) {
    console.error("Error validating bank statement:", error);
    
    // Return error result
    return {
      id: generateId(),
      name: file.name,
      type: "bank_statement",
      status: "error",
      score: 0,
      issues: [{
        type: "error",
        message: "Validation failed",
        details: error instanceof Error ? error.message : "Unknown error"
      }],
      validations: [{
        name: "Document processing",
        status: "failed",
        details: "Failed to process document"
      }]
    };
  }
};

// Export the document validation service
export const documentValidationService = {
  validateBankStatement
};