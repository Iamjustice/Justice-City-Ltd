import { createContext, useContext, useState, ReactNode } from "react";
import { useToast } from "@/hooks/use-toast";

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
  verifyIdentity: () => Promise<void>;
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
      name: "Alex Doe",
      email: "alex@example.com",
      role,
      isVerified: false,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
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

  const verifyIdentity = async () => {
    setIsLoading(true);
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        if (user) {
          setUser({ ...user, isVerified: true });
          toast({
            title: "Identity Verified",
            description: "You now have full access to Justice City.",
            variant: "default", // Using default/success style
            className: "bg-green-600 text-white border-none",
          });
        }
        setIsLoading(false);
        resolve();
      }, 2000); // Simulate verification processing
    });
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
