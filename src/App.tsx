import React, { useState, useEffect } from "react";
import {
  Sparkles,
  Search,
  Mic,
  MicOff,
  ChefHat,
  Bookmark,
  Share2,
  Download,
  Utensils,
  BookOpen,
  Clock,
  Gauge,
  Flame,
  Info,
  Check,
  CheckCircle,
  RotateCcw,
  Printer,
  Heart,
  AlertTriangle,
  Lightbulb,
  Grid,
  Menu,
  Sun,
  Moon,
  Volume2,
  RefreshCw,
  ChevronRight,
  Sparkle,
  Eye,
  CheckSquare,
  Compass,
  Award,
  ArrowDown
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { ChefChatbot } from "./components/ChefChatbot";
import { MealPlanner } from "./components/MealPlanner";
import { Recipe, Ingredient, Substitute, DiscoveryResult, DiscoveryRecommendation } from "./types";

// Premium curated food gallery matching the 60% photography direction
const TRENDING_PRESETS = [
  {
    title: "Truffle Tagliatelle Carbonara",
    cuisine: "Italian",
    prepTime: "12 mins",
    cookTime: "15 mins",
    difficulty: "Medium",
    image: "https://images.unsplash.com/photo-1612874742237-6526221588e3?auto=format&fit=crop&w=700&q=80",
    description: "Al dente fresh egg ribbons coated in a silky emulsion of cured guanciale rind, pecorino cheese, fresh yolk, and shaved winter truffles.",
    rating: "5.0",
    category: "Dinner"
  },
  {
    title: "Saffron Hyderabadi Mutton Biryani",
    cuisine: "Indian",
    prepTime: "25 mins",
    cookTime: "45 mins",
    difficulty: "Hard",
    image: "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=700&q=80",
    description: "Heirloom long-grain basmati steamed in authentic dum style layered with milk-soaked saffron threads and tender overnight marinated local mutton.",
    rating: "4.9",
    category: "Lunch"
  },
  {
    title: "Seared Salmon with Herb Glaze",
    cuisine: "French",
    prepTime: "10 mins",
    cookTime: "12 mins",
    difficulty: "Easy",
    image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=700&q=80",
    description: "Pacific wild salmon fillet skin-seared to crispy perfection, bathed in warm browned butter infused with dill fronds, meyer lemon, and caperberries.",
    rating: "4.95",
    category: "Dinner"
  },
  {
    title: "Velvety Matcha Lava Fondant",
    cuisine: "Desserts",
    prepTime: "12 mins",
    cookTime: "14 mins",
    difficulty: "Medium",
    image: "https://images.unsplash.com/photo-1508737027454-e6454ef45afd?auto=format&fit=crop&w=700&q=80",
    description: "Soft matcha sponge cushion filled with liquid core of molten white chocolate and premium Uji ceremonial green tea cream.",
    rating: "4.85",
    category: "Desserts"
  }
];

const PRESET_CATEGORIES = [
  { name: "Breakfast", icon: "🍳", query: "Fluffy Japanese Souffle Pancakes or luxury Eggs Benedict" },
  { name: "Lunch", icon: "🍱", query: "Creamy Tomato Basil Gnocchi or Szechuan Sesame Salad" },
  { name: "Dinner", icon: "🍲", query: "Grilled Rosemary Lamb chops or Seafood Paella" },
  { name: "Snacks", icon: "🌮", query: "Avo sourdough toast with microgreens or crispy tacos" },
  { name: "Desserts", icon: "🧁", query: "Belgian Chocolate Fondant or Creamy Lemon Tiramisu" },
  { name: "Beverages", icon: "🍹", query: "Fresh summer mint cucumber cooler or hot spiced chai latte" }
];

const QUICK_SEARCH_PILLS = [
  "Garlic Butter Lobster Tail",
  "Hyderabadi Chicken Dum Biryani",
  "Salted Caramel Soufflé",
  "Black Pepper Tofu Cube",
  "Rosemary Garlic Ribeye",
  "Pan-Seared Wagyu Burger"
];

// High-fidelity Unsplash photography mapper
const getDishImage = (title: string): string => {
  const normalized = title.toLowerCase();
  
  if (normalized.includes("shrimp") || normalized.includes("prawn") || normalized.includes("royyalu") || normalized.includes("seafood")) {
    return "https://images.unsplash.com/photo-1559742811-8241323f465d?auto=format&fit=crop&w=800&q=80";
  }
  if (normalized.includes("biryani") || normalized.includes("pulao") || normalized.includes("rice") || normalized.includes("annam")) {
    return "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=800&q=80";
    }
  if (normalized.includes("paneer") || normalized.includes("cheese") || normalized.includes("tofu") || normalized.includes("haloumi")) {
    return "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=800&q=80";
  }
  if (normalized.includes("pizza") || normalized.includes("crust") || normalized.includes("focaccia")) {
    return "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80";
  }
  if (normalized.includes("chicken") || normalized.includes("murgh") || normalized.includes("kodi") || normalized.includes("tandoori") || normalized.includes("duck")) {
    return "https://images.unsplash.com/photo-1626200419199-391ae4be7a40?auto=format&fit=crop&w=800&q=80";
  }
  if (normalized.includes("cake") || normalized.includes("lava") || normalized.includes("chocolate") || normalized.includes("tiramisu") || normalized.includes("pudding") || normalized.includes("dessert") || normalized.includes("sweet")) {
    return "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80";
  }
  if (normalized.includes("salad") || normalized.includes("healthy") || normalized.includes("green") || normalized.includes("bowl")) {
    return "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80";
  }
  if (normalized.includes("soup") || normalized.includes("charu") || normalized.includes("rasam") || normalized.includes("sambar") || normalized.includes("broth")) {
    return "https://images.unsplash.com/photo-1547592165-e1d17fed6005?auto=format&fit=crop&w=800&q=80";
  }
  if (normalized.includes("pasta") || normalized.includes("noodle") || normalized.includes("spaghetti") || normalized.includes("ramen")) {
    return "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80";
  }
  if (normalized.includes("curry") || normalized.includes("koora") || normalized.includes("masala") || normalized.includes("gravy") || normalized.includes("korma")) {
    return "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=800&q=80";
  }
  if (normalized.includes("meat") || normalized.includes("steak") || normalized.includes("beef") || normalized.includes("pork") || normalized.includes("lamb") || normalized.includes("ribeye")) {
    return "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80";
  }
  if (normalized.includes("taco") || normalized.includes("burger") || normalized.includes("burrito") || normalized.includes("quesadilla")) {
    return "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80";
  }

  const fallbacks = [
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?auto=format&fit=crop&w=800&q=80"
  ];
  return fallbacks[Math.abs(title.length) % fallbacks.length];
};

export default function App() {
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    const saved = localStorage.getItem("ai_recipe_book_theme");
    return saved === "dark" ? "dark" : "dark"; // Defaulting to refined dark mode for premium cinematic feeling
  });

  const [language, setLanguage] = useState<"en" | "te">(() => {
    const saved = localStorage.getItem("ai_recipe_book_lang");
    return saved === "te" ? "te" : "en";
  });

  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  // Form states
  const [recipeNameInput, setRecipeNameInput] = useState("");
  const [ingredientsInput, setIngredientsInput] = useState("");
  const [cuisineInput, setCuisineInput] = useState("Indian");
  const [dietaryInput, setDietaryInput] = useState("Vegetarian");

  // Web Speech API Microphone setup
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);

  // Active loaded recipe
  const [activeRecipe, setActiveRecipe] = useState<Recipe | null>(null);
  const [loadingRecipe, setLoadingRecipe] = useState(false);
  const [recipeError, setRecipeError] = useState<string | null>(null);

  // Discovery cupboard pantry matcher state
  const [discoveryInput, setDiscoveryInput] = useState("");
  const [loadingDiscovery, setLoadingDiscovery] = useState(false);
  const [discoveryResult, setDiscoveryResult] = useState<DiscoveryResult | null>(null);
  const [discoveryError, setDiscoveryError] = useState<string | null>(null);

  // Saved / historical list caches
  const [savedRecipes, setSavedRecipes] = useState<Recipe[]>(() => {
    const saved = localStorage.getItem("ai_recipe_saved_list");
    return saved ? JSON.parse(saved) : [];
  });
  const [historyRecipes, setHistoryRecipes] = useState<Recipe[]>(() => {
    const saved = localStorage.getItem("ai_recipe_history_list");
    return saved ? JSON.parse(saved) : [];
  });

  const [activeTab, setActiveTab] = useState<"dashboard" | "generator" | "discover" | "planner" | "saved">("dashboard");
  const [toast, setToast] = useState<{ message: string; type: "success" | "info" } | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Fallback states for dashboard bento box images
  const [pantryImgFailed, setPantryImgFailed] = useState(false);
  const [dietImgFailed, setDietImgFailed] = useState(false);

  // Premium Interactive Sliders and Widgets state variables
  const [furnaceHeat, setFurnaceHeat] = useState<"gentle" | "sizzling" | "blazing">("gentle");
  const [furnaceHumidity, setFurnaceHumidity] = useState(45);
  const [sensoryUmami, setSensoryUmami] = useState(70);
  const [sensorySpicy, setSensorySpicy] = useState(40);
  const [sensorySweet, setSensorySweet] = useState(30);
  const [sensoryHerbs, setSensoryHerbs] = useState(60);
  const [sensorySalt, setSensorySalt] = useState(45);
  const [carbonWasteWeight, setCarbonWasteWeight] = useState(12); // weekly organic waste kg estimator
  
  // local active study technique indicator for the masterclass slider details
  const [selectedTechniqueIdx, setSelectedTechniqueIdx] = useState<number | null>(null);

  // Theme support
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("ai_recipe_book_theme", theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("ai_recipe_book_lang", language);
  }, [language]);

  useEffect(() => {
    setCompletedSteps([]);
  }, [activeRecipe]);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3500);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Speech recognition listener hook
  useEffect(() => {
    const SpeechAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechAPI) {
      setVoiceSupported(true);
      const rec = new SpeechAPI();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = language === "te" ? "te-IN" : "en-US";

      rec.onstart = () => {
        setIsSpeaking(true);
      };

      rec.onresult = (e: any) => {
        const transcript = e.results[0][0].transcript;
        setRecipeNameInput(transcript);
        showToast(language === "te" ? `Gurtinchabadina Swaram: "${transcript}"` : `Mic parsed: "${transcript}"`, "success");
        setIsSpeaking(false);
        generateRecipe(transcript, ingredientsInput, cuisineInput, dietaryInput);
        setActiveTab("generator");
      };

      rec.onerror = () => {
        setIsSpeaking(false);
        showToast("Microphone capture issue. Check browser permissions.", "info");
      };

      rec.onend = () => {
        setIsSpeaking(false);
      };

      setRecognition(rec);
    }
  }, [cuisineInput, dietaryInput, language, ingredientsInput]);

  const showToast = (message: string, type: "success" | "info" = "success") => {
    setToast({ message, type });
  };

  const toggleMic = () => {
    if (!voiceSupported) {
      showToast("Speech synthesis is unavailable in this container context.", "info");
      return;
    }
    if (isSpeaking) {
      recognition?.stop();
    } else {
      recognition?.start();
    }
  };

  // Generate Recipe handler
  const generateRecipe = async (
    titleQuery: string = recipeNameInput,
    ingredientsQuery: string = ingredientsInput,
    cuisineVal: string = cuisineInput,
    dietaryVal: string = dietaryInput
  ) => {
    const query = titleQuery.trim();
    if (!query) {
      showToast(language === "te" ? "Vantakam peru vrayandi modhata!" : "What are we cooking today? Type a cuisine or dish name first!", "info");
      return;
    }

    setLoadingRecipe(true);
    setRecipeError(null);
    setActiveRecipe(null);
    setActiveTab("generator");

    try {
      const response = await fetch("/api/generate-recipe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipeName: query,
          ingredients: ingredientsQuery,
          cuisine: cuisineVal,
          dietary: dietaryVal,
          lang: language
        })
      });

      if (!response.ok) {
        throw new Error(language === "te"
          ? "Network error jarigindhi. Gemini stove andhathaledhu."
          : "Stove got a bit unstable while casting the recipe. Please try again."
        );
      }

      const raw = await response.json();
      const updatedRecipe: Recipe = {
        ...raw,
        id: "recipe-" + Date.now(),
        cuisine: cuisineVal,
        dietary: dietaryVal,
        isFavorite: false,
        createdAt: new Date().toLocaleDateString(),
        image: getDishImage(raw.title || query)
      };

      setActiveRecipe(updatedRecipe);

      // Save historical state
      setHistoryRecipes((prev) => {
        const filtered = prev.filter((r) => r.title.toLowerCase() !== updatedRecipe.title.toLowerCase());
        const composite = [updatedRecipe, ...filtered].slice(0, 8);
        localStorage.setItem("ai_recipe_history_list", JSON.stringify(composite));
        return composite;
      });

      showToast(language === "te" ? "AI Recipe Siddhamaindi!" : "Elite recipe synthesized successfully!", "success");
    } catch (err: any) {
      setRecipeError(err.message || "Failed to generate your personalized recipe.");
    } finally {
      setLoadingRecipe(false);
    }
  };

  // Match ingredients from Cupboard
  const runPantryMatch = async () => {
    if (!discoveryInput.trim()) {
      showToast(language === "te" ? "Cupboard lo dravyaalu type cheyyandi!" : "Please write what ingredients you have in the cupboard first!", "info");
      return;
    }

    setLoadingDiscovery(true);
    setDiscoveryError(null);
    setDiscoveryResult(null);

    try {
      const response = await fetch("/api/discover-recipes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ingredients: discoveryInput,
          lang: language
        })
      });

      if (!response.ok) {
        throw new Error("Pantry scanner suffered a brief glitch.");
      }

      const resData = await response.json();
      setDiscoveryResult(resData);
      showToast(language === "te" ? "Dravyaalaku tagga options vachaayi!" : "Found exciting match recommendations!", "success");
    } catch (err: any) {
      setDiscoveryError(err.message || "Unable to parse ingredients.");
    } finally {
      setLoadingDiscovery(false);
    }
  };

  const selectDiscoveredRecipe = (title: string) => {
    setRecipeNameInput(title);
    setIngredientsInput(discoveryInput);
    generateRecipe(title, discoveryInput, cuisineInput, "Pantry ingredients match");
  };

  const handleToggleBookmark = (recipe: Recipe) => {
    const isSaved = savedRecipes.some((r) => r.title.toLowerCase() === recipe.title.toLowerCase());
    let computed;
    if (isSaved) {
      computed = savedRecipes.filter((r) => r.title.toLowerCase() !== recipe.title.toLowerCase());
      showToast("Removed from bookmarked library", "info");
    } else {
      const recipeToSave = { ...recipe, isFavorite: true };
      computed = [recipeToSave, ...savedRecipes];
      showToast("Added to bookmarked library!", "success");
    }
    setSavedRecipes(computed);
    localStorage.setItem("ai_recipe_saved_list", JSON.stringify(computed));

    if (activeRecipe && activeRecipe.title.toLowerCase() === recipe.title.toLowerCase()) {
      setActiveRecipe({ ...activeRecipe, isFavorite: !isSaved });
    }
  };

  const copyRecipeShareText = (recipe: Recipe) => {
    const text = `🍽️ *${recipe.title}*
✨ _"${recipe.description}"_
⏰ Prep: ${recipe.prepTime} | Cook: ${recipe.cookTime} | Serves: ${recipe.servings}
🔥 Calorie Metrics: ${recipe.nutrition.calories} kCal | ${recipe.nutrition.protein} Protein
🧑‍🍳 Transcribe stunning recipes instantly with AI Recipe Book!`;

    navigator.clipboard.writeText(text);
    showToast("Share brief copied into clipboard!", "success");
  };

  const downloadRecipeFile = (recipe: Recipe) => {
    const fileContent = `=============================================
🍽️ ${recipe.title.toUpperCase()}
✨ Mastercrafted with Premium AI Chef
=============================================
Cuisine Category: ${recipe.cuisine || "Global Fusion"}
Prep Time: ${recipe.prepTime} | Cook Time: ${recipe.cookTime}
Servings: ${recipe.servings} | Difficulty: ${recipe.difficulty}

NUTRITIONAL PROFILE:
- ${recipe.nutrition.calories} Calories
- ${recipe.nutrition.protein} Protein
- ${recipe.nutrition.carbs} Carbs
- ${recipe.nutrition.fats} Fats

INGREDIENTS LIST:
${recipe.ingredients.map((ing) => `- [ ] ${ing.name} [${ing.quantity}] ${ing.tag ? `(${ing.tag})` : ""}`).join("\n")}

COOKING TIMELINE INSTRUCTIONS:
${recipe.instructions.map((step, id) => `[STAGE ${id + 1}] ${step}`).join("\n\n")}

CHEF SECRET TIPS:
${recipe.tips.map((t, id) => `Tip ${id + 1}: ${t}`).join("\n")}

CRITICAL ERRORS TO AVOID:
${recipe.mistakes.map((m, id) => `Mistake ${id + 1}: ${m}`).join("\n")}

Generated dynamically on ${recipe.createdAt || new Date().toLocaleDateString()}.`;

    const blob = new Blob([fileContent], { type: "text/plain;charset=utf-8" });
    const fileUrl = URL.createObjectURL(blob);
    const downloadAction = document.createElement("a");
    downloadAction.href = fileUrl;
    downloadAction.download = `${recipe.title.toLowerCase().replace(/\s+/g, "-")}-elite-recipe.txt`;
    downloadAction.click();
    showToast("Recipe downloaded successfully!", "success");
  };

  const toggleCheckedIngredient = (index: number) => {
    if (!activeRecipe) return;
    const items = [...activeRecipe.ingredients];
    items[index] = {
      ...items[index],
      checked: !items[index].checked
    };
    setActiveRecipe({
      ...activeRecipe,
      ingredients: items
    });
  };

  // Exquisite Apple-Fitness style circular progress rings (Multi-layered, customizable glow margins)
  const paintCircularNutritionProgress = (valString: string, glowColor: string, label: string, targetVal: number) => {
    const numericValue = parseInt(valString) || 0;
    const computedPercentage = Math.min(100, Math.round((numericValue / targetVal) * 100));
    
    // SVG radial variables
    const radius = 34;
    const perimeter = 2 * Math.PI * radius;
    const offset = perimeter - (computedPercentage / 100) * perimeter;

    return (
      <motion.div 
        whileHover={{ scale: 1.05 }}
        className="relative group p-4 rounded-3xl bg-neutral-900/40 border border-white/5 flex flex-col items-center justify-center text-center shadow-lg transition-all"
      >
        <div className="relative w-20 h-20 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90">
            {/* Base circle track */}
            <circle
              cx="40"
              cy="40"
              r={radius}
              className="stroke-neutral-800"
              strokeWidth="6"
              fill="transparent"
            />
            {/* Glowing progress stroke */}
            <circle
              cx="40"
              cy="40"
              r={radius}
              className={`transition-all duration-1000 ease-out`}
              stroke={glowColor}
              strokeWidth="6"
              fill="transparent"
              strokeDasharray={perimeter}
              strokeDashoffset={offset}
              strokeLinecap="round"
              style={{ filter: "drop-shadow(0px 0px 4px " + glowColor + "70)" }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xs font-black text-white font-mono leading-none">{valString}</span>
            <span className="text-[7.5px] font-bold text-neutral-500 uppercase mt-1">/{targetVal}</span>
          </div>
        </div>
        <span className="text-[9px] text-zinc-400 font-extrabold uppercase mt-3 tracking-widest">{label}</span>
      </motion.div>
    );
  };

  return (
    <div className={`min-h-screen relative font-sans overflow-x-hidden selection:bg-brand-orange/30 selection:text-brand-orange transition-colors duration-300 ${theme === "dark" ? "bg-[#0A0A0E] text-zinc-100" : "bg-[#FAF9F6] text-neutral-850"}`}>
      
      {/* Cinematic Aurora Backdrops & Floating Blurry blobs (Orange, Purple, Violet) */}
      <div className="absolute top-0 left-0 w-full h-[800px] overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-12 left-10 w-[400px] md:w-[700px] h-[400px] md:h-[700px] rounded-full aurora-glow-1 pulse-slow" />
        <div className="absolute top-48 right-12 w-[350px] md:w-[600px] h-[350px] md:h-[600px] rounded-full aurora-glow-2 pulse-slow [animation-delay:2s]" />
        <div className="absolute top-96 left-1/3 w-[300px] md:w-[500px] h-[300px] md:h-[500px] rounded-full aurora-glow-3 pulse-slow [animation-delay:4s]" />
      </div>

      {/* Exquisite Floating Ambient Ingredients (Visual Parallax Simulation) */}
      <div className="absolute top-32 inset-x-0 bottom-0 pointer-events-none overflow-hidden z-0 hidden lg:block">
        <motion.div 
          animate={{ y: [0, -15, 0], rotate: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
          className="absolute top-10 left-12 opacity-35 scale-110 filter drop-shadow-2xl"
        >
          <span className="text-5xl">🍅</span>
        </motion.div>
        <motion.div 
          animate={{ y: [0, 18, 0], rotate: [0, -15, 0] }}
          transition={{ repeat: Infinity, duration: 10, ease: "easeInOut", delay: 1 }}
          className="absolute top-36 right-16 opacity-35 scale-110 filter drop-shadow-2xl"
        >
          <span className="text-4xl">🌿</span>
        </motion.div>
        <motion.div 
          animate={{ y: [0, -22, 0], rotate: [0, 18, 0] }}
          transition={{ repeat: Infinity, duration: 12, ease: "easeInOut", delay: 2 }}
          className="absolute top-[480px] left-20 opacity-30 scale-125 filter drop-shadow-2xl"
        >
          <span className="text-5xl">🧄</span>
        </motion.div>
        <motion.div 
          animate={{ y: [0, 15, 0], rotate: [0, -12, 0] }}
          transition={{ repeat: Infinity, duration: 9, ease: "easeInOut", delay: 3 }}
          className="absolute top-[620px] right-24 opacity-25 scale-100 filter drop-shadow-2xl"
        >
          <span className="text-4xl">🌶️</span>
        </motion.div>
      </div>

      {/* Toast notifier banner */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -24, scale: 0.95 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-55 px-6 py-3 bg-neutral-900 border border-zinc-800 text-white shadow-2xl rounded-2xl flex items-center gap-3 backdrop-blur-xl"
          >
            <Sparkle className="w-4.5 h-4.5 text-brand-orange animate-spin [animation-duration:4s]" />
            <span className="text-xs font-semibold tracking-wide">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* World-Class Header Navigation (Stripe / Airbnb Grade) */}
      <header className="sticky top-0 z-40 bg-[#0A0A0E]/50 dark:bg-[#0A0A0E]/50 backdrop-blur-2xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-22 flex items-center justify-between">
          
          {/* Logo element */}
          <button
            onClick={() => { setActiveTab("dashboard"); setDiscoveryResult(null); }}
            className="flex items-center gap-3 group text-left cursor-pointer focus:outline-none"
          >
            <div className="p-2.5 bg-gradient-to-tr from-brand-orange to-yellow-500 rounded-2xl text-white shadow-[0_5px_20px_rgba(255,122,0,0.25)] group-hover:scale-105 transition-transform duration-300">
              <ChefHat className="w-6 h-6" />
            </div>
            <div>
              <span className="font-display font-black text-xl tracking-tight bg-gradient-to-r from-brand-orange via-amber-400 to-yellow-505 bg-clip-text text-transparent flex items-center gap-2 leading-none">
                CuisineAI
              </span>
              <span className="text-[9px] text-zinc-500 block tracking-widest uppercase font-black mt-1">Gourmet Intelligent Engine</span>
            </div>
          </button>

          {/* Central responsive tab selectors */}
          <nav className="hidden md:flex items-center bg-zinc-900/40 border border-white/5 p-1 rounded-2xl">
            {[
              { id: "dashboard", label: "Discover" },
              { id: "generator", label: "AI Generator" },
              { id: "discover", label: "Pantry Matcher" },
              { id: "planner", label: "Weekly Regimen" },
              { id: "saved", label: "Library" }
            ].map((tabItem) => (
              <button
                key={tabItem.id}
                onClick={() => {
                  setActiveTab(tabItem.id as any);
                  if (tabItem.id !== "discover") setDiscoveryResult(null);
                }}
                className={`relative px-4.5 py-2.5 rounded-xl text-xs font-black tracking-wider transition-all focus:outline-none cursor-pointer uppercase ${
                  activeTab === tabItem.id
                    ? "text-[#FF7A00] bg-[#FF7A00]/10"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                {tabItem.label}
                {tabItem.id === "saved" && savedRecipes.length > 0 && (
                  <span className="ml-1.5 px-2 py-0.5 bg-brand-orange text-white text-[9px] rounded-full font-black">
                    {savedRecipes.length}
                  </span>
                )}
                {activeTab === tabItem.id && (
                  <motion.div
                    layoutId="navbar-highlight-pill"
                    className="absolute bottom-0 inset-x-4 h-[2px] bg-gradient-to-r from-brand-orange to-yellow-550 rounded-full"
                    transition={{ type: "spring", stiffness: 350, damping: 25 }}
                  />
                )}
              </button>
            ))}
          </nav>

          {/* Right Action buttons */}
          <div className="flex items-center gap-3">
            
            {/* Multi Language choice banner choice */}
            <div className="flex bg-zinc-900/50 p-1 rounded-xl border border-white/5">
              <button
                onClick={() => {
                  setLanguage("en");
                  showToast("Translated interface to English", "success");
                }}
                className={`px-3 py-1.5 text-[9px] font-black rounded-lg transition-all focus:outline-none cursor-pointer ${
                  language === "en" ? "bg-white text-zinc-950 font-black shadow-sm" : "text-zinc-400 hover:text-white"
                }`}
              >
                EN
              </button>
              <button
                onClick={() => {
                  setLanguage("te");
                  showToast("Phonetic Telugu enabled!", "success");
                }}
                className={`px-3 py-1.5 text-[9px] font-black rounded-lg transition-all focus:outline-none cursor-pointer ${
                  language === "te" ? "bg-brand-orange text-white font-black" : "text-zinc-400 hover:text-white"
                }`}
                title="Telugu Script Options"
              >
                తెలుగు
              </button>
            </div>

            {/* Premium Theme toggle */}
            <button
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              className="p-2.5 bg-zinc-900/60 hover:bg-zinc-800 border border-white/5 rounded-xl transition-colors cursor-pointer text-zinc-400 hover:text-white"
            >
              {theme === "light" ? <Moon className="w-4.5 h-4.5" /> : <Sun className="w-4.5 h-4.5" />}
            </button>

            {/* Responsive ham drawer */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2.5 bg-zinc-900/60 border border-white/5 rounded-xl cursor-pointer text-zinc-400"
            >
              <Menu className="w-4.5 h-4.5" />
            </button>
          </div>
        </div>

        {/* Mobile menu collapsible */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-white/5 bg-[#0A0A0E]/95 backdrop-blur-2xl px-6 py-5 space-y-2.5 text-xs font-black uppercase"
            >
              {[
                { id: "dashboard", label: "Discover Hub" },
                { id: "generator", label: "AI Generator" },
                { id: "discover", label: "Cupboard Matcher" },
                { id: "planner", label: "Diet Regimen" },
                { id: "saved", label: "Bookmarked Library" }
              ].map((menuTab) => (
                <button
                  key={menuTab.id}
                  onClick={() => {
                    setActiveTab(menuTab.id as any);
                    setMobileMenuOpen(false);
                    if (menuTab.id !== "discover") setDiscoveryResult(null);
                  }}
                  className={`w-full py-3 text-left px-4 rounded-xl block font-black border border-transparent tracking-wide cursor-pointer ${
                    activeTab === menuTab.id 
                      ? "text-brand-orange bg-brand-orange/10 border-brand-orange/25" 
                      : "text-zinc-400 hover:bg-zinc-900/50"
                  }`}
                >
                  {menuTab.label}
                  {menuTab.id === "saved" && savedRecipes.length > 0 && (
                    <span className="ml-2.5 px-2 py-0.5 bg-brand-orange text-white rounded-full text-[10px]">
                      {savedRecipes.length}
                    </span>
                  )}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Core View Area Wrapper */}
      <main className="max-w-7xl mx-auto px-6 py-10 md:py-16 relative z-10 min-h-[70vh]">
        
        <AnimatePresence mode="wait">
          
          {/* VIEW 1: HOME DISCOVER & BEAUTIFUL PARALLAX HERO */}
          {activeTab === "dashboard" && (
            <motion.div
              key="dashboard-view"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              className="space-y-16"
            >
              {/* IMMERSIVE FULL SIZED HERO BOX (60% graphics content - 40% UI) */}
              <div className="relative rounded-[3rem] overflow-hidden bg-neutral-900 border border-white/5 min-h-[560px] md:min-h-[640px] flex items-center justify-center p-6 md:p-16 shadow-[0_30px_70px_rgba(0,0,0,0.45)]">
                
                {/* 60% Photography Overlay Background with animated steam particles */}
                <div className="absolute inset-0 z-0 select-none pointer-events-none overflow-hidden">
                  <div className="absolute inset-0 bg-radial-gradient from-zinc-950/20 via-black/85 to-black z-10" />
                  <img 
                    src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1920&q=80" 
                    alt="Masterchef Kitchen Background" 
                    className="w-full h-full object-cover opacity-50 scale-105 animate-[floatSlow_25s_infinite_ease-in-out]" 
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Subtle Steam Bubble animations */}
                  <div className="absolute bottom-[20%] left-1/2 -translate-x-1/2 flex gap-4 opacity-75">
                    <span className="h-4 w-4 rounded-full bg-white/20 filter blur-xs steam-bubble [animation-delay:0s]" />
                    <span className="h-6 w-6 rounded-full bg-white/10 filter blur-xs steam-bubble [animation-delay:0.8s]" />
                    <span className="h-3 w-3 rounded-full bg-white/20 filter blur-xs steam-bubble [animation-delay:1.4s]" />
                  </div>
                </div>

                {/* Hero UI Content (Centered, clear, high-end) */}
                <div className="max-w-3xl space-y-8 relative z-10 flex flex-col items-center text-center">
                  
                  {/* Floating Apple/Perplexity-like dynamic badge */}
                  <motion.div
                    initial={{ scale: 0.95 }}
                    animate={{ scale: [0.95, 1, 0.95] }}
                    transition={{ repeat: Infinity, duration: 4 }}
                    className="inline-flex items-center gap-2 px-4.5 py-2 rounded-full bg-white/10 border border-white/10 text-[10px] font-black text-amber-400 uppercase tracking-widest leading-none shadow-xl"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-brand-orange animate-pulse" />
                    <span>Unlock the Chef Within You</span>
                  </motion.div>

                  <h1 className="font-display font-black text-4xl md:text-6xl text-white tracking-tight leading-[1.08] max-w-2xl">
                    Your Personal <span className="bg-gradient-to-r from-brand-orange via-amber-400 to-yellow-405 bg-clip-text text-transparent">AI Chef</span>
                  </h1>

                  <p className="text-zinc-300 text-sm md:text-base leading-relaxed font-semibold max-w-xl">
                    {language === "te"
                      ? "Nootana Gemini AI dwara thwaraga adbhuthamaina recipes thayaaru chesi, cupboard dravyaalatho matching vantakalu kanugonandi."
                      : "Generate beautiful recipes, discover meals from ingredients, and cook like a professional chef using AI."
                    }
                  </p>

                  {/* Giant Glowing Perplexity-style omni command bar */}
                  <div className="w-full max-w-2xl mt-4 p-3.5 rounded-3xl bg-neutral-900/60 border border-white/10 backdrop-blur-2xl transition-all focus-within:ring-4 focus-within:ring-brand-orange/30 focus-within:border-brand-orange/60 shadow-[0_20px_50px_rgba(255,122,0,0.15)] flex flex-col gap-3">
                    <div className="flex items-center gap-3 px-3">
                      <Search className="w-5.5 h-5.5 text-brand-orange shrink-0" />
                      <input
                        type="text"
                        value={recipeNameInput}
                        onChange={(e) => setRecipeNameInput(e.target.value)}
                        placeholder={language === "te" ? "Adagandi (e.g. Garlic Butter Salmon)..." : "Ask anything or list ingredients (e.g., Creamy Garlic Salmon, Paneer Biryani)..."}
                        className="w-full bg-transparent border-none text-white placeholder-zinc-500 text-sm focus:outline-none"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            generateRecipe();
                          }
                        }}
                      />
                      {recipeNameInput && (
                        <button
                          onClick={() => setRecipeNameInput("")}
                          className="hover:text-amber-400 text-zinc-400 text-xs font-black px-2 cursor-pointer"
                        >
                          Clear
                        </button>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/5 px-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <select
                          value={cuisineInput}
                          onChange={(e) => setCuisineInput(e.target.value)}
                          className="bg-zinc-950 border border-white/10 rounded-xl px-2.5 py-1.5 text-[10px] text-zinc-300 font-extrabold focus:outline-none cursor-pointer"
                        >
                          <option value="Indian">Indian Cuisine</option>
                          <option value="Italian">Italian Hearth</option>
                          <option value="Chinese">Sichuan Wok</option>
                          <option value="Mexican">Mexican Fiesta</option>
                          <option value="Japanese">Japanese Zen</option>
                          <option value="French">French Bistro</option>
                        </select>

                        <select
                          value={dietaryInput}
                          onChange={(e) => setDietaryInput(e.target.value)}
                          className="bg-zinc-950 border border-white/10 rounded-xl px-2.5 py-1.5 text-[10px] text-zinc-300 font-extrabold focus:outline-none cursor-pointer"
                        >
                          <option value="Vegetarian">Pure Veg</option>
                          <option value="Vegan">Strict Vegan</option>
                          <option value="Non-Vegetarian">All Meats</option>
                          <option value="High Protein">High Protein</option>
                          <option value="Low Carb Keto">Keto Low-Carb</option>
                        </select>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={toggleMic}
                          className={`p-2 rounded-xl transition-all flex items-center justify-center shrink-0 cursor-pointer ${
                            isSpeaking 
                              ? "bg-red-500 text-white animate-pulse" 
                              : "bg-white/15 hover:bg-white/20 text-white border border-white/10"
                          }`}
                          title="Record dictation instructions"
                        >
                          {isSpeaking ? <MicOff className="w-4.5 h-4.5" /> : <Mic className="w-4.5 h-4.5 text-emerald-400" />}
                        </button>

                        <button
                          onClick={() => generateRecipe()}
                          className="px-6 py-2 bg-gradient-to-r from-brand-orange to-yellow-500 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-transform hover:scale-102 cursor-pointer shadow-lg active:scale-98"
                          id="hero-generate-btn"
                        >
                          Chef Sparkle
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Floating helpful trend suggest tags */}
                  <div className="flex flex-wrap items-center justify-center gap-2 mt-2 text-[11px] text-zinc-400 max-w-xl">
                    <span className="font-extrabold uppercase tracking-widest text-[9.5px] text-brand-orange mr-1">Trending Suggestions:</span>
                    {QUICK_SEARCH_PILLS.map((pill) => (
                      <button
                        key={pill}
                        onClick={() => {
                          setRecipeNameInput(pill);
                          generateRecipe(pill, ingredientsInput, cuisineInput, dietaryInput);
                        }}
                        className="px-3.5 py-1.5 rounded-full bg-white/5 border border-white/5 hover:border-brand-orange/60 hover:bg-white/10 text-white transition-all cursor-pointer text-[10px] font-bold"
                      >
                        {pill}
                      </button>
                    ))}
                  </div>

                  {/* Scroll Down Indicator */}
                  <div className="pt-6 animate-bounce text-zinc-500">
                    <ArrowDown className="w-5 h-5 mx-auto" />
                  </div>

                </div>
              </div>

              {/* PINTEREST-STYLE MASONRY GRID COLLECTIONS (60% photography, 40% clean ui cards) */}
              <div className="space-y-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 border-l-4 border-brand-orange pl-4.5">
                  <div>
                    <h3 className="font-display font-black text-2xl tracking-tight text-stone-900 dark:text-white uppercase">
                      Pinterest Trending Plates
                    </h3>
                    <p className="text-xs text-stone-500 dark:text-zinc-400 mt-1">
                      Real-time trending visual suggestions to ignite your culinary passion instantly
                    </p>
                  </div>
                  <span className="text-[10px] font-black uppercase bg-[#FF7A00]/10 text-[#FF7A00] tracking-widest px-4.5 py-2 rounded-xl">
                    Seasonal Recommendations
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                  {TRENDING_PRESETS.map((preset, idx) => (
                    <motion.div
                      whileHover={{ y: -8 }}
                      transition={{ type: "spring", damping: 20 }}
                      key={idx}
                      onClick={() => {
                        setRecipeNameInput(preset.title);
                        generateRecipe(preset.title, "", preset.cuisine, "All");
                      }}
                      className="group bg-neutral-900/40 border border-white/5 rounded-[2rem] overflow-hidden shadow-xl hover:shadow-[0_15px_30px_rgba(255,122,0,0.15)] transition-all cursor-pointer flex flex-col h-full"
                    >
                      {/* Image compartment: full height with Zoom effects */}
                      <div className="relative h-60 overflow-hidden bg-[#0A0A0E] select-none">
                        <img
                          src={preset.image}
                          alt={preset.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-black/60 backdrop-blur-md text-white text-[10px] font-black tracking-widest px-3 py-1 rounded-full uppercase">
                          <span>★ {preset.rating}</span>
                        </div>
                        <div className="absolute bottom-4 left-4 bg-brand-orange text-white text-[9px] font-black px-2.5 py-1 rounded-md uppercase tracking-wider">
                          {preset.cuisine}
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0E] via-transparent to-transparent opacity-60" />
                      </div>

                      {/* Info Compartment: 40% UI size */}
                      <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-[9px] text-zinc-500 font-extrabold uppercase font-mono tracking-widest">
                            <span>{preset.prepTime} Prep</span>
                            <span className="text-amber-500">{preset.difficulty}</span>
                          </div>
                          <h4 className="font-display font-black text-sm text-stone-900 dark:text-zinc-100 group-hover:text-brand-orange transition-colors tracking-tight leading-snug">
                            {preset.title}
                          </h4>
                          <p className="text-[11px] text-stone-500 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                            {preset.description}
                          </p>
                        </div>
                        <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[10px] font-black text-brand-orange uppercase tracking-wider">
                          <span>Craft Recipe</span>
                          <ChevronRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* BENTO BOX ACTIONS: Pantry and Planners (Deep, clean gradients, glowing visual hubs) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                <div className="p-8 md:p-10 bg-gradient-to-br from-neutral-900 via-amber-950/20 to-neutral-950 text-zinc-100 rounded-[2.5rem] border border-white/5 flex flex-col justify-between relative overflow-hidden group min-h-[260px] shadow-2xl">
                  {/* Subtle photographic corner aspect */}
                  <div className="absolute top-0 right-0 w-44 md:w-52 h-full select-none pointer-events-none z-0 overflow-hidden">
                    {!pantryImgFailed ? (
                      <div className="relative w-full h-full">
                        <img 
                          src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80" 
                          alt="cupboard ingredients" 
                          className="w-full h-full object-cover transition-opacity duration-300"
                          style={{ opacity: 0.3 }}
                          onError={() => setPantryImgFailed(true)}
                        />
                        {/* dark orange-to-black gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-br from-[#FF7A00]/30 via-orange-950/40 to-black mix-blend-multiply" />
                        <div className="absolute inset-0 bg-gradient-to-l from-transparent via-neutral-950/50 to-neutral-950" />
                      </div>
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-gradient-to-br from-[#FF7A00]/15 to-black border-l border-white/5">
                        <span className="text-3xl filter drop-shadow">📦 🥕 🧅 🍅</span>
                        <span className="text-[8px] font-mono text-zinc-500 mt-2 uppercase tracking-widest">Pantry Library</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2.5 max-w-sm relative z-10">
                    <span className="text-[9.5px] font-black text-brand-orange uppercase tracking-widest block font-mono">Waste reduction matcher</span>
                    <h3 className="font-display font-black text-2xl tracking-tight">AI Cupboard Pantry Discoverer</h3>
                    <p className="text-xs text-zinc-400 font-semibold leading-relaxed">
                      List miscellaneous ingredients lingering in your kitchen cupboards, and let CuisineAI orchestrate beautiful, cookable dishes with zero waste!
                    </p>
                  </div>
                  <div className="pt-6 relative z-10">
                    <button
                      onClick={() => setActiveTab("discover")}
                      className="inline-flex items-center gap-1.5 px-6 py-3.5 bg-brand-orange hover:bg-brand-orange/90 text-white font-black text-xs rounded-xl tracking-widest uppercase transition-colors cursor-pointer"
                    >
                      <span>Explore Cupboard Matcher</span>
                      <ChevronRight className="w-4.5 h-4.5" />
                    </button>
                  </div>
                </div>

                <div className="p-8 md:p-10 bg-gradient-to-br from-neutral-900 via-purple-950/20 to-neutral-950 text-zinc-100 rounded-[2.5rem] border border-white/5 flex flex-col justify-between relative overflow-hidden group min-h-[260px] shadow-2xl">
                  {/* Subtle photographic corner aspect */}
                  <div className="absolute top-0 right-0 w-44 md:w-52 h-full select-none pointer-events-none z-0 overflow-hidden">
                    {!dietImgFailed ? (
                      <div className="relative w-full h-full">
                        <img 
                          src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=800&q=80" 
                          alt="diet meal prep" 
                          className="w-full h-full object-cover transition-opacity duration-300"
                          style={{ opacity: 0.25 }}
                          onError={() => setDietImgFailed(true)}
                        />
                        {/* purple-to-black gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-800/25 via-purple-950/40 to-black mix-blend-multiply" />
                        <div className="absolute inset-0 bg-gradient-to-l from-transparent via-neutral-950/50 to-neutral-950" />
                      </div>
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-gradient-to-br from-purple-950/15 to-black border-l border-white/5">
                        <span className="text-3xl filter drop-shadow">🥗 🍎 💪 📊</span>
                        <span className="text-[8px] font-mono text-zinc-500 mt-2 uppercase tracking-widest">Diet Calendar</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2.5 max-w-sm relative z-10">
                    <span className="text-[9.5px] font-black text-purple-400 uppercase tracking-widest block font-mono">Calorie planner hub</span>
                    <h3 className="font-display font-black text-2xl tracking-tight">AI Weekly Diet &amp; Calorie Guide</h3>
                    <p className="text-xs text-zinc-400 font-semibold leading-relaxed">
                      Formulate the complete week's balanced nutritional roadmap prescribing explicit protein, diet goals, and allergen filters with AI.
                    </p>
                  </div>
                  <div className="pt-6 relative z-10">
                    <button
                      onClick={() => setActiveTab("planner")}
                      className="inline-flex items-center gap-1.5 px-6 py-3.5 bg-white text-zinc-950 hover:bg-zinc-100 font-black text-xs rounded-xl tracking-widest uppercase transition-all cursor-pointer"
                    >
                      <span>Plan Diet Calendar</span>
                      <ChevronRight className="w-4.5 h-4.5" />
                    </button>
                  </div>
                </div>

              </div>

              {/* QUICK CATEGORY SEARCH BARS */}
              <div className="space-y-6">
                <h4 className="text-xs font-black uppercase text-zinc-500 tracking-widest text-center">
                  Quick Category Explorations
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                  {PRESET_CATEGORIES.map((cat, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setRecipeNameInput(cat.query);
                        generateRecipe(cat.query, "", "Global", "Any");
                        showToast(`Stoking custom ${cat.name} recipe spark...`, "info");
                      }}
                      className="p-5 bg-neutral-900/40 border border-white/5 rounded-2xl text-center hover:border-brand-orange hover:shadow-lg transition-all cursor-pointer group"
                    >
                      <span className="text-4xl block filter drop-shadow-md transform group-hover:scale-115 transition-transform">{cat.icon}</span>
                      <span className="font-black text-[10px] text-zinc-400 group-hover:text-white block mt-3 uppercase tracking-wider font-mono">
                        {cat.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* INTERACTIVE COMPONENT 1: DYNAMIC TASTE SENSORY CHART & MATRIX CHECKER */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start bg-neutral-900/10 border border-white/5 rounded-[2.5rem] p-6 md:p-10 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-80 h-80 bg-brand-orange/5 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 right-0 w-80 h-80 bg-yellow-500/5 rounded-full blur-3xl pointer-events-none" />

                {/* Left: Interactive Sliders (5 cols) */}
                <div className="lg:col-span-5 space-y-6 relative z-10">
                  <span className="text-[10px] font-black text-brand-orange uppercase tracking-widest block font-mono">Taste Spectrum Analyzer</span>
                  <div className="space-y-1.5">
                    <h3 className="font-display font-black text-xl text-stone-900 dark:text-white uppercase tracking-tight leading-tight">Dynamic Taste Sensory Matrix</h3>
                    <p className="text-xs text-stone-500 dark:text-zinc-400 font-semibold leading-relaxed">
                      Calibrate the chemical sliders below. CuisineAI will synthesize the virtual flavor map and suggest premium culinary pairing compounds and dishes.
                    </p>
                  </div>

                  <div className="space-y-4 font-semibold">
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between font-mono text-[9.5px]">
                        <span className="text-zinc-400 uppercase">Umami Richness (Ghee/Shiitake):</span>
                        <span className="text-brand-orange">{sensoryUmami}%</span>
                      </div>
                      <input
                        type="range"
                        min="10"
                        max="100"
                        value={sensoryUmami}
                        onChange={(e) => setSensoryUmami(parseInt(e.target.value))}
                        className="w-full h-1.5 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-brand-orange border border-white/5"
                      />
                    </div>

                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between font-mono text-[9.5px]">
                        <span className="text-zinc-400 uppercase">Capsaicin Heat (Spicy):</span>
                        <span className="text-red-400">{sensorySpicy}%</span>
                      </div>
                      <input
                        type="range"
                        min="10"
                        max="100"
                        value={sensorySpicy}
                        onChange={(e) => setSensorySpicy(parseInt(e.target.value))}
                        className="w-full h-1.5 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-red-500 border border-white/5"
                      />
                    </div>

                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between font-mono text-[9.5px]">
                        <span className="text-zinc-400 uppercase">Saccharose Level (Sweetness):</span>
                        <span className="text-amber-400">{sensorySweet}%</span>
                      </div>
                      <input
                        type="range"
                        min="10"
                        max="100"
                        value={sensorySweet}
                        onChange={(e) => setSensorySweet(parseInt(e.target.value))}
                        className="w-full h-1.5 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-amber-400 border border-white/5"
                      />
                    </div>

                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between font-mono text-[9.5px]">
                        <span className="text-zinc-400 uppercase">Botanical Tannins (Herbs):</span>
                        <span className="text-emerald-400">{sensoryHerbs}%</span>
                      </div>
                      <input
                        type="range"
                        min="10"
                        max="100"
                        value={sensoryHerbs}
                        onChange={(e) => setSensoryHerbs(parseInt(e.target.value))}
                        className="w-full h-1.5 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-emerald-400 border border-white/5"
                      />
                    </div>

                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between font-mono text-[9.5px]">
                        <span className="text-zinc-400 uppercase">Sodium Balance (Savory):</span>
                        <span className="text-sky-400">{sensorySalt}%</span>
                      </div>
                      <input
                        type="range"
                        min="10"
                        max="100"
                        value={sensorySalt}
                        onChange={(e) => setSensorySalt(parseInt(e.target.value))}
                        className="w-full h-1.5 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-sky-400 border border-white/5"
                      />
                    </div>
                  </div>
                </div>

                {/* Middle: Live Radar SVG Graphic (4 cols) */}
                <div className="lg:col-span-4 flex flex-col items-center justify-center relative z-10 py-4">
                  <div className="relative w-64 h-64 flex items-center justify-center">
                    {/* Concentric grid background circles */}
                    {[0.2, 0.4, 0.6, 0.8, 1.0].map((scale, i) => (
                      <div
                        key={i}
                        className="absolute rounded-full border border-zinc-800/60"
                        style={{ width: `${scale * 100}%`, height: `${scale * 100}%` }}
                      />
                    ))}

                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      {/* Dynamic Radar Polygon based on taste variables */}
                      {(() => {
                        const cx = 128;
                        const cy = 127;
                        const maxR = 90;
                        
                        const getCoords = (value: number, angleDeg: number) => {
                          const r = (value / 100) * maxR;
                          const angleRad = (angleDeg * Math.PI) / 180;
                          return {
                            x: cx + r * Math.cos(angleRad),
                            y: cy - r * Math.sin(angleRad),
                          };
                        };

                        const ptUmami = getCoords(sensoryUmami, 90);
                        const ptSpicy = getCoords(sensorySpicy, 18);
                        const ptSweet = getCoords(sensorySweet, -54);
                        const ptHerbs = getCoords(sensoryHerbs, -126);
                        const ptSalt = getCoords(sensorySalt, 162);

                        const pointsString = `${ptUmami.x},${ptUmami.y} ${ptSpicy.x},${ptSpicy.y} ${ptSweet.x},${ptSweet.y} ${ptHerbs.x},${ptHerbs.y} ${ptSalt.x},${ptSalt.y}`;

                        return (
                          <svg className="w-full h-full">
                            {/* Axis lines */}
                            {[-126, -54, 18, 90, 162].map((deg, i) => {
                              const borderPt = getCoords(100, deg);
                              return (
                                <line
                                  key={i}
                                  x1={cx}
                                  y1={cy}
                                  x2={borderPt.x}
                                  y2={borderPt.y}
                                  className="stroke-zinc-800"
                                  strokeWidth="1"
                                />
                              );
                            })}

                            {/* Polygon overlay with golden-orange glow */}
                            <polygon
                              points={pointsString}
                              fill="rgba(255,122,0,0.18)"
                              stroke="#FF7A00"
                              strokeWidth="2.5"
                              style={{ filter: "drop-shadow(0px 0px 8px rgba(255,122,0,0.4))" }}
                            />

                            {/* Dynamic vertex points */}
                            {[ptUmami, ptSpicy, ptSweet, ptHerbs, ptSalt].map((pt, i) => (
                              <circle key={i} cx={pt.x} cy={pt.y} r="4" fill="#FFB033" />
                            ))}

                            {/* Labels */}
                            <text x={cx} y={cy - maxR - 8} fill="#FF7A00" fontSize="9" fontWeight="black" textAnchor="middle" fontFamily="monospace">UMAMI</text>
                            <text x={cx + maxR + 10} y={cy + 3} fill="#EF4444" fontSize="9" fontWeight="black" textAnchor="start" fontFamily="monospace">HEAT</text>
                            <text x={cx + 50} y={cy + maxR + 10} fill="#F97316" fontSize="9" fontWeight="black" textAnchor="middle" fontFamily="monospace">SWEET</text>
                            <text x={cx - 50} y={cy + maxR + 10} fill="#10B981" fontSize="9" fontWeight="black" textAnchor="middle" fontFamily="monospace">HERB</text>
                            <text x={cx - maxR - 10} y={cy + 3} fill="#06B6D4" fontSize="9" fontWeight="black" textAnchor="end" fontFamily="monospace">SAVORY</text>
                          </svg>
                        );
                      })()}
                    </div>
                  </div>
                </div>

                {/* Right: Smart Flavor Recommendations (3 cols) */}
                <div className="lg:col-span-3 space-y-4 relative z-10 flex flex-col justify-between h-full min-h-[220px]">
                  <div className="space-y-3">
                    <span className="text-[9px] font-black text-amber-500 uppercase tracking-widest font-mono block">Real-time Molecular Pairings</span>
                    {(() => {
                      const values = [
                        { name: "Umami Bomb", val: sensoryUmami, desc: "Aged Parmigiano infused with wild truffle oil shavings", query: "Garlic Truffle Shiitake Risotto" },
                        { name: "Scoville Blaze", val: sensorySpicy, desc: "Sriracha fermented red cayenne pepper reduction", query: "Fiery Fire Roasted Garlic Chili Chicken wings" },
                        { name: "Gilded Nectar", val: sensorySweet, desc: "Cold-pressed blossom raw honey glaze reduction", query: "Glazed Saffron Sweet Roasted Pumpkin" },
                        { name: "Botanical Medley", val: sensoryHerbs, desc: "Wilted basil emulsion & crushed pine rosemary stalks", query: "Rosemary Butter Crusted French lamb chops" },
                        { name: "Sea Salt Crisp", val: sensorySalt, desc: "Celtic fleur de sel flakes over aged tamari seasoning", query: "Atlantic Sea Salt Crusted Baked Cod" }
                      ];

                      const topCompound = values.sort((a,b) => b.val - a.val)[0];

                      return (
                        <div className="p-4 bg-zinc-950/60 border border-white/5 rounded-2.5xl hover:border-brand-orange transition-all">
                          <span className="text-[8px] font-black uppercase text-brand-orange font-mono">Matched Compound</span>
                          <h4 className="font-display font-black text-white text-sm mt-1 leading-snug">{topCompound.name}</h4>
                          <p className="text-[11px] text-zinc-400 font-semibold mt-1 leading-relaxed">{topCompound.desc}</p>
                          
                          <div className="pt-3 mt-3 border-t border-white/5">
                            <span className="text-[8px] font-black uppercase text-zinc-500 font-mono block">Optimal Culinary Recommendation:</span>
                            <span className="text-xs text-amber-400 font-black italic block mt-1">"{topCompound.query}"</span>
                            
                            <button
                              onClick={() => {
                                setRecipeNameInput(topCompound.query);
                                generateRecipe(topCompound.query, "", "Global", "Any");
                                setActiveTab("generator");
                                showToast("Bridging taste chemical spectrum to furnace...", "success");
                              }}
                              className="w-full mt-3.5 py-2.5 bg-gradient-to-r from-brand-orange to-amber-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all cursor-pointer font-mono"
                            >
                              Forge this match steps
                            </button>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                  <span className="text-[9.5px] font-medium text-zinc-500 italic font-mono block">Pairings generated on authentic food pairing chemistry structures.</span>
                </div>
              </div>

              {/* INTERACTIVE COMPONENT 2: INTERACTIVE MASTERCLASS CHEF CULINARY TECHNIQUES */}
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-l-4 border-[#FF7A00] pl-4.5">
                  <div>
                    <h3 className="font-display font-black text-lg tracking-tight text-stone-900 dark:text-white uppercase">AI Masterchef Culinary Techniques</h3>
                    <p className="text-xs text-stone-500 dark:text-zinc-400 mt-1">
                      Learn and configure high-precision restaurant-grade micro-techniques into your next custom recipes
                    </p>
                  </div>
                  <span className="text-[9.5px] font-black uppercase bg-orange-500/10 text-brand-orange tracking-widest px-3 py-1.5 rounded-lg font-mono">
                    Skill Level: Advanced Culinary
                  </span>
                </div>

                {(() => {
                  const TECHNIQUES_LIBRARY = [
                    {
                      title: "Maillard Searing Thermal Mechanism",
                      icon: "🔥",
                      tempOpt: "310°F to 330°F",
                      humidityIdeal: "Under 15%",
                      chemistry: "Non-enzymatic amino acid rearrangement producing dozens of high-value savory flavor molecules.",
                      chefTip: "Ensure protein surfaces are bone-dry before searing. Shake coarse sea salt lightly to absorb stray ambient moisture."
                    },
                    {
                      title: "Sauce-making Emulsive Ghee Alchemy",
                      icon: "🥣",
                      tempOpt: "115°F to 135°F",
                      humidityIdeal: "Ratio 3:1 Lipids",
                      chemistry: "Suspension of microscopic fat droplets within sauce reduction mediated by raw organic egg yolk lecithin.",
                      chefTip: "Whisk cold butter cubes incrementally off-burner into reduction to avoid separating premium lipid proteins."
                    },
                    {
                      title: "Sous-Vide Isothermal Precision Cookery",
                      icon: "🌡️",
                      tempOpt: "128°F to 142°F",
                      humidityIdeal: "Hermetic seal 100%",
                      chemistry: "Slow denaturation of active collagen tissues retaining cellular core structural waters.",
                      chefTip: "Seal garlic butter and fresh thyme branches inside storage pouch to trigger rapid osmosis pressure dispersal."
                    },
                    {
                      title: "Slow Botanical Oil Confit Bath",
                      icon: "🌿",
                      tempOpt: "175°F to 195°F",
                      humidityIdeal: "Anhydrous (Dry)",
                      chemistry: "Low temperature fat matrix lipid breakdown, tenderizing deep fibers without collapsing membranes.",
                      chefTip: "Completely submerge items in duck fat or cold stone olive oils with garlic heads and rosemary stalks."
                    }
                  ];

                  return (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                      {TECHNIQUES_LIBRARY.map((tech, idx) => {
                        const isStudying = selectedTechniqueIdx === idx;
                        return (
                          <div
                            key={idx}
                            onClick={() => setSelectedTechniqueIdx(isStudying ? null : idx)}
                            className={`p-5 bg-neutral-900/45 border rounded-[2rem] text-left transition-all cursor-pointer relative overflow-hidden group flex flex-col justify-between ${
                              isStudying ? "border-brand-orange shadow-[0_0_25px_rgba(255,122,0,0.15)] col-span-1 md:col-span-2" : "border-white/5 hover:border-brand-orange/40"
                            }`}
                          >
                            <div className="space-y-4">
                              <div className="flex items-center justify-between">
                                <span className="text-3xl block filter drop-shadow-md">{tech.icon}</span>
                                <span className="text-[8px] font-black uppercase text-zinc-500 font-mono tracking-widest leading-none">
                                  {isStudying ? "STUDY SECTOR ACTIVE" : "Click to Study"}
                                </span>
                              </div>
                              
                              <h4 className="font-display font-black text-xs text-stone-900 dark:text-zinc-100 group-hover:text-brand-orange transition-colors leading-snug">
                                {tech.title}
                              </h4>
                              
                              {isStudying ? (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: "auto" }}
                                  className="pt-2 space-y-4 font-semibold text-xs"
                                >
                                  <div className="grid grid-cols-2 gap-3 font-mono text-[9.5px]">
                                    <div className="bg-zinc-950/60 p-2 border border-white/5 rounded-xl">
                                      <span className="text-zinc-500 block uppercase">CORE HEAT:</span>
                                      <span className="text-brand-orange font-black mt-0.5 block">{tech.tempOpt}</span>
                                    </div>
                                    <div className="bg-zinc-950/60 p-2 border border-white/5 rounded-xl">
                                      <span className="text-zinc-500 block uppercase">HUMIDITY COEF:</span>
                                      <span className="text-emerald-400 font-black mt-0.5 block">{tech.humidityIdeal}</span>
                                    </div>
                                  </div>
                                  
                                  <p className="text-[11px] text-zinc-300 leading-relaxed font-semibold">
                                    <span className="text-brand-orange font-black">Gastronomy Science: </span>
                                    {tech.chemistry}
                                  </p>

                                  <p className="text-[11px] text-zinc-400 leading-relaxed italic border-l-2 border-[#FF7A00] pl-3 bg-[#FF7A00]/5 py-2.5 rounded-r-xl">
                                    👨‍🍳 <span className="font-black text-brand-orange">Michelin Tip: </span>
                                    {tech.chefTip}
                                  </p>

                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setRecipeNameInput(`Dish with ${tech.title}`);
                                      generateRecipe(`Dish using premium ${tech.title}`, "", "Global", "Any");
                                      setActiveTab("generator");
                                      showToast(`Technique ${tech.title} injected to furnace!`, "success");
                                    }}
                                    className="w-full mt-2 py-3 bg-brand-orange hover:bg-brand-orange/90 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all cursor-pointer font-mono text-center block"
                                  >
                                    Inject technique to next recipe
                                  </button>
                                </motion.div>
                              ) : (
                                <p className="text-[10px] text-zinc-500 font-semibold line-clamp-2 leading-relaxed">
                                  {tech.chemistry}
                                </p>
                              )}
                            </div>

                            {!isStudying && (
                              <div className="pt-4 mt-3 border-t border-white/5 flex items-center justify-between text-[8.5px] font-black text-brand-orange uppercase tracking-widest font-mono">
                                <span>Analyze chemical telemetry</span>
                                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform" />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}
              </div>

              {/* Historical browsing logs */}
              {historyRecipes.length > 0 && (
                <div className="space-y-6 pt-10 border-t border-white/5">
                  <div className="flex items-center justify-between">
                    <h4 className="font-display font-black text-xs uppercase text-zinc-400 tracking-widest flex items-center gap-2">
                      <RotateCcw className="w-4.5 h-4.5 text-brand-orange" />
                      <span>Recent Culinary Creations</span>
                    </h4>
                    <button
                      onClick={() => {
                        setHistoryRecipes([]);
                        localStorage.removeItem("ai_recipe_history_list");
                        showToast("Cleared query logs", "info");
                      }}
                      className="text-[10px] text-red-500 hover:text-red-400 font-black uppercase tracking-wider"
                    >
                      Clear Logs
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {historyRecipes.map((hist, index) => (
                      <div
                        key={index}
                        onClick={() => {
                          setActiveRecipe(hist);
                          setActiveTab("generator");
                        }}
                        className="p-4 bg-neutral-900/50 border border-white/5 rounded-2xl hover:border-brand-orange cursor-pointer flex items-center justify-between group transition-all"
                      >
                        <div className="truncate pr-2">
                          <span className="text-[8px] tracking-widest uppercase font-black text-brand-orange block font-mono">{hist.cuisine || "Special"}</span>
                          <span className="font-black text-xs text-white group-hover:text-brand-orange block truncate mt-1">{hist.title}</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-zinc-500 group-hover:translate-x-1 transition-transform shrink-0" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* VIEW 2: DETAILED GENERATED ACTIVE RECIPE SHOWCASE & CINEMATIC DISPLAY CONTAINER */}
          {activeTab === "generator" && (
            <motion.div
              key="generator-view"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              className="space-y-10"
            >
              <div className={!activeRecipe && !loadingRecipe ? "grid grid-cols-1 lg:grid-cols-12 gap-8 items-start" : "space-y-10"}>
                
                {/* Parameter Settings Glass box */}
                <div className={`${!activeRecipe && !loadingRecipe ? "lg:col-span-7" : ""} charcoal-glass rounded-[2.5rem] p-6 md:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.3)] space-y-6 relative overflow-hidden h-full flex flex-col justify-between`}>
                  <div>
                    <div className="absolute top-0 right-0 w-80 h-80 bg-brand-orange/5 rounded-full blur-3xl pointer-events-none" />
                    
                    <div className="flex items-center gap-4 border-b border-white/5 pb-4 mb-6">
                      <div className="p-3 bg-[#FF7A00]/10 rounded-2xl text-brand-orange shadow-lg shadow-orange-500/5">
                        <Sparkles className="w-6 h-6 animate-pulse" />
                      </div>
                      <div>
                        <h2 className="font-display font-black text-xl text-stone-900 dark:text-white uppercase tracking-tight">AI Generator Workshop</h2>
                        <p className="text-xs text-stone-500 dark:text-zinc-450 font-medium">Fine-tune meal variables below and let our Gemini core forge custom guides</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-semibold">
                      <div className="space-y-2 md:col-span-2">
                        <label className="text-[10px] font-black text-stone-500 dark:text-zinc-400 uppercase tracking-widest block font-mono">Dish theme or item preference</label>
                        <div className="flex items-center bg-stone-50/70 dark:bg-zinc-950 border border-stone-250 dark:border-zinc-850 rounded-xl px-4 py-3.5">
                          <input
                            type="text"
                            value={recipeNameInput}
                            onChange={(e) => setRecipeNameInput(e.target.value)}
                            placeholder="e.g. Traditional Garlic Butter Salmon, spicy chicken, rich lasagna..."
                            className="flex-1 bg-transparent text-xs text-stone-900 dark:text-white focus:outline-none"
                          />
                          <button
                            onClick={toggleMic}
                            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                              isSpeaking ? "bg-red-500 text-white animate-pulse" : "hover:bg-neutral-800 text-zinc-400"
                            }`}
                            title="Mic input settings"
                          >
                            <Mic className="w-4 h-4 text-brand-orange" />
                          </button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-stone-500 dark:text-zinc-400 uppercase tracking-widest block font-mono">Cuisine Category</label>
                        <select
                          value={cuisineInput}
                          onChange={(e) => setCuisineInput(e.target.value)}
                          className="w-full bg-stone-55 dark:bg-zinc-950 border border-stone-250 dark:border-zinc-850 rounded-xl px-4 py-4 text-stone-900 dark:text-zinc-200 focus:outline-none cursor-pointer"
                        >
                          <option value="Indian">Indian Authentic</option>
                          <option value="Italian">Italian Kitchen</option>
                          <option value="Chinese">Wok Authentic Chinese</option>
                          <option value="Mexican">Traditional Mexican</option>
                          <option value="Japanese">Zen Japanese Dining</option>
                          <option value="French">Elegance French Bistro</option>
                          <option value="Global">Global Fusion Cuisine</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-stone-500 dark:text-zinc-400 uppercase tracking-widest block font-mono">Dietary Restriction</label>
                        <select
                          value={dietaryInput}
                          onChange={(e) => setDietaryInput(e.target.value)}
                          className="w-full bg-stone-55 dark:bg-zinc-950 border border-stone-250 dark:border-zinc-850 rounded-xl px-4 py-4 text-stone-900 dark:text-zinc-200 focus:outline-none cursor-pointer"
                        >
                          <option value="Vegetarian">Pure Vegetarian</option>
                          <option value="Vegan">Strict Vegan (Plant)</option>
                          <option value="Non-Vegetarian">All protein meats</option>
                          <option value="High Protein">High protein focus</option>
                          <option value="Low Carb Keto">Keto / Low-Carb</option>
                        </select>
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <label className="text-[10px] font-black text-stone-500 dark:text-zinc-400 uppercase tracking-widest block font-mono">
                          Incorporate Specific cupboard ingredients (Optional)
                        </label>
                        <input
                          type="text"
                          value={ingredientsInput}
                          onChange={(e) => setIngredientsInput(e.target.value)}
                          placeholder="e.g. cherry tomatoes, mushrooms, heavy cream, parsley... (Separated by comma)"
                          className="w-full bg-stone-55 dark:bg-zinc-950 border border-stone-250 dark:border-zinc-850 rounded-xl px-4 py-4 text-stone-900 dark:text-zinc-200 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-6">
                    <button
                      onClick={() => generateRecipe()}
                      disabled={loadingRecipe}
                      className="w-full py-4.5 bg-gradient-to-r from-brand-orange via-amber-500 to-yellow-500 disabled:opacity-55 text-white text-xs font-black uppercase tracking-widest rounded-2xl shadow-[0_10px_30px_rgba(255,122,0,0.25)] hover:shadow-orange-500/35 transition-all cursor-pointer flex items-center justify-center gap-2 font-mono"
                    >
                      {loadingRecipe ? (
                        <>
                          <RefreshCw className="w-5 h-5 animate-spin" />
                          <span>Gemini is stoking the kitchen coals...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4.5 h-4.5 text-yellow-300 animate-pulse" />
                          <span>Forge custom gourmet recipe steps</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Split right column: AI Furnace telemetry dashboard block */}
                {!activeRecipe && !loadingRecipe && (
                  <div className="lg:col-span-5 bg-neutral-900/10 border border-white/5 rounded-[2.5rem] p-6 md:p-8 space-y-6 relative overflow-hidden h-full flex flex-col justify-between">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-orange/5 rounded-full blur-3xl pointer-events-none" />
                    
                    <div>
                      <div className="flex items-center justify-between border-b border-white/5 pb-3">
                        <div className="flex items-center gap-2">
                          <Flame className="w-5 h-5 text-brand-orange animate-pulse" />
                          <span className="text-[10px] font-black text-white uppercase tracking-widest font-mono">Kitchen Furnace Telemetry</span>
                        </div>
                        <span className="h-2 w-2 bg-red-400 rounded-full animate-ping"></span>
                      </div>

                      <p className="text-xs text-zinc-400 font-semibold leading-relaxed mt-2.5">
                        Adjust virtual cooking parameters to calculate kinetic thermal heat and moisture pressure coefficient before generating recipe steps.
                      </p>

                      {/* Animated Gilded Flame Simulator UI */}
                      <div className="my-6 py-4 flex flex-col items-center justify-center bg-zinc-950/40 rounded-2.5xl border border-white/5 relative overflow-hidden">
                        <div className="relative flex items-center justify-center w-28 h-28">
                          <div className="absolute inset-0 bg-brand-orange/15 rounded-full blur-xl animate-pulse" />
                          {furnaceHeat === "gentle" && (
                            <div className="relative flex flex-col items-center">
                              <span className="text-5xl animate-bounce [animation-duration:2.5s]">🍲</span>
                              <span className="text-[9.5px] font-mono text-emerald-400 uppercase tracking-widest font-black mt-2">SIMMER COEF ACTIVE</span>
                            </div>
                          )}
                          {furnaceHeat === "sizzling" && (
                            <div className="relative flex flex-col items-center">
                              <span className="text-5xl animate-pulse [animation-duration:1s]">🍳</span>
                              <span className="text-[9.5px] font-mono text-brand-orange uppercase tracking-widest font-black mt-2">SEARING COEF ACTIVE</span>
                            </div>
                          )}
                          {furnaceHeat === "blazing" && (
                            <div className="relative flex flex-col items-center">
                              <span className="text-5xl animate-bounce [animation-duration:0.6s]">🔥</span>
                              <span className="text-[9.5px] font-mono text-red-500 uppercase tracking-widest font-black mt-2">BLAZING COEF ACTIVE</span>
                            </div>
                          )}
                        </div>

                        {/* Pressure telemetry display */}
                        <div className="w-full px-5 mt-4 space-y-1.5 text-xs text-zinc-400">
                          <div className="flex justify-between font-mono text-[9px] uppercase">
                            <span>Kcal Steam Moisture Pressure:</span>
                            <span className="text-white font-black">{Math.round((furnaceHumidity * 1.5) + (furnaceHeat === "blazing" ? 80 : furnaceHeat === "sizzling" ? 40 : 10))} Pa</span>
                          </div>
                          <div className="w-full bg-zinc-900 border border-white/5 h-2 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${
                                furnaceHeat === "blazing" ? "bg-red-500" : furnaceHeat === "sizzling" ? "bg-brand-orange" : "bg-emerald-400"
                              }`}
                              style={{ width: `${Math.min(100, Math.round((furnaceHumidity * 0.8) + (furnaceHeat === "blazing" ? 30 : 5)))}%` }}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Parameter controllers */}
                      <div className="space-y-4 font-semibold">
                        <div className="space-y-1.5">
                          <span className="text-[9.5px] uppercase font-black text-zinc-500 font-mono tracking-widest block">Furnace Burner Intensity:</span>
                          <div className="grid grid-cols-3 gap-2 text-[9.5px] font-mono">
                            {(["gentle", "sizzling", "blazing"] as const).map((mode) => (
                              <button
                                key={mode}
                                type="button"
                                onClick={() => {
                                  setFurnaceHeat(mode);
                                  showToast(`Furnace coefficient recalibrated to ${mode.toUpperCase()}!`, "info");
                                }}
                                className={`py-2 px-3 border rounded-xl text-center capitalize transition-all cursor-pointer font-black ${
                                  furnaceHeat === mode
                                    ? "bg-[#FF7A00]/15 border-brand-orange text-[#FF7A00]"
                                    : "bg-zinc-950/40 border-white/5 text-zinc-400 hover:border-zinc-800"
                                }`}
                              >
                                {mode}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-1 text-xs">
                          <div className="flex justify-between font-mono text-[9.5px]">
                            <span className="text-zinc-500 uppercase">FURNACE AMBIENT HUMIDITY:</span>
                            <span className="text-cyan-400">{furnaceHumidity}% rH</span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={furnaceHumidity}
                            onChange={(e) => setFurnaceHumidity(parseInt(e.target.value))}
                            className="w-full accent-cyan-400 cursor-pointer bg-zinc-900 border border-white/5 rounded"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Pro Cooking Quote */}
                    <div className="pt-4 border-t border-white/5 mt-4">
                      <span className="text-[9px] font-black text-brand-orange uppercase tracking-widest font-mono block">Michelin Culinary Observation</span>
                      <p className="text-[10px] text-zinc-400 leading-relaxed italic mt-1.5">
                        &ldquo;Control the thermodynamic expansion rate perfectly. Liquid volatility is what locks in cell moistures. Simmer gently for delicate seafood proteins.&rdquo;
                      </p>
                    </div>
                  </div>
                )}

              </div>

              {/* Loader visual block */}
              {loadingRecipe && (
                <div className="p-16 text-center border border-white/5 bg-neutral-900/40 backdrop-blur-2xl rounded-[2.5rem] space-y-6 relative overflow-hidden flex flex-col items-center justify-center min-h-[300px]">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-brand-orange/10 rounded-full blur-3xl animate-pulse" />
                  <div className="relative w-24 h-24 flex items-center justify-center">
                    <div className="absolute inset-0 border-4 border-brand-orange/10 border-t-brand-orange rounded-full animate-spin" />
                    <ChefHat className="w-12 h-12 text-brand-orange animate-pulse" />
                  </div>
                  <div className="space-y-3 max-w-md relative z-10">
                    <h3 className="font-display font-black text-xl text-white tracking-tight uppercase">Consulting Master Chefs...</h3>
                    <p className="text-xs text-zinc-400 leading-relaxed font-semibold">
                      Forming ingredient ratios, step timelines, metabolic profiles, substitutes, and secret chef remarks for a restaurant-grade home experience.
                    </p>
                  </div>
                </div>
              )}

              {/* Recipe prompt failure block */}
              {recipeError && (
                <div className="p-10 border border-red-500/20 bg-red-950/20 text-center rounded-[2.5rem] space-y-5">
                  <AlertTriangle className="w-12 h-12 text-red-500 mx-auto" />
                  <div>
                    <h4 className="font-bold text-lg text-red-400 uppercase tracking-wide">AI Burner Error</h4>
                    <p className="text-xs text-red-350 mt-2 max-w-md mx-auto leading-relaxed">{recipeError}</p>
                  </div>
                  <button
                    onClick={() => generateRecipe()}
                    className="px-6 py-3 bg-red-550 hover:bg-red-650 text-white font-black text-xs uppercase rounded-xl tracking-widest cursor-pointer shadow-md"
                  >
                    Malli Vanta Pranalika Prayatna Cheyyi
                  </button>
                </div>
              )}

              {/* ACTIVE GENERATED RECIPE DECK (Netflix reveals movie style - Immersive) */}
              {activeRecipe && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.65, ease: "easeOut" }}
                  className="space-y-10"
                  id="recipe-printable-area"
                >
                  {/* Progress feedback banner */}
                  {(() => {
                    const totalSteps = activeRecipe.instructions.length;
                    const checkedCount = completedSteps.length;
                    const completionRate = Math.round((checkedCount / totalSteps) * 100);

                    if (checkedCount === 0) return null;
                    return (
                      <motion.div
                        initial={{ opacity: 0, y: -15 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-6 rounded-[2rem] bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-xl"
                      >
                        <div className="space-y-1">
                          <p className="text-xs font-black text-emerald-400 flex items-center gap-2 uppercase tracking-widest">
                            <Check className="w-4.5 h-4.5 bg-emerald-500 text-neutral-900 rounded-full p-0.5 font-bold" />
                            <span>Active culinary practice in session!</span>
                          </p>
                          <p className="text-[10px] text-zinc-400 font-extrabold uppercase mt-1 tracking-wider">
                            Steps done: {checkedCount} out of {totalSteps}
                          </p>
                        </div>

                        <div className="flex-1 sm:max-w-sm space-y-1.5">
                          <div className="w-full bg-neutral-800 h-3 rounded-full overflow-hidden">
                            <div 
                              className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-300" 
                              style={{ width: `${completionRate}%` }} 
                            />
                          </div>
                          <div className="flex justify-between text-[10px] font-black font-mono tracking-wider text-emerald-400">
                            <span>{completionRate}% STEP PROGRESS</span>
                            {completionRate === 100 && <span className="text-amber-400 animate-bounce">READY TO FEAST! 🍽️</span>}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })()}

                  {/* NETFLIX MOVIE BANNER LAYOUT (60% Food Image, 40% clean ui tag overlays) */}
                  <div className="relative rounded-[3rem] overflow-hidden border border-white/5 bg-[#0D0D12] shadow-2xl">
                    
                    {/* Immersive Photography background occupying full viewport backspace */}
                    <div className="absolute inset-0 select-none z-0">
                      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/75 to-transparent z-10" />
                      <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-[#0D0D12]/90 to-transparent z-10" />
                      <img 
                        src={activeRecipe.image} 
                        alt={activeRecipe.title} 
                        className="w-full h-full object-cover opacity-60 scale-102"
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    {/* Left Column Content - High precision typography details */}
                    <div className="relative z-20 p-8 md:p-14 lg:p-16 max-w-4xl space-y-8 flex flex-col justify-between min-h-[460px]">
                      
                      <div className="space-y-4">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="px-3.5 py-1.5 bg-brand-orange/20 border border-brand-orange/30 text-brand-orange text-[9px] font-black uppercase tracking-widest rounded-lg font-mono">
                            {activeRecipe.cuisine || cuisineInput} Cuisine
                          </span>
                          <span className="px-3.5 py-1.5 bg-teal-500/15 border border-teal-500/20 text-teal-400 text-[9px] font-black uppercase tracking-widest rounded-lg font-mono">
                            {activeRecipe.dietary || dietaryInput}
                          </span>
                          <span className="px-3.5 py-1.5 bg-neutral-800 text-zinc-300 text-[9px] font-black uppercase tracking-widest rounded-lg font-mono">
                            ★ 4.9 Rated
                          </span>
                        </div>

                        <h1 className="font-display font-black text-3xl md:text-5xl text-white tracking-tight leading-none uppercase">
                          {activeRecipe.title}
                        </h1>

                        <p className="text-xs md:text-sm text-zinc-300 leading-relaxed font-semibold max-w-2xl">
                          {activeRecipe.description}
                        </p>
                      </div>

                      {/* Display Info details stats bar */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8 border-t border-white/5 max-w-3xl">
                        <div className="space-y-1">
                          <span className="text-[9.5px] uppercase font-black tracking-widest text-[#FF7A00] block font-mono">Chef Prep time</span>
                          <span className="text-sm font-black text-white flex items-center gap-1.5 font-mono">
                            <Clock className="w-4 h-4 text-brand-orange" />
                            {activeRecipe.prepTime}
                          </span>
                        </div>
                        <div className="space-y-1">
                          <span className="text-[9.5px] uppercase font-black tracking-widest text-[#FF7A00] block font-mono">Cook time</span>
                          <span className="text-sm font-black text-white flex items-center gap-1.5 font-mono">
                            <Utensils className="w-4 h-4 text-amber-400" />
                            {activeRecipe.cookTime}
                          </span>
                        </div>
                        <div className="space-y-1">
                          <span className="text-[9.5px] uppercase font-black tracking-widest text-[#FF7A00] block font-mono">Difficulty</span>
                          <span className="text-sm font-black text-brand-orange flex items-center gap-1.5 font-mono">
                            <Gauge className="w-4 h-4" />
                            {activeRecipe.difficulty}
                          </span>
                        </div>
                        <div className="space-y-1">
                          <span className="text-[9.5px] uppercase font-black tracking-widest text-[#FF7A00] block font-mono">Servings count</span>
                          <span className="text-sm font-black text-white block font-mono">
                            🧑‍🤝‍🧑 {activeRecipe.servings} Serves
                          </span>
                        </div>
                      </div>

                      {/* Primary deck visual controls floating at bottom right */}
                      <div className="pt-6 flex flex-wrap gap-3 items-center">
                        <button
                          onClick={() => handleToggleBookmark(activeRecipe)}
                          className={`px-6 py-3.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer border ${
                            savedRecipes.some((r) => r.title.toLowerCase() === activeRecipe.title.toLowerCase())
                              ? "bg-rose-500 border-rose-500 text-white shadow-lg"
                              : "bg-neutral-900 border-white/15 hover:border-brand-orange text-zinc-300"
                          }`}
                        >
                          <Heart className="w-4 h-4 fill-current" />
                          <span>
                            {savedRecipes.some((r) => r.title.toLowerCase() === activeRecipe.title.toLowerCase()) 
                              ? "Bookmarked!" 
                              : "Bookmark Recipe"
                            }
                          </span>
                        </button>

                        <button
                          onClick={() => copyRecipeShareText(activeRecipe)}
                          className="px-4 py-3 bg-neutral-900/80 border border-white/5 hover:border-brand-orange text-zinc-300 rounded-xl flex items-center gap-1.5 cursor-pointer text-xs font-black uppercase tracking-wider"
                          title="Share outline text"
                        >
                          <Share2 className="w-4 h-4 text-brand-orange" />
                          <span>Share</span>
                        </button>

                        <button
                          onClick={() => downloadRecipeFile(activeRecipe)}
                          className="px-4 py-3 bg-neutral-900/80 border border-white/5 hover:border-brand-orange text-zinc-300 rounded-xl flex items-center gap-1.5 cursor-pointer text-xs font-black uppercase tracking-wider"
                          title="Download local txt document"
                        >
                          <Download className="w-4 h-4 text-emerald-400" />
                          <span>Txt blueprint</span>
                        </button>

                        <button
                          onClick={() => window.print()}
                          className="px-4 py-3 bg-neutral-900/80 border border-white/5 hover:border-white text-zinc-300 rounded-xl flex items-center gap-1.5 cursor-pointer text-xs font-black uppercase tracking-wider ml-auto font-mono"
                        >
                          <Printer className="w-4 h-4" />
                          <span>Print PDF</span>
                        </button>
                      </div>

                    </div>
                  </div>

                  {/* 40% UI details: Ingredients closet lists, stepper timeline, nutrition progressive charts */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Left Column (Spans 1) Ingredients Checklist & Nutrition circular progress rings */}
                    <div className="space-y-8 lg:col-span-1">
                      
                      {/* Ingredients section */}
                      <div className="bg-neutral-900/40 border border-white/5 rounded-[2rem] p-6 shadow-xl space-y-5">
                        <div className="flex items-center justify-between border-b border-white/5 pb-3">
                          <h3 className="font-display font-black text-sm text-white flex items-center gap-2 uppercase tracking-wider">
                            <BookOpen className="w-4.5 h-4.5 text-brand-orange" />
                            <span>Ingredients Closet</span>
                          </h3>
                          <span className="text-[9px] text-[#FF7A00] font-black uppercase font-mono tracking-widest bg-[#FF7A00]/10 px-2 py-0.5 rounded">
                            Interactive
                          </span>
                        </div>

                        <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
                          {activeRecipe.ingredients.map((ing, idx) => (
                            <div
                              key={idx}
                              onClick={() => toggleCheckedIngredient(idx)}
                              className={`flex items-start gap-3.5 p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer ${
                                ing.checked
                                  ? "bg-emerald-500/5 border-emerald-500/10 text-zinc-550 line-through"
                                  : "bg-zinc-950/40 border-white/5 hover:border-brand-orange/40"
                              }`}
                            >
                              <div className={`mt-0.5 w-5 h-5 rounded-lg flex items-center justify-center border transition-all ${
                                ing.checked 
                                  ? "bg-emerald-500 border-emerald-500 text-neutral-955 shadow-sm" 
                                  : "border-zinc-750 bg-neutral-950"
                              }`}>
                                {ing.checked && <Check className="w-3.5 h-3.5 stroke-[4]" />}
                              </div>
                              <div className="flex-1 text-xs">
                                <span className={`font-black block leading-tight ${ing.checked ? "text-zinc-500" : "text-white"}`}>{ing.name}</span>
                                <span className="text-zinc-450 font-mono text-[9px] block mt-1 tracking-tight">{ing.quantity}</span>
                                {ing.tag && (
                                  <span className="inline-block px-1.5 py-0.5 bg-amber-500/10 text-[8px] text-brand-orange font-black uppercase rounded-sm tracking-wider mt-1.5 leading-none">
                                    {ing.tag}
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Clipboard grocery exporter */}
                        <div className="pt-3 border-t border-white/5">
                          <button
                            onClick={() => {
                              const pending = activeRecipe.ingredients.filter((i) => !i.checked);
                              if (pending.length === 0) {
                                showToast("All items checked off properly!", "info");
                                return;
                              }
                              const listText = `Grocery checkouts for ${activeRecipe.title}:\n` + pending.map((p) => `- ${p.name} (${p.quantity})`).join("\n");
                              navigator.clipboard.writeText(listText);
                              showToast("Grocery outline copied to clipboard!", "success");
                            }}
                            className="w-full py-3.5 bg-brand-orange hover:bg-brand-orange/90 text-white text-[10px] font-black uppercase tracking-widest rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition-all font-mono"
                          >
                            <span>Grocery copy checklist ({activeRecipe.ingredients.filter((i) => !i.checked).length})</span>
                          </button>
                        </div>
                      </div>

                      {/* APPLE FITNESS RINGS GRAPHICS COMPARTMENT */}
                      <div className="bg-neutral-900/40 border border-white/5 rounded-[2rem] p-6 shadow-xl space-y-5">
                        <div className="flex items-center gap-2 border-b border-white/5 pb-3 justify-between">
                          <div className="flex items-center gap-2">
                            <Flame className="w-4.5 h-4.5 text-orange-500" />
                            <h3 className="font-display font-black text-sm text-white uppercase tracking-wider">
                              Apple Fitness Rings
                            </h3>
                          </div>
                          <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest font-mono">Calorie profiles</span>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          {paintCircularNutritionProgress(activeRecipe.nutrition.calories, "#FF7A00", "Calories", 1200)}
                          {paintCircularNutritionProgress(activeRecipe.nutrition.protein, "#10B981", "Protein", 100)}
                          {paintCircularNutritionProgress(activeRecipe.nutrition.carbs, "#F59E0B", "Carbohydrates", 250)}
                          {paintCircularNutritionProgress(activeRecipe.nutrition.fats, "#3B82F6", "Fats Lipid", 80)}
                        </div>
                      </div>

                    </div>

                    {/* Right column (Spans 2) Premium Steps timeline checklist (Fitness tracker inspired) */}
                    <div className="lg:col-span-2 space-y-8">
                      
                      {/* Timeline steps card */}
                      <div className="bg-neutral-900/40 border border-white/5 rounded-[2rem] p-6 md:p-8 shadow-xl space-y-6">
                        
                        <div className="flex items-center justify-between border-b border-white/5 pb-4">
                          <div className="flex items-center gap-2">
                            <CheckSquare className="w-5 h-5 text-emerald-400" />
                            <h3 className="font-display font-black text-sm text-white uppercase tracking-wider">
                              {language === "te" ? "Vantakam tayaree sopanaala pranalika" : "Chronological cooking timeline tracker"}
                            </h3>
                          </div>
                          <span className="text-[9px] font-black font-mono text-zinc-500 uppercase tracking-widest">
                            Interactive steps
                          </span>
                        </div>

                        <div className="relative pl-8 space-y-6">
                          
                          {/* Slinky Fitness progress bar line */}
                          <div className="absolute left-[13px] top-4 bottom-4 w-[2px] bg-neutral-800" />

                          {activeRecipe.instructions.map((step, idx) => {
                            const isDone = completedSteps.includes(idx);
                            return (
                              <div
                                key={idx}
                                onClick={() => {
                                  setCompletedSteps((prev) =>
                                    prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
                                  );
                                }}
                                className={`relative group flex items-start gap-4.5 p-4 rounded-2xl border transition-all duration-300 cursor-pointer ${
                                  isDone
                                    ? "bg-emerald-500/5 border-emerald-500/10 text-zinc-500 shadow-inner"
                                    : "bg-zinc-950/40 border-white/5 hover:border-brand-orange/40"
                                }`}
                              >
                                {/* Radial track marker overlay */}
                                <div className={`absolute -left-[25.5px] top-[20px] w-5.5 h-5.5 rounded-full border-2 flex items-center justify-center transition-all ${
                                  isDone
                                    ? "bg-emerald-500 border-emerald-500 text-neutral-950 scale-110 shadow-[0_0_10px_rgba(16,185,129,0.4)]"
                                    : "bg-neutral-900 border-zinc-700 text-transparent"
                                }`}>
                                  {isDone && <Check className="w-3 h-3 stroke-[4]" />}
                                </div>

                                <div className="space-y-1.5 flex-1">
                                  <div className="flex items-center justify-between">
                                    <span className={`text-[9px] font-black px-2.5 py-0.5 rounded-md uppercase tracking-wider font-mono ${
                                      isDone ? "bg-emerald-500/10 text-emerald-400" : "bg-brand-orange/15 text-brand-orange"
                                    }`}>
                                      {language === "te" ? `SOPANAM ${idx + 1}` : `STAGE ${idx + 1}`}
                                    </span>
                                    <span className="text-[9px] font-extrabold font-mono tracking-widest uppercase text-zinc-500">
                                      {isDone ? (language === "te" ? "Tayaraindi" : "Checked Off") : (language === "te" ? "Avasaram" : "Pending")}
                                    </span>
                                  </div>
                                  <p className={`text-xs leading-relaxed transition-all tracking-wide ${
                                    isDone ? "text-zinc-500 font-normal line-through" : "text-zinc-200 font-semibold"
                                  }`}>
                                    {step}
                                  </p>
                                </div>
                              </div>
                            );
                          })}

                        </div>

                      </div>

                      {/* Warnings and Secret Chef Tips (Gold & Ruby themes) */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                        <div className="bg-amber-500/5 border border-brand-orange/20 rounded-[2rem] p-6 space-y-4">
                          <h4 className="font-display font-black text-xs text-brand-orange uppercase tracking-wider flex items-center gap-1.5 font-mono">
                            <Lightbulb className="w-4.5 h-4.5 text-yellow-500" />
                            <span>Chef Secret Tips</span>
                          </h4>
                          <ul className="space-y-3 text-xs text-stone-700 dark:text-zinc-300 leading-relaxed font-semibold">
                            {activeRecipe.tips.map((tip, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-[11px]">
                                <span className="text-yellow-500 font-black shrink-0">✦</span>
                                <span>{tip}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="bg-red-500/5 border border-red-550/20 rounded-[2rem] p-6 space-y-4">
                          <h4 className="font-display font-black text-xs text-red-400 tracking-wider uppercase flex items-center gap-1.5 font-mono">
                            <AlertTriangle className="w-4.5 h-4.5 text-red-500" />
                            <span>Avoid Critical Mistakes</span>
                          </h4>
                          <ul className="space-y-3 text-xs text-stone-700 dark:text-zinc-300 leading-relaxed font-semibold">
                            {activeRecipe.mistakes.map((mistake, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-[11px]">
                                <span className="text-red-500 font-black shrink-0">✖</span>
                                <span>{mistake}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                      </div>

                      {/* Ingredient substitutes list if active */}
                      {activeRecipe.substitutes && activeRecipe.substitutes.length > 0 && (
                        <div className="bg-[#0A0A0E] border border-white/5 rounded-[2rem] p-6 shadow-xl space-y-4">
                          <h4 className="font-display font-black text-xs uppercase tracking-wider text-white flex items-center gap-2">
                            <Info className="w-4.5 h-4.5 text-sky-400" />
                            <span>AI Replacement Substitutions</span>
                          </h4>
                          <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs border-collapse">
                              <thead>
                                <tr className="border-b border-white/5 text-zinc-500">
                                  <th className="pb-3.5 font-black uppercase text-[9px] tracking-widest font-mono">Original Item</th>
                                  <th className="pb-3.5 font-black uppercase text-[9px] tracking-widest font-mono">AI Swapped Alternative</th>
                                  <th className="pb-3.5 font-black uppercase text-[9px] tracking-widest font-mono">Swap Adjustment Reason</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-white/5 font-semibold">
                                {activeRecipe.substitutes.map((s, id) => (
                                  <tr key={id} className="text-zinc-300">
                                    <td className="py-4 font-black text-red-400 font-mono">{s.original}</td>
                                    <td className="py-4 font-black text-emerald-400 font-mono">{s.substitute}</td>
                                    <td className="py-4 text-zinc-400 text-[11px] leading-relaxed">{s.reason}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}

                      {/* Side Drinks and recommended accompaniments */}
                      <div className="bg-neutral-900/30 border border-white/5 rounded-[2rem] p-6 shadow-xl space-y-4">
                        <h4 className="font-display font-black text-xs uppercase tracking-widest text-[#FF7A00] font-mono">Chef Recommended Sides &amp; Mixology Mocktails</h4>
                        <div className="flex flex-wrap gap-2.5">
                          {activeRecipe.sideDishes.map((side, id) => (
                            <span
                              key={id} 
                              className="px-4 py-2 bg-zinc-950 border border-white/5 rounded-xl text-[11px] font-black text-zinc-300 cursor-pointer hover:border-brand-orange transition-colors"
                            >
                              🥗 {side}
                            </span>
                          ))}
                        </div>
                      </div>

                    </div>

                  </div>

                </motion.div>
              )}

            </motion.div>
          )}

          {/* VIEW 3: DISCOVER CUPBOARD PANTRY MATCH ENGINE */}
          {activeTab === "discover" && (
            <motion.div
              key="discover-view"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              className="space-y-8"
            >
              <div className={!discoveryResult && !loadingDiscovery ? "grid grid-cols-1 lg:grid-cols-12 gap-8 items-start" : "space-y-8"}>
                
                <div className={`${!discoveryResult && !loadingDiscovery ? "lg:col-span-7" : ""} charcoal-glass rounded-[2.5rem] p-6 md:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.3)] space-y-6 relative overflow-hidden h-full flex flex-col justify-between`}>
                  <div>
                    <div className="absolute top-0 right-0 w-80 h-80 bg-brand-orange/5 rounded-full blur-3xl pointer-events-none" />
                    
                    <div className="flex items-center gap-4 mb-6">
                      <div className="p-3.5 bg-[#FF7A00]/10 rounded-2xl text-brand-orange">
                        <Grid className="w-6 h-6" />
                      </div>
                      <div>
                        <h2 className="font-display font-black text-xl text-stone-900 dark:text-white uppercase tracking-tight">Ingredient Cupboard Pantry Matcher</h2>
                        <p className="text-xs text-stone-500 dark:text-zinc-450 font-medium mt-1">Safeguard leftovers and map out stunning, cookable recipes with immediate steps</p>
                      </div>
                    </div>

                    <div className="space-y-4 text-xs font-semibold">
                      <div className="space-y-2">
                        <label className="font-black text-stone-500 dark:text-zinc-400 uppercase tracking-widest block font-mono">List any ingredients present in your cupboard/fridge</label>
                        <input
                          type="text"
                          value={discoveryInput}
                          onChange={(e) => setDiscoveryInput(e.target.value)}
                          placeholder="e.g. Potato, chicken breasts, garlic, milk, butter, curry leaves..."
                          className="w-full bg-stone-55 dark:bg-zinc-950 border border-stone-250 dark:border-zinc-850 rounded-xl px-4 py-4 text-stone-900 dark:text-zinc-200 focus:outline-none"
                        />
                      </div>

                      {discoveryError && (
                        <div className="p-4 bg-red-500/5 border border-red-550/15 text-red-400 font-semibold rounded-xl text-xs">
                          {discoveryError}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="pt-6">
                    <button
                      onClick={runPantryMatch}
                      disabled={loadingDiscovery || !discoveryInput.trim()}
                      className="w-full py-4.5 bg-gradient-to-r from-brand-orange via-amber-500 to-yellow-500 disabled:opacity-50 text-white font-black uppercase tracking-wider text-xs rounded-xl shadow-md cursor-pointer transition-colors font-mono hover:shadow-orange-500/35"
                    >
                      {loadingDiscovery ? "Calculating visual pantry coordinates..." : "FORGE COMPOSITE DISCOVERY"}
                    </button>
                  </div>
                </div>

                {/* Gamified Cupboard Pantry Adder & Carbon Footprint calculation */}
                {!discoveryResult && !loadingDiscovery && (
                  <div className="lg:col-span-5 bg-neutral-900/10 border border-white/5 rounded-[2.5rem] p-6 md:p-8 space-y-6 relative overflow-hidden h-full flex flex-col justify-between">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
                    
                    <div className="space-y-5">
                      <div className="flex items-center justify-between border-b border-white/5 pb-3">
                        <span className="text-[10px] font-black text-brand-orange uppercase tracking-widest font-mono">Pantry Ingredient Express Locker</span>
                        <span className="text-[9px] uppercase bg-emerald-500/10 text-emerald-400 font-black px-2 py-1 rounded font-mono">Eco-Saver</span>
                      </div>

                      <p className="text-xs text-zinc-400 font-semibold leading-relaxed">
                        Tap any premium ingredient shortcut below to dynamically append or remove items from your matchmaking input above.
                      </p>

                      {/* Gamified shortcuts cupboard */}
                      <div className="grid grid-cols-3 gap-2.5 font-semibold text-xs pt-2">
                        {[
                          { name: "Potato", icon: "🥔" },
                          { name: "Chicken", icon: "🍗" },
                          { name: "Garlic", icon: "🧄" },
                          { name: "Salmon", icon: "🐟" },
                          { name: "Mushroom", icon: "🍄" },
                          { name: "Paneer", icon: "🧀" },
                          { name: "Onion", icon: "🧅" },
                          { name: "Basil", icon: "🌿" },
                          { name: "Butter", icon: "🧈" }
                        ].map((item, idx) => {
                          const lowerName = item.name.toLowerCase();
                          const lowerInput = discoveryInput.toLowerCase();
                          const isSelected = lowerInput.includes(lowerName);

                          return (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => {
                                let currentItems = discoveryInput
                                  .split(",")
                                  .map(i => i.trim())
                                  .filter(i => i.length > 0);
                                
                                const idxFound = currentItems.findIndex(i => i.toLowerCase() === lowerName);
                                if (idxFound > -1) {
                                  currentItems.splice(idxFound, 1);
                                  showToast(`Removed indeed ${item.name} from locker.`, "info");
                                } else {
                                  currentItems.push(item.name);
                                  showToast(`Deposited ${item.name} inside pantry express!`, "success");
                                }
                                setDiscoveryInput(currentItems.join(", "));
                              }}
                              className={`py-3 px-2.5 border rounded-xl flex flex-col items-center justify-center text-center gap-1.5 transition-all text-[11px] cursor-pointer ${
                                isSelected
                                  ? "bg-[#FF7A00]/15 border-brand-orange text-[#FF7A00]"
                                  : "bg-zinc-950/40 border-white/5 text-zinc-400 hover:border-zinc-800"
                              }`}
                            >
                              <span className="text-xl">{item.icon}</span>
                              <span className="font-black tracking-wide leading-none">{item.name}</span>
                            </button>
                          );
                        })}
                      </div>

                      {/* Carbon footprint calculator slider */}
                      <div className="pt-4 border-t border-white/5 space-y-3.5 font-semibold">
                        <div className="flex items-center justify-between">
                          <span className="text-[9.5px] uppercase font-black text-zinc-400 font-mono">Organic Trash Saver Estimation:</span>
                          <span className="text-[10px] font-mono text-emerald-400 font-black">{carbonWasteWeight} kg waste diverted</span>
                        </div>
                        
                        <input
                          type="range"
                          min="1"
                          max="50"
                          value={carbonWasteWeight}
                          onChange={(e) => setCarbonWasteWeight(parseInt(e.target.value))}
                          className="w-full accent-emerald-500 cursor-pointer bg-zinc-900 border border-white/5 h-1.5 rounded-full"
                        />

                        <div className="bg-emerald-500/5 p-3 border border-emerald-500/10 rounded-2.5xl flex items-center gap-3">
                          <span className="text-2xl">🌱</span>
                          <div className="text-xs">
                            <span className="text-white block">Carbon Emissions Diverted Score:</span>
                            <span className="text-[11px] text-emerald-400 font-mono mt-0.5 block font-black">
                              Calculated {(carbonWasteWeight * 1.9).toFixed(1)} kg/CO2 Greenhouse Saved
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4.5 border-t border-white/5 text-[9.5px]/relaxed text-zinc-500 italic font-mono block">
                      Preventing organic food decay dramatically offsets methane gas generation in landfills.
                    </div>
                  </div>
                )}

              </div>

              {loadingDiscovery && (
                <div className="p-16 text-center border border-white/5 bg-neutral-900/40 rounded-[2.5rem] space-y-4">
                  <div className="w-8 h-8 border-4 border-brand-orange animate-spin border-t-transparent rounded-full mx-auto" />
                  <p className="text-xs text-zinc-400 font-mono">Orchestrating optimal flavor pairings with premium culinary spices...</p>
                </div>
              )}

              {discoveryResult && (
                <div className="space-y-8">
                  
                  {/* Top optimal match banner with beautiful illustration back */}
                  <div className="bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-700 text-white p-8 rounded-[2.5rem] shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-80 h-full bg-white/5 rounded-full blur-3xl pointer-events-none" />
                    <div className="space-y-2.5 relative z-10">
                      <span className="text-[10px] font-black uppercase tracking-widest text-emerald-250 font-mono">Premium Gastronomy Match Recommendation</span>
                      <h3 className="font-display font-black text-2xl leading-none">{discoveryResult.bestMatch}</h3>
                      <p className="text-xs text-emerald-100 max-w-xl leading-relaxed">
                        This curated match yields the highest percentage score corresponding logically with your cupboard parameters. Ready to forge step details.
                      </p>
                    </div>
                    <div className="relative z-10 shrink-0">
                      <button
                        onClick={() => selectDiscoveredRecipe(discoveryResult.bestMatch)}
                        className="px-6 py-3.5 bg-white hover:bg-zinc-100 text-emerald-900 font-black text-xs uppercase rounded-xl tracking-widest shadow-md transition-all active:scale-98"
                      >
                        Forge recipe steps
                      </button>
                    </div>
                  </div>

                  {/* Recommendations options */}
                  <div className="space-y-6">
                    <h3 className="font-display font-black text-sm text-zinc-400 uppercase tracking-wider">Other culinary avenues open:</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      {discoveryResult.recommendations.map((rec, id) => (
                        <div
                          key={id}
                          className="bg-neutral-900/40 border border-white/5 rounded-[2.2rem] p-6 flex flex-col justify-between space-y-6 shadow-xl hover:border-brand-orange transition-all"
                        >
                          <div className="space-y-3">
                            <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-widest font-mono">
                              <span className="text-brand-orange">{rec.cuisine} style</span>
                              <span className="text-zinc-500">{rec.prepTime} Prep</span>
                            </div>
                            <h4 className="font-display font-black text-white text-base leading-tight">{rec.title}</h4>
                            <p className="text-[11px] text-zinc-400 leading-relaxed font-semibold">{rec.description}</p>
                          </div>

                          <div className="space-y-4 pt-4 border-t border-white/5 text-xs font-semibold">
                            <div className="space-y-1.5">
                              <span className="text-[9.5px] uppercase font-black text-emerald-400 block font-mono">Cupboard matches:</span>
                              <div className="flex flex-wrap gap-1">
                                {rec.keyIngredientsNeeded.map((ingVal, idx) => (
                                  <span key={idx} className="bg-emerald-500/10 px-2.5 py-1 rounded text-[9px] text-emerald-300 border border-emerald-500/25 mb-1 inline-block">
                                    {ingVal}
                                  </span>
                                ))}
                              </div>
                            </div>

                            {rec.missingIngredients && rec.missingIngredients.length > 0 && (
                              <div className="space-y-1.5">
                                <span className="text-[9.5px] uppercase font-black text-rose-400 block font-mono">Missing Ingredients:</span>
                                <div className="flex flex-wrap gap-1">
                                  {rec.missingIngredients.map((iMissing, idx) => (
                                    <span key={idx} className="bg-rose-500/10 px-2.5 py-1 rounded text-[9px] text-rose-450 border border-rose-500/25 mb-1 inline-block font-mono">
                                      {iMissing}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}

                            <button
                              onClick={() => selectDiscoveredRecipe(rec.title)}
                              className="w-full mt-3 py-3 bg-zinc-950 hover:bg-neutral-800 text-zinc-300 hover:text-white border border-white/5 hover:border-brand-orange text-[10px] font-black uppercase tracking-widest rounded-xl cursor-pointer transition-colors font-mono"
                            >
                              Forge complete dish
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              )}

            </motion.div>
          )}

          {/* VIEW 4: WEEKLY MEAL DIET REGIMEN */}
          {activeTab === "planner" && (
            <motion.div
              key="planner-view"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
            >
              <MealPlanner lang={language} />
            </motion.div>
          )}

          {/* VIEW 5: BOOKMARKED LIBRARY */}
          {activeTab === "saved" && (
            <motion.div
              key="saved-view"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              className="space-y-8"
            >
              <div className="flex items-center justify-between border-b border-white/5 pb-3.5">
                <div className="space-y-1 border-l-4 border-brand-orange pl-4.5">
                  <h2 className="font-display font-black text-2xl text-stone-900 dark:text-white uppercase tracking-tight">Saved Gastronomy Library</h2>
                  <p className="text-xs text-stone-500 dark:text-zinc-400 font-medium">Your customized catalogued elite recipe blueprints logged safe offline</p>
                </div>

                {savedRecipes.length > 0 && (
                  <button
                    onClick={() => {
                      setSavedRecipes([]);
                      localStorage.removeItem("ai_recipe_saved_list");
                      showToast("Library wiped cleanly", "info");
                    }}
                    className="text-[10px] text-red-500 hover:text-red-400 font-black uppercase tracking-widest cursor-pointer font-mono"
                  >
                    Clear Library
                  </button>
                )}
              </div>

              {savedRecipes.length === 0 ? (
                <div className="p-16 text-center border border-white/10 bg-neutral-900/40 rounded-[2.5rem] space-y-5">
                  <Bookmark className="w-14 h-14 text-zinc-600 mx-auto animate-bounce" />
                  <div className="space-y-1.5">
                    <h3 className="font-display font-black text-xl text-neutral-300 uppercase">Blueprints collection is empty</h3>
                    <p className="text-xs text-zinc-500 max-w-sm mx-auto leading-relaxed font-semibold">
                      Fine-tune recipes inside our generative furnace or match leftovers in the pantry, then click the heart icon on any generated file to store it here.
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab("generator")}
                    className="px-6 py-3.5 bg-brand-orange hover:bg-brand-orange/90 text-white font-black text-[10.5px] uppercase tracking-widest rounded-xl transition-transform hover:scale-105 shadow-md shadow-orange-500/20 mt-4"
                  >
                    Go to AI Generator
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {savedRecipes.map((item, idx) => (
                    <div
                      key={idx}
                      className="bg-neutral-900/40 border border-white/5 rounded-[2.2rem] p-6 flex flex-col justify-between space-y-6 hover:shadow-2xl hover:border-brand-orange transition-all"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest font-mono">
                          <span className="text-brand-orange">{item.cuisine || "Special"} style</span>
                          <span className="text-zinc-500 flex items-center gap-1"><Clock className="w-4.5 h-4.5" /> {item.prepTime}</span>
                        </div>
                        <h4 className="font-display font-black text-white text-base leading-tight">{item.title}</h4>
                        <p className="text-[11.5px] text-zinc-400 leading-snug line-clamp-2">{item.description}</p>
                      </div>

                      <div className="space-y-4 pt-4 border-t border-white/5 text-xs font-semibold">
                        <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-wider text-zinc-450 font-mono">
                          <span>Calories: {item.nutrition.calories}</span>
                          <span className="text-emerald-400">Protein: {item.nutrition.protein}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2.5 text-[9.5px] font-black uppercase tracking-widest font-mono">
                          <button
                            onClick={() => {
                              setActiveRecipe(item);
                              setActiveTab("generator");
                            }}
                            className="py-3 bg-brand-orange hover:bg-brand-orange/90 text-white rounded-xl text-center cursor-pointer transition-colors"
                          >
                            Open Details
                          </button>
                          <button
                            onClick={() => handleToggleBookmark(item)}
                            className="py-3 bg-zinc-950 hover:bg-neutral-800 text-red-400 rounded-xl text-center cursor-pointer transition-colors border border-white/5"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

        </AnimatePresence>

      </main>

      {/* Floating ChatGPT styled chef chatbot bubble */}
      <ChefChatbot lang={language} />

      {/* Apple-inspired subtle cinematic footer */}
      <footer className="relative bg-[#0A0A0E]/80 border-t border-white/5 py-12 mt-20 text-xs text-zinc-500 z-10 w-full font-semibold">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="text-left space-y-1">
            <p className="font-black text-zinc-400 text-xs uppercase tracking-widest font-mono">CuisineAI Studio</p>
            <p className="text-[11px] text-zinc-500">
              Immersive culinary generator powered by modern Google Gemini models, custom voice parsing, and responsive components.
            </p>
          </div>
          <div className="text-right text-[11px] text-zinc-650 font-mono">
            <span>© {new Date().getFullYear()} CuisineAI Inc. Compiled with cinematic design standards.</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
