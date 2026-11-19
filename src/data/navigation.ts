export interface NavLink {
  label: string;
  href: string;
}

export const mainNav: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export const footerNav = {
  company: [
    { label: "About Us", href: "/about" },
    { label: "Contact", href: "/contact" },
  ] satisfies NavLink[],
  customers: [
    { label: "Browse Services", href: "/services" },
    { label: "How It Works", href: "/#how-it-works" },
    { label: "Sign In", href: "/login" },
    { label: "Create an Account", href: "/register" },
  ] satisfies NavLink[],
  providers: [
    { label: "Become a Provider", href: "/register" },
    { label: "Provider Sign In", href: "/login" },
    { label: "Contact Support", href: "/contact" },
  ] satisfies NavLink[],
};
