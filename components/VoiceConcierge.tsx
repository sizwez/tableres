
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Modality } from '@google/genai';

const VoiceConcierge: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [status, setStatus] = useState('Idle');
  const sessionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  // Decoding raw PCM
  const decodeAudioData = async (data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number) => {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
    for (let channel = 0; channel < numChannels; channel++) {
      const channelData = buffer.getChannelData(channel);
      for (let i = 0; i < frameCount; i++) {
        channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
      }
    }
    return buffer;
  };

  const decodeBase64 = (base64: string) => {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  };

  const createBlob = (data: Float32Array) => {
    const int16 = new Int16Array(data.length);
    for (let i = 0; i < data.length; i++) {
      int16[i] = data[i] * 32768;
    }
    const bytes = new Uint8Array(int16.buffer);
    let binary = '';
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return {
      data: btoa(binary),
      mimeType: 'audio/pcm;rate=16000',
    };
  };

  const toggleConcierge = async () => {
    if (isActive) {
      sessionRef.current?.close();
      setIsActive(false);
      setStatus('Idle');
      return;
    }

    setIsConnecting(true);
    setStatus('Connecting...');

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      audioContextRef.current = audioCtx;

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        callbacks: {
          onopen: () => {
            setIsConnecting(false);
            setIsActive(true);
            setStatus('Listening...');
            
            const source = inputCtx.createMediaStreamSource(stream);
            const processor = inputCtx.createScriptProcessor(4096, 1, 1);
            processor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              sessionPromise.then(s => s.sendRealtimeInput({ media: createBlob(inputData) }));
            };
            source.connect(processor);
            processor.connect(inputCtx.destination);
          },
          onmessage: async (msg) => {
            const base64Audio = msg.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (base64Audio && audioContextRef.current) {
              const ctx = audioContextRef.current;
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
              const buffer = await decodeAudioData(decodeBase64(base64Audio), ctx, 24000, 1);
              const source = ctx.createBufferSource();
              source.buffer = buffer;
              source.connect(ctx.destination);
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += buffer.duration;
              sourcesRef.current.add(source);
              source.onended = () => sourcesRef.current.delete(source);
            }

            if (msg.serverContent?.interrupted) {
              sourcesRef.current.forEach(s => s.stop());
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
            }
          },
          onclose: () => {
            setIsActive(false);
            setStatus('Disconnected');
          },
          onerror: (e) => {
            console.error('Voice Concierge Error:', e);
            setIsActive(false);
          }
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } } },
          systemInstruction: "You are the DineSA Platinum Concierge. You speak in a friendly, helpful, and sophisticated South African accent (think elegant and warm). Help users find restaurants, explain food culture, or discuss deals in South Africa. Keep responses concise as this is a voice interaction."
        }
      });

      sessionRef.current = await sessionPromise;
    } catch (err) {
      console.error('Failed to start concierge:', err);
      setIsConnecting(false);
    }
  };

  return (
    <div className="fixed bottom-6 left-6 z-[60]">
      <div className={`relative transition-all duration-500 ${isActive ? 'mb-4' : ''}`}>
        {isActive && (
          <div className="bg-white/80 backdrop-blur-2xl p-4 rounded-3xl shadow-2xl border border-white mb-4 animate-in fade-in slide-in-from-bottom-4 flex items-center space-x-4 w-64">
            <div className="flex space-x-1 items-center">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="w-1 bg-orange-600 rounded-full animate-pulse" style={{ height: `${Math.random() * 20 + 5}px`, animationDelay: `${i * 0.1}s` }}></div>
              ))}
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-orange-600 uppercase tracking-widest">Platinum Concierge</span>
              <span className="text-sm font-bold text-gray-900 line-clamp-1">{status}</span>
            </div>
          </div>
        )}
        
        <button 
          onClick={toggleConcierge}
          disabled={isConnecting}
          className={`w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all active:scale-90 relative overflow-hidden ${
            isActive ? 'bg-red-600 text-white animate-pulse' : 'bg-gray-900 text-white hover:bg-orange-600'
          }`}
        >
          {isConnecting ? (
            <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : isActive ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          ) : (
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/><path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/></svg>
          )}
          
          {/* Ripple effect */}
          {!isActive && (
            <div className="absolute inset-0 bg-white/20 scale-0 group-hover:scale-100 transition-transform duration-500 rounded-full"></div>
          )}
        </button>
      </div>
    </div>
  );
};

export default VoiceConcierge;
