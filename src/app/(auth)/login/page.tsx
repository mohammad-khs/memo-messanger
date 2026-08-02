"use client";

import Button from "@/components/ui/button";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { toast } from "react-hot-toast";

export default function Page() {
  const [isLoading, setIsLoading] = useState(false);

  async function loginWithProvider(provider: string) {
    try {
      setIsLoading(true);
      await signIn(provider, {
        callbackUrl: "/dashboard",
      });
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center px-6">
      <div className="w-full max-w-md rounded-3xl border bg-white/80 backdrop-blur-xl shadow-2xl p-8">
        {/* Logo */}
        <div className="flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-black text-xl font-bold text-white shadow-lg">
            M
          </div>
        </div>

        {/* Heading */}
        <div className="mt-6 text-center">
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome Back
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Sign in to continue to your dashboard
          </p>
        </div>

        {/* Divider */}
        <div className="my-8 flex items-center gap-4">
          <div className="h-px flex-1 bg-gray-200" />
          <span className="text-xs uppercase tracking-wider text-gray-400">
            Continue with
          </span>
          <div className="h-px flex-1 bg-gray-200" />
        </div>

        {/* Buttons */}
        <div className="space-y-4">
          <Button
            isLoading={isLoading}
            onClick={() => loginWithProvider("google")}
            className="w-full h-12 rounded-xl border border-gray-200 bg-white text-gray-900 hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            {/* {!isLoading && (
              // <GoogleIcon className="mr-3 h-5 w-5" />
            )} */}
            Continue with Google
          </Button>

          <Button
            isLoading={isLoading}
            onClick={() => loginWithProvider("github")}
            className="w-full h-12 rounded-xl border border-gray-200 bg-white text-gray-900 hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            {/* {!isLoading && (
              <GithubIcon className="mr-3 h-5 w-5" />
            )} */}
            Continue with GitHub
          </Button>
        </div>

        <p className="mt-8 text-center text-xs text-gray-500">
          By continuing you agree to our{" "}
          <span className="font-medium text-black cursor-pointer">
            Terms
          </span>{" "}
          and{" "}
          <span className="font-medium text-black cursor-pointer">
            Privacy Policy
          </span>
          .
        </p>
      </div>
    </main>
  );
}