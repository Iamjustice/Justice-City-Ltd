import { createContext, useContext, useState, ReactNode } from "react";
import { useToast } from "@/hooks/use-toast";
import { submitVerification } from "@/lib/verification";

type UserRole = "buyer" | "seller" | "agent" | "admin" | null;

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isVerified: boolean;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (role?: UserRole) => void;
  logout: () => void;
  verifyIdentity: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    // Initialize from localStorage for persistence in mockup mode
    const saved = localStorage.getItem("justice_city_user");
    return saved ? JSON.parse(saved) : null;
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const login = (role: UserRole = "buyer") => {
    setIsLoading(true);
    const userData = {
      id: "usr_123",
      name: role === "admin" ? "Justice Admin" : role === "agent" ? "Agent Alex" : "Alex Doe",
      email: `${role}@example.com`,
      role,
      isVerified: role === "admin", // Admins are verified by default in mockup
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${role}`,
    };
    
    // Store in localStorage for persistence in mockup mode
    localStorage.setItem("justice_city_user", JSON.stringify(userData));
    setUser(userData);
    setIsLoading(false);
    toast({
      title: "Welcome back",
      description: "You are currently logged in as an Unverified User.",
    });
  };

  const logout = () => {
    localStorage.removeItem("justice_city_user");
    setUser(null);
    toast({
      title: "Logged out",
    });
  };

  const verifyIdentity = async (): Promise<boolean> => {
    if (!user) return false;

    setIsLoading(true);

    try {
      const verification = await submitVerification({
        mode: "biometric",
        userId: user.id,
        country: "NG",
        firstName: user.name.split(" ")[0],
        lastName: user.name.split(" ").slice(1).join(" ") || "User",
      });

      const isApproved = verification.status === "approved";
      const updatedUser = { ...user, isVerified: isApproved };
      localStorage.setItem("justice_city_user", JSON.stringify(updatedUser));
      setUser(updatedUser);

      toast({
        title: isApproved ? "Identity Verified" : "Identity Verification Submitted",
        description: isApproved
          ? "You now have full access to Justice City."
          : "Your Smile ID check is pending review. We will notify you once it is approved.",
        variant: "default",
        className: isApproved ? "bg-green-600 text-white border-none" : undefined,
      });

      return isApproved;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Verification failed.";

      toast({
        title: "Verification Failed",
        description: message,
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }

    return false;
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, verifyIdentity }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
