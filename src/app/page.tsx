"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { LuEye, LuEyeClosed } from "react-icons/lu";

export default function Home() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      setError("Please enter a password.");
      return;
    }
    // The middleware will then handle the validation and redirection.
    router.push(`/?password=${encodeURIComponent(password)}`);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] bg-white text-black p-4">
      <h1 className="text-4xl md:text-5xl font-bold mb-8 text-rv-navy">
        Welcome to RedHouse Vision Center
      </h1>

      <div className="flex flex-col items-center justify-center bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <p className="text-lg mb-4 text-center">
          This pricing tool is designed exclusively for RedHouse Vision Center.
        </p>

        <form
          onSubmit={handlePasswordSubmit}
          className="w-full flex flex-col items-center"
        >
          <div className="relative w-full mb-4">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter password to access"
              className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rv-navy"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(""); // Clear error on new input
              }}
            />
            <button
              type="button" // Important: type="button" to prevent form submission
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/3 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none" // Positioning and styling for the icon button
              aria-label={showPassword ? "Hide password" : "Show password"} // Accessibility
            >
              {showPassword ? <LuEyeClosed size={20} /> : <LuEye size={20} />}
            </button>
          </div>
          <button
            type="submit"
            className="bg-rv-navy text-white px-6 py-3 rounded-md hover:bg-rv-red transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-rv-navy focus:ring-offset-2"
          >
            Access Calculator
          </button>
          {error && <p className="text-rv-red mt-2">{error}</p>}
        </form>

        <p className="mt-6 text-sm text-gray-600 text-center">Beta test.</p>
      </div>
    </div>
  );
}
