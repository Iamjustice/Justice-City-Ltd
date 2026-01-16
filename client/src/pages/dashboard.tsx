import { useAuth } from "@/lib/auth";
import { 
  Plus, 
  FileText, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  MoreHorizontal, 
  Building2,
  MessageSquare,
  Users,
  Search as SearchIcon,
  Filter,
  ShieldCheck
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import { useState } from "react";
import { VerificationModal } from "@/components/verification-modal";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const { user } = useAuth();
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const [isCreateListingOpen, setIsCreateListingOpen] = useState(false);

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

  // Mock leads/chats for the dashboard
  const leads = [
    {
      id: "lead_1",
      name: "Tunde Ednut",
      property: "Luxury Apartment in VI",
      date: "2 hours ago",
      status: "Unread",
      message: "I am interested in viewing this property tomorrow."
    },
    {
      id: "lead_2",
      name: "Chioma Adeleke",
      property: "Modern Duplex in Lekki",
      date: "5 hours ago",
      status: "Read",
      message: "Is the price negotiable?"
    },
    {
      id: "lead_3",
      name: "Obinna Nwosu",
      property: "Commercial Space Ikeja",
      date: "Yesterday",
      status: "Read",
      message: "What is the total square footage?"
    }
  ];

  const handleCreateListing = () => {
    if (!user?.isVerified) {
      setIsVerificationModalOpen(true);
    } else {
      setIsCreateListingOpen(true);
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

  // Define Dashboard Views based on Role
  const renderDashboardContent = () => {
    switch (user.role) {
      case "admin":
        return <AdminDashboardView />;
      case "agent":
        return <AgentDashboardView 
                 listings={listings} 
                 leads={leads} 
                 handleCreateListing={handleCreateListing} 
                 setIsVerificationModalOpen={setIsVerificationModalOpen}
                 user={user}
               />;
      case "seller":
        return <SellerDashboardView listings={listings} handleCreateListing={handleCreateListing} user={user} />;
      case "buyer":
      default:
        return <BuyerDashboardView user={user} />;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <VerificationModal 
        isOpen={isVerificationModalOpen} 
        onClose={() => setIsVerificationModalOpen(false)}
        triggerAction="create a listing"
      />

      <Dialog open={isCreateListingOpen} onOpenChange={setIsCreateListingOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader className="pb-4">
            <DialogTitle>Create New Listing</DialogTitle>
            <DialogDescription>
              Add a new property to the marketplace. Your listing will be reviewed before going live.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Property Title</Label>
                <Input id="title" placeholder="e.g. 3 Bedroom Flat" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Listing Type</Label>
                <select className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-slate-50 text-sm">
                  <option>Sale</option>
                  <option>Rent</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price (₦)</Label>
                <Input id="price" placeholder="e.g. 50,000,000" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input id="location" placeholder="e.g. Lekki, Lagos" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <textarea 
                id="description"
                className="w-full h-24 p-3 rounded-lg border border-slate-200 bg-slate-50 text-sm resize-none"
                placeholder="Describe the property's features..."
              />
            </div>
            <div className="space-y-4">
              <Label className="text-base font-bold">Required Documentation</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:border-blue-400 transition-colors cursor-pointer group bg-slate-50/50">
                  <FileText className="w-8 h-8 text-slate-400 mx-auto mb-2 group-hover:text-blue-500 transition-colors" />
                  <p className="text-sm font-semibold text-slate-900">Upload Property Documents</p>
                  <p className="text-xs text-slate-500 mt-1">C of O, Survey Plan, or Deed</p>
                </div>
                <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:border-blue-400 transition-colors cursor-pointer group bg-slate-50/50">
                  <ShieldCheck className="w-8 h-8 text-slate-400 mx-auto mb-2 group-hover:text-blue-500 transition-colors" />
                  <p className="text-sm font-semibold text-slate-900">Ownership Authorization</p>
                  <p className="text-xs text-slate-500 mt-1">Letter of Authorization from Owner</p>
                </div>
              </div>
            </div>
            <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center hover:border-blue-400 transition-colors cursor-pointer group">
              <Plus className="w-8 h-8 text-slate-400 mx-auto mb-2 group-hover:text-blue-500 transition-colors" />
              <p className="text-sm font-semibold text-slate-900">Upload Property Images</p>
              <p className="text-xs text-slate-500 mt-1">Add up to 10 high-quality photos</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateListingOpen(false)}>Cancel</Button>
            <Button onClick={() => setIsCreateListingOpen(false)} className="bg-blue-600">Submit for Review</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {renderDashboardContent()}
    </div>
  );
}

// Sub-components for different dashboard views
function AdminDashboardView() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-display font-bold text-slate-900">Admin Console</h1>
          <p className="text-slate-500">System-wide overview and verification management.</p>
        </div>
        <Badge className="bg-red-100 text-red-700 border-red-200">System Live</Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Total Users", value: "1,240", icon: Users, color: "text-blue-600" },
          { label: "Pending Verifications", value: "42", icon: Clock, color: "text-amber-600" },
          { label: "Flagged Listings", value: "3", icon: AlertCircle, color: "text-red-600" },
          { label: "Revenue (Jan)", value: "₦4.2M", icon: FileText, color: "text-green-600" },
        ].map((stat, i) => (
          <Card key={i}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </div>
              <p className="text-2xl font-bold mt-2">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Identity Verification Requests</CardTitle>
          <CardDescription>Manual review required for high-value accounts.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Documents</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {["Adekunle Gold", "Simi Kosoko", "Burna Boy"].map((name, i) => (
                <TableRow key={i}>
                  <TableCell className="font-medium">{name}</TableCell>
                  <TableCell>{i === 0 ? "Agent" : "Seller"}</TableCell>
                  <TableCell><Badge variant="outline">NIN, Utility Bill</Badge></TableCell>
                  <TableCell><Badge className="bg-amber-100 text-amber-700">Awaiting Review</Badge></TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" variant="outline">Review</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function AgentDashboardView({ listings, leads, handleCreateListing, setIsVerificationModalOpen, user }: any) {
  return (
    <>
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

      <Tabs defaultValue="listings" className="space-y-6">
        <TabsList className="bg-slate-100 p-1">
          <TabsTrigger value="listings" className="gap-2">
            <Building2 className="w-4 h-4" /> Listings
          </TabsTrigger>
          <TabsTrigger value="chats" className="gap-2">
            <MessageSquare className="w-4 h-4" /> Chats
          </TabsTrigger>
          <TabsTrigger value="verifications" className="gap-2">
            <Clock className="w-4 h-4" /> Pending Verifications
          </TabsTrigger>
        </TabsList>

        <TabsContent value="listings">
          {/* Stats Cards and Table (using original logic) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-slate-500 font-medium text-sm">Total Active Listings</h3>
                <Building2 className="w-5 h-5 text-blue-600" />
              </div>
              <p className="text-3xl font-bold text-slate-900">12</p>
            </div>
            {/* ... other stats */}
          </div>
          {/* (Agent Table logic) */}
        </TabsContent>
        {/* ... Chats and Verifications content */}
      </Tabs>

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
    </>
  );
}

function SellerDashboardView({ listings, handleCreateListing, user }: any) {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-display font-bold text-slate-900">Seller Hub</h1>
          <p className="text-slate-500">Manage your private property sales.</p>
        </div>
        <Button onClick={handleCreateListing} className="bg-blue-600">
          <Plus className="w-4 h-4 mr-2" /> List Property
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">My Properties</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {listings.slice(0, 2).map((l: any) => (
                <div key={l.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-semibold text-sm">{l.title}</p>
                    <p className="text-xs text-slate-500">{l.price}</p>
                  </div>
                  <Badge variant="outline">{l.status}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Market Interest</CardTitle>
          </CardHeader>
          <CardContent className="h-[200px] flex items-center justify-center text-slate-400 italic">
            Visualizing interest in your properties...
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function BuyerDashboardView({ user }: any) {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold text-slate-900">My Justice City</h1>
        <p className="text-slate-500">Saved properties and ongoing inquiries.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-blue-600" /> Saved Properties
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center py-8">
            <p className="text-slate-400 text-sm">You haven't saved any properties yet.</p>
            <Button asChild variant="link" className="mt-2 text-blue-600">
              <Link href="/">Browse Marketplace</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-blue-600" /> Active Inquiries
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center py-8">
            <p className="text-slate-400 text-sm">Your conversation history will appear here.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
