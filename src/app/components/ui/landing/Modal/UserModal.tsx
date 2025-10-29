import React, { useState, useEffect } from "react";
import { CloseCircle, ArrowLeft } from "iconsax-reactjs";
import axios from "axios";
import { toast } from "react-toastify";
import SignInForm from "./SignInForm";
import SignUpForm from "./SignUpForm";
import UserProfile from "./UserProfile";
import ForgotPasswordForm from "./ForgotPasswordForm";
import { useAuth } from "@/app/contexts/AuthContext";

interface UserModalProps {
  handleClose: () => void;
  animateModal: boolean;
}

type ModalState = "signin" | "signup" | "profile" | "forgotpassword";

const UserModal: React.FC<UserModalProps> = ({ handleClose, animateModal }) => {
  const { user, isAuthenticated, login, logout, isLoading } = useAuth();
  const [currentState, setCurrentState] = useState<ModalState>("signin");
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Set initial state based on authentication status
  useEffect(() => {
    if (!isLoading) {
      setCurrentState(isAuthenticated ? "profile" : "signin");
    }
  }, [isAuthenticated, isLoading]);

  // Form handlers
  const handleSigninSubmit = async (data: {
    email: string;
    password: string;
  }) => {
    try {
      const response = await axios.post("/api/auth/login", data);

      // Store user data in auth context
      login(response.data.user);
      toast.success("Login successful!");
      changeState("profile");
    } catch (error: any) {
      console.error("Sign in error:", error);
      const errorMessage =
        error.response?.data?.error || "An error occurred during sign in.";
      toast.error(errorMessage);
    }
  };

  const handleSignupSubmit = async (data: {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
  }) => {
    try {
      const response = await axios.post("/api/auth/signup", data);

      toast.success("Account created successfully! Please sign in.");
      changeState("signin");
    } catch (error: any) {
      console.error("Sign up error:", error);
      const errorMessage =
        error.response?.data?.error || "An error occurred during sign up.";
      toast.error(errorMessage);
    }
  };

  const handleForgotSubmit = (data: { email: string }) => {
    console.log("Forgot password:", data);
    // Handle forgot password logic here
  };

  const handleSignOut = () => {
    logout();
    toast.success("Signed out successfully!");
    changeState("signin");
  };

  const changeState = (newState: ModalState) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentState(newState);
      setIsTransitioning(false);
    }, 150);
  };

  const getTitle = () => {
    switch (currentState) {
      case "signin":
        return "Sign In";
      case "signup":
        return "Create Account";
      case "profile":
        return "Your Profile";
      case "forgotpassword":
        return "Reset Password";
      default:
        return "Account";
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex font-poppins">
      {/* Overlay */}
      <div
        className={`fixed inset-0 transition-opacity duration-300 ${
          animateModal
            ? "bg-[#D5E8FA]/30 backdrop-blur-sm"
            : "bg-transparent backdrop-blur-0"
        }`}
        onClick={handleClose}
      ></div>

      {/* Sidebar */}
      <div
        className={`fixed right-0 top-0 h-full bg-white w-[350px] md:w-[400px] shadow-lg p-6 overflow-y-auto z-10 transform transition-transform duration-300 ease-in-out ${
          animateModal ? "translate-x-0 opacity-100" : "translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center mb-6 w-full">
          <div className="flex items-center gap-3">
            {currentState !== "signin" && currentState !== "profile" && (
              <button
                onClick={() => changeState("signin")}
                className="p-1 rounded-full hover:bg-gray-200 transition duration-200"
              >
                <ArrowLeft size={20} color="#3474c0" />
              </button>
            )}
            <h2 className="text-xl font-semibold text-[#3474c0]">
              {getTitle()}
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="p-1 rounded-full hover:bg-gray-200 transition duration-200"
            aria-label="Close"
          >
            <CloseCircle color="#3474c0" size={24} />
          </button>
        </div>

        <div
          className={`transition-opacity duration-300 ${
            isTransitioning ? "opacity-0" : "opacity-100"
          }`}
        >
          {currentState === "signin" && (
            <SignInForm
              onSwitchToSignup={() => changeState("signup")}
              onSwitchToForgotPassword={() => changeState("forgotpassword")}
              onSubmit={handleSigninSubmit}
            />
          )}
          {currentState === "signup" && (
            <SignUpForm
              onSwitchToSignin={() => changeState("signin")}
              onSubmit={handleSignupSubmit}
            />
          )}
          {currentState === "profile" && (
            <UserProfile onSignOut={handleSignOut} />
          )}
          {currentState === "forgotpassword" && (
            <ForgotPasswordForm
              onSwitchToSignin={() => changeState("signin")}
              onSubmit={handleForgotSubmit}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default UserModal;
