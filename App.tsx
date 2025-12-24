
import React, { useState, useEffect, useCallback } from 'react';
import Layout from './components/Layout';
import RestaurantCard from './components/RestaurantCard';
import AIChat from './components/AIChat';
import VoiceConcierge from './components/VoiceConcierge';
import Notification, { NotificationType } from './components/Notification';
import { AppView, Restaurant, Booking } from './types';
import { MOCK_RESTAURANTS } from './constants';
import { getSmartSearch } from './services/geminiService';

const App: React.FC = () => {
  // Persistence state
  const [activeView, setActiveView] = useState<AppView>(AppView.HOME);
  const [isPremium, setIsPremium] = useState(() => localStorage.getItem('dinesa_premium') === 'true');
  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem('dinesa_bookings');
    return saved ? JSON.parse(saved) : [];
  });
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('dinesa_favorites');
    return saved ? JSON.parse(saved) : [];
  });
  
  // App state
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [viewingRestaurant, setViewingRestaurant] = useState<Restaurant | null>(null);
  const [notification, setNotification] = useState<{message: string, type: NotificationType} | null>(null);
  const [aiSearchResults, setAiSearchResults] = useState<{text: string, sources: any[]} | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  // Persistence effects
  useEffect(() => {
    localStorage.setItem('dinesa_bookings', JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem('dinesa_premium', isPremium.toString());
  }, [isPremium]);

  useEffect(() => {
    localStorage.setItem('dinesa_favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => console.log('Geolocation disabled')
      );
    }
  }, []);

  const showNotification = useCallback((message: string, type: NotificationType = 'success') => {
    setNotification({ message, type });
  }, []);

  const toggleFavorite = (id: string) => {
    setFavorites(prev => {
      const isFav = prev.includes(id);
      if (isFav) {
        showNotification("Removed from favorites", "info");
        return prev.filter(fid => fid !== id);
      } else {
        showNotification("Added to favorites!");
        return [...prev, id];
      }
    });
  };

  const handleSmartSearch = async () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    setAiSearchResults(null);
    const result = await getSmartSearch(searchQuery);
    if (result) {
      setAiSearchResults(result);
    }
    setIsSearching(false);
  };

  const handleBooking = (restaurantId: string) => {
    const restaurant = MOCK_RESTAURANTS.find(r => r.id === restaurantId);
    if (restaurant) {
      setSelectedRestaurant(restaurant);
    }
  };

  const confirmBooking = (guests: number, date: string, time: string) => {
    if (new Date(date) < new Date(new Date().setHours(0,0,0,0))) {
      showNotification("Please select a future date.", "error");
      return;
    }
    if (selectedRestaurant) {
      const newBooking: Booking = {
        restaurantId: selectedRestaurant.id,
        guests,
        date,
        time
      };
      setBookings(prev => [newBooking, ...prev]);
      setSelectedRestaurant(null);
      showNotification(`Table for ${guests} confirmed at ${selectedRestaurant.name}!`);
      setActiveView(AppView.BOOKINGS);
    }
  };

  const filteredRestaurants = MOCK_RESTAURANTS.filter(r => 
    r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.cuisine.some(c => c.toLowerCase().includes(searchQuery.toLowerCase())) ||
    r.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const favoriteRestaurants = MOCK_RESTAURANTS.filter(r => favorites.includes(r.id));

  const renderHome = () => (
    <div className="space-y-12 pb-12">
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden bg-gray-900">
        <img 
          src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=1920" 
          className="absolute inset-0 w-full h-full object-cover opacity-60 scale-105"
          alt="DineSA Hero"
        />
        <div className="relative z-10 max-w-4xl px-4 text-center">
          <div className="inline-block px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full border border-white/20 mb-8">
            <span className="text-white text-[10px] font-black tracking-[0.2em] uppercase">The Culinary Soul of South Africa</span>
          </div>
          <h1 className="text-5xl md:text-8xl font-black text-white mb-8 leading-tight font-serif italic">
            Discover <span className="text-orange-500">Local</span> Magic
          </h1>
          <p className="text-lg md:text-2xl text-gray-200 mb-12 max-w-2xl mx-auto font-medium leading-relaxed">
            From the streets of Soweto to the heights of Constantia. Instant bookings and exclusive insider deals.
          </p>
          <div className="max-w-2xl mx-auto relative group">
            <input 
              type="text" 
              placeholder="Search cuisine, city, or 'vibrant spots near me'..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && setActiveView(AppView.BROWSE)}
              className="w-full pl-8 pr-40 py-6 md:py-8 rounded-[2.5rem] bg-white text-gray-900 text-xl shadow-[0_32px_64px_-12px_rgba(0,0,0,0.5)] focus:outline-none focus:ring-4 focus:ring-orange-500/30 transition-all border-none"
            />
            <button 
              onClick={() => setActiveView(AppView.BROWSE)}
              className="absolute right-3 top-3 bottom-3 px-10 bg-orange-600 text-white font-black rounded-[2rem] hover:bg-orange-700 transition-all shadow-lg active:scale-95 text-lg"
            >
              Explore
            </button>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-4xl font-black text-gray-900 font-serif italic">The Essential 8</h2>
            <p className="text-gray-500 mt-2 font-medium">SA's most iconic dining destinations this month.</p>
          </div>
          <div className="flex space-x-2">
            <button onClick={() => setActiveView(AppView.FAVORITES)} className="px-5 py-2.5 bg-white border border-gray-100 rounded-2xl text-xs font-black text-gray-900 shadow-sm hover:bg-gray-50 transition-all">
              My Favorites ({favorites.length})
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {MOCK_RESTAURANTS.slice(0, 3).map(res => (
            <RestaurantCard 
              key={res.id} 
              restaurant={res} 
              isFavorite={favorites.includes(res.id)}
              onToggleFavorite={toggleFavorite}
              onClick={(id) => setViewingRestaurant(res)} 
              onBook={handleBooking} 
            />
          ))}
        </div>
      </section>
    </div>
  );

  const renderFavorites = () => (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="mb-16">
        <h1 className="text-5xl font-black text-gray-900 font-serif italic">Your Wishlist</h1>
        <p className="text-gray-500 mt-4 text-lg">You've saved {favorites.length} restaurants to try.</p>
      </div>

      {favoriteRestaurants.length === 0 ? (
        <div className="text-center py-32 bg-white rounded-[4rem] border border-dashed border-gray-200">
          <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-8 text-gray-200">
             <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
          </div>
          <p className="text-gray-500 text-xl font-bold">Your list is empty.</p>
          <button onClick={() => setActiveView(AppView.HOME)} className="mt-8 px-10 py-4 bg-gray-900 text-white font-black rounded-2xl hover:bg-orange-600 transition-all shadow-xl">Start Browsing</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
          {favoriteRestaurants.map(res => (
            <RestaurantCard 
              key={res.id} 
              restaurant={res} 
              isFavorite={true}
              onToggleFavorite={toggleFavorite}
              onClick={() => setViewingRestaurant(res)} 
              onBook={handleBooking} 
            />
          ))}
        </div>
      )}
    </div>
  );

  return (
    <Layout activeView={activeView} onViewChange={setActiveView} isPremium={isPremium}>
      {activeView === AppView.HOME && renderHome()}
      {activeView === AppView.BROWSE && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-8">
            <div>
              <h1 className="text-5xl font-black text-gray-900 font-serif italic">Find your table</h1>
              <p className="text-gray-500 mt-4 text-lg font-medium">Showing {filteredRestaurants.length} verified venues near you.</p>
            </div>
            <div className="w-full md:w-auto flex gap-4">
              <input 
                type="text" 
                placeholder="Filter results..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-grow md:w-80 px-6 py-4 bg-white border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-orange-500/20 shadow-sm font-bold"
              />
              <button onClick={handleSmartSearch} className="px-8 py-4 bg-orange-600 text-white font-black rounded-2xl hover:bg-orange-700 transition-all shadow-lg flex items-center space-x-2">
                {isSearching ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
                <span>AI</span>
              </button>
            </div>
          </div>

          {aiSearchResults && (
            <div className="mb-20 p-10 bg-orange-600 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex items-center space-x-3 mb-6">
                  <span className="bg-white/20 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Web Grounded Insight</span>
                </div>
                <p className="text-2xl font-bold leading-relaxed mb-8">{aiSearchResults.text}</p>
                <div className="flex flex-wrap gap-3">
                  {aiSearchResults.sources.map((s: any, i: number) => (
                    <a key={i} href={s.uri} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-white/10 hover:bg-white/30 backdrop-blur-md text-white text-xs font-bold rounded-xl transition-all border border-white/20">
                      {s.title}
                    </a>
                  ))}
                </div>
              </div>
              <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-orange-400 rounded-full blur-3xl opacity-30"></div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
            {filteredRestaurants.map(res => (
              <RestaurantCard 
                key={res.id} 
                restaurant={res} 
                isFavorite={favorites.includes(res.id)}
                onToggleFavorite={toggleFavorite}
                onClick={() => setViewingRestaurant(res)} 
                onBook={handleBooking} 
              />
            ))}
          </div>
        </div>
      )}
      {activeView === AppView.FAVORITES && renderFavorites()}
      {activeView === AppView.DEALS && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
           <div className="mb-20 text-center max-w-3xl mx-auto">
            <h1 className="text-6xl font-black text-gray-900 font-serif italic mb-6">Platinum Marketplace</h1>
            <p className="text-xl text-gray-500 font-medium">Exclusive deals negotiated with the best in the business.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {MOCK_RESTAURANTS.filter(r => r.deals && r.deals.length > 0).map(res => (
              <div key={res.id} className="bg-white rounded-[3rem] p-4 shadow-xl border border-gray-50 flex flex-col sm:flex-row group hover:shadow-2xl transition-all">
                <div className="sm:w-2/5 h-64 sm:h-auto rounded-[2.5rem] overflow-hidden">
                  <img src={res.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                </div>
                <div className="p-8 sm:w-3/5 flex flex-col justify-between">
                  <div>
                    <h3 className="text-3xl font-black text-gray-900 font-serif italic mb-2">{res.name}</h3>
                    <div className="flex items-center text-xs font-black text-orange-600 uppercase tracking-widest mb-6">
                       <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                       Verified Offer
                    </div>
                    {res.deals?.map((deal, idx) => (
                      <div key={idx} className="bg-gray-50 p-5 rounded-2xl border border-gray-100 mb-4">
                        <p className="text-gray-900 font-black text-lg">{deal}</p>
                      </div>
                    ))}
                  </div>
                  <button onClick={() => handleBooking(res.id)} className="w-full py-4 bg-gray-900 text-white font-black rounded-2xl hover:bg-orange-600 shadow-lg transition-all active:scale-95 uppercase tracking-widest text-sm">
                    Claim Deal
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {activeView === AppView.BOOKINGS && (
        <div className="max-w-4xl mx-auto px-4 py-20">
          <h1 className="text-5xl font-black text-gray-900 font-serif italic mb-16">Reservations</h1>
          {bookings.length === 0 ? (
            <div className="bg-white p-20 rounded-[4rem] border border-gray-100 shadow-sm text-center">
              <p className="text-gray-400 text-xl font-bold">No tables booked.</p>
              <button onClick={() => setActiveView(AppView.BROWSE)} className="mt-8 px-10 py-4 bg-orange-600 text-white font-black rounded-2xl shadow-xl">Book a Table</button>
            </div>
          ) : (
            <div className="space-y-8">
              {bookings.map((booking, idx) => {
                const restaurant = MOCK_RESTAURANTS.find(r => r.id === booking.restaurantId);
                return (
                  <div key={idx} className="bg-white p-8 rounded-[3rem] shadow-xl border border-gray-50 flex items-center">
                    <div className="w-32 h-32 rounded-3xl overflow-hidden flex-shrink-0">
                      <img src={restaurant?.image} className="w-full h-full object-cover" />
                    </div>
                    <div className="ml-10 flex-grow">
                      <div className="flex justify-between items-start mb-6">
                        <div>
                          <h3 className="text-2xl font-black text-gray-900 font-serif italic">{restaurant?.name}</h3>
                          <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mt-1">{restaurant?.location}</p>
                        </div>
                        <div className="px-4 py-2 bg-green-50 text-green-600 text-[10px] font-black rounded-full uppercase tracking-widest border border-green-100 shadow-sm">Confirmed</div>
                      </div>
                      <div className="flex space-x-6">
                        <div className="flex items-center text-sm font-black text-gray-700">
                          <svg className="w-5 h-5 mr-2 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                          {new Date(booking.date).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short' })}
                        </div>
                        <div className="flex items-center text-sm font-black text-gray-700">
                          <svg className="w-5 h-5 mr-2 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                          {booking.time}
                        </div>
                        <div className="flex items-center text-sm font-black text-gray-700">
                          <svg className="w-5 h-5 mr-2 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                          {booking.guests} Guests
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Restaurant Detail Modal */}
      {viewingRestaurant && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/80 backdrop-blur-xl animate-in fade-in duration-500" onClick={() => setViewingRestaurant(null)}></div>
          <div className="relative bg-white w-full max-w-4xl max-h-[90vh] rounded-[4rem] shadow-2xl overflow-y-auto animate-in zoom-in duration-300 no-scrollbar">
            <div className="relative h-96 overflow-hidden">
              <img src={viewingRestaurant.image} className="w-full h-full object-cover" />
              <button onClick={() => setViewingRestaurant(null)} className="absolute top-8 right-8 p-4 bg-black/40 backdrop-blur-md text-white rounded-full hover:bg-black/60 shadow-xl transition-all">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="p-12 md:p-20">
              <div className="flex justify-between items-start mb-10">
                <div>
                  <h2 className="text-6xl font-black text-gray-900 font-serif italic mb-4">{viewingRestaurant.name}</h2>
                  <div className="flex flex-wrap gap-4 items-center">
                    <span className="px-4 py-2 bg-orange-50 text-orange-600 text-xs font-black rounded-xl uppercase tracking-widest">{viewingRestaurant.cuisine.join(' • ')}</span>
                    <span className="text-gray-400 font-bold">•</span>
                    <span className="text-gray-900 font-black">{viewingRestaurant.location}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                   <div className="flex items-center text-4xl font-black text-gray-900">
                    <svg className="w-8 h-8 text-orange-500 mr-2" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                    {viewingRestaurant.rating}
                  </div>
                  <span className="text-xs font-bold text-gray-400 mt-2 uppercase tracking-[0.2em]">{viewingRestaurant.reviews} Reviews</span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
                <div>
                  <h3 className="text-2xl font-black text-gray-900 mb-6 uppercase tracking-widest">Story</h3>
                  <p className="text-xl text-gray-600 leading-relaxed font-medium mb-12">{viewingRestaurant.description}</p>
                  
                  <h3 className="text-2xl font-black text-gray-900 mb-6 uppercase tracking-widest">Menu Highlights</h3>
                  <div className="space-y-4">
                    {viewingRestaurant.menuHighlights?.map((item, i) => (
                      <div key={i} className="p-6 bg-gray-50 rounded-[2rem] border border-gray-100 flex justify-between items-center group hover:bg-white hover:border-orange-200 transition-all shadow-sm hover:shadow-lg">
                        <span className="text-lg font-black text-gray-800">{item}</span>
                        <span className="text-orange-600 font-black">Chef Select</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-12">
                   <div className="p-10 bg-gray-900 rounded-[3rem] text-white shadow-2xl">
                    <h3 className="text-2xl font-black mb-8">Quick Info</h3>
                    <div className="space-y-8">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mr-6">
                           <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Hours Today</p>
                          <p className="text-lg font-bold">{viewingRestaurant.hours}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mr-6">
                           <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Call Venue</p>
                          <p className="text-lg font-bold">{viewingRestaurant.phone}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={() => {
                      setViewingRestaurant(null);
                      handleBooking(viewingRestaurant.id);
                    }}
                    className="w-full py-6 bg-orange-600 text-white font-black rounded-[2.5rem] text-2xl shadow-2xl hover:bg-orange-700 transition-all hover:scale-[1.02] active:scale-[0.98]"
                  >
                    Secure a Table
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <AIChat />
      <VoiceConcierge />

      {notification && (
        <Notification 
          message={notification.message} 
          type={notification.type} 
          onClose={() => setNotification(null)} 
        />
      )}

      {selectedRestaurant && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/90 backdrop-blur-xl" onClick={() => setSelectedRestaurant(null)}></div>
          <div className="relative bg-white w-full max-w-lg rounded-[3.5rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300">
            <div className="p-12 md:p-16">
              <h3 className="text-4xl font-black text-gray-900 font-serif italic mb-2">Reserve</h3>
              <p className="text-xl font-bold text-orange-600 mb-12">{selectedRestaurant.name}</p>
              
              <div className="space-y-8">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Guests</label>
                    <select id="guests" className="w-full p-5 bg-gray-50 border border-gray-100 rounded-2xl font-black text-lg focus:outline-none focus:ring-4 focus:ring-orange-600/10 appearance-none">
                      {[1, 2, 3, 4, 5, 6, 8, 10].map(n => <option key={n} value={n}>{n} People</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Time</label>
                    <select id="time" className="w-full p-5 bg-gray-50 border border-gray-100 rounded-2xl font-black text-lg focus:outline-none focus:ring-4 focus:ring-orange-600/10 appearance-none">
                      {['18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00'].map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Date</label>
                  <input type="date" id="date" min={new Date().toISOString().split('T')[0]} defaultValue={new Date().toISOString().split('T')[0]} className="w-full p-5 bg-gray-50 border border-gray-100 rounded-2xl font-black text-lg focus:outline-none focus:ring-4 focus:ring-orange-600/10" />
                </div>
              </div>

              <button 
                onClick={() => {
                  const g = parseInt((document.getElementById('guests') as HTMLSelectElement).value);
                  const d = (document.getElementById('date') as HTMLInputElement).value;
                  const t = (document.getElementById('time') as HTMLSelectElement).value;
                  confirmBooking(g, d, t);
                }}
                className="w-full mt-12 py-6 bg-gray-900 text-white font-black rounded-[2rem] hover:bg-orange-600 shadow-2xl transition-all hover:scale-105 active:scale-95 text-lg uppercase tracking-widest"
              >
                Confirm Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default App;
