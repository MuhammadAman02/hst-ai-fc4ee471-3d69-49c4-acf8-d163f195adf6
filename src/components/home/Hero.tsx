import { ArrowRight, FileCheck, Shield, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <div className="relative overflow-hidden bg-white">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmMGY5ZmYiIGZpbGwtb3BhY2l0eT0iMC40Ij48cGF0aCBkPSJNMzYgMzRjMC0yLjIgMS44LTQgNC00czQgMS44IDQgNC0xLjggNC00IDQtNC0xLjgtNC00eiIvPjwvZz48L2c+PC9zdmc+')] opacity-30"></div>
      <div className="relative pt-16 pb-24 sm:pt-24 sm:pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
              <h1>
                <span className="block text-base font-semibold text-brand-600 tracking-wide uppercase">
                  HST Solutions
                </span>
                <span className="mt-1 block text-4xl tracking-tight font-extrabold sm:text-5xl xl:text-6xl">
                  <span className="block gradient-heading">Secure Document Validation</span>
                </span>
              </h1>
              <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
                Helping Credit Unions identify and prevent fraud during customer verification with advanced document validation technology.
              </p>
              <div className="mt-8 sm:max-w-lg sm:mx-auto sm:text-center lg:text-left lg:mx-0">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Link to="/upload" className="btn-primary flex items-center justify-center sm:justify-start">
                    <span>Upload Documents</span>
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                  <a href="#features" className="btn-secondary flex items-center justify-center sm:justify-start">
                    Learn More
                  </a>
                </div>
              </div>
            </div>
            <div className="mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6 lg:flex lg:items-center">
              <div className="relative mx-auto w-full rounded-lg shadow-lg lg:max-w-md">
                <div className="relative block w-full bg-white rounded-lg overflow-hidden">
                  <div className="p-8 flex flex-col items-center">
                    <div className="flex space-x-4 mb-6">
                      <div className="w-16 h-16 bg-brand-50 rounded-full flex items-center justify-center">
                        <FileCheck className="h-8 w-8 text-brand-600" />
                      </div>
                      <div className="w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center">
                        <Shield className="h-8 w-8 text-teal-600" />
                      </div>
                      <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center">
                        <AlertTriangle className="h-8 w-8 text-red-600" />
                      </div>
                    </div>
                    
                    {/* Document validation visualization */}
                    <div className="w-full border border-gray-200 rounded-md p-3 mb-4 bg-gray-50">
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center">
                          <FileCheck className="h-4 w-4 text-brand-600 mr-2" />
                          <span className="text-sm font-medium">Bank Statement</span>
                        </div>
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Verified</span>
                      </div>
                      <div className="space-y-1">
                        <div className="h-2 bg-green-200 rounded-full w-full"></div>
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>Format</span>
                          <span>100%</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="w-full border border-gray-200 rounded-md p-3 mb-4 bg-gray-50">
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center">
                          <FileCheck className="h-4 w-4 text-brand-600 mr-2" />
                          <span className="text-sm font-medium">Payslip</span>
                        </div>
                        <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">Warning</span>
                      </div>
                      <div className="space-y-1">
                        <div className="h-2 bg-yellow-200 rounded-full w-3/4"></div>
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>Consistency</span>
                          <span>75%</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="w-full border border-gray-200 rounded-md p-3 mb-4 bg-gray-50">
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center">
                          <FileCheck className="h-4 w-4 text-brand-600 mr-2" />
                          <span className="text-sm font-medium">ID Document</span>
                        </div>
                        <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">Alert</span>
                      </div>
                      <div className="space-y-1">
                        <div className="h-2 bg-red-200 rounded-full w-1/2"></div>
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>Authenticity</span>
                          <span>50%</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-2 flex justify-between w-full">
                      <div className="h-10 w-24 bg-green-100 rounded-md flex items-center justify-center">
                        <span className="text-sm font-medium text-green-800">Valid</span>
                      </div>
                      <div className="h-10 w-24 bg-red-100 rounded-md flex items-center justify-center">
                        <span className="text-sm font-medium text-red-800">Invalid</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;