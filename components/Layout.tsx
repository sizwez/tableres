
import React from 'react';
import { AppView } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeView: AppView;
  onViewChange: (view: AppView) => void;
  isPremium: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, activeView, onViewChange, isPremium }) => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-2">
              <div 
                className="flex-shrink-0 flex items-center cursor-pointer"
                onClick={() => onViewChange(AppView.HOME)}
              >
                <span className="text-2xl font-black tracking-tighter text-orange-600 font-serif italic">Dine</span>
                <span className="text-2xl font-bold tracking-tight text-gray-900">SA</span>
              </div>
              <div className="hidden md:ml-8 md:flex md:space-x-8">
                <button
                  onClick={() => onViewChange(AppView.BROWSE)}
                  className={`${activeView === AppView.BROWSE ? 'border-orange-500 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                >
                  Explore
                </button>
                <button
                  onClick={() => onViewChange(AppView.DEALS)}
                  className={`${activeView === AppView.DEALS ? 'border-orange-500 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                >
                  Hot Deals
                </button>
                <button
                  onClick={() => onViewChange(AppView.BOOKINGS)}
                  className={`${activeView === AppView.BOOKINGS ? 'border-orange-500 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                >
                  My Tables
                </button>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {!isPremium && (
                <button
                  onClick={() => onViewChange(AppView.PREMIUM)}
                  className="hidden sm:inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-full shadow-sm text-white bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700"
                >
                  Go Premium
                </button>
              )}
              {isPremium && (
                <div className="flex items-center px-3 py-1 bg-amber-50 rounded-full border border-amber-200">
                  <span className="text-xs font-bold text-amber-600 uppercase tracking-widest">Premium Member</span>
                </div>
              )}
              <div className="flex-shrink-0">
                <img
                  className="h-8 w-8 rounded-full border border-gray-200"
                  src="https://picsum.photos/seed/user/100/100"
                  alt="User profile"
                />
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center">
              <span className="text-xl font-black text-orange-600 font-serif italic">Dine</span>
              <span className="text-xl font-bold text-gray-900 ml-1">SA</span>
              <p className="ml-4 text-sm text-gray-500">© 2024 DineSA Platform. All rights reserved.</p>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-gray-500 text-sm">Terms</a>
              <a href="#" className="text-gray-400 hover:text-gray-500 text-sm">Privacy</a>
              <a href="#" className="text-gray-400 hover:text-gray-500 text-sm">Contact</a>
              <a href="#" className="text-gray-400 hover:text-gray-500 text-sm font-semibold text-orange-600">Restaurant Portal</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Mobile Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around py-3 px-2 z-50">
        <button onClick={() => onViewChange(AppView.HOME)} className={`flex flex-col items-center ${activeView === AppView.HOME ? 'text-orange-600' : 'text-gray-500'}`}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
          <span className="text-[10px] mt-1">Home</span>
        </button>
        <button onClick={() => onViewChange(AppView.BROWSE)} className={`flex flex-col items-center ${activeView === AppView.BROWSE ? 'text-orange-600' : 'text-gray-500'}`}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <span className="text-[10px] mt-1">Explore</span>
        </button>
        <button onClick={() => onViewChange(AppView.DEALS)} className={`flex flex-col items-center ${activeView === AppView.DEALS ? 'text-orange-600' : 'text-gray-500'}`}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" /></svg>
          <span className="text-[10px] mt-1">Deals</span>
        </button>
        <button onClick={() => onViewChange(AppView.BOOKINGS)} className={`flex flex-col items-center ${activeView === AppView.BOOKINGS ? 'text-orange-600' : 'text-gray-500'}`}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          <span className="text-[10px] mt-1">Bookings</span>
        </button>
      </div>
    </div>
  );
};

export default Layout;
