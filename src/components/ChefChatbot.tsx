import React, { useState, useRef, useEffect } from "react";
import { Send, X, Sparkles, ChefHat, Volume2, VolumeX, Mic, MessageSquare, Play, Square, CircleHelp, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { ChatMessage } from "../types";

interface ChefChatbotProps {
  lang?: "en" | "te";
}

export const ChefChatbot: React.FC<ChefChatbotProps> = ({ lang = "en" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [voiceModeActive, setVoiceModeActive] = useState(false);
  const [soundMuted, setSoundMuted] = useState(false);
  const isTelugu = lang === "te";

  const getGreeting = () => {
    if (isTelugu) {
      return "Namaskaram! Nenu mee Premium AI Chef. 👨‍🍳\n\nEe roju meeku ఏ vantakam cheyadamlo సహాయం cheyyano adagandi? Custom substitutions, recipe troubleshooting modhalainavi adhi adbhuthamga chepthanu!";
    }
    return "Bonjour! I am your AI Chef de Cuisine. 👨‍🍳\n\nAsk me anything! From fixing a salty sauce to finding elite dairy substitutes, consider me your digital kitchen companion.";
  };

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = sessionStorage.getItem("ai_chef_chat_history");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // ignore
      }
    }
    return [
      {
        role: "model",
        text: getGreeting(),
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ];
  });

  useEffect(() => {
    const saved = sessionStorage.getItem("ai_chef_chat_history");
    if (!saved || JSON.parse(saved).length <= 1) {
      setMessages([
        {
          role: "model",
          text: getGreeting(),
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    }
  }, [lang]);

  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    sessionStorage.setItem("ai_chef_chat_history", JSON.stringify(messages));
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      role: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend,
          history: messages.slice(-8),
          lang,
        }),
      });

      if (!response.ok) {
        throw new Error(isTelugu ? "Stove thappu chesindi!" : "Soup got scorched on the stove!");
      }

      const data = await response.json();
      const chefMsg: ChatMessage = {
        role: "model",
        text: data.text || (isTelugu ? "Manninchandi, maku thala noppi vachindi." : "Pardon, something tasted wrong with my neural culinary engine!"),
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, chefMsg]);

      // Simulated voice feedback speech synthesis if sounds are active
      if (!soundMuted && "speechSynthesis" in window) {
        try {
          window.speechSynthesis.cancel();
          const cleanText = chefMsg.text.replace(/[\*#_]/g, "");
          const utterance = new SpeechSynthesisUtterance(cleanText.slice(0, 150));
          utterance.lang = lang === "te" ? "te-IN" : "en-US";
          utterance.rate = 1.05;
          window.speechSynthesis.speak(utterance);
        } catch (voiceErr) {
          // Speak fallback ignored silently
        }
      }
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        role: "model",
        text: isTelugu 
          ? "Oops! Naa poyyi konchem heat ekkuvairayyi aagindhi. Malli try cheyyandi."
          : "Oops! My burner took a brief pause. Let's fire that culinary query up again.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickPrompts = isTelugu ? [
    { label: "🥚 Substitute eggs?", text: "Egg ki badalu baking ledha vantalloki em vaadavachoo cheppandi?" },
    { label: "🔥 Less Spicy tricks?", text: "Nenu chesina koorlo karam ekkuva aindhi. Ela thagginchalo cheppandi?" },
    { label: "🧅 Simple Aloo dishes?", text: "Potato mariyu ulli payalu thoni simple ga em vantalu cheyyocchu?" },
  ] : [
    { label: "🥚 Swap Eggs", text: "What is a good substitute for eggs in dessert baking?" },
    { label: "🔥 Too Spicy?", text: "I made my gravy far too spicy. How do I balance the heat?" },
    { label: "🍋 Dry Lemons", text: "What clever culinary tricks can I do with leftover dry lemons?" },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans select-none print:hidden">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.94 }}
            transition={{ type: "spring", damping: 25, stiffness: 350 }}
            className="mb-5 w-[360px] sm:w-[410px] h-[580px] rounded-[2.5rem] shadow-[0_25px_60px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col border border-neutral-200/20 dark:border-zinc-800/80 bg-stone-900/40 dark:bg-zinc-950/45 backdrop-blur-3xl"
            id="chef-chatbot-box"
          >
            {/* Ambient Aurora inside Chat Box top portion */}
            <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-brand-orange/15 to-transparent pointer-events-none" />

            {/* Header */}
            <div className="relative px-6 py-5 flex items-center justify-between border-b border-white/10 text-white">
              <div className="flex items-center gap-3.5">
                {/* Floating AI Chef Avatar (concentric glowing loops) */}
                <div className="relative">
                  <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-brand-orange to-yellow-500 opacity-60 blur-xs animate-pulse" />
                  <div className="relative h-11 w-11 rounded-full bg-zinc-900 border-2 border-white/20 flex items-center justify-center overflow-hidden">
                    <img 
                      src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=150&q=80" 
                      alt="Chef de Cuisine Avatar" 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <span className="absolute bottom-0 right-0 h-3 w-3 bg-emerald-400 border-2 border-zinc-900 rounded-full"></span>
                </div>
                <div>
                  <h3 className="font-display font-black text-sm tracking-tight leading-none text-white flex items-center gap-1.5">
                    <span>Chef de Cuisine</span>
                    <Sparkles className="w-4 h-4 text-amber-400 animate-bounce" />
                  </h3>
                  <span className="text-[10px] uppercase font-black tracking-wider text-amber-500/90 block mt-1">
                    ChatGPT Powered
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1">
                {/* Sound Speak Toggle */}
                <button
                  type="button"
                  onClick={() => {
                    setSoundMuted(!soundMuted);
                    if (!soundMuted && "speechSynthesis" in window) {
                      window.speechSynthesis.cancel();
                    }
                  }}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors text-zinc-300 hover:text-white"
                  title={soundMuted ? "Unmute vocal responses" : "Mute vocal responses"}
                >
                  {soundMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
                </button>
                {/* Simulated Premium Voice Intercom Mode */}
                <button
                  type="button"
                  onClick={() => setVoiceModeActive(!voiceModeActive)}
                  className={`p-2 rounded-full transition-colors ${voiceModeActive ? 'bg-brand-orange text-white' : 'hover:bg-white/10 text-zinc-300'}`}
                  title="Toggle ChatGPT Voice Mode"
                >
                  <Mic className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors text-zinc-300"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Chat Body Wrapper */}
            <div className="flex-1 relative overflow-hidden flex flex-col min-h-0">
              <AnimatePresence mode="wait">
                {voiceModeActive ? (
                  /* EXQUISITE SIMULATED VOICE INTERCOM PANEL (Inspired by ChatGPT Advanced Voice Mode) */
                  <motion.div
                    key="voice-mode-screen"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex-1 flex flex-col items-center justify-between p-8 text-center bg-zinc-950/90 relative"
                  >
                    <div className="space-y-1 mt-4">
                      <span className="text-[10px] text-amber-400 uppercase font-black tracking-widest block">AI Culinary Intercom</span>
                      <h4 className="text-white font-display font-bold text-lg">ChatGPT Advanced Core speak</h4>
                    </div>

                    {/* Highly responsive acoustic audio wave spheres */}
                    <div className="relative flex items-center justify-center w-40 h-40">
                      {/* Concentric expanding ripples */}
                      <div className="absolute inset-0 rounded-full bg-brand-orange/5 animate-ping [animation-duration:3s]" />
                      <div className="absolute inset-4 rounded-full bg-yellow-500/10 animate-ping [animation-duration:2s]" />
                      
                      <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-brand-orange via-amber-500 to-yellow-400 flex items-center justify-center shadow-[0_0_50px_rgba(255,122,0,0.4)]">
                        <Volume2 className="w-10 h-10 text-white animate-pulse" />
                      </div>

                      {/* Moving vertical bars */}
                      <div className="absolute bottom-0 flex items-end gap-1.5 h-8">
                        {[4, 8, 14, 20, 12, 18, 9, 6].map((h, i) => (
                          <motion.span
                            key={i}
                            animate={{ height: [h + "px", (h * 2.2) + "px", h + "px"] }}
                            transition={{ repeat: Infinity, duration: 0.6 + i * 0.1, ease: "easeInOut" }}
                            className="w-1 rounded-full bg-amber-400 block"
                          />
                        ))}
                      </div>
                    </div>

                    <div className="space-y-6 w-full">
                      <p className="text-xs text-zinc-400 max-w-xs mx-auto leading-relaxed italic">
                        {isTelugu 
                          ? "Chef tho matladuthunnaru. Ee interactive mode mee matalani dynamic ga screen paina update chesthundi."
                          : "Listening closely... Say 'What can I substitute garlic with?' or 'How do I thick up soup?'"
                        }
                      </p>
                      
                      <button
                        onClick={() => setVoiceModeActive(false)}
                        className="px-6 py-3 bg-red-550 hover:bg-red-650 text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-lg cursor-pointer transition-transform hover:scale-105"
                      >
                        Disconnect Voice
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  /* Standard Chef Text Chat Log screen */
                  <motion.div
                    key="text-mode-screen"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex-1 flex flex-col min-h-0 justify-between"
                  >
                    {/* Chat Messages */}
                    <div className="flex-1 overflow-y-auto p-5 space-y-4 scrollbar-thin bg-black/10 dark:bg-black/30">
                      {messages.map((msg, idx) => (
                        <div
                          key={idx}
                          className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-[85%] rounded-[1.6rem] px-4.5 py-3.5 text-xs md:text-sm font-medium leading-relaxed shadow-lg ${
                              msg.role === "user"
                                ? "bg-gradient-to-tr from-brand-orange to-yellow-500 text-white rounded-br-xs"
                                : "bg-white/85 dark:bg-zinc-900/85 border border-neutral-200/10 text-stone-800 dark:text-zinc-200 rounded-bl-xs"
                            }`}
                          >
                            <p className="whitespace-pre-wrap">{msg.text}</p>
                            <span
                              className={`block text-[8px] font-black uppercase text-right mt-1.5 tracking-wider ${
                                msg.role === "user" ? "text-amber-100" : "text-stone-400 dark:text-zinc-550"
                              }`}
                            >
                              {msg.timestamp}
                            </span>
                          </div>
                        </div>
                      ))}

                      {isLoading && (
                        <div className="flex justify-start">
                          <div className="bg-white/80 dark:bg-zinc-900/80 rounded-[1.4rem] rounded-bl-xs px-4.5 py-3 border border-stone-200/5 dark:border-zinc-800/20 shadow-lg flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-brand-orange animate-bounce [animation-delay:-0.3s]"></span>
                            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-bounce [animation-delay:-0.15s]"></span>
                            <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 animate-bounce"></span>
                          </div>
                        </div>
                      )}
                      <div ref={messagesEndRef} />
                    </div>

                    {/* Quick Prompts Helper */}
                    {messages.length <= 1 && (
                      <div className="px-5 py-3.5 border-t border-white/5 bg-zinc-900/30 backdrop-blur-3xl">
                        <span className="text-[10px] font-black uppercase tracking-wider text-amber-500 block mb-2">
                          💡 Suggestive culinary queries:
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {quickPrompts.map((p, idx) => (
                            <button
                              key={idx}
                              onClick={() => handleSendMessage(p.text)}
                              className="text-[10px] font-extrabold px-3.5 py-2 rounded-full border border-neutral-300/10 hover:border-brand-orange text-stone-300 hover:text-white bg-zinc-900/50 hover:bg-brand-orange/15 transition-all cursor-pointer"
                            >
                              {p.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Input Bar */}
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleSendMessage(inputText);
                      }}
                      className="p-4 border-t border-white/5 bg-zinc-950/60 dark:bg-zinc-950/80 flex items-center gap-2"
                    >
                      <input
                        type="text"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder={isTelugu ? "Vanta gurinchi adagandi (e.g., egg replace)..." : "Ask chef (e.g., balance spices, swap eggs)..."}
                        disabled={isLoading}
                        className="flex-1 text-xs bg-white/10 dark:bg-zinc-900/80 border border-white/5 dark:border-zinc-800/80 rounded-2xl px-4 py-3.5 text-white placeholder-zinc-400 focus:outline-none focus:border-brand-orange/60 disabled:opacity-50"
                      />
                      <button
                        type="submit"
                        disabled={!inputText.trim() || isLoading}
                        className="p-3 bg-gradient-to-tr from-brand-orange to-yellow-500 text-white rounded-2xl hover:opacity-95 disabled:opacity-45 transition-all cursor-pointer shadow-md shadow-orange-500/20"
                        id="send-chat-btn"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Sparkly Launcher Bubble Button */}
      <motion.button
        whileHover={{ scale: 1.08, shadow: "0 0 30px rgba(255,122,0,0.4)" }}
        whileTap={{ scale: 0.92 }}
        onClick={() => setIsOpen(!isOpen)}
        className="h-16 w-16 rounded-full bg-gradient-to-tr from-brand-orange via-amber-500 to-yellow-500 text-white flex items-center justify-center shadow-[0_10px_35px_rgba(255,122,0,0.35)] cursor-pointer relative border border-white/10"
        id="toggle-chatbot-bubble"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative"
            >
              <ChefHat className="w-6 h-6 text-white" />
              <span className="absolute -top-1 -right-1 block h-3 w-3 rounded-full bg-emerald-400 ring-4 ring-neutral-900"></span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
};
