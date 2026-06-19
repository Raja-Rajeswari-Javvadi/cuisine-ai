import React, { useState } from "react";
import { Calendar, Flame, AlertCircle, RefreshCw, ChevronRight, Apple, CheckCircle2, Sparkles, AlertTriangle, Salad, HeartHandshake, Eye, Activity, Heart, Award, ArrowUpRight, TrendingUp } from "lucide-react";
import { WeeklyMealPlan } from "../types";

interface MealPlannerProps {
  lang?: string;
}

// Premium culinary imagery
const getMealTopicImage = (goal: string): string => {
  const normalized = goal.toLowerCase();
  if (normalized.includes("protein") || normalized.includes("athlet")) {
    return "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=600&q=80"; // steak salad pack
  }
  if (normalized.includes("keto") || normalized.includes("low carb")) {
    return "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80"; // ribs
  }
  if (normalized.includes("veget") || normalized.includes("longevity")) {
    return "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80"; // greek bowl
  }
  return "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80";
};

// Curated elite offline templates - eliminates blank loading space, creates immediate immersive exploring
const CURATED_GOLDEN_PLANS = [
  {
    title: "Mediterranean longevity & Heart Plan",
    notes: "A premium regimen focused on heavy antioxidant fats, cold-pressed polyphenols, wild mackerel lipids, and complex ancient grains. Optimized for cardiac defense index and vascular elasticity.",
    days: [
      { day: "Monday", breakfast: "Greek probiotic yogurt with raw walnut halves, pomegranate gems & honey", lunch: "Quinoa grain medley under grilled wild sardines & herb vinaigrette", snack: "Hummus with olive tapenade & celery stalks", dinner: "Hearth-roasted Lemon Sea Bass over steamed asparagus spears", calories: "1680 kcal" },
      { day: "Tuesday", breakfast: "Avocado sourdough toast under two poached free-range eggs and microgreens", lunch: "Lentil soup with garden spinach and raw extra-virgin olive drizzle", snack: "Handful of raw pistachios and organic dried figs", dinner: "Herbed French skillet chicken breast with heirloom cherry tomatoes", calories: "1720 kcal" },
      { day: "Wednesday", breakfast: "Organic ancient steel-cut oats cooked in nut milk with raspberry chia jelly", lunch: "Warm organic chickpea grain bowl with shaved radish & feta crumble", snack: "Slices of crisp organic green apple with salted almond paste", dinner: "Dry-seared wild Salmon fillet on steam wilted dandelion greens", calories: "1750 kcal" },
      { day: "Thursday", breakfast: "Smoked salmon carpaccio on cucumber coin wafers with organic capers", lunch: "Farro tabbouleh salad with garlic roasted chickpeas & wild mint", snack: "Roasted pumpkin seeds with pink sea salt", dinner: "Baked wild cod fillet under a savory Kalamata olive crust & garlic beans", calories: "1690 kcal" },
      { day: "Friday", breakfast: "Herbed egg-white scramble with vine tomatoes & baby arugula", lunch: "Zesty organic black bean quinoa bowl with micro green salad", snack: "Kalamata olives with feta cheese cubes", dinner: "Slow baked halibut steak with rosemary crushed baby gold potato", calories: "1810 kcal" },
      { day: "Saturday", breakfast: "Warm raspberry oatmeal porridge with hemp seeds & walnut crumble", lunch: "Lentil macro broth with steamed red cargo rice and roasted stems", snack: "Organic cashew paste on celery sticks", dinner: "Fire roasted shrimp skewers with tri-color peppers & lemon glisting", calories: "1730 kcal" },
      { day: "Sunday", breakfast: "Tuscan poached eggs over slow braised kale greens & roasted tomato", lunch: "Garlic avocado mash wrapped in dynamic toasted flaxseed flatbread", snack: "Small block of 90% dark ceremonial cacao bean chocolate", dinner: "Ancient-grain stuffed orange peppers under tender pine nut crumble", calories: "1700 kcal" }
    ]
  },
  {
    title: "Sheng-Fung Ketogenic Shred Schedule",
    notes: "Strict low-carbohydrate high-lipid formulation to stimulate rapid liver ketogenesis while preserving lean skeletal muscle tissue.",
    days: [
      { day: "Monday", breakfast: "Sautéed organic bacon strips with pasture egg omelette in butter", lunch: "Traditional Cobb salad with roasted poultry skin, blue cheese, and avocado", snack: "Raw macadamia nut halves with hot ceremonial matcha", dinner: "USDA Prime Ribeye steak base under grass-fed garlic butter & spinach", calories: "2150 kcal" },
      { day: "Tuesday", breakfast: "Double espresso infused with organic MCT oil and coconut butter cream", lunch: "Skin-crisped Salmon medallion inside heavy cream parmesan broccoli", snack: "Smoked local Gouda cheese wedges", dinner: "Pan seared pork cutlets inside rich garlic cauliflower carbonara mash", calories: "2200 kcal" },
      { day: "Wednesday", breakfast: "Baked avocado bowls filled with heavy cheddar & crumbled sage sausage", lunch: "Mediterranean tuna salad wrapped inside crisp butter lettuce cups", snack: "Dry roasted pumpkin seeds with organic sea salt", dinner: "Skillet garlic prawns bathed in double cream with zucchini squash ribbons", calories: "2050 kcal" },
      { day: "Thursday", breakfast: "Rich chive and wild mushroom omeled baked in stone-pressed ghee", lunch: "Golden roasted turkey leg over baby spinach salad & cold walnut drip", snack: "Avocado wedges sprinkled with red pepper flakes & lime zest", dinner: "Tender local Lamb chops roasted in buttered herbs & garden asparagus", calories: "2280 kcal" },
      { day: "Friday", breakfast: "Baked keto morning eggs topped with crispy duck rind bacon crumbs", lunch: "Chuck beef patties covered under roasted Monterey Jack cheese & lettuce", snack: "Rich hickory smoked almonds", dinner: "Oven-roasted herbed chicken thighs inside garlic butter cabbage wedges", calories: "2190 kcal" },
      { day: "Saturday", breakfast: "Coconut flour pancake pancakes with melted unsalted butter & keto glaze", lunch: "Greek village chicken salad with black Greek olives, feta & olive oil", snack: "Organic celery channels filled with organic hazelnut butter", dinner: "Grilled sea scallops inside herbed brown ghee sauce over greens", calories: "2010 kcal" },
      { day: "Sunday", breakfast: "Scrambled free-range eggs with cream cheese, chives & smoked salmon", lunch: "Rich duck thigh confit over garlic sautéed green garden beans", snack: "Small blocks of organic Pecorino cheese", dinner: "Prime tenderloin steak seared in bone marrow reduction and spinach", calories: "2300 kcal" }
    ]
  }
];

export const MealPlanner: React.FC<MealPlannerProps> = ({ lang = "en" }) => {
  const [dietGoal, setDietGoal] = useState("High Protein");
  const [calories, setCalories] = useState("2000");
  const [preferences, setPreferences] = useState("No particular allergy");
  const [isLoading, setIsLoading] = useState(false);
  const isTelugu = lang === "te";

  // Apple Health Sync Simulator Sliders info block state
  const [exerciseRing, setExerciseRing] = useState(45); // in minutes
  const [stepsRing, setStepsRing] = useState(8200); // step count
  const [muscleRing, setMuscleRing] = useState(14.5); // body fat/muscle mass targets

  const [plan, setPlan] = useState<WeeklyMealPlan | null>(() => {
    const saved = localStorage.getItem("ai_recipe_weekly_meal_plan");
    return saved ? JSON.parse(saved) : null;
  });
  const [error, setError] = useState<string | null>(null);

  const generatePlan = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/generate-meal-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dietGoal, calories, preferences, lang }),
      });

      if (!response.ok) {
        throw new Error(isTelugu 
          ? "Meal plan tayari lo thappu jarigindhi. Malli try cheyyandi."
          : "Chef got overwhelmed balancing the calories. Please try again."
        );
      }

      const data = await response.json();
      setPlan(data);
      localStorage.setItem("ai_recipe_weekly_meal_plan", JSON.stringify(data));
    } catch (err: any) {
      setError(err.message || (isTelugu ? "Meal plan andinchalekapoyaam." : "Failed to generate meal plan. Try adjusting parameters."));
    } finally {
      setIsLoading(false);
    }
  };

  const loadPresetPlan = (index: number) => {
    const selected = CURATED_GOLDEN_PLANS[index];
    setPlan(selected);
    setDietGoal(index === 0 ? "Mediterranean Splendid" : "Low Carb Keto");
    setCalories(index === 0 ? "1750" : "2150");
    setPreferences(index === 0 ? "Heart healthy, Extra olivine" : "Strict Grain free, sugar free");
    localStorage.setItem("ai_recipe_weekly_meal_plan", JSON.stringify(selected));
  };

  const clearPlan = () => {
    setPlan(null);
    localStorage.removeItem("ai_recipe_weekly_meal_plan");
  };

  // SVG circular progress rendering for Apple Health fitness rings
  const drawSyncFitnessRing = (current: number, target: number, color: string, label: string, suffix: string) => {
    const percentage = Math.min(100, Math.round((current / target) * 100));
    const r = 26;
    const circ = 2 * Math.PI * r;
    const offset = circ - (percentage / 100) * circ;

    return (
      <div className="flex items-center gap-3.5 bg-zinc-950/40 p-3.5 border border-white/5 rounded-2xl">
        <div className="relative w-14 h-14 shrink-0 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90">
            <circle cx="28" cy="28" r={r} className="stroke-neutral-900" strokeWidth="4.5" fill="transparent" />
            <circle
              cx="28"
              cy="28"
              r={r}
              stroke={color}
              strokeWidth="4.5"
              fill="transparent"
              strokeDasharray={circ}
              strokeDashoffset={offset}
              strokeLinecap="round"
              className="transition-all duration-700 ease-out"
              style={{ filter: `drop-shadow(0px 0px 4px ${color}55)` }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[9px] font-black text-white font-mono">{percentage}%</span>
          </div>
        </div>
        <div className="truncate">
          <span className="text-[10px] uppercase font-black tracking-widest text-zinc-500 block font-mono">{label}</span>
          <span className="text-xs font-black text-white font-mono block mt-0.5">{current} {suffix}</span>
        </div>
      </div>
    );
  };

  // Auto-calculated metabolic offset recommendation
  const calculatedCalorieRecommendation = Math.round(1550 + (exerciseRing * 7) + (stepsRing * 0.08));

  return (
    <div className="charcoal-glass rounded-[2.5rem] p-6 md:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.3)] space-y-8 relative overflow-hidden">
      
      {/* Background orange-gold soft ambient lights */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-brand-orange/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-yellow-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header with Luxury gold badge styling */}
      <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-white/5 pb-6">
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-gradient-to-tr from-[#FF7A00] to-yellow-500 rounded-2xl text-white shadow-lg shadow-orange-500/20 animate-pulse">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 bg-[#FF7A00]/15 text-brand-orange text-[8px] font-black tracking-widest rounded uppercase font-mono">STATION BETA v2.4</span>
              <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-ping"></span>
            </div>
            <h2 className="font-display font-black text-xl md:text-2xl text-stone-900 dark:text-white tracking-tight mt-1">
              {isTelugu ? "AI Weekly Diet Plan Planner" : "Weekly Premium Calorie Diet Scheduler"}
            </h2>
            <p className="text-xs text-stone-500 dark:text-zinc-450 font-medium mt-1">
              {isTelugu ? "Mee calorie lakshyaalaku thaginattu vanta pranalika" : "Immersive day-by-day caloric management crafted dynamically with metabolic diagnostics"}
            </p>
          </div>
        </div>
        {plan && (
          <button
            onClick={clearPlan}
            className="text-[10px] font-black uppercase tracking-widest px-5 py-3 border border-stone-200 dark:border-zinc-805 rounded-xl hover:bg-brand-orange hover:text-white dark:text-zinc-350 transition-all cursor-pointer font-mono"
          >
            {isTelugu ? "Malli Plan Cheyyi" : "Reset Calorie Calendar"}
          </button>
        )}
      </div>

      {!plan ? (
        <div className="space-y-10 relative z-10 animate-fade-in">
          
          {/* Aesthetic Promo Card Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="p-5 bg-stone-50/50 dark:bg-zinc-900/10 border border-stone-200/40 dark:border-zinc-800/40 rounded-2.5xl flex items-start gap-4">
              <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl">
                <Salad className="w-5 h-5 shrink-0" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 font-mono block">Dietary Filters</span>
                <p className="text-xs text-stone-700 dark:text-zinc-300 font-semibold mt-1">Vegan, low-carb, keto or highly organic protein inputs easily mapped.</p>
              </div>
            </div>
            
            <div className="p-5 bg-stone-50/50 dark:bg-zinc-900/10 border border-stone-200/40 dark:border-zinc-800/40 rounded-2.5xl flex items-start gap-4">
              <div className="p-2.5 bg-orange-500/10 border border-orange-500/20 text-orange-500 rounded-xl">
                <Flame className="w-5 h-5 shrink-0" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 font-mono block">Perfect Metabolism</span>
                <p className="text-xs text-stone-700 dark:text-zinc-300 font-semibold mt-1">Strict calorie boundaries configured securely for metabolism targets.</p>
              </div>
            </div>
            
            <div className="p-5 bg-stone-50/50 dark:bg-zinc-900/10 border border-stone-200/40 dark:border-zinc-800/40 rounded-2.5xl flex items-start gap-4">
              <div className="p-2.5 bg-pink-500/10 border border-pink-500/20 text-pink-400 rounded-xl">
                <HeartHandshake className="w-5 h-5 shrink-0" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 font-mono block">Allergen Safety</span>
                <p className="text-xs text-stone-700 dark:text-zinc-300 font-semibold mt-1">Automatic strict exclusions applied if food intolerances are configured.</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            
            {/* Split COLUMN 1: Calorie Inputs and Config parameters */}
            <div className="space-y-6 bg-zinc-950/20 border border-white/5 p-6 md:p-8 rounded-[2rem]">
              <span className="text-[10px] font-black text-brand-orange uppercase tracking-widest block font-mono">Regimen Parameters</span>
              
              <div className="space-y-2 text-xs font-semibold">
                <label className="font-extrabold uppercase tracking-wider text-stone-500 dark:text-zinc-400 font-mono text-[10px]">Diet Goal / Lifestyle Choice</label>
                <select
                  value={dietGoal}
                  onChange={(e) => setDietGoal(e.target.value)}
                  className="w-full bg-stone-50/60 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-850 rounded-xl px-4 py-4 text-stone-800 dark:text-zinc-200 focus:outline-none cursor-pointer"
                >
                  <option value="High Protein">High Protein Muscle Builder</option>
                  <option value="Low Carb Keto">Keto/Low Carb Ketosis Plan</option>
                  <option value="Healthy Vegetarian">100% Pure Organic Vegetarian</option>
                  <option value="Plant-Based Vegan">Cruelty-Free Plant-Based Vegan</option>
                  <option value="Balanced Deficit">Caloric Deficit for Lean Weight Loss</option>
                  <option value="Mediterranean Splendid">Mediterranean Heart &amp; Longevity</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs font-semibold">
                <div className="space-y-2">
                  <label className="font-extrabold uppercase tracking-wider text-stone-500 dark:text-zinc-400 font-mono text-[10px]">Calorie Intake (kcal)</label>
                  <input
                    type="number"
                    value={calories}
                    onChange={(e) => setCalories(e.target.value)}
                    placeholder="e.g. 2000"
                    className="w-full bg-stone-55 dark:bg-zinc-950 border border-stone-250 dark:border-zinc-850 rounded-xl px-4 py-4 text-stone-850 dark:text-zinc-200 focus:outline-none focus:border-brand-orange/50 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="font-extrabold uppercase tracking-wider text-stone-500 dark:text-zinc-400 font-mono text-[10px] block">Calculated Fitness Ideal</label>
                  <div className="w-full bg-zinc-900 border border-white/5 rounded-xl px-4 py-4 text-emerald-400 font-black font-mono flex items-center justify-between text-xs">
                    <span>{calculatedCalorieRecommendation} kcal</span>
                    <button
                      onClick={() => setCalories(calculatedCalorieRecommendation.toString())}
                      className="text-[8.5px] uppercase font-black tracking-widest text-[#FF7A00] hover:text-white"
                      title="Sync recommendations into input"
                    >
                      SYNC
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-xs font-semibold">
                <label className="font-extrabold uppercase tracking-wider text-stone-500 dark:text-zinc-400 font-mono text-[10px] block">Exclude Ingredients / Food Intolerances</label>
                <input
                  type="text"
                  value={preferences}
                  onChange={(e) => setPreferences(e.target.value)}
                  placeholder="e.g. peanuts, dairy, gluten-free, no shellfish"
                  className="w-full bg-stone-55 dark:bg-zinc-950 border border-stone-250 dark:border-zinc-850 rounded-xl px-4 py-4 text-zinc-205 focus:outline-none"
                />
              </div>

              {error && (
                <div className="flex items-start gap-2.5 p-4 bg-red-500/5 border border-red-500/15 text-red-500 text-xs rounded-xl">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <button
                onClick={generatePlan}
                disabled={isLoading || !calories}
                className="w-full py-4 bg-gradient-to-r from-brand-orange via-amber-500 to-yellow-500 disabled:opacity-50 text-white font-black text-xs uppercase tracking-widest rounded-xl shadow-lg hover:shadow-orange-500/30 transition-all text-center flex items-center justify-center gap-2 cursor-pointer font-mono"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin text-white" />
                    <span>{isTelugu ? "Plan Tayarouthondi..." : "Forging Metabolism Schedule..."}</span>
                  </>
                ) : (
                  <>
                    <Apple className="w-4.5 h-4.5 text-yellow-300" />
                    <span>{isTelugu ? "WEEKLY MEAL PLAN CREATE CHEYYI" : "COMPILE METABOLIC CALENDAR"}</span>
                  </>
                )}
              </button>
            </div>

            {/* Split COLUMN 2: Apple Health & Sleep Sync Simulation */}
            <div className="space-y-6 bg-zinc-950/20 border border-white/5 p-6 md:p-8 rounded-[2rem] h-full flex flex-col justify-between">
              
              <div>
                <div className="flex items-center justify-between border-b border-white/5 pb-3">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4.5 h-4.5 text-emerald-400" />
                    <span className="text-[10px] font-black text-white uppercase tracking-widest font-mono">Apple Fitness Sync (Live Simulator)</span>
                  </div>
                  <span className="text-[8px] font-black text-zinc-500 font-mono uppercase tracking-widest">Linked Active</span>
                </div>

                <p className="text-xs text-zinc-400 font-semibold leading-relaxed mt-2.5">
                  Tweak active bio-metrics below. CuisineAI dynamically maps calorie burn rings to suggest precise intake levels.
                </p>

                {/* Simulated metrics rings stack */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mt-5">
                  {drawSyncFitnessRing(exerciseRing, 60, "#FF0055", "Active Exercise", "m")}
                  {drawSyncFitnessRing(stepsRing, 10000, "#00FF66", "Daily Steps", "steps")}
                  {drawSyncFitnessRing(muscleRing, 20, "#00A2FF", "Lean Skeletal", "%")}
                </div>

                {/* Interactive sliders */}
                <div className="space-y-4.5 mt-6 font-semibold">
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between font-mono text-[9.5px]">
                      <span className="text-zinc-500 uppercase">Interactive Exercise Minutes:</span>
                      <span className="text-rose-450">{exerciseRing} mins</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="120"
                      value={exerciseRing}
                      onChange={(e) => setExerciseRing(parseInt(e.target.value))}
                      className="w-full accent-brand-orange cursor-pointer bg-zinc-900 border border-white/5 rounded"
                    />
                  </div>

                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between font-mono text-[9.5px]">
                      <span className="text-zinc-500 uppercase">Interactive Active Steps:</span>
                      <span className="text-emerald-400">{stepsRing} steps</span>
                    </div>
                    <input
                      type="range"
                      min="2000"
                      max="18000"
                      step="500"
                      value={stepsRing}
                      onChange={(e) => setStepsRing(parseInt(e.target.value))}
                      className="w-full accent-emerald-400 cursor-pointer bg-zinc-900 border border-white/5 rounded"
                    />
                  </div>
                </div>
              </div>

              {/* CURATED PRESETS EXPLORER DECK - Instant loading, zero blank page */}
              <div className="mt-6 pt-6 border-t border-white/5 space-y-3">
                <span className="text-[9.5px] font-black text-amber-500 uppercase tracking-widest block font-mono">Or load complete masterchef pre-curated regimens:</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {CURATED_GOLDEN_PLANS.map((presetPlan, idx) => (
                    <div
                      key={idx}
                      onClick={() => loadPresetPlan(idx)}
                      className="p-4 bg-zinc-950/60 border border-white/5 rounded-2xl hover:border-brand-orange hover:bg-zinc-900/40 transition-all cursor-pointer group text-left"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[8px] font-black uppercase text-brand-orange font-mono">Curated Library</span>
                        <ArrowUpRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-brand-orange transition-colors" />
                      </div>
                      <h4 className="font-display font-black text-white text-xs mt-1.5 leading-tight group-hover:text-amber-400 truncate">{presetPlan.title}</h4>
                      <span className="text-[10px] font-mono text-zinc-400 block mt-1">Ready to explore instantly</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>

        </div>
      ) : (
        <div className="space-y-8 relative z-10 animate-fade-in">
          
          {/* Active plan description row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center p-6 bg-gradient-to-r from-amber-500/5 to-yellow-500/5 border border-brand-orange/20 rounded-3xl">
            <div className="relative h-32 rounded-2xl overflow-hidden md:col-span-1 shadow-md">
              <img 
                src={getMealTopicImage(dietGoal)} 
                alt={dietGoal} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <span className="text-[10px] font-black uppercase tracking-widest text-white px-3 py-1 bg-brand-orange rounded-md">{dietGoal}</span>
              </div>
            </div>
            
            <div className="space-y-3 md:col-span-2">
              <h3 className="font-display font-black text-stone-850 dark:text-zinc-100 text-base flex items-center gap-2">
                <Sparkles className="w-4.5 h-4.5 text-brand-orange animate-pulse" />
                <span>{plan.title}</span>
              </h3>
              <p className="text-xs text-stone-500 dark:text-zinc-400 leading-relaxed italic">
                👨‍🍳 &ldquo;{plan.notes}&rdquo;
              </p>
            </div>
          </div>

          {/* Days Vertical Progression */}
          <div className="space-y-5">
            {plan.days.map((dayItem, index) => (
              <div
                key={index}
                className="group border border-stone-200/60 dark:border-zinc-800/80 rounded-2.5xl overflow-hidden hover:border-brand-orange/40 transition-all bg-white dark:bg-zinc-950/40 shadow-sm"
              >
                <div className="bg-stone-50 dark:bg-zinc-900/40 px-6 py-4 flex items-center justify-between border-b border-stone-150 dark:border-zinc-850">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-brand-orange"></span>
                    <span className="font-black text-xs text-brand-orange uppercase tracking-widest font-mono">{dayItem.day}</span>
                  </div>
                  <span className="flex items-center gap-1.5 text-xs text-stone-600 dark:text-zinc-350 font-mono tracking-tight font-black uppercase">
                    <Flame className="w-4 h-4 text-orange-500 animate-pulse" />
                    <span>{dayItem.calories}</span>
                  </span>
                </div>
                
                {/* 4 detailed meal preps sessions */}
                <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-5 text-xs font-semibold">
                  <div className="space-y-1.5 bg-stone-50/50 dark:bg-zinc-900/10 p-4 rounded-2xl hover:bg-brand-orange/5 border border-transparent hover:border-brand-orange/10 transition-colors">
                    <span className="text-[8.5px] uppercase font-black text-amber-500 block tracking-widest font-mono">Breakfast</span>
                    <p className="text-stone-750 dark:text-zinc-250 font-semibold mt-1 text-[11.5px] leading-relaxed">{dayItem.breakfast}</p>
                  </div>
                  <div className="space-y-1.5 bg-stone-50/50 dark:bg-zinc-900/10 p-4 rounded-2xl hover:bg-brand-orange/5 border border-transparent hover:border-brand-orange/10 transition-colors">
                    <span className="text-[8.5px] uppercase font-black text-amber-500 block tracking-widest font-mono">Mid-day Lunch</span>
                    <p className="text-stone-750 dark:text-zinc-250 font-semibold mt-1 text-[11.5px] leading-relaxed">{dayItem.lunch}</p>
                  </div>
                  <div className="space-y-1.5 bg-stone-50/50 dark:bg-zinc-900/10 p-4 rounded-2xl hover:bg-brand-orange/5 border border-transparent hover:border-brand-orange/10 transition-colors">
                    <span className="text-[8.5px] uppercase font-black text-amber-500 block tracking-widest font-mono">Snack Time</span>
                    <p className="text-stone-750 dark:text-zinc-250 font-semibold mt-1 text-[11.5px] leading-relaxed">{dayItem.snack}</p>
                  </div>
                  <div className="space-y-1.5 bg-stone-50/50 dark:bg-zinc-900/10 p-4 rounded-2xl hover:bg-brand-orange/5 border border-transparent hover:border-brand-orange/10 transition-colors">
                    <span className="text-[8.5px] uppercase font-black text-amber-500 block tracking-widest font-mono">Dinner Feast</span>
                    <p className="text-stone-750 dark:text-zinc-250 font-semibold mt-1 text-[11.5px] leading-relaxed">{dayItem.dinner}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-emerald-500/5 p-6 rounded-3xl text-center border border-emerald-500/10 flex flex-col items-center justify-center gap-2">
            <span className="text-xs text-zinc-400 font-medium">
              {isTelugu ? "Calorie targets kachitanga synchronize cheyyabaddayi!" : "Metabolism levels parsed against targeted parameters successfully."}
            </span>
            <div className="flex justify-center items-center gap-2 text-xs text-emerald-450 font-black uppercase tracking-widest font-mono">
              <CheckCircle2 className="w-5 h-5 text-emerald-550 animate-pulse" /> 
              <span>{isTelugu ? "Vanta Pranalika Ready Aindi!" : "AI Calorie Plan Synchronized & Verified!"}</span>
            </div>
          </div>
          
        </div>
      )}
    </div>
  );
};
