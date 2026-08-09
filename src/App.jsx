import { useState } from "react";
import MainDashboard from "./pages/MainDashboard";
import AuthScreen from "./components/auth/AuthScreen";

export default function App() {
  // Default logged-in user or null for auth
  const [user, setUser] = useState({ name: "Anshul Mehta", email: "anshul.m@meridian.bank", role: "Head of Retention" });

  if (!user) {
    return <AuthScreen onLogin={(loggedInUser) => setUser(loggedInUser)} />;
  }

  return (
    <MainDashboard
      user={user}
      onLogout={() => setUser(null)}
    />
  );
}
