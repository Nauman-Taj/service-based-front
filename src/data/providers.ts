import type { Provider } from "@/types/provider";

const avatar = (path: string) =>
  `https://randomuser.me/api/portraits/${path}.jpg`;

export const providers: Provider[] = [
  {
    id: "prov-1",
    name: "Ayesha Khan",
    businessName: "Ayesha Home Cleaning",
    specialty: "Home Cleaning",
    rating: 4.9,
    reviewCount: 214,
    completedJobs: 320,
    location: "Gulgasht Colony, Multan",
    avatar: avatar("women/8"),
    verified: true,
    bio: "Ten years of residential cleaning across Multan, with a focus on eco-friendly products and move-out details.",
  },
  {
    id: "prov-2",
    name: "Muhammad Bilal",
    businessName: "Bilal Plumbing Services",
    specialty: "Plumbing",
    rating: 4.8,
    reviewCount: 186,
    completedJobs: 410,
    location: "Cantt, Multan",
    avatar: avatar("men/10"),
    verified: true,
    bio: "Licensed plumber serving Multan, from dripping taps to full bathroom refits.",
  },
  {
    id: "prov-3",
    name: "Usman Tariq",
    businessName: "Usman Electric Works",
    specialty: "Electrical",
    rating: 5.0,
    reviewCount: 98,
    completedJobs: 150,
    location: "Bosan Road, Multan",
    avatar: avatar("men/69"),
    verified: true,
    bio: "Certified electrician specialising in home safety inspections and smart lighting installs.",
  },
  {
    id: "prov-4",
    name: "Hamza Iqbal",
    businessName: "Hamza Carpentry Works",
    specialty: "Carpentry",
    rating: 4.9,
    reviewCount: 156,
    completedJobs: 275,
    location: "Shah Rukn-e-Alam, Multan",
    avatar: avatar("men/7"),
    verified: true,
    bio: "Bespoke shelving, built-in wardrobes and furniture restoration with a craftsman's eye.",
  },
  {
    id: "prov-5",
    name: "Fatima Noor",
    businessName: "Fatima Garden Care",
    specialty: "Gardening & Landscaping",
    rating: 4.8,
    reviewCount: 132,
    completedJobs: 190,
    location: "DHA, Multan",
    avatar: avatar("women/26"),
    verified: true,
    bio: "Garden designer and maintenance specialist helping Multan's outdoor spaces thrive year-round.",
  },
  {
    id: "prov-6",
    name: "Zain Abbas",
    businessName: "Zain Painting Services",
    specialty: "Painting",
    rating: 4.9,
    reviewCount: 121,
    completedJobs: 205,
    location: "Gulshan Market, Multan",
    avatar: avatar("men/38"),
    verified: true,
    bio: "Interior and exterior painter known for clean lines, tidy sites and honest quotes.",
  },
];

export function getProviderById(id: string): Provider | undefined {
  return providers.find((provider) => provider.id === id);
}
