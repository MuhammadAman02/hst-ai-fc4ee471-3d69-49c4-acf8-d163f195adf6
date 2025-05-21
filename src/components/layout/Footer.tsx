import { Shield } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex items-center">
            <Shield className="h-6 w-6 text-brand-600" />
            <span className="ml-2 text-lg font-bold text-gray-900">HST Validator</span>
          </div>
          <div className="mt-4 md:mt-0">
            <p className="text-sm text-gray-500">
              &copy; {currentYear} HST Solutions. All rights reserved.
            </p>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-200 pt-8 md:flex md:items-center md:justify-between">
          <div className="flex space-x-6 md:order-2">
            <a href="#" className="text-gray-400 hover:text-brand-600">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-400 hover:text-brand-600">
              Terms of Service
            </a>
            <a href="#" className="text-gray-400 hover:text-brand-600">
              Contact
            </a>
          </div>
          <p className="mt-8 text-sm text-gray-400 md:mt-0 md:order-1">
            Secure document validation for Credit Unions
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;