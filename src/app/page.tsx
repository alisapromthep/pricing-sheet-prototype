"use client";
import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, you would validate the password here (e.g., against an environment variable or API)
    // For this beta, we'll use a simple client-side check.
    if (password === "redhouse2024") {
      // Example password
      window.location.href = "/hoyacalculator"; // Redirect on success
    } else {
      setError("Incorrect password. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] bg-white text-black p-4">
      {/* Assuming your header takes up some height, min-h-[calc(100vh-header-height)] ensures content is centered below it */}
      {/* For example, if your header is 64px tall, use min-h-[calc(100vh-64px)] */}

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
          <input
            type="password"
            placeholder="Enter password to access"
            className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rv-navy"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError(""); // Clear error on new input
            }}
          />
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
