import React, { useState } from "react";
import { Eye, EyeSlash, User, Message, Lock } from "iconsax-reactjs";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

interface SignUpFormProps {
  onSwitchToSignin: () => void;
  onSubmit: (data: {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
  }) => void;
}

const SignUpForm: React.FC<SignUpFormProps> = ({
  onSwitchToSignin,
  onSubmit,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validationSchema = Yup.object({
    name: Yup.string()
      .min(2, "Name must be at least 2 characters")
      .required("Full name is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      )
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords must match")
      .required("Please confirm your password"),
  });

  const initialValues = {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ isSubmitting }) => (
        <Form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <div className="relative">
              <User
                size={20}
                color="#9CA3AF"
                className="absolute left-3 top-1/2 transform -translate-y-1/2"
              />
              <Field
                type="text"
                name="name"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3474c0] focus:border-transparent"
                placeholder="Enter your full name"
              />
            </div>
            <ErrorMessage
              name="name"
              component="div"
              className="text-red-500 text-sm mt-1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Message
                size={20}
                color="#9CA3AF"
                className="absolute left-3 top-1/2 transform -translate-y-1/2"
              />
              <Field
                type="email"
                name="email"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3474c0] focus:border-transparent"
                placeholder="Enter your email"
              />
            </div>
            <ErrorMessage
              name="email"
              component="div"
              className="text-red-500 text-sm mt-1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock
                size={20}
                color="#9CA3AF"
                className="absolute left-3 top-1/2 transform -translate-y-1/2"
              />
              <Field
                type={showPassword ? "text" : "password"}
                name="password"
                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3474c0] focus:border-transparent"
                placeholder="Create a password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                {showPassword ? (
                  <EyeSlash size={20} color="#9CA3AF" />
                ) : (
                  <Eye size={20} color="#9CA3AF" />
                )}
              </button>
            </div>
            <ErrorMessage
              name="password"
              component="div"
              className="text-red-500 text-sm mt-1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <Lock
                size={20}
                color="#9CA3AF"
                className="absolute left-3 top-1/2 transform -translate-y-1/2"
              />
              <Field
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3474c0] focus:border-transparent"
                placeholder="Confirm your password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                {showConfirmPassword ? (
                  <EyeSlash size={20} color="#9CA3AF" />
                ) : (
                  <Eye size={20} color="#9CA3AF" />
                )}
              </button>
            </div>
            <ErrorMessage
              name="confirmPassword"
              component="div"
              className="text-red-500 text-sm mt-1"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#3474c0] text-white py-3 rounded-lg font-semibold hover:bg-[#2a5a9e] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Creating Account..." : "Create Account"}
          </button>

          <div className="text-center">
            <span className="text-gray-600">Already have an account? </span>
            <button
              type="button"
              onClick={onSwitchToSignin}
              className="text-[#3474c0] font-semibold hover:underline"
            >
              Sign In
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default SignUpForm;
