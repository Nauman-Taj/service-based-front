export interface Testimonial {
  id: string;
  name: string;
  role: string;
  rating: number;
  quote: string;
  service: string;
}

export const testimonials: Testimonial[] = [
  {
    id: "test-1",
    name: "Hira Malik",
    role: "Homeowner · Gulgasht Colony, Multan",
    rating: 5,
    quote:
      "Booked a deep clean for our move-out and the apartment looked better than the day we moved in. The team arrived early and brought everything.",
    service: "Deep Home Cleaning",
  },
  {
    id: "test-2",
    name: "Ahmad Raza",
    role: "Landlord · Cantt, Multan",
    rating: 5,
    quote:
      "The plumber arrived within the hour, explained the issue clearly and fixed it for exactly the quoted price. No surprises, no upselling.",
    service: "Emergency Plumbing Repair",
  },
  {
    id: "test-3",
    name: "Ayesha Rahman",
    role: "Homeowner · Bosan Road, Multan",
    rating: 5,
    quote:
      "I compared three electricians in minutes. Booking, confirmation and payment were seamless, and the safety report was genuinely useful.",
    service: "Home Electrical Inspection",
  },
  {
    id: "test-4",
    name: "Hassan Shah",
    role: "Homeowner · DHA, Multan",
    rating: 5,
    quote:
      "Our garden has never looked better. Fatima was professional, punctual and full of great ideas for low-maintenance planting.",
    service: "Lawn Mowing & Garden Care",
  },
  {
    id: "test-5",
    name: "Sana Javed",
    role: "Homeowner · Shah Rukn-e-Alam, Multan",
    rating: 5,
    quote:
      "The custom shelving is flawless and the whole process took less than a week from quote to install. Worth every penny.",
    service: "Custom Shelving Installation",
  },
];
