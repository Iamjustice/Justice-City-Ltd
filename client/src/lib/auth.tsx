import { createContext, useContext, useState, ReactNode } from "react";
import { useToast } from "@/hooks/use-toast";
import { submitVerification } from "@/lib/verification";

type UserRole = "buyer" | "seller" | "agent" | "owner" | "renter" | "admin" | null;

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
  updateProfileAvatar: (file: File) => Promise<void>;
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
    const resolvedRole = role ?? "buyer";
    const idByRole: Record<Exclude<UserRole, null>, string> = {
      buyer: "usr_buyer_001",
      seller: "usr_seller_001",
      agent: "usr_agent_001",
      owner: "usr_owner_001",
      renter: "usr_renter_001",
      admin: "usr_admin_001",
    };
    const nameByRole: Record<Exclude<UserRole, null>, string> = {
      buyer: "Alex Doe",
      seller: "Seller Stella",
      agent: "Agent Alex",
      owner: "Owner Olivia",
      renter: "Renter Ryan",
      admin: "Justice Admin",
    };

    const userData = {
      id: idByRole[resolvedRole],
      name: nameByRole[resolvedRole],
      email: `${resolvedRole}@example.com`,
      role: resolvedRole,
      isVerified: resolvedRole === "admin", // Admins are verified by default in mockup
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${resolvedRole}`,
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

  const updateProfileAvatar = async (file: File): Promise<void> => {
    if (!user) {
      throw new Error("You must be logged in to update your profile photo.");
    }

    if (!file.type.toLowerCase().startsWith("image/")) {
      throw new Error("Please upload a valid image file (JPG, PNG, or WEBP).");
    }

    if (file.size > 5 * 1024 * 1024) {
      throw new Error("Profile photo must be 5MB or smaller.");
    }

    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result !== "string") {
          reject(new Error("Failed to read selected image."));
          return;
        }
        resolve(reader.result);
      };
      reader.onerror = () => reject(new Error("Failed to read selected image."));
      reader.readAsDataURL(file);
    });

    const updatedUser = { ...user, avatar: dataUrl };
    localStorage.setItem("justice_city_user", JSON.stringify(updatedUser));
    setUser(updatedUser);

    toast({
      title: "Profile photo updated",
      description: "Your new profile photo is now active across your account.",
    });
  };

  return (
    <AuthContext.Provider
      value={{ user, isLoading, login, logout, verifyIdentity, updateProfileAvatar }}
    >
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
