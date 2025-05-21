import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import DocumentUpload from "../components/upload/DocumentUpload";

const Upload = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow bg-gray-50">
        <DocumentUpload />
      </main>
      <Footer />
    </div>
  );
};

export default Upload;