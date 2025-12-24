
import { Restaurant } from './types';

export const MOCK_RESTAURANTS: Restaurant[] = [
  {
    id: '1',
    name: 'The Test Kitchen Fledgelings',
    description: 'A mentorship-driven culinary experience in Cape Town, offering world-class fusion dishes.',
    image: 'https://images.unsplash.com/photo-1550966842-2849a22027e4?auto=format&fit=crop&q=80&w=800',
    rating: 4.8,
    reviews: 1250,
    cuisine: ['Contemporary', 'Fusion'],
    priceRange: '$$$$',
    location: 'Woodstock, Cape Town',
    deals: ['15% off lunch on Tuesdays'],
    isPremium: true,
    phone: '+27 21 447 2337',
    hours: '18:00 - 22:30',
    menuHighlights: ['Pan-seared Scallops', 'Springbok Tataki', 'Deconstructed Milk Tart']
  },
  {
    id: '2',
    name: 'Marble Restaurant',
    description: 'Celebrating the South African tradition of cooking on fire with stunning Johannesburg views.',
    image: 'https://images.unsplash.com/photo-1544148103-0773bf10d330?auto=format&fit=crop&q=80&w=800',
    rating: 4.7,
    reviews: 980,
    cuisine: ['Grill', 'South African'],
    priceRange: '$$$$',
    location: 'Rosebank, Johannesburg',
    deals: ['Complimentary welcome drink'],
    phone: '+27 10 594 5550',
    hours: '12:00 - 22:00',
    menuHighlights: ['Coal-fired Ribeye', 'Smoked Mussels', 'Wood-fired Cauliflower']
  },
  {
    id: '3',
    name: 'Babel at Babylonstoren',
    description: 'Farm-to-fork dining in a restored stable with a focus on seasonal garden produce.',
    image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=800',
    rating: 4.9,
    reviews: 2100,
    cuisine: ['Organic', 'Farm-to-Table'],
    priceRange: '$$$',
    location: 'Paarl, Winelands',
    isPremium: true,
    phone: '+27 21 863 3852',
    hours: '08:00 - 17:00',
    menuHighlights: ['Seasonal Salad Bowl', 'Garden-fresh Risotto', 'Artisanal Biltong Platter']
  },
  {
    id: '4',
    name: 'Moyo Kirstenbosch',
    description: 'Traditional African flavors served in the heart of the world-famous botanical gardens.',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=800',
    rating: 4.5,
    reviews: 1540,
    cuisine: ['African', 'Traditional'],
    priceRange: '$$',
    location: 'Newlands, Cape Town',
    deals: ['Buy 1 Get 1 Main Course (Premium Only)'],
    phone: '+27 21 762 9585',
    hours: '11:00 - 21:00',
    menuHighlights: ['Oxtail Potjie', 'Cape Malay Curry', 'Bobotie']
  },
  {
    id: '5',
    name: '9th Avenue Waterside',
    description: 'Modern European-inspired dining with panoramic Durban harbor views.',
    image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80&w=800',
    rating: 4.6,
    reviews: 820,
    cuisine: ['European', 'Seafood'],
    priceRange: '$$$',
    location: 'Victoria Embankment, Durban',
    deals: ['Early Bird 3-course set for R350'],
    phone: '+27 31 940 4628',
    hours: '12:00 - 21:30',
    menuHighlights: ['Grilled Prawns', 'Confit Duck', 'Vanilla Bean Creme Brulee']
  }
];
