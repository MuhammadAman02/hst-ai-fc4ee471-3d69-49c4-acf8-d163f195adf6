import { useState } from "react";
import { 
  AlertTriangle, 
  CheckCircle, 
  FileText, 
  ChevronDown, 
  ChevronUp, 
  Download,
  ExternalLink,
  Info
} from "lucide-react";
import { Link } from "react-router-dom";

// Mock validation results
const mockResults = [
  {
    id: "doc-1",
    name: "Bank Statement - March 2023.pdf",
    type: "bank_statement",
    status: "warning",
    score: 75,
    issues: [
      { 
        type: "warning", 
        message: "Unusual transaction pattern detected", 
        details: "Multiple large round-figure deposits in short succession" 
      },
      { 
        type: "warning", 
        message: "Balance inconsistency", 
        details: "Closing balance from previous statement doesn't match opening balance" 
      }
    ],
    validations: [
      { name: "Document format", status: "passed" },
      { name: "Logo verification", status: "passed" },
      { name: "Account number format", status: "passed" },
      { name: "Transaction consistency", status: "failed" },
      { name: "Balance verification", status: "failed" }
    ]
  },
  {
    id: "doc-2",
    name: "Payslip - February 2023.pdf",
    type: "payslip",
    status: "error",
    score: 45,
    issues: [
      { 
        type: "error", 
        message: "Employer details mismatch", 
        details: "Employer name doesn't match records in other documents" 
      },
      { 
        type: "error", 
        message: "Calculation inconsistency", 
        details: "Gross pay minus deductions doesn't equal net pay" 
      },
      { 
        type: "warning", 
        message: "Unusual salary amount", 
        details: "Salary is significantly higher than average for this role" 
      }
    ],
    validations: [
      { name: "Document format", status: "passed" },
      { name: "Logo verification", status: "failed" },
      { name: "Tax calculation", status: "failed" },
      { name: "Employee details", status: "passed" },
      { name: "Payment consistency", status: "failed" }
    ]
  },
  {
    id: "doc-3",
    name: "PPSN Document.pdf",
    type: "ppsn",
    status: "success",
    score: 98,
    issues: [],
    validations: [
      { name: "Document format", status: "passed" },
      { name: "PPS number format", status: "passed" },
      { name: "Watermark verification", status: "passed" },
      { name: "Document integrity", status: "passed" }
    ]
  }
];

const ValidationResults = () => {
  const [expandedDocuments, setExpandedDocuments] = useState<string[]>([]);

  const toggleDocument = (id: string) => {
    setExpandedDocuments(prev => 
      prev.includes(id) 
        ? prev.filter(docId => docId !== id) 
        : [...prev, id]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "bg-success text-white";
      case "warning":
        return "bg-warning text-white";
      case "error":
        return "bg-alert text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-5 w-5" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5" />;
      case "error":
        return <AlertTriangle className="h-5 w-5" />;
      default:
        return <Info className="h-5 w-5" />;
    }
  };

  const getValidationStatusColor = (status: string) => {
    switch (status) {
      case "passed":
        return "text-success-dark";
      case "failed":
        return "text-alert-dark";
      default:
        return "text-gray-500";
    }
  };

  const getValidationStatusIcon = (status: string) => {
    switch (status) {
      case "passed":
        return <CheckCircle className="h-4 w-4" />;
      case "failed":
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-success-dark";
    if (score >= 70) return "text-warning-dark";
    return "text-alert-dark";
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white shadow-sm rounded-lg p-6 border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Validation Results</h2>
          <div className="flex space-x-4">
            <button className="btn-secondary flex items-center">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </button>
            <Link to="/upload" className="btn-primary flex items-center">
              <FileText className="h-4 w-4 mr-2" />
              Upload More
            </Link>
          </div>
        </div>

        <div className="mb-6">
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg p-4 border border-gray-100 shadow-sm">
                <p className="text-sm text-gray-500">Documents Analyzed</p>
                <p className="text-2xl font-bold">{mockResults.length}</p>
              </div>
              <div className="bg-white rounded-lg p-4 border border-gray-100 shadow-sm">
                <p className="text-sm text-gray-500">Potential Issues</p>
                <p className="text-2xl font-bold">{mockResults.reduce((acc, doc) => acc + doc.issues.length, 0)}</p>
              </div>
              <div className="bg-white rounded-lg p-4 border border-gray-100 shadow-sm">
                <p className="text-sm text-gray-500">Overall Risk</p>
                <p className="text-2xl font-bold text-warning-dark">Medium</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {mockResults.map((document) => (
            <div key={document.id} className="border border-gray-200 rounded-lg overflow-hidden">
              <div 
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
                onClick={() => toggleDocument(document.id)}
              >
                <div className="flex items-center">
                  <div className={`rounded-full p-2 ${getStatusColor(document.status)}`}>
                    {getStatusIcon(document.status)}
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">{document.name}</h3>
                    <p className="text-sm text-gray-500 capitalize">{document.type.replace('_', ' ')}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="mr-4">
                    <p className="text-sm text-gray-500">Validation Score</p>
                    <p className={`text-lg font-bold ${getScoreColor(document.score)}`}>{document.score}%</p>
                  </div>
                  {expandedDocuments.includes(document.id) ? (
                    <ChevronUp className="h-5 w-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  )}
                </div>
              </div>
              
              {expandedDocuments.includes(document.id) && (
                <div className="border-t border-gray-200 p-4 bg-gray-50">
                  {document.issues.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-md font-medium text-gray-900 mb-2">Detected Issues</h4>
                      <div className="space-y-2">
                        {document.issues.map((issue, index) => (
                          <div key={index} className={`p-3 rounded-md ${
                            issue.type === 'error' ? 'bg-alert-light' : 'bg-warning-light'
                          }`}>
                            <div className="flex items-start">
                              <AlertTriangle className={`h-5 w-5 mr-2 ${
                                issue.type === 'error' ? 'text-alert-dark' : 'text-warning-dark'
                              }`} />
                              <div>
                                <p className="text-sm font-medium text-gray-900">{issue.message}</p>
                                <p className="text-xs text-gray-600">{issue.details}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div>
                    <h4 className="text-md font-medium text-gray-900 mb-2">Validation Checks</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {document.validations.map((validation, index) => (
                        <div key={index} className="flex items-center p-2 bg-white rounded border border-gray-100">
                          <div className={getValidationStatusColor(validation.status)}>
                            {getValidationStatusIcon(validation.status)}
                          </div>
                          <span className="ml-2 text-sm">{validation.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mt-4 flex justify-end">
                    <button className="text-sm text-brand-600 hover:text-brand-700 flex items-center">
                      <ExternalLink className="h-4 w-4 mr-1" />
                      View Full Report
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ValidationResults;