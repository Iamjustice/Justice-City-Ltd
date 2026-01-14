export interface Property {
  id: string;
  title: string;
  price: number;
  location: string;
  type: "Sale" | "Rent";
  status: "Published" | "Pending" | "Sold";
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  image: string;
  agent: {
    name: string;
    verified: boolean;
    image: string;
  };
  description: string;
}

export const MOCK_PROPERTIES: Property[] = [
  {
    id: "prop_1",
    title: "Luxury Apartment in Victoria Island",
    price: 150000000,
    location: "1024 Adetokunbo Ademola, VI, Lagos",
    type: "Sale",
    status: "Published",
    bedrooms: 3,
    bathrooms: 3,
    sqft: 2200,
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=1000",
    agent: {
      name: "Sarah Okon",
      verified: true,
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    },
    description: "A stunning 3-bedroom apartment with ocean view, 24/7 power, and maximum security. Verified title.",
  },
  {
    id: "prop_2",
    title: "Modern Duplex in Lekki Phase 1",
    price: 8500000,
    location: "Block 4, Admiralty Way, Lekki",
    type: "Rent",
    status: "Published",
    bedrooms: 4,
    bathrooms: 5,
    sqft: 3500,
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1000",
    agent: {
      name: "Emmanuel Kalu",
      verified: true,
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emmanuel",
    },
    description: "Newly built duplex with BQ. Fully serviced estate with gym and pool.",
  },
  {
    id: "prop_3",
    title: "Commercial Space in Ikeja GRA",
    price: 450000000,
    location: "Isaac John Street, Ikeja",
    type: "Sale",
    status: "Published",
    bedrooms: 0,
    bathrooms: 4,
    sqft: 5000,
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1000",
    agent: {
      name: "Chinedu Obi",
      verified: false, // Unverified agent example
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Chinedu",
    },
    description: "Prime office space in the heart of the mainland. Perfect for corporate headquarters.",
  },
  {
    id: "prop_4",
    title: "Serviced Flat in Maitama",
    price: 12000000,
    location: "Gana Street, Maitama, Abuja",
    type: "Rent",
    status: "Published",
    bedrooms: 2,
    bathrooms: 2,
    sqft: 1500,
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=1000",
    agent: {
      name: "Zainab Ahmed",
      verified: true,
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Zainab",
    },
    description: "Exquisite 2-bedroom flat with italian finishing. Diplomatic zone security.",
  },
];
