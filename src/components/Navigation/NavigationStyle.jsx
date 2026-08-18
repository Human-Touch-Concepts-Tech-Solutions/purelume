import {
  Gift,
  HeartHandshake,
  Package,
  Sparkles,
  Smile,
  Crown,
  Bookmark,
  Coffee,
  PartyPopper,
  GlassWater,
  Gem,
  Award,
  CircleDollarSign,
  Flower,
  Frame,
  Box,
  Layers,
  ShieldCheck,
  Baby
} from 'lucide-react';

// 13 Sub-navigation Items for Favours and Giveaways
export const favoursItems = [
  {
    title: 'Wedding Favors',
    desc: 'Custom keepsakes for guests',
    href: '/categories/Bracelets',
    icon: Gem
  },
  {
    title: 'Baby Shower',
    desc: 'Special gifts for bridesmaids',
    href: '/category/bridal-party-gifts',
    icon: Baby
  },
  {
    title: 'Baby Boy / Girl Birthdays',
    desc: 'Cute gifts for new arrivals',
    href: '/category/baby-shower',
    icon: Smile
  },
  {
    title: 'Graduation',
    desc: 'Branded promotional items',
    href: '/category/corporate-giveaways',
    icon: Package
  },
  {
    title: 'Corporate Gifting',
    desc: 'Resin & floral keyrings',
    href: '/category/custom-keychains',
    icon: Gem
  },
  {
    title: 'Bridal Shower ',
    desc: 'Hand-poured artisan candles',
    href: '/category/scented-candles',
    icon: Sparkles
  },
  {
    title: 'Birthday Party Favors',
    desc: 'Floral & acrylic coasters',
    href: '/category/coasters',
    icon: Coffee
  },
  {
    title: 'Burial / Memorial Souvenirs',
    desc: 'Pressed flower bookmarks',
    href: '/category/bookmarks',
    icon: Bookmark
  },
  {
    title: 'Party Favor Bags',
    desc: 'Curated gift bundles',
    href: '/category/party-favor-bags',
    icon: PartyPopper
  },
  {
    title: 'Mini Drinkware',
    desc: 'Custom mini glasses & flasks',
    href: '/category/drinkware',
    icon: GlassWater
  },
  {
    title: 'Luxury Gift Boxes',
    desc: 'Premium curated boxes',
    href: '/category/luxury-gift-boxes',
    icon: Gift
  },
  {
    title: 'Anniversary Tokens',
    desc: 'Memorable keepsake pieces',
    href: '/category/anniversary-tokens',
    icon: Award
  },
  {
    title: 'Budget Favours',
    desc: 'Affordable guest gifts',
    href: '/category/budget-favours',
    icon: CircleDollarSign
  }
];

// 5 Sub-navigation Items for Flower Preservation
export const preservationItems = [
  {
    title: 'Keychains',
    desc: 'Keep your wedding flowers forever',
    href: '/preservation/bridal-bouquet',
    icon: Flower
  },
  {
    title: 'Bookmarks & Coasters',
    desc: 'Deep clear resin encapsulation',
    href: '/preservation/resin-blocks',
    icon: Box
  },
  {
    title: 'Journals',
    desc: '3D framed flower arrangements',
    href: '/preservation/shadow-boxes',
    icon: Frame
  },
  {
    title: 'Memorial Flower Keepsakes',
    desc: 'Honor special memories in resin',
    href: '/preservation/memorial-keepsakes',
    icon: Layers
  },
  {
    title: 'Preservation Kits',
    desc: 'DIY silica drying & care kits',
    href: '/preservation/kits',
    icon: ShieldCheck
  }
];

// Main links across the navigation bar
export const mainNavLinks = [
  { title: 'Custom Projects', href: '/custom-projects' },
  { title: 'Workshops', href: '/workshops' },
  { title: 'About', href: '/about' },
  { title: 'Contact', href: '/contact' },
  { title: 'Blog', href: '/blog' }
];