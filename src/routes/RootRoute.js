import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const RootRoute = () => {
  const token = useSelector((state) => state.auth.token);
  console.log(token);

  if (token) {
    return <Navigate to="/dashboard" />;
  } else {
    return <Navigate to="/login" />;
  }
};

export default RootRoute;
