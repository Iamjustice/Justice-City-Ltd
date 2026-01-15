import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, SlidersHorizontal, ShieldCheck } from "lucide-react";
import { MOCK_PROPERTIES } from "@/lib/mock-data";
import { PropertyCard } from "@/components/property-card";
import generatedImage from '@assets/generated_images/modern_trustworthy_city_skyline_for_real_estate_hero_background.png';

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProperties = MOCK_PROPERTIES.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="pb-20">
      {/* Hero Section */}
      <section className="relative h-[500px] flex items-center justify-center overflow-hidden bg-slate-900">
        <div className="absolute inset-0">
          <img 
            src={generatedImage}
            alt="City Skyline" 
            className="w-full h-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
        </div>
        
        <div className="relative z-10 container mx-auto px-4 text-center">
          <div className="inline-block mb-4 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/20 backdrop-blur-md">
            <span className="text-blue-200 font-semibold text-sm tracking-wide uppercase">
              The Trust-First Marketplace
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-6 leading-tight">
            Find Your Home. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-green-400">
              Verify The Truth.
            </span>
          </h1>
          <p className="text-lg text-slate-300 mb-10 max-w-2xl mx-auto">
            Justice City is the only real estate platform where every user and every property is verified. No fakes. No scams. Just real deals.
          </p>

          {/* Search Bar */}
          <div className="max-w-3xl mx-auto flex flex-col gap-6">
            <div className="bg-white p-2 rounded-2xl shadow-2xl shadow-blue-900/20 flex flex-col md:flex-row gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input 
                  placeholder="Search by location, price, or property type..." 
                  className="pl-10 h-12 border-transparent bg-transparent focus-visible:ring-0 text-base"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="lg" className="h-12 px-6 hidden md:flex gap-2">
                  <SlidersHorizontal className="w-4 h-4" />
                  Filters
                </Button>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-center gap-4">
              <div className="flex items-center justify-center bg-white/10 backdrop-blur-md p-1 rounded-xl border border-white/20 w-full md:w-auto">
                {["Buy", "Rent", "Sell"].map((type) => (
                  <button
                    key={type}
                    className="flex-1 md:flex-none px-6 md:px-8 py-2.5 rounded-lg text-sm font-semibold transition-all hover:bg-white/10 text-white data-[active=true]:bg-blue-600 data-[active=true]:text-white"
                    data-active={type === "Buy"}
                  >
                    {type}
                  </button>
                ))}
              </div>
              <Button size="lg" className="h-[52px] w-full md:w-auto md:px-12 bg-blue-600 hover:bg-blue-700 font-bold text-lg shadow-xl shadow-blue-600/30 transition-all hover:scale-[1.02] active:scale-[0.98] rounded-xl">
                Search
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats / Trust Signals */}
      <section className="bg-white border-b border-slate-100">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: "Verified Listings", value: "2,400+" },
              { label: "Identity Checks", value: "100%" },
              { label: "Fraud Rate", value: "0.0%" },
              { label: "Active Agents", value: "500+" },
            ].map((stat, i) => (
              <div key={i} className="text-center md:text-left border-l-2 border-slate-100 pl-6 first:border-0 md:first:pl-0">
                <p className="text-3xl font-display font-bold text-slate-900">{stat.value}</p>
                <p className="text-sm text-slate-500 font-medium uppercase tracking-wider">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Listings Grid */}
      <section className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-display font-bold text-slate-900">Featured Properties</h2>
            <p className="text-slate-500">Curated listings with verified documentation.</p>
          </div>
          <Button variant="ghost" className="text-blue-600">View All</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProperties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="container mx-auto px-4 mb-8">
        <div className="bg-slate-900 rounded-3xl p-8 md:p-16 text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
          {/* Abstract Pattern Background */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full blur-[100px] opacity-20 translate-x-1/2 -translate-y-1/2"></div>
          
          <div className="relative z-10 max-w-xl">
            <h2 className="text-3xl font-display font-bold text-white mb-4">Are you a Real Estate Agent?</h2>
            <p className="text-slate-300 text-lg mb-8">
              Join the elite circle of verified agents. Build trust instantly with your clients by showing your verified badge.
            </p>
            <Button size="lg" className="bg-white text-slate-900 hover:bg-slate-100 font-semibold h-12 px-8">
              Get Verified Now
            </Button>
          </div>
          
          <div className="relative z-10 bg-white/10 backdrop-blur-lg p-6 rounded-2xl border border-white/10 max-w-xs w-full">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-white font-bold">Verification Badge</p>
                <p className="text-slate-400 text-sm">Valid until Dec 2026</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-2 bg-white/20 rounded-full w-3/4"></div>
              <div className="h-2 bg-white/20 rounded-full w-1/2"></div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
