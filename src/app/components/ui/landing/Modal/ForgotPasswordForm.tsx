import React, { useState } from "react";
import { Message } from "iconsax-reactjs";

interface ForgotPasswordFormProps {
  onSwitchToSignin: () => void;
  onSubmit: (data: { email: string }) => void;
}

const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({
  onSwitchToSignin,
  onSubmit,
}) => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ email });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Reset Password
        </h3>
        <p className="text-gray-600 text-sm">
          Enter your email address and we&apos;ll send you a link to reset your
          password.
        </p>
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
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3474c0] focus:border-transparent"
            placeholder="Enter your email"
            required
          />
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-[#3474c0] text-white py-3 rounded-lg font-semibold hover:bg-[#2a5a9e] transition-colors"
      >
        Send Reset Link
      </button>

      <div className="text-center">
        <button
          type="button"
          onClick={onSwitchToSignin}
          className="text-[#3474c0] font-semibold hover:underline"
        >
          Back to Sign In
        </button>
      </div>
    </form>
  );
};

export default ForgotPasswordForm;
