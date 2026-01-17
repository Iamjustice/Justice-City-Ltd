import { useRoute } from "wouter";
import { MOCK_PROPERTIES } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { VerificationModal } from "@/components/verification-modal";
import { ChatInterface } from "@/components/chat-interface";
import { useState } from "react";
import { 
  MapPin, 
  Bed, 
  Bath, 
  Expand, 
  ShieldCheck, 
  Lock, 
  MessageSquare,
  Phone,
  Calendar,
  FileText,
  Check,
  X,
  Heart
} from "lucide-react";
import NotFound from "./not-found";
import { Dialog, DialogContent } from "@/components/ui/dialog";

export default function PropertyDetails() {
  const [match, params] = useRoute("/property/:id");
  const { user, login } = useAuth();
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const property = MOCK_PROPERTIES.find(p => p.id === params?.id);

  if (!property) return <NotFound />;

  const formatter = new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0,
  });

  const handleAction = (action: string) => {
    if (!user) {
      login();
      return;
    }
    if (!user.isVerified) {
      setIsVerificationModalOpen(true);
      return;
    }
    
    if (action === "chat") {
      setIsChatOpen(true);
    } else {
      console.log(`Performing ${action}`);
    }
  };

  return (
    <div className="min-h-screen bg-white pb-20 relative">
      <VerificationModal 
        isOpen={isVerificationModalOpen} 
        onClose={() => setIsVerificationModalOpen(false)}
        triggerAction="contact the seller"
      />

      {/* Floating Save Button - Mobile */}
      <div className="fixed bottom-6 right-6 z-50 md:hidden">
        <Button 
          onClick={() => handleAction("save")}
          className="w-14 h-14 rounded-full shadow-2xl bg-white text-slate-400 hover:text-red-500 hover:bg-white border border-slate-200"
        >
          <Heart className="w-6 h-6" />
        </Button>
      </div>

      {/* Chat Dialog */}
      <Dialog open={isChatOpen} onOpenChange={setIsChatOpen}>
        <DialogContent className="sm:max-w-md p-0 border-none bg-transparent shadow-none">
          <div className="relative">
            {/* Close button handled by Dialog default, but we can customize if needed */}
            <ChatInterface 
              recipient={property.agent} 
              propertyTitle={property.title}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Image Gallery Header */}
      <div className="h-[400px] md:h-[500px] relative bg-slate-100">
        <img 
          src={property.image} 
          alt={property.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8 container mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="flex gap-2 mb-2">
                <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-sm">
                  {property.type}
                </span>
                <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-sm flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4" />
                  Verified Title
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-2">
                {property.title}
              </h1>
              <div className="flex items-center text-white/90 gap-2">
                <MapPin className="w-5 h-5" />
                <span className="text-lg">{property.location}</span>
              </div>
            </div>
            <div className="text-white flex flex-col items-end gap-2">
              <p className="text-3xl font-bold font-display">{formatter.format(property.price)}</p>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleAction("save")}
                className="hidden md:flex bg-white/10 backdrop-blur-md border-white/30 text-white hover:bg-white hover:text-red-500 gap-2"
              >
                <Heart className="w-4 h-4" />
                Save Property
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Details */}
        <div className="lg:col-span-2 space-y-8">
          {/* Key Features */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex justify-between">
            <div className="text-center">
              <p className="text-slate-500 text-sm mb-1">Bedrooms</p>
              <div className="flex items-center justify-center gap-2">
                <Bed className="w-6 h-6 text-slate-900" />
                <span className="text-2xl font-bold text-slate-900">{property.bedrooms}</span>
              </div>
            </div>
            <div className="w-px bg-slate-200"></div>
            <div className="text-center">
              <p className="text-slate-500 text-sm mb-1">Bathrooms</p>
              <div className="flex items-center justify-center gap-2">
                <Bath className="w-6 h-6 text-slate-900" />
                <span className="text-2xl font-bold text-slate-900">{property.bathrooms}</span>
              </div>
            </div>
            <div className="w-px bg-slate-200"></div>
            <div className="text-center">
              <p className="text-slate-500 text-sm mb-1">Square Ft</p>
              <div className="flex items-center justify-center gap-2">
                <Expand className="w-6 h-6 text-slate-900" />
                <span className="text-2xl font-bold text-slate-900">{property.sqft}</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h2 className="text-2xl font-display font-bold text-slate-900 mb-4">About this property</h2>
            <p className="text-slate-600 leading-relaxed text-lg">
              {property.description}
            </p>
            <div className="mt-6 grid grid-cols-2 gap-4">
              {["24/7 Power", "Gated Security", "Treated Water", "Parking Space"].map((feature, i) => (
                <div key={i} className="flex items-center gap-2 text-slate-700">
                  <div className="w-5 h-5 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                    <Check className="w-3 h-3" />
                  </div>
                  {feature}
                </div>
              ))}
            </div>
          </div>

          {/* Verified Documents Preview */}
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
            <h3 className="font-bold text-lg text-slate-900 mb-4 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-green-600" />
              Verified Documentation
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-4 bg-white rounded-lg border border-slate-200 shadow-sm opacity-70">
                <FileText className="w-8 h-8 text-slate-400" />
                <div>
                  <p className="font-semibold text-slate-900">Certificate of Occupancy</p>
                  <p className="text-xs text-slate-500">Verified by Justice City Admin</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-white rounded-lg border border-slate-200 shadow-sm opacity-70">
                <FileText className="w-8 h-8 text-slate-400" />
                <div>
                  <p className="font-semibold text-slate-900">Governor's Consent</p>
                  <p className="text-xs text-slate-500">Verified by Justice City Admin</p>
                </div>
              </div>
            </div>
            {(!user || !user.isVerified) && (
              <div className="mt-4 p-3 bg-amber-50 border border-amber-200 text-amber-800 text-sm rounded-lg flex gap-2">
                <Lock className="w-4 h-4 mt-0.5 shrink-0" />
                Full document access is restricted to verified users only.
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Agent & Action Card */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-6">
              <div className="flex items-center gap-4 mb-6">
                <img 
                  src={property.agent.image} 
                  alt={property.agent.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-slate-100"
                />
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">{property.agent.name}</h3>
                  {property.agent.verified ? (
                    <div className="flex items-center gap-1 text-green-600 text-sm font-medium">
                      <ShieldCheck className="w-4 h-4" /> Verified Agent
                    </div>
                  ) : (
                    <div className="text-slate-500 text-sm">Agent</div>
                  )}
                </div>
              </div>

              {/* Gated Action Buttons */}
              <div className="space-y-3">
                <Button 
                  className="w-full h-12 text-lg gap-2" 
                  size="lg"
                  onClick={() => handleAction("chat")}
                >
                  {(!user || !user.isVerified) && <Lock className="w-4 h-4" />}
                  <MessageSquare className="w-4 h-4" />
                  Chat with Agent
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full h-12 text-lg gap-2" 
                  size="lg"
                  onClick={() => handleAction("call")}
                >
                  {(!user || !user.isVerified) && <Lock className="w-4 h-4" />}
                  <Phone className="w-4 h-4" />
                  Request Callback
                </Button>
                
                <Button 
                  variant="secondary" 
                  className="w-full h-12 text-lg gap-2" 
                  size="lg"
                  onClick={() => handleAction("tour")}
                >
                  <Calendar className="w-4 h-4" />
                  Schedule Tour
                </Button>
              </div>

              {/* Safety Warning */}
              <div className="mt-6 pt-6 border-t border-slate-100">
                <p className="text-xs text-slate-400 text-center">
                  Justice City protects your data. Contact info is masked until you are verified.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
