import { useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import animationData from "../../../public/404.json"

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center max-h-screen bg-gray-100 text-center p-4">
      <Lottie
        animationData={animationData}
        loop
        autoplay
        style={{ width: 700, height: 700 }}
      />
      <button
        className="mb-3 px-6 py-2 bg-[#b5a5f9] cursor-pointer text-white rounded hover:bg-purple-500 transition"
        onClick={() => navigate("/")}
      >
        Go Home
      </button>
      <p className="mt-2 text-gray-600">Oops! The page you’re looking for doesn’t exist.</p>

    </div>
  );
};

export default NotFoundPage;
