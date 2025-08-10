import type { RootState } from "@/redux/store";
import { useSelector} from "react-redux";
import { Navigate } from "react-router-dom";

const RedirectIfAuth = ({ children }: { children: React.ReactNode }) => {

  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

 if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />; 
  }

  return <>{children}</>;

};

export default RedirectIfAuth;
