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
  Filter
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

  return (
    <div className="container mx-auto px-4 py-8">
      <VerificationModal 
        isOpen={isVerificationModalOpen} 
        onClose={() => setIsVerificationModalOpen(false)}
        triggerAction="create a listing"
      />

      <Dialog open={isCreateListingOpen} onOpenChange={setIsCreateListingOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create New Listing</DialogTitle>
            <DialogDescription>
              Add a new property to the marketplace. Your listing will be reviewed before going live.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
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
                className="w-full h-24 p-3 rounded-lg border border-slate-200 bg-slate-50 text-sm resize-none"
                placeholder="Describe the property's features..."
              />
            </div>
            <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center hover:border-blue-400 transition-colors cursor-pointer">
              <Plus className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="text-sm text-slate-500">Upload Property Images</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateListingOpen(false)}>Cancel</Button>
            <Button onClick={() => setIsCreateListingOpen(false)} className="bg-blue-600">Submit for Review</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
                <h3 className="text-slate-500 font-medium text-sm">Active Leads</h3>
                <Users className="w-5 h-5 text-amber-500" />
              </div>
              <p className="text-3xl font-bold text-slate-900">8</p>
              <p className="text-amber-600 text-xs mt-2">New messages waiting</p>
            </div>
          </div>

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
        </TabsContent>

        <TabsContent value="chats">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle className="text-lg">Recent Conversations</CardTitle>
                <CardDescription>Chat with potential buyers</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[400px]">
                  {leads.map((lead) => (
                    <div 
                      key={lead.id} 
                      className="p-4 border-b border-slate-100 hover:bg-slate-50 cursor-pointer transition-colors"
                    >
                      <div className="flex justify-between items-start mb-1">
                        <p className="font-semibold text-slate-900">{lead.name}</p>
                        <span className="text-[10px] text-slate-400 uppercase font-bold">{lead.date}</span>
                      </div>
                      <p className="text-xs text-blue-600 font-medium mb-1 truncate">{lead.property}</p>
                      <p className="text-sm text-slate-500 truncate">{lead.message}</p>
                    </div>
                  ))}
                </ScrollArea>
              </CardContent>
            </Card>
            <Card className="md:col-span-2">
              <div className="h-[520px] flex flex-col items-center justify-center text-center p-8">
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                  <MessageSquare className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Select a conversation</h3>
                <p className="text-slate-500 max-w-xs mx-auto mt-2">
                  Click on a lead from the left to start chatting about your properties.
                </p>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="verifications">
          <Card>
            <CardHeader>
              <CardTitle>Pending Property Verifications</CardTitle>
              <CardDescription>Track the status of your listed properties currently being verified by our professionals.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center gap-4 p-4 border border-slate-100 rounded-xl bg-slate-50/50">
                  <div className="w-16 h-16 bg-slate-200 rounded-lg flex-shrink-0"></div>
                  <div className="flex-1">
                    <h4 className="font-bold text-slate-900">Unfinished Bungalow in Epe</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-amber-200">Pending Review</Badge>
                      <span className="text-xs text-slate-400">Submitted 2 days ago</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">View Progress</Button>
                </div>
                <div className="text-center py-12">
                  <p className="text-slate-400 italic">No other properties currently in verification.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
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
    </div>
  );
}
