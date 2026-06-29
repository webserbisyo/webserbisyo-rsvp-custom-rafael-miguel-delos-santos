import { 
  Home, BookOpen, Image, Clock3, CalendarDays, MapPin, Mail, Utensils, Shirt,
  Sparkles, Users, Gift, Award, Phone, MessageCircle
} from "@/client/libs/icons";
import React from "react";

export type NavItem = {
  label: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
  isPrimary?: boolean;
};

export type SitemapGroup = {
  title: string;
  items: NavItem[];
};

export const topNavItems: NavItem[] = [
  { label: "Story", href: "#our-story" },
  { label: "Gallery", href: "#gallery" },
  { label: "Countdown", href: "#countdown" },
  { label: "Timeline", href: "#timeline" },
  { label: "Details", href: "#extra-info" },
  { label: "Guestbook", href: "#guestbook" },
];

export const dockItems: NavItem[] = [
  { label: "Ceremony", href: "#ceremony", icon: CalendarDays },
  { label: "Venue", href: "#venue", icon: MapPin },
  { label: "RSVP", href: "/rsvp", icon: Mail, isPrimary: true },
  { label: "Reception", href: "#reception", icon: Utensils },
  { label: "Attire", href: "#attire", icon: Shirt },
];

export const sitemapGroups: SitemapGroup[] = [
  {
    title: "Explore",
    items: [
      { label: "Home", href: "#hero", icon: Home },
      { label: "Story", href: "#our-story", icon: BookOpen },
      { label: "Gallery", href: "#gallery", icon: Image },
      { label: "Countdown", href: "#countdown", icon: Clock3 },
      { label: "Timeline", href: "#timeline", icon: CalendarDays },
      { label: "Guestbook", href: "#guestbook", icon: MessageCircle },
    ],
  },
  {
    title: "Guest Essentials",
    items: [
      { label: "Ceremony", href: "#ceremony", icon: CalendarDays },
      { label: "Venue", href: "#venue", icon: MapPin },
      { label: "RSVP", href: "/rsvp", icon: Mail },
      { label: "Reception", href: "#reception", icon: Utensils },
      { label: "Attire", href: "#attire", icon: Shirt },
    ],
  },
  {
    title: "Wedding Info",
    items: [
      { label: "Details", href: "#extra-info", icon: Sparkles },
      { label: "Entourage", href: "#entourage", icon: Users },
      { label: "Gifts", href: "#gifts", icon: Gift },
      { label: "Sponsors", href: "#sponsors", icon: Award },
    ],
  },
  {
    title: "Support",
    items: [
      { label: "Contact", href: "#contact", icon: Phone },
    ],
  },
];
