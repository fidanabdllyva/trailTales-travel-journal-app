import { FaCheck } from "react-icons/fa";
import { Link, useSearchParams } from "react-router-dom";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const message = searchParams.get("message");

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md text-center border border-gray-200">
        <h2 className="text-2xl font-semibold flex items-center gap-2 text-gray-800 mb-4">
          {message} 
          <span className="text-green-500"><FaCheck/></span>
        </h2>
        <p className="text-gray-600 mb-6">
          Your email has been successfully verified. You can now log in to your account.
        </p>
        <Link
          to="/"
          className="inline-block w-full bg-gradient-to-r from-cyan-400 via-purple-500 to-green-300 text-white font-medium py-2 px-6 rounded-lg transition hover:opacity-90"
        >
          Go Back to Login
        </Link>
      </div>
    </div>
  );
};

export default VerifyEmail;
