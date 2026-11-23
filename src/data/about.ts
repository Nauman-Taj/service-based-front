import {
  BadgeCheck,
  Banknote,
  Clock,
  FileCheck2,
  HeartHandshake,
  MapPin,
  ShieldCheck,
  Star,
  type LucideIcon,
} from "lucide-react";

export interface AboutStat {
  value: string;
  label: string;
}

export const aboutStats: AboutStat[] = [
  { value: "2023", label: "Founded in Multan" },
  { value: "8", label: "Service categories" },
  { value: "1,800+", label: "Vetted providers" },
  { value: "2,400+", label: "Bookings completed" },
];

export interface AboutValue {
  icon: LucideIcon;
  title: string;
  description: string;
}

export const aboutValues: AboutValue[] = [
  {
    icon: ShieldCheck,
    title: "Trust is earned, not assumed",
    description:
      "Every provider passes identity, insurance and background checks before they can accept a single booking.",
  },
  {
    icon: Banknote,
    title: "Fair, upfront pricing",
    description:
      "See what you will pay before you book. No call-out surprises and no last-minute add-ons.",
  },
  {
    icon: MapPin,
    title: "Local people, local accountability",
    description:
      "We are rooted in Multan and know the neighbourhoods our providers serve, from New Multan Colony to DHA.",
  },
  {
    icon: HeartHandshake,
    title: "Help that feels human",
    description:
      "Real people are available seven days a week, before and after the job, to keep things moving.",
  },
];

export interface VettingStep {
  icon: LucideIcon;
  title: string;
  description: string;
}

export const vettingSteps: VettingStep[] = [
  {
    icon: FileCheck2,
    title: "Identity & background checks",
    description:
      "We verify CNIC details, home address and background record before an application moves forward.",
  },
  {
    icon: BadgeCheck,
    title: "Skills & insurance review",
    description:
      "Trade credentials, public liability insurance and examples of recent work are reviewed by our team.",
  },
  {
    icon: Star,
    title: "Verified customer reviews",
    description:
      "Only customers who booked through Quicker can leave a review. Ratings below 4.5 trigger a quality review.",
  },
  {
    icon: Clock,
    title: "Ongoing quality monitoring",
    description:
      "Punctuality, cancellations and complaint rates are tracked every month. Providers who fall short are removed.",
  },
];

export const aboutStory = {
  eyebrow: "Our story",
  title: "Built in Multan, for Multan",
  paragraphs: [
    "Finding a reliable plumber should not mean calling five numbers and hoping for the best. Quicker started in 2023 with a simple idea: give homeowners one place to compare trusted local professionals, see upfront prices and book with confidence.",
    "Today we work with independent tradespeople and small teams across the city — from New Multan Colony to DHA — helping them grow their businesses while giving customers a fair, transparent alternative to word-of-mouth guesswork.",
  ],
  promise: {
    title: "Our promise",
    description:
      "The standards below are not marketing lines. They are the checks every booking passes through.",
    points: [
      "Every provider is verified before they can accept bookings.",
      "Every price is agreed upfront, before the work begins.",
      "Every booking is backed by a real support team.",
    ],
  },
} as const;

export const providerExpectations = [
  "Background-checked, insured professionals",
  "Upfront PKR pricing with no hidden fees",
  "On-time arrival, or live updates if plans change",
  "Tidy work and a clear handover when the job is done",
  "Seven-day support from a real person",
] as const;
