// Convenience hook for reading auth state from anywhere
import { useSelector } from "react-redux";

const useAuth = () => {
  const auth = useSelector((state) => state.auth);
  return auth;
};

export default useAuth;
