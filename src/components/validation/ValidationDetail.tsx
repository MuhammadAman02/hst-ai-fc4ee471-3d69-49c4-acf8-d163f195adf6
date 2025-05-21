import { useState } from "react";
import { 
  AlertTriangle, 
  CheckCircle, 
  Info, 
  ChevronDown, 
  ChevronUp,
  FileText,
  BarChart4,
  Calendar,
  DollarSign,
  Repeat,
  FileImage,
  Database,
  Brain
} from "lucide-react";
import { ValidationResult, ValidationCheck, ValidationIssue } from "../../services/documentValidation";

interface ValidationDetailProps {
  result: ValidationResult;
}

const ValidationDetail = ({ result }: ValidationDetailProps) => {
  const [expandedSections, setExpandedSections] = useState<string[]>(["issues"]);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section) 
        : [...prev, section]
    );
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "passed":
        return <CheckCircle className="h-4 w-4 text-success-dark" />;
      case "failed":
        return <AlertTriangle className="h-4 w-4 text-alert-dark" />;
      default:
        return <Info className="h-4 w-4 text-gray-500" />;
    }
  };

  const getCategoryIcon = (name: string) => {
    if (name.toLowerCase().includes("arithmetic") || name.toLowerCase().includes("consistency")) {
      return <DollarSign className="h-5 w-5" />;
    }
    if (name.toLowerCase().includes("date")) {
      return <Calendar className="h-5 w-5" />;
    }
    if (name.toLowerCase().includes("repetition") || name.toLowerCase().includes("anomal")) {
      return <Repeat className="h-5 w-5" />;
    }
    if (name.toLowerCase().includes("integrity") || name.toLowerCase().includes("forensic")) {
      return <FileImage className="h-5 w-5" />;
    }
    if (name.toLowerCase().includes("missing")) {
      return <Database className="h-5 w-5" />;
    }
    if (name.toLowerCase().includes("ml") || name.toLowerCase().includes("ai")) {
      return <Brain className="h-5 w-5" />;
    }
    return <FileText className="h-5 w-5" />;
  };

  // Group validations by category
  const groupedValidations: Record<string, ValidationCheck[]> = {
    "Data Validation & Consistency": result.validations.filter(v => 
      v.name.includes("Arithmetic") || 
      v.name.includes("Date") || 
      v.name.includes("Repetition")
    ),
    "Document Integrity & Forensics": result.validations.filter(v => 
      v.name.includes("integrity") || 
      v.name.includes("Forensic")
    ),
    "Anomaly & Behavioral Analysis": result.validations.filter(v => 
      v.name.includes("Anomalous") || 
      v.name.includes("Missing")
    ),
    "AI/ML Detection": result.validations.filter(v => 
      v.name.includes("ML") || 
      v.name.includes("AI")
    ),
    "Other Checks": result.validations.filter(v => 
      !v.name.includes("Arithmetic") && 
      !v.name.includes("Date") && 
      !v.name.includes("Repetition") && 
      !v.name.includes("integrity") && 
      !v.name.includes("Forensic") && 
      !v.name.includes("Anomalous") && 
      !v.name.includes("Missing") && 
      !v.name.includes("ML") && 
      !v.name.includes("AI")
    )
  };

  // Remove empty categories
  Object.keys(groupedValidations).forEach(key => {
    if (groupedValidations[key].length === 0) {
      delete groupedValidations[key];
    }
  });

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <h3 className="text-lg font-medium text-gray-900">Detailed Validation Report</h3>
        <p className="text-sm text-gray-500 mt-1">
          Document: {result.name} ({result.type.replace('_', ' ')})
        </p>
      </div>

      {/* Issues Section */}
      <div className="border-b border-gray-200">
        <div 
          className="p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50"
          onClick={() => toggleSection("issues")}
        >
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-alert-dark mr-2" />
            <h4 className="font-medium text-gray-900">Detected Issues ({result.issues.length})</h4>
          </div>
          {expandedSections.includes("issues") ? (
            <ChevronUp className="h-5 w-5 text-gray-400" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-400" />
          )}
        </div>
        
        {expandedSections.includes("issues") && (
          <div className="p-4 bg-gray-50">
            {result.issues.length === 0 ? (
              <p className="text-sm text-gray-500">No issues detected.</p>
            ) : (
              <div className="space-y-3">
                {result.issues.map((issue, index) => (
                  <div 
                    key={index} 
                    className={`p-3 rounded-md ${
                      issue.type === 'error' ? 'bg-alert-light' : 
                      issue.type === 'warning' ? 'bg-warning-light' : 'bg-gray-100'
                    }`}
                  >
                    <div className="flex items-start">
                      {issue.type === 'error' ? (
                        <AlertTriangle className="h-5 w-5 text-alert-dark mr-2 flex-shrink-0" />
                      ) : issue.type === 'warning' ? (
                        <AlertTriangle className="h-5 w-5 text-warning-dark mr-2 flex-shrink-0" />
                      ) : (
                        <Info className="h-5 w-5 text-gray-500 mr-2 flex-shrink-0" />
                      )}
                      <div>
                        <p className="text-sm font-medium text-gray-900">{issue.message}</p>
                        <p className="text-xs text-gray-600 mt-1">{issue.details}</p>
                        {issue.location && (
                          <p className="text-xs text-gray-500 mt-1">Location: {issue.location}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Validation Categories */}
      {Object.entries(groupedValidations).map(([category, checks]) => (
        <div key={category} className="border-b border-gray-200">
          <div 
            className="p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50"
            onClick={() => toggleSection(category)}
          >
            <div className="flex items-center">
              {category === "Data Validation & Consistency" && <BarChart4 className="h-5 w-5 text-brand-600 mr-2" />}
              {category === "Document Integrity & Forensics" && <FileImage className="h-5 w-5 text-indigo-600 mr-2" />}
              {category === "Anomaly & Behavioral Analysis" && <AlertTriangle className="h-5 w-5 text-amber-600 mr-2" />}
              {category === "AI/ML Detection" && <Brain className="h-5 w-5 text-purple-600 mr-2" />}
              {category === "Other Checks" && <FileText className="h-5 w-5 text-gray-600 mr-2" />}
              <h4 className="font-medium text-gray-900">{category} ({checks.length})</h4>
            </div>
            {expandedSections.includes(category) ? (
              <ChevronUp className="h-5 w-5 text-gray-400" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-400" />
            )}
          </div>
          
          {expandedSections.includes(category) && (
            <div className="p-4 bg-gray-50">
              <div className="space-y-3">
                {checks.map((check, index) => (
                  <div key={index} className="bg-white rounded-md border border-gray-200 p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        {getCategoryIcon(check.name)}
                        <span className="ml-2 font-medium text-gray-900">{check.name}</span>
                      </div>
                      <div className="flex items-center">
                        {getStatusIcon(check.status)}
                        <span className={`ml-1 text-sm ${
                          check.status === "passed" ? "text-success-dark" : 
                          check.status === "failed" ? "text-alert-dark" : "text-gray-500"
                        }`}>
                          {check.status.charAt(0).toUpperCase() + check.status.slice(1)}
                        </span>
                      </div>
                    </div>
                    {check.details && (
                      <div className="mt-2 text-sm text-gray-600 border-t border-gray-100 pt-2">
                        {check.details}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Metadata Section */}
      {result.metadata && (
        <div className="border-b border-gray-200">
          <div 
            className="p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50"
            onClick={() => toggleSection("metadata")}
          >
            <div className="flex items-center">
              <Database className="h-5 w-5 text-gray-500 mr-2" />
              <h4 className="font-medium text-gray-900">Document Metadata</h4>
            </div>
            {expandedSections.includes("metadata") ? (
              <ChevronUp className="h-5 w-5 text-gray-400" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-400" />
            )}
          </div>
          
          {expandedSections.includes("metadata") && (
            <div className="p-4 bg-gray-50">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {Object.entries(result.metadata).map(([key, value]) => (
                  <div key={key} className="bg-white rounded-md border border-gray-200 p-3">
                    <p className="text-sm text-gray-500">{key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}</p>
                    <p className="text-sm font-medium text-gray-900 mt-1">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ValidationDetail;