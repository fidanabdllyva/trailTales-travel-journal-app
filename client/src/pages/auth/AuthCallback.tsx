import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
// import { useDispatch } from "react-redux";
// import { setUser } from "../../features/userSlice";

const AuthCallback = () => {
  const navigate = useNavigate();
//   const dispatch = useDispatch();
  const { token } = useParams();
  useEffect(() => {
    if (token) {
      try {
        const decoded: {
          role: string;
          email: string;
          fullName: string;
          profileImage: string;
          id: string;
          iat: number;
          exp: number;
        } = jwtDecode(token);

        localStorage.setItem("token", JSON.stringify(token));
        // enqueueSnackbar("Google login successful", {
        //   variant: "success",
        //   autoHideDuration: 2000,
        //   anchorOrigin: {
        //     horizontal: "right",
        //     vertical: "bottom",
        //   },
        // });

        // dispatch(
        //   setUser({
        //     id: decoded.id,
        //     email: decoded.email,
        //     role: decoded.role,
        //     fullName: decoded.fullName,
        //     profileImage: decoded.profileImage,
        //     token: token,
        //   })
        // );
        navigate("/dashboard");
      } catch (err) {
        console.log("error: ", err);
        // enqueueSnackbar("Invalid token", {
        //   variant: "error",
        //   autoHideDuration: 2000,
        //   anchorOrigin: {
        //     vertical: "bottom",
        //     horizontal: "right",
        //   },
        // });
        navigate("/");
      }
    } else {
    //   enqueueSnackbar("Token not found", {
    //     variant: "error",
    //     autoHideDuration: 2000,
    //     anchorOrigin: {
    //       vertical: "bottom",
    //       horizontal: "right",
    //     },
    //   });
      navigate("/");
    }
  }, [navigate, token]);

  return <div className="text-center mt-10 text-gray-600">Redirecting...</div>;
};

export default AuthCallback;