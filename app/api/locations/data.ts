export type LocationItem = {
  id: number;
  title: string;
  category: string;
  description: string;
  district: string;
  latitude: number;
  longitude: number;
  locationDetails: string;
  contactLabel: string;
  contactValue: string;
  tourUrl: string;
  images: string[];
  isPublished: boolean;
};

export let locationsStore: LocationItem[] = [
  {
    id: 1,
    title: "Al Qarah Mountain",
    category: "Nature",
    description:
      "A dramatic natural landmark known for its caves, formations, and panoramic desert character.",
    district: "Al Ahsa",
    latitude: 25.4215,
    longitude: 49.675,
    locationDetails:
      "Famous for its unique geological formations, caves, and elevated views over the oasis landscape.",
    contactLabel: "Destination Office",
    contactValue: "+966 000 000 000",
    tourUrl: "https://example.com",
    images: [
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
    ],
    isPublished: true,
  },
  {
    id: 2,
    title: "Ibrahim Palace",
    category: "Heritage",
    description:
      "A heritage icon that reflects the historic and architectural identity of Al Ahsa.",
    district: "Hofuf",
    latitude: 25.3833,
    longitude: 49.586,
    locationDetails:
      "A major historic landmark known for its courtyards, fortification character, and cultural significance.",
    contactLabel: "Visitor Information",
    contactValue: "+966 000 000 001",
    tourUrl: "https://example.com",
    images: [
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80",
    ],
    isPublished: true,
  },
  {
    id: 3,
    title: "Jawatha Mosque",
    category: "Religious Heritage",
    description:
      "One of the oldest historic mosques in the region and a key cultural destination.",
    district: "Al Kilabiyah",
    latitude: 25.4312,
    longitude: 49.7244,
    locationDetails:
      "A spiritually and historically important site connected to the early Islamic legacy of the region.",
    contactLabel: "Site Contact",
    contactValue: "+966 000 000 002",
    tourUrl: "https://example.com",
    images: [
      "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1512632578888-169bbbc64f33?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1524499982521-1ffd58dd89ea?auto=format&fit=crop&w=1200&q=80",
    ],
    isPublished: true,
  },
  {
    id: 4,
    title: "Souq Al Qaisariya",
    category: "Market",
    description:
      "A traditional market experience with authentic atmosphere, local crafts, and Saudi character.",
    district: "Hofuf",
    latitude: 25.3824,
    longitude: 49.5846,
    locationDetails:
      "A restored traditional souq known for artisanal products, heritage ambiance, and walkable cultural streetscape.",
    contactLabel: "Market Contact",
    contactValue: "+966 000 000 003",
    tourUrl: "https://example.com",
    images: [
      "https://images.unsplash.com/photo-1524499982521-1ffd58dd89ea?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=1200&q=80",
    ],
    isPublished: true,
  },
];