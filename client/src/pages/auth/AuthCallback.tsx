import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { setUser } from "@/redux/features/authSlice";

const AuthCallback = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { token } = useParams();
  useEffect(() => {
    if (token) {
      try {
        const decoded: {
          email: string;
          fullName: string;
          profileImage: string;
          username: string;
          id: string;
          iat: number;
          exp: number;
        } = jwtDecode(token);

        localStorage.setItem("token", JSON.stringify(token));
      toast.success("Google login successful");

        dispatch(
          setUser({
               id: decoded.id,
            email: decoded.email,
            fullName: decoded.fullName,
            profileImage: decoded.profileImage,
            username: decoded.username || decoded.email.split("@")[0],
            token,
            rememberMe: true,
          })
        );
        navigate("/dashboard");
      } catch (err) {
        console.log("error: ", err);
       toast.error("Invalid token");
        navigate("/");
      }
    } else {
      toast.error("No token provided");
      navigate("/");
    }
  }, [navigate, token]);

  return <div className="text-center mt-10 text-gray-600">Redirecting...</div>;
};

export default AuthCallback;