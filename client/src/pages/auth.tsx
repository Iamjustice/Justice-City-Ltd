import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth";

export default function AuthPage() {
  const [location, setLocation] = useLocation();
  const [isSignUp, setIsSignUp] = useState(true);
  const { login } = useAuth();

  useEffect(() => {
    // Check if we should start in login mode
    const params = new URLSearchParams(window.location.search);
    if (params.get("mode") === "login") {
      setIsSignUp(false);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submit clicked, isSignUp:", isSignUp);
    
    // Call the login function from AuthContext to update global state
    login(isSignUp ? "buyer" : "buyer");

    if (isSignUp) {
      setLocation("/verify");
    } else {
      console.log("Attempting to go to marketplace...");
      // Marketplace is the root page (Home)
      setLocation("/");
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 bg-slate-50/50">
      <Card className="w-full max-w-md shadow-xl border-slate-200">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-600/20">
              <ShieldCheck className="w-8 h-8" />
            </div>
          </div>
          <CardTitle className="text-2xl font-display font-bold">
            {isSignUp ? "Create an account" : "Welcome back"}
          </CardTitle>
          <CardDescription>
            {isSignUp 
              ? "Join Justice City to start your verified real estate journey" 
              : "Enter your credentials to access your account"}
          </CardDescription>
        </CardHeader>
        <div className="p-1 px-6 flex justify-center">
          <div className="flex bg-slate-100 p-1 rounded-lg w-full max-w-xs">
            <button
              onClick={() => setIsSignUp(true)}
              className={cn(
                "flex-1 py-1.5 text-sm font-semibold rounded-md transition-all",
                isSignUp ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
              )}
            >
              Sign Up
            </button>
            <button
              onClick={() => setIsSignUp(false)}
              className={cn(
                "flex-1 py-1.5 text-sm font-semibold rounded-md transition-all",
                !isSignUp ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
              )}
            >
              Log In
            </button>
          </div>
        </div>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {isSignUp && (
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" placeholder="John Doe" required />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="john@example.com" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" required />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 h-11 text-base font-semibold">
              {isSignUp ? "Sign Up" : "Log In"}
            </Button>
            <div className="text-sm text-center text-slate-500">
              {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
              <button 
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className={cn(
                  "font-semibold hover:underline",
                  isSignUp ? "text-blue-600" : "text-blue-600"
                )}
              >
                {isSignUp ? "Log In" : "Sign Up"}
              </button>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
