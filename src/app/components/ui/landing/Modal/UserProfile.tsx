import React from "react";
import { User } from "iconsax-reactjs";
import { useAuth } from "@/app/contexts/AuthContext";

interface UserProfileProps {
  onSignOut?: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ onSignOut }) => {
  const { user, logout } = useAuth();

  const displayName = user ? `${user.firstname} ${user.lastname}` : "User";
  const displayEmail = user?.email || "user@example.com";

  const handleSignOut = () => {
    logout();
    if (onSignOut) {
      onSignOut();
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-20 h-20 bg-[#3474c0] rounded-full flex items-center justify-center mx-auto mb-4">
          <User size={32} color="white" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">{displayName}</h3>
        <p className="text-gray-600">{displayEmail}</p>
      </div>

      <div className="space-y-3">
        <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
          <div className="font-medium text-gray-900">My Orders</div>
          <div className="text-sm text-gray-600">View your order history</div>
        </button>

        <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
          <div className="font-medium text-gray-900">Account Settings</div>
          <div className="text-sm text-gray-600">
            Manage your account details
          </div>
        </button>

        <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
          <div className="font-medium text-gray-900">Addresses</div>
          <div className="text-sm text-gray-600">Manage delivery addresses</div>
        </button>

        <button
          onClick={onSignOut}
          className="w-full text-left p-3 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
        >
          <div className="font-medium">Sign Out</div>
          <div className="text-sm">Log out of your account</div>
        </button>
      </div>
    </div>
  );
};

export default UserProfile;
