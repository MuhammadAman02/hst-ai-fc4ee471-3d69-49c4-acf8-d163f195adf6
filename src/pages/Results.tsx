import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import ValidationResults from "../components/validation/ValidationResults";

const Results = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow bg-gray-50">
        <ValidationResults />
      </main>
      <Footer />
    </div>
  );
};

export default Results;