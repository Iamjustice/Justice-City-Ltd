import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { 
  Plus, 
  FileText, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  MoreHorizontal, 
  Building2 
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { useState } from "react";
import { VerificationModal } from "@/components/verification-modal";

export default function Dashboard() {
  const { user } = useAuth();
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);

  // Mock listings for the dashboard
  const listings = [
    {
      id: "prop_1",
      title: "Luxury Apartment in Victoria Island",
      status: "Published",
      views: 1240,
      inquiries: 18,
      price: "₦150,000,000",
      date: "Jan 12, 2026",
    },
    {
      id: "prop_5",
      title: "Unfinished Bungalow in Epe",
      status: "Pending Review",
      views: 0,
      inquiries: 0,
      price: "₦25,000,000",
      date: "Jan 14, 2026",
    },
    {
      id: "prop_6",
      title: "3 Bedroom Flat - Yaba",
      status: "Draft",
      views: 0,
      inquiries: 0,
      price: "₦4,000,000/yr",
      date: "Jan 10, 2026",
    },
  ];

  const handleCreateListing = () => {
    if (!user?.isVerified) {
      setIsVerificationModalOpen(true);
    } else {
      // Navigate to create listing (mock action)
      console.log("Navigate to create listing");
    }
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <h2 className="text-2xl font-bold">Please log in to view your dashboard</h2>
        <Button asChild>
          <Link href="/">Go Home</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <VerificationModal 
        isOpen={isVerificationModalOpen} 
        onClose={() => setIsVerificationModalOpen(false)}
        triggerAction="create a listing"
      />

      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-slate-900">Agent Dashboard</h1>
          <p className="text-slate-500">Manage your listings and track performance.</p>
        </div>
        <Button onClick={handleCreateListing} size="lg" className="bg-blue-600 hover:bg-blue-700 gap-2">
          <Plus className="w-5 h-5" />
          Create New Listing
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-500 font-medium text-sm">Total Active Listings</h3>
            <Building2 className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-3xl font-bold text-slate-900">12</p>
          <p className="text-green-600 text-xs mt-2 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> All Verified
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-500 font-medium text-sm">Total Views (30d)</h3>
            <FileText className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-3xl font-bold text-slate-900">3.4k</p>
          <p className="text-green-600 text-xs mt-2">+12% from last month</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-500 font-medium text-sm">Pending Verifications</h3>
            <Clock className="w-5 h-5 text-amber-500" />
          </div>
          <p className="text-3xl font-bold text-slate-900">1</p>
          <p className="text-amber-600 text-xs mt-2">Requires your attention</p>
        </div>
      </div>

      {/* Listings Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h3 className="font-bold text-lg text-slate-900">Recent Listings</h3>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
              <TableHead className="w-[400px]">Property</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stats</TableHead>
              <TableHead>Date Added</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {listings.map((listing) => (
              <TableRow key={listing.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-100 rounded-lg flex-shrink-0"></div>
                    <div>
                      <p className="text-slate-900 font-semibold">{listing.title}</p>
                      <p className="text-xs text-slate-500">ID: {listing.id.toUpperCase()}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge 
                    variant={
                      listing.status === "Published" ? "default" : 
                      listing.status === "Pending Review" ? "secondary" : "outline"
                    }
                    className={
                      listing.status === "Published" ? "bg-green-100 text-green-700 hover:bg-green-100 shadow-none border-green-200" :
                      listing.status === "Pending Review" ? "bg-amber-50 text-amber-700 hover:bg-amber-50 shadow-none border-amber-200" :
                      "text-slate-500"
                    }
                  >
                    {listing.status === "Published" && <CheckCircle2 className="w-3 h-3 mr-1" />}
                    {listing.status === "Pending Review" && <Clock className="w-3 h-3 mr-1" />}
                    {listing.status}
                  </Badge>
                </TableCell>
                <TableCell>{listing.price}</TableCell>
                <TableCell>
                  <div className="text-xs text-slate-500">
                    <span className="font-medium text-slate-900">{listing.views}</span> views • 
                    <span className="font-medium text-slate-900 ml-1">{listing.inquiries}</span> leads
                  </div>
                </TableCell>
                <TableCell className="text-slate-500 text-sm">{listing.date}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="w-4 h-4 text-slate-400" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {!user?.isVerified && (
        <div className="mt-6 bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
          <div>
            <h4 className="font-bold text-amber-800">Your account is not verified</h4>
            <p className="text-sm text-amber-700 mt-1">
              Unverified agents cannot publish listings. <button onClick={() => setIsVerificationModalOpen(true)} className="underline font-semibold hover:text-amber-900">Verify Identity now</button> to unlock full access.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
