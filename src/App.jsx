import { useState } from "react";
import MainDashboard from "./pages/MainDashboard";
import AuthScreen from "./components/auth/AuthScreen";

export default function App() {
  // Default logged-in user or null for auth
<<<<<<< HEAD
  const [user, setUser] = useState({ name: "Anshul", email: "anshul@meridian.bank", role: "Head of Retention" });
=======
  const [user, setUser] = useState({ name: "Anshul Mehta", email: "anshul.m@meridian.bank", role: "Head of Retention" });
>>>>>>> 9e878aba1ab9205deea900f3c6716300711f862d

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
