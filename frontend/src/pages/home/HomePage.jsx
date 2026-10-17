import { useAuthStore } from "../../store/authUser";
import AuthScreen from "./AuthScreen";
import HomeScreen from "./HomeScreen";

function HomePage() {
  const { user } = useAuthStore();
  return user ? <HomeScreen /> : <AuthScreen />;
}

export default HomePage;
