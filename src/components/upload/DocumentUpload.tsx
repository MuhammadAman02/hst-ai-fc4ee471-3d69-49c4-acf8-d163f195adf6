import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, X, FileText, Check, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { documentValidationService } from "../../services/documentValidation";
import { useValidation } from "../../context/ValidationContext";

type FileWithPreview = {
  file: File;
  preview: string | null;
  type: string;
};

const DocumentUpload = () => {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();
  const { addValidationResult, clearValidationResults } = useValidation();

  const documentTypes = [
    { value: "bank_statement", label: "Bank Statement" },
    { value: "payslip", label: "Payslip" },
    { value: "irp", label: "Irish Residency Permit (IRP)" },
    { value: "ppsn", label: "Personal Public Service Number (PPSN)" },
    { value: "tax_document", label: "Tax Document" },
    { value: "id_document", label: "ID Document" },
  ];

  const onDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const onDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files).map(file => ({
        file,
        preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null,
        type: ""
      }));
      
      setFiles(prevFiles => [...prevFiles, ...newFiles]);
    }
  }, []);

  const onFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files).map(file => ({
        file,
        preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null,
        type: ""
      }));
      
      setFiles(prevFiles => [...prevFiles, ...newFiles]);
    }
  }, []);

  const removeFile = useCallback((index: number) => {
    setFiles(prevFiles => {
      const newFiles = [...prevFiles];
      if (newFiles[index].preview) {
        URL.revokeObjectURL(newFiles[index].preview!);
      }
      newFiles.splice(index, 1);
      return newFiles;
    });
  }, []);

  const setFileType = useCallback((index: number, type: string) => {
    setFiles(prevFiles => {
      const newFiles = [...prevFiles];
      newFiles[index] = { ...newFiles[index], type };
      return newFiles;
    });
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate that all files have a type
    const missingTypes = files.some(file => !file.type);
    if (missingTypes) {
      toast.error("Please select a document type for all files");
      return;
    }

    if (files.length === 0) {
      toast.error("Please upload at least one document");
      return;
    }

    setIsUploading(true);
    clearValidationResults(); // Clear previous results
    
    try {
      // Process each file based on its type
      const validationPromises = files.map(async (fileWithType) => {
        if (fileWithType.type === "bank_statement") {
          // Use our bank statement validation service
          return await documentValidationService.validateBankStatement(fileWithType.file);
        } else {
          // For other document types, return a placeholder result
          // In a real app, you would have specific validation for each document type
          return {
            id: `doc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            name: fileWithType.file.name,
            type: fileWithType.type,
            status: "pending" as const,
            score: 0,
            issues: [],
            validations: [
              { name: "Document format", status: "pending" as const }
            ]
          };
        }
      });
      
      // Wait for all validations to complete
      const results = await Promise.all(validationPromises);
      
      // Add each result to the context
      results.forEach(result => {
        addValidationResult(result);
      });
      
      // Show success message
      toast.success(`Validated ${results.length} document(s) successfully`);
      
      // Navigate to results page
      navigate("/results");
    } catch (error) {
      console.error("Validation error:", error);
      toast.error("An error occurred during document validation");
    } finally {
      setIsUploading(false);
    }
  }, [files, navigate, addValidationResult, clearValidationResults]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white shadow-sm rounded-lg p-6 border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Upload Documents for Validation</h2>
        
        <form onSubmit={handleSubmit}>
          <div 
            className={`border-2 border-dashed rounded-lg p-12 text-center ${
              isDragging ? "border-brand-500 bg-brand-50" : "border-gray-300 hover:border-brand-500"
            } transition-colors duration-200 cursor-pointer`}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            onClick={() => document.getElementById("file-upload")?.click()}
          >
            <input
              id="file-upload"
              type="file"
              multiple
              className="hidden"
              onChange={onFileChange}
            />
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm font-medium text-gray-900">
              Drag and drop files here, or click to browse
            </p>
            <p className="mt-1 text-xs text-gray-500">
              Supported formats: PDF, JPG, PNG (Max 10MB per file)
            </p>
          </div>

          {files.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-3">Uploaded Documents</h3>
              <ul className="divide-y divide-gray-200">
                {files.map((file, index) => (
                  <li key={index} className="py-4 flex items-center justify-between">
                    <div className="flex items-center">
                      {file.preview ? (
                        <img 
                          src={file.preview} 
                          alt={file.file.name}
                          className="h-16 w-16 object-cover rounded border border-gray-200"
                        />
                      ) : (
                        <div className="h-16 w-16 bg-gray-100 rounded flex items-center justify-center">
                          <FileText className="h-8 w-8 text-gray-400" />
                        </div>
                      )}
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-900 truncate max-w-xs">
                          {file.file.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {(file.file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                        <select
                          value={file.type}
                          onChange={(e) => setFileType(index, e.target.value)}
                          className="mt-1 block w-full pl-3 pr-10 py-1 text-xs border-gray-300 focus:outline-none focus:ring-brand-500 focus:border-brand-500 rounded-md"
                        >
                          <option value="">Select document type</option>
                          {documentTypes.map((type) => (
                            <option key={type.value} value={type.value}>
                              {type.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="ml-4 flex-shrink-0 p-1 rounded-full text-gray-400 hover:text-gray-500"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-8 flex justify-end">
            <button
              type="submit"
              disabled={isUploading || files.length === 0}
              className={`btn-primary ${
                isUploading || files.length === 0 ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isUploading ? "Validating..." : "Validate Documents"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DocumentUpload;