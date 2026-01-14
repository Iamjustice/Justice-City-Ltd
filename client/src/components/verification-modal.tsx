import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { ShieldCheck, ScanFace, FileCheck, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface VerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  triggerAction?: string;
}

export function VerificationModal({ isOpen, onClose, triggerAction = "access this feature" }: VerificationModalProps) {
  const { verifyIdentity } = useAuth();
  const [step, setStep] = useState<"intro" | "scanning" | "success">("intro");

  const handleVerify = async () => {
    setStep("scanning");
    await verifyIdentity();
    setStep("success");
    setTimeout(() => {
      onClose();
      setStep("intro"); // Reset for next time
    }, 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md overflow-hidden">
        <AnimatePresence mode="wait">
          {step === "intro" && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <DialogHeader>
                <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <ShieldCheck className="w-6 h-6 text-blue-600" />
                </div>
                <DialogTitle className="text-center text-xl">Identity Verification Required</DialogTitle>
                <DialogDescription className="text-center">
                  To {triggerAction}, you must verify your identity. This keeps Justice City safe for everyone.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <ScanFace className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-sm text-slate-900">Facial Recognition</h4>
                    <p className="text-xs text-slate-500">We'll scan your face to match your ID.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <FileCheck className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-sm text-slate-900">Government ID</h4>
                    <p className="text-xs text-slate-500">Upload your NIN, Passport, or Driver's License.</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={onClose}>
                  Cancel
                </Button>
                <Button className="flex-1 bg-blue-600 hover:bg-blue-700" onClick={handleVerify}>
                  Start Verification
                </Button>
              </div>
            </motion.div>
          )}

          {step === "scanning" && (
            <motion.div
              key="scanning"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-12 flex flex-col items-center justify-center text-center space-y-4"
            >
              <div className="relative w-20 h-20">
                <div className="absolute inset-0 border-4 border-slate-100 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
                <ScanFace className="absolute inset-0 m-auto w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-slate-900">Verifying Identity...</h3>
                <p className="text-sm text-slate-500">Connecting to Smile ID Secure Server</p>
              </div>
            </motion.div>
          )}

          {step === "success" && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-12 flex flex-col items-center justify-center text-center space-y-4"
            >
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-slate-900">Verification Complete</h3>
                <p className="text-sm text-slate-500">You are now a verified member of Justice City.</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
