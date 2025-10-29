import React, { useState } from "react";
import { Eye, EyeSlash, Message, Lock } from "iconsax-reactjs";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

interface SignInFormProps {
  onSwitchToSignup: () => void;
  onSwitchToForgotPassword: () => void;
  onSubmit: (data: { email: string; password: string }) => void;
}

const SignInForm: React.FC<SignInFormProps> = ({
  onSwitchToSignup,
  onSwitchToForgotPassword,
  onSubmit,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  const initialValues = {
    email: "",
    password: "",
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
                placeholder="Enter your password"
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

          <div className="flex justify-end">
            <button
              type="button"
              onClick={onSwitchToForgotPassword}
              className="text-sm text-[#3474c0] hover:underline"
            >
              Forgot Password?
            </button>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#3474c0] text-white py-3 rounded-lg font-semibold hover:bg-[#2a5a9e] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Signing In..." : "Sign In"}
          </button>

          <div className="text-center">
            <span className="text-gray-600">Don&apos;t have an account? </span>
            <button
              type="button"
              onClick={onSwitchToSignup}
              className="text-[#3474c0] font-semibold hover:underline"
            >
              Sign Up
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default SignInForm;
