import React from "react";
import LoginForm from "./LoginForm";
import Image from "next/image";

export const metadata = {
  title: "Admin Login | Restaurant POS",
  description: "Secure admin access",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex w-full">
      {/* Visual Side (Left) - Hidden on Mobile */}
      <div className="hidden lg:flex w-1/2 relative bg-black items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/login-bg.png"
            alt="Restaurant Ambience"
            fill
            className="object-cover opacity-60"
            priority
          />
        </div>
        <div className="relative z-10 p-12 text-white max-w-lg">
          <h1 className="text-5xl font-bold mb-6 font-display leading-tight">
            Elevate Your <span className="text-amber-500">Dining</span> Experience
          </h1>
          <p className="text-lg text-gray-300 leading-relaxed opacity-90">
            Manage your restaurant with elegance and efficiency. Access the dashboard to oversee orders, reservations, and analytics.
          </p>
        </div>

        {/* Abstract Overlay Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-transparent to-black/40 pointer-events-none" />
      </div>

      {/* Functional Side (Right) */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-neutral-900 relative">

        {/* Mobile Background Fallback */}
        <div className="absolute inset-0 lg:hidden opacity-20">
          <Image
            src="/login-bg.png"
            alt="Background"
            fill
            className="object-cover"
          />
        </div>

        <div className="relative z-10 w-full flex justify-center">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}