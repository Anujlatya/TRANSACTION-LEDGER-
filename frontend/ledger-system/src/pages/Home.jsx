import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import SignupModal from "../components/auth/SignupModal";
import Navbar from "../layouts/Navbar";
import Hero from "../components/Hero";
import LoginModal from "../components/auth/LoginModal";

export default function Home() {
  const [loginOpen, setLoginOpen] = useState(false);
  const [signupOpen, setSignupOpen] = useState(false);

  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      if (user.role === "ADMIN") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }
    }
  }, [user, loading, navigate]);

  return (

    <div className="bg-[#050816] min-h-screen overflow-x-hidden">

      <Navbar
        openLogin={() => setLoginOpen(true)}
        openSignup={() => setSignupOpen(true)}
      />

      <Hero />

      {/* Footer will come later */}

      {/* Login Modal */}

      <LoginModal
        isOpen={loginOpen}
        onClose={() => setLoginOpen(false)}
        onSignup={() => {
          setLoginOpen(false);

          setTimeout(() => {
            setSignupOpen(true);
          }, 250);
        }}
      />

      <SignupModal
        isOpen={signupOpen}
        onClose={() => setSignupOpen(false)}
        onLogin={() => {
          console.log("2. Home onLogin called");

          setSignupOpen(false);
          setLoginOpen(true);
        }}
      />



    </div>

  );

}