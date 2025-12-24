
import React from 'react';
import { Restaurant } from '../types';

interface RestaurantCardProps {
  restaurant: Restaurant;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onClick: (id: string) => void;
  onBook: (id: string) => void;
}

const RestaurantCard: React.FC<RestaurantCardProps> = ({ 
  restaurant, 
  isFavorite, 
  onToggleFavorite, 
  onClick, 
  onBook 
}) => {
  return (
    <div 
      className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 group cursor-pointer flex flex-col h-full"
      onClick={() => onClick(restaurant.id)}
    >
      <div className="relative h-48 sm:h-56 overflow-hidden">
        <img 
          src={restaurant.image} 
          alt={restaurant.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
        />
        
        {/* Favorite Button */}
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(restaurant.id);
          }}
          className={`absolute top-4 right-4 p-2.5 rounded-full backdrop-blur-md transition-all z-10 ${
            isFavorite ? 'bg-orange-600 text-white shadow-lg' : 'bg-white/30 text-white hover:bg-white/50'
          }`}
        >
          <svg className="w-5 h-5" fill={isFavorite ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>

        {restaurant.isPremium && (
          <div className="absolute top-4 left-4 bg-amber-500 text-white text-[10px] font-black px-2 py-1 rounded shadow-lg flex items-center tracking-widest uppercase">
            GOLD PARTNER
          </div>
        )}
        <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md text-white text-xs font-black px-2.5 py-1 rounded-lg">
          {restaurant.priceRange}
        </div>
      </div>
      
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-black text-gray-900 line-clamp-1 group-hover:text-orange-600 transition-colors font-serif italic">
            {restaurant.name}
          </h3>
          <div className="flex items-center text-orange-500 bg-orange-50 px-2 py-1 rounded-lg">
            <svg className="w-3.5 h-3.5 mr-1" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
            <span className="text-xs font-black">{restaurant.rating}</span>
          </div>
        </div>
        
        <p className="text-gray-500 text-sm mb-4 line-clamp-2 leading-relaxed">
          {restaurant.description}
        </p>

        <div className="flex flex-wrap gap-1.5 mb-6">
          {restaurant.cuisine.map((c, i) => (
            <span key={i} className="px-2.5 py-1 bg-gray-50 text-gray-500 text-[10px] font-black rounded-lg uppercase tracking-widest border border-gray-100">
              {c}
            </span>
          ))}
        </div>

        <div className="mt-auto pt-5 border-t border-gray-50 flex items-center justify-between">
          <div className="flex items-center text-gray-400 text-[10px] font-bold uppercase tracking-widest">
            <svg className="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            {restaurant.location.split(',')[0]}
          </div>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onBook(restaurant.id);
            }}
            className="px-5 py-2.5 bg-gray-900 text-white text-xs font-black rounded-xl hover:bg-orange-600 transition-all shadow-lg active:scale-95 uppercase tracking-widest"
          >
            Book
          </button>
        </div>
      </div>
    </div>
  );
};

export default RestaurantCard;
