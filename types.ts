
export interface Restaurant {
  id: string;
  name: string;
  description: string;
  image: string;
  rating: number;
  reviews: number;
  cuisine: string[];
  priceRange: '$' | '$$' | '$$$' | '$$$$';
  location: string;
  deals?: string[];
  isPremium?: boolean;
  phone?: string;
  hours?: string;
  menuHighlights?: string[];
}

export interface Booking {
  restaurantId: string;
  date: string;
  time: string;
  guests: number;
  specialRequests?: string;
}

export enum AppView {
  HOME = 'home',
  BROWSE = 'browse',
  DEALS = 'deals',
  BOOKINGS = 'bookings',
  PREMIUM = 'premium',
  FAVORITES = 'favorites'
}
