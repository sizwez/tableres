
import React, { useState, useRef, useEffect } from 'react';
import { getRestaurantRecommendations } from '../services/geminiService';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  data?: any;
}

const AIChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Hi! I'm DineSA's food scout. Looking for something special in South Africa tonight? Tell me your vibe or craving!" }
  ]);
  const [loading, setLoading] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    // Call Gemini
    const result = await getRestaurantRecommendations(userMessage);
    
    if (result) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: result.summary,
        data: result.recommendations
      }]);
    } else {
      setMessages(prev => [...prev, { role: 'assistant', content: "I couldn't find specific recommendations right now. Maybe try searching for a specific city or cuisine?" }]);
    }
    setLoading(false);
  };

  return (
    <div className="fixed bottom-24 right-6 md:bottom-10 md:right-10 z-[60]">
      {isOpen ? (
        <div className="bg-white rounded-3xl shadow-2xl w-[90vw] md:w-96 flex flex-col overflow-hidden border border-gray-100 animate-in fade-in slide-in-from-bottom-10 duration-300">
          {/* Header */}
          <div className="bg-orange-600 p-4 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <span className="text-white font-bold">DineSA Scout</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white hover:bg-white/10 p-1 rounded">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          {/* Messages */}
          <div ref={chatRef} className="flex-grow p-4 space-y-4 overflow-y-auto max-h-[50vh]">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${m.role === 'user' ? 'bg-orange-600 text-white rounded-tr-none' : 'bg-gray-100 text-gray-800 rounded-tl-none'}`}>
                  {m.content}
                  {m.data && (
                    <div className="mt-3 space-y-2">
                      {m.data.map((rec: any, idx: number) => (
                        <div key={idx} className="bg-white p-2 rounded-lg border border-gray-200 shadow-sm">
                          <p className="font-bold text-orange-600">{rec.title}</p>
                          <p className="text-xs text-gray-600 leading-tight mt-1">{rec.description}</p>
                          <div className="flex justify-between mt-2 pt-1 border-t border-gray-50">
                            <span className="text-[10px] font-bold text-gray-400 uppercase">{rec.vibe}</span>
                            <span className="text-[10px] font-bold text-gray-700">{rec.typicalSpend}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 p-3 rounded-2xl rounded-tl-none flex space-x-1">
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-75"></div>
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-150"></div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="p-4 border-t border-gray-100">
            <div className="relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask for dinner ideas..."
                className="w-full pl-4 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-600 text-sm"
              />
              <button 
                type="submit" 
                className="absolute right-2 top-2 p-1.5 bg-orange-600 text-white rounded-full hover:bg-orange-700 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
              </button>
            </div>
          </form>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 bg-orange-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all group relative"
        >
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-pulse"></div>
          <span className="absolute right-16 bg-white px-3 py-1.5 rounded-xl shadow-lg text-gray-900 text-xs font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity border border-gray-100">
            Ask the Scout!
          </span>
        </button>
      )}
    </div>
  );
};

export default AIChat;
