import { useAuth } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Mail, Phone, MapPin, Calendar, Clock } from "lucide-react";

export default function ProfilePage() {
  const { user } = useAuth();

  if (!user) return <div className="p-20 text-center">Please log in to view profile.</div>;

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card className="md:col-span-1">
          <CardContent className="pt-8 text-center">
            <Avatar className="w-32 h-32 mx-auto mb-4 border-4 border-white shadow-xl">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="text-4xl">{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <h2 className="text-2xl font-bold text-slate-900">{user.name}</h2>
            <p className="text-slate-500 capitalize mb-4">{user.role}</p>
            {user.isVerified && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 text-green-700 border border-green-200 text-sm font-semibold">
                <ShieldCheck className="w-4 h-4" />
                Verified
              </div>
            )}
            <div className="mt-8 pt-8 border-t border-slate-100 space-y-4 text-left">
              <div className="flex items-center gap-3 text-slate-600">
                <Mail className="w-4 h-4" />
                <span className="text-sm">{user.email}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-600">
                <Phone className="w-4 h-4" />
                <span className="text-sm">+234 (0) 906 534 0189</span>
              </div>
              <div className="flex items-center gap-3 text-slate-600">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">Owerri, Nigeria</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="md:col-span-2 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Account Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-6">
                <div className="p-4 bg-slate-50 rounded-2xl">
                  <p className="text-sm text-slate-500 mb-1">Account Created</p>
                  <p className="font-semibold text-slate-900">Jan 12, 2026</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl">
                  <p className="text-sm text-slate-500 mb-1">Verification Level</p>
                  <p className="font-semibold text-slate-900">Level 2 (Full)</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {[
                  { action: "Viewed Property", target: "Luxury Villa in Lekki", time: "2 hours ago" },
                  { action: "Saved Property", target: "Modern Flat Owerri", time: "1 day ago" },
                  { action: "Profile Updated", target: "Photo change", time: "3 days ago" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                    <div>
                      <p className="font-medium text-slate-900">{item.action}</p>
                      <p className="text-sm text-slate-500">{item.target}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-400">{item.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
