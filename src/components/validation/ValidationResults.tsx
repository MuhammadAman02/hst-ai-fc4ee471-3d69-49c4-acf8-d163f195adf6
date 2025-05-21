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
import { useValidation } from "../../context/ValidationContext";

const ValidationResults = () => {
  const [expandedDocuments, setExpandedDocuments] = useState<string[]>([]);
  const { validationResults } = useValidation();

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

  // Calculate overall risk level based on validation results
  const calculateOverallRisk = () => {
    if (validationResults.length === 0) return "Unknown";
    
    const errorCount = validationResults.filter(doc => doc.status === "error").length;
    const warningCount = validationResults.filter(doc => doc.status === "warning").length;
    
    if (errorCount > 0) return "High";
    if (warningCount > 0) return "Medium";
    return "Low";
  };

  // Get color for risk level
  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "Low":
        return "text-success-dark";
      case "Medium":
        return "text-warning-dark";
      case "High":
        return "text-alert-dark";
      default:
        return "text-gray-500";
    }
  };

  // Count total issues across all documents
  const getTotalIssues = () => {
    return validationResults.reduce((total, doc) => total + doc.issues.length, 0);
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

        {validationResults.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Documents Validated</h3>
            <p className="text-gray-500 mb-6">Upload and validate documents to see results here.</p>
            <Link to="/upload" className="btn-primary inline-flex items-center">
              <FileText className="h-4 w-4 mr-2" />
              Upload Documents
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white rounded-lg p-4 border border-gray-100 shadow-sm">
                    <p className="text-sm text-gray-500">Documents Analyzed</p>
                    <p className="text-2xl font-bold">{validationResults.length}</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-gray-100 shadow-sm">
                    <p className="text-sm text-gray-500">Potential Issues</p>
                    <p className="text-2xl font-bold">{getTotalIssues()}</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-gray-100 shadow-sm">
                    <p className="text-sm text-gray-500">Overall Risk</p>
                    <p className={`text-2xl font-bold ${getRiskColor(calculateOverallRisk())}`}>
                      {calculateOverallRisk()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {validationResults.map((document) => (
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
          </>
        )}
      </div>
    </div>
  );
};

export default ValidationResults;