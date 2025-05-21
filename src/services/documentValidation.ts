import { toast } from "sonner";

// Types for validation
export type ValidationIssue = {
  type: "error" | "warning" | "info";
  message: string;
  details: string;
};

export type ValidationCheck = {
  name: string;
  status: "passed" | "failed" | "pending";
};

export type ValidationResult = {
  id: string;
  name: string;
  type: string;
  status: "success" | "warning" | "error" | "pending";
  score: number;
  issues: ValidationIssue[];
  validations: ValidationCheck[];
  rawData?: any; // For storing parsed document data
};

// Bank statement specific types
export type BankTransaction = {
  date: string;
  description: string;
  amount: number;
  type: "credit" | "debit";
  balance: number;
};

export type BankStatement = {
  accountName?: string;
  accountNumber?: string;
  startDate?: string;
  endDate?: string;
  openingBalance?: number;
  closingBalance?: number;
  transactions: BankTransaction[];
};

// Main validation service
export const documentValidationService = {
  // Process and validate a bank statement
  validateBankStatement(file: File): Promise<ValidationResult> {
    return new Promise((resolve) => {
      console.log("Starting bank statement validation for:", file.name);
      
      // Create a base result object
      const result: ValidationResult = {
        id: `doc-${Date.now()}`,
        name: file.name,
        type: "bank_statement",
        status: "pending",
        score: 0,
        issues: [],
        validations: [
          { name: "Document format", status: "pending" },
          { name: "Balance consistency", status: "pending" },
          { name: "Transaction integrity", status: "pending" },
          { name: "Mathematical accuracy", status: "pending" },
          { name: "Suspicious patterns", status: "pending" }
        ]
      };

      // Simulate parsing the bank statement (in a real app, this would use OCR or parse a structured format)
      this.parseBankStatement(file).then(parsedData => {
        console.log("Parsed bank statement data:", parsedData);
        
        // Store the raw data for reference
        result.rawData = parsedData;
        
        // Run all validation checks
        const validationResults = this.runBankStatementChecks(parsedData);
        
        // Update the result with validation findings
        result.validations = validationResults.checks;
        result.issues = validationResults.issues;
        
        // Calculate overall score based on passed validations
        const passedChecks = validationResults.checks.filter(check => check.status === "passed").length;
        const totalChecks = validationResults.checks.length;
        result.score = Math.round((passedChecks / totalChecks) * 100);
        
        // Determine overall status
        if (validationResults.issues.some(issue => issue.type === "error")) {
          result.status = "error";
        } else if (validationResults.issues.some(issue => issue.type === "warning")) {
          result.status = "warning";
        } else {
          result.status = "success";
        }
        
        console.log("Validation complete:", result);
        resolve(result);
      });
    });
  },
  
  // Parse a bank statement file (simulated)
  parseBankStatement(file: File): Promise<BankStatement> {
    return new Promise((resolve) => {
      console.log("Parsing bank statement:", file.name);
      
      // In a real application, this would use OCR for PDFs/images or parse CSV/Excel
      // For this demo, we'll simulate parsing with some sample data and introduce
      // some inconsistencies to test our validation logic
      
      // Simulate reading delay
      setTimeout(() => {
        // Generate sample data with some intentional issues for validation testing
        const hasTampering = Math.random() > 0.5;
        const hasBalanceIssue = Math.random() > 0.5;
        
        // Create sample transactions
        const transactions: BankTransaction[] = [];
        let runningBalance = 5000; // Starting balance
        
        // Generate 10-15 transactions
        const transactionCount = 10 + Math.floor(Math.random() * 5);
        
        for (let i = 0; i < transactionCount; i++) {
          const isDebit = Math.random() > 0.4;
          const amount = Math.round((isDebit ? -1 : 1) * (100 + Math.random() * 900));
          
          // Calculate correct balance
          const correctBalance = runningBalance + amount;
          
          // Introduce balance tampering in one transaction if tampering flag is set
          let reportedBalance = correctBalance;
          if (hasTampering && i === Math.floor(transactionCount / 2)) {
            reportedBalance = correctBalance + 1000; // Tampered balance
            console.log("Introducing tampered balance at transaction", i);
          }
          
          transactions.push({
            date: `2023-03-${10 + i}`,
            description: isDebit ? 
              ["Grocery Store", "Online Purchase", "Restaurant", "Utility Bill"][Math.floor(Math.random() * 4)] :
              ["Salary Payment", "Transfer", "Refund", "Interest"][Math.floor(Math.random() * 4)],
            amount: amount,
            type: isDebit ? "debit" : "credit",
            balance: reportedBalance
          });
          
          runningBalance = correctBalance; // Keep track of the actual balance
        }
        
        // Create the bank statement object
        const statement: BankStatement = {
          accountName: "John Doe",
          accountNumber: "IE29AIBK93115212345678",
          startDate: "2023-03-01",
          endDate: "2023-03-31",
          openingBalance: 5000,
          // Introduce closing balance inconsistency if flag is set
          closingBalance: hasBalanceIssue ? 
            (runningBalance + 250) : // Incorrect closing balance
            runningBalance, // Correct closing balance
          transactions: transactions
        };
        
        if (hasBalanceIssue) {
          console.log("Introducing closing balance inconsistency");
        }
        
        resolve(statement);
      }, 1000);
    });
  },
  
  // Run all validation checks on a bank statement
  runBankStatementChecks(statement: BankStatement): { checks: ValidationCheck[], issues: ValidationIssue[] } {
    console.log("Running validation checks on bank statement");
    
    const checks: ValidationCheck[] = [];
    const issues: ValidationIssue[] = [];
    
    // 1. Check document format (account number, dates, etc.)
    const formatCheck = this.validateBankStatementFormat(statement);
    checks.push(formatCheck.check);
    issues.push(...formatCheck.issues);
    
    // 2. Check balance consistency (opening/closing balance)
    const balanceCheck = this.validateBalanceConsistency(statement);
    checks.push(balanceCheck.check);
    issues.push(...balanceCheck.issues);
    
    // 3. Check transaction integrity (each transaction's effect on balance)
    const transactionCheck = this.validateTransactionIntegrity(statement);
    checks.push(transactionCheck.check);
    issues.push(...transactionCheck.issues);
    
    // 4. Check mathematical accuracy (sums, calculations)
    const mathCheck = this.validateMathematicalAccuracy(statement);
    checks.push(mathCheck.check);
    issues.push(...mathCheck.issues);
    
    // 5. Check for suspicious patterns
    const patternCheck = this.validateSuspiciousPatterns(statement);
    checks.push(patternCheck.check);
    issues.push(...patternCheck.issues);
    
    return { checks, issues };
  },
  
  // Validate bank statement format
  validateBankStatementFormat(statement: BankStatement): { check: ValidationCheck, issues: ValidationIssue[] } {
    const issues: ValidationIssue[] = [];
    
    // Check if account number follows IBAN format for Ireland
    if (statement.accountNumber && !statement.accountNumber.match(/^IE\d{2}[A-Z]{4}\d{14}$/)) {
      issues.push({
        type: "warning",
        message: "Invalid account number format",
        details: "The account number does not follow the standard Irish IBAN format"
      });
    }
    
    // Check if dates are present and in correct order
    if (statement.startDate && statement.endDate) {
      const startDate = new Date(statement.startDate);
      const endDate = new Date(statement.endDate);
      
      if (startDate > endDate) {
        issues.push({
          type: "error",
          message: "Invalid date range",
          details: "The statement end date is before the start date"
        });
      }
    } else {
      issues.push({
        type: "warning",
        message: "Missing date information",
        details: "The statement is missing start or end date information"
      });
    }
    
    return {
      check: {
        name: "Document format",
        status: issues.length > 0 ? "failed" : "passed"
      },
      issues
    };
  },
  
  // Validate balance consistency
  validateBalanceConsistency(statement: BankStatement): { check: ValidationCheck, issues: ValidationIssue[] } {
    const issues: ValidationIssue[] = [];
    
    // Check if opening and closing balances are present
    if (statement.openingBalance === undefined || statement.closingBalance === undefined) {
      issues.push({
        type: "warning",
        message: "Missing balance information",
        details: "The statement is missing opening or closing balance information"
      });
      
      return {
        check: {
          name: "Balance consistency",
          status: "failed"
        },
        issues
      };
    }
    
    // Calculate expected closing balance based on opening balance and all transactions
    let calculatedClosingBalance = statement.openingBalance;
    for (const transaction of statement.transactions) {
      calculatedClosingBalance += transaction.amount;
    }
    
    // Check if calculated closing balance matches reported closing balance
    if (Math.abs(calculatedClosingBalance - statement.closingBalance) > 0.01) {
      issues.push({
        type: "error",
        message: "Closing balance inconsistency",
        details: `Calculated closing balance (${calculatedClosingBalance.toFixed(2)}) doesn't match reported closing balance (${statement.closingBalance.toFixed(2)})`
      });
    }
    
    // Check if last transaction balance matches closing balance
    if (statement.transactions.length > 0) {
      const lastTransaction = statement.transactions[statement.transactions.length - 1];
      if (Math.abs(lastTransaction.balance - statement.closingBalance) > 0.01) {
        issues.push({
          type: "error",
          message: "Final transaction balance inconsistency",
          details: `Final transaction balance (${lastTransaction.balance.toFixed(2)}) doesn't match closing balance (${statement.closingBalance.toFixed(2)})`
        });
      }
    }
    
    return {
      check: {
        name: "Balance consistency",
        status: issues.length > 0 ? "failed" : "passed"
      },
      issues
    };
  },
  
  // Validate transaction integrity
  validateTransactionIntegrity(statement: BankStatement): { check: ValidationCheck, issues: ValidationIssue[] } {
    const issues: ValidationIssue[] = [];
    
    if (statement.transactions.length === 0) {
      issues.push({
        type: "warning",
        message: "No transactions found",
        details: "The statement doesn't contain any transactions"
      });
      
      return {
        check: {
          name: "Transaction integrity",
          status: "failed"
        },
        issues
      };
    }
    
    let previousBalance = statement.openingBalance;
    let previousDate: Date | null = null;
    
    // Check each transaction
    statement.transactions.forEach((transaction, index) => {
      // Check if transaction date is valid
      const transactionDate = new Date(transaction.date);
      if (isNaN(transactionDate.getTime())) {
        issues.push({
          type: "warning",
          message: `Invalid date in transaction ${index + 1}`,
          details: `Transaction date "${transaction.date}" is not a valid date`
        });
      }
      
      // Check if dates are in chronological order
      if (previousDate && transactionDate < previousDate) {
        issues.push({
          type: "warning",
          message: `Non-chronological transaction ${index + 1}`,
          details: `Transaction date ${transaction.date} is before previous transaction date ${previousDate.toISOString().split('T')[0]}`
        });
      }
      previousDate = transactionDate;
      
      // Check if balance calculation is correct
      const expectedBalance = previousBalance + transaction.amount;
      if (Math.abs(expectedBalance - transaction.balance) > 0.01) {
        issues.push({
          type: "error",
          message: `Balance inconsistency in transaction ${index + 1}`,
          details: `Expected balance ${expectedBalance.toFixed(2)} but found ${transaction.balance.toFixed(2)}`
        });
      }
      
      previousBalance = expectedBalance; // Use the correct calculated balance for next iteration
    });
    
    return {
      check: {
        name: "Transaction integrity",
        status: issues.length > 0 ? "failed" : "passed"
      },
      issues
    };
  },
  
  // Validate mathematical accuracy
  validateMathematicalAccuracy(statement: BankStatement): { check: ValidationCheck, issues: ValidationIssue[] } {
    const issues: ValidationIssue[] = [];
    
    // Check if the sum of all transactions matches the difference between opening and closing balance
    const totalTransactions = statement.transactions.reduce((sum, transaction) => sum + transaction.amount, 0);
    const balanceDifference = (statement.closingBalance || 0) - (statement.openingBalance || 0);
    
    if (Math.abs(totalTransactions - balanceDifference) > 0.01) {
      issues.push({
        type: "error",
        message: "Mathematical inconsistency",
        details: `Sum of transactions (${totalTransactions.toFixed(2)}) doesn't match the difference between opening and closing balance (${balanceDifference.toFixed(2)})`
      });
    }
    
    // Check for any transactions with zero amount (suspicious)
    const zeroTransactions = statement.transactions.filter(t => Math.abs(t.amount) < 0.01);
    if (zeroTransactions.length > 0) {
      issues.push({
        type: "warning",
        message: "Zero-amount transactions detected",
        details: `Found ${zeroTransactions.length} transaction(s) with zero or near-zero amounts`
      });
    }
    
    return {
      check: {
        name: "Mathematical accuracy",
        status: issues.length > 0 ? "failed" : "passed"
      },
      issues
    };
  },
  
  // Validate for suspicious patterns
  validateSuspiciousPatterns(statement: BankStatement): { check: ValidationCheck, issues: ValidationIssue[] } {
    const issues: ValidationIssue[] = [];
    
    // Check for unusually large transactions
    const amounts = statement.transactions.map(t => Math.abs(t.amount));
    const averageAmount = amounts.reduce((sum, amount) => sum + amount, 0) / amounts.length;
    const largeThreshold = averageAmount * 3; // Transactions 3x larger than average
    
    const largeTransactions = statement.transactions.filter(t => Math.abs(t.amount) > largeThreshold);
    if (largeTransactions.length > 0) {
      issues.push({
        type: "warning",
        message: "Unusually large transactions",
        details: `Found ${largeTransactions.length} transaction(s) significantly larger than average`
      });
    }
    
    // Check for round number transactions (often suspicious)
    const roundTransactions = statement.transactions.filter(t => Math.abs(t.amount) % 100 === 0);
    if (roundTransactions.length > statement.transactions.length * 0.3) { // If more than 30% are round numbers
      issues.push({
        type: "warning",
        message: "Unusual number of round-figure transactions",
        details: `${roundTransactions.length} out of ${statement.transactions.length} transactions are round numbers (multiples of 100)`
      });
    }
    
    // Check for unusual patterns in transaction timing
    const credits = statement.transactions.filter(t => t.type === "credit");
    if (credits.length >= 2) {
      // Check for multiple large credits in a short time period
      const largeCreditCount = credits.filter(t => Math.abs(t.amount) > averageAmount * 2).length;
      if (largeCreditCount >= 2) {
        issues.push({
          type: "warning",
          message: "Multiple large credits",
          details: `Found ${largeCreditCount} unusually large credit transactions`
        });
      }
    }
    
    return {
      check: {
        name: "Suspicious patterns",
        status: issues.length > 0 ? "failed" : "passed"
      },
      issues
    };
  }
};