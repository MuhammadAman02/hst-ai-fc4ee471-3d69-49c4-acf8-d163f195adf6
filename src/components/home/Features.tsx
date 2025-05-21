import { 
  FileCheck, 
  Shield, 
  AlertTriangle, 
  Database, 
  Search, 
  BarChart4, 
  FileText, 
  CheckCircle2, 
  Fingerprint 
} from "lucide-react";

const features = [
  {
    name: "Document Authenticity",
    description: "Verify if documents are genuinely issued by legitimate authorities through template matching and format validation.",
    icon: FileCheck,
    color: "text-brand-600",
    bgColor: "bg-brand-50"
  },
  {
    name: "Content Consistency",
    description: "Ensure data within documents is internally consistent with checks for matching totals, dates, and cross-field consistency.",
    icon: CheckCircle2,
    color: "text-teal-600",
    bgColor: "bg-teal-50"
  },
  {
    name: "Cross-Document Verification",
    description: "Validate that information aligns across multiple sources like payslips, bank statements, and identification documents.",
    icon: Search,
    color: "text-indigo-600",
    bgColor: "bg-indigo-50"
  },
  {
    name: "Regulatory Validation",
    description: "Confirm documents follow structural and regulatory requirements set by official entities for formats like PPS numbers and IBANs.",
    icon: Shield,
    color: "text-purple-600",
    bgColor: "bg-purple-50"
  },
  {
    name: "Behavioral Analysis",
    description: "Apply contextual pattern-based detection to catch fraud based on historical trends and unusual activities.",
    icon: BarChart4,
    color: "text-amber-600",
    bgColor: "bg-amber-50"
  },
  {
    name: "Fraud Detection",
    description: "Identify potential red flags such as manipulated logos, photo mismatches, and falsified information.",
    icon: AlertTriangle,
    color: "text-red-600",
    bgColor: "bg-red-50"
  },
];

const Features = () => {
  return (
    <div id="features" className="bg-white py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base text-brand-600 font-semibold tracking-wide uppercase">Features</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Comprehensive Document Validation
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            Our platform provides multiple layers of validation to ensure document authenticity and detect potential fraud.
          </p>
        </div>

        <div className="mt-16">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.name} className="pt-6 card-hover">
                <div className="flow-root bg-white rounded-lg px-6 pb-8 border border-gray-100">
                  <div className="-mt-6">
                    <div>
                      <span className={`inline-flex items-center justify-center p-3 rounded-md shadow-lg ${feature.bgColor}`}>
                        <feature.icon className={`h-6 w-6 ${feature.color}`} aria-hidden="true" />
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">{feature.name}</h3>
                    <p className="mt-5 text-base text-gray-500">{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features;