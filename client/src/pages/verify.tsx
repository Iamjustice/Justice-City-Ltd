import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShieldCheck, Upload, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { getSmileLinkFallbackUrl } from "@/lib/verification";
import { useToast } from "@/hooks/use-toast";

export default function VerificationPage() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState(1);
  const { verifyIdentity, isLoading } = useAuth();
  const { toast } = useToast();

  const handleNext = async () => {
    if (step < 3) {
      setStep(step + 1);
      return;
    }

    try {
      const isApproved = await verifyIdentity();
      setLocation(isApproved ? "/dashboard" : "/profile");
    } catch {
      const fallbackUrl = getSmileLinkFallbackUrl();
      if (!fallbackUrl) return;

      toast({
        title: "Redirecting to Smile Link",
        description: "Live verification will continue in the secure hosted Smile flow.",
      });
      window.location.assign(fallbackUrl);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 bg-slate-50/50">
      <Card className="w-full max-w-2xl shadow-xl border-slate-200">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-600/20">
              <ShieldCheck className="w-8 h-8" />
            </div>
          </div>
          <CardTitle className="text-2xl font-display font-bold">Identity Verification</CardTitle>
          <CardDescription>Complete these steps to become a verified member</CardDescription>
          
          {/* Progress Bar */}
          <div className="flex items-center justify-between mt-8 relative max-w-sm mx-auto">
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-200 -translate-y-1/2"></div>
            {[1, 2, 3].map((s) => (
              <div 
                key={s} 
                className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                  s <= step ? "bg-blue-600 text-white" : "bg-white text-slate-400 border-2 border-slate-200"
                }`}
              >
                {s < step ? <CheckCircle2 className="w-5 h-5" /> : s}
              </div>
            ))}
          </div>
        </CardHeader>

        <CardContent className="py-8">
          {step === 1 && (
            <div className="space-y-6 text-center">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Step 1: Phone Verification</h3>
                <p className="text-slate-500 text-sm">We'll send a code to your mobile device</p>
              </div>
              <div className="max-w-xs mx-auto space-y-4">
                <div className="space-y-2 text-left">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" placeholder="+234 906 534 0189" />
                </div>
                <Button onClick={handleNext} className="w-full bg-blue-600">Send Code</Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 text-center">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Step 2: Upload Government ID</h3>
                <p className="text-slate-500 text-sm">Identity document, International Passport, or Driver's License</p>
              </div>
              <div className="border-2 border-dashed border-slate-200 rounded-2xl p-12 hover:border-blue-400 transition-colors cursor-pointer group">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Upload className="w-8 h-8 text-blue-600" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-semibold text-slate-900">Click to upload or drag and drop</p>
                    <p className="text-xs text-slate-500">PNG, JPG or PDF (max. 5MB)</p>
                  </div>
                </div>
              </div>
              <Button onClick={handleNext} className="w-full bg-blue-600">Continue</Button>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 text-center">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Step 3: Biometric Liveness Check</h3>
                <p className="text-slate-500 text-sm">Position your face within the frame to confirm identity</p>
              </div>
              <div className="w-64 h-64 bg-slate-900 rounded-full mx-auto overflow-hidden relative border-4 border-blue-500/30">
                <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 to-transparent"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-64 border-2 border-white/20 rounded-[40%]"></div>
              </div>
              <Button onClick={handleNext} className="w-full bg-blue-600" disabled={isLoading}>
                {isLoading ? "Submitting to Smile ID..." : "Start Scan"}
              </Button>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="justify-center border-t bg-slate-50/50 py-4">
          <p className="text-xs text-slate-500 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            Your data is encrypted and handled securely according to our Privacy Policy
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
