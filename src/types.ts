export interface Ingredient {
  name: string;
  quantity: string;
  tag?: string;
  checked?: boolean;
}

export interface Nutrition {
  calories: string;
  protein: string;
  carbs: string;
  fats: string;
}

export interface Substitute {
  original: string;
  substitute: string;
  reason: string;
}

export interface Recipe {
  id: string; // generated locally for history/bookmarks
  title: string;
  description: string;
  prepTime: string;
  cookTime: string;
  difficulty: "Easy" | "Medium" | "Hard" | string;
  servings: string;
  ingredients: Ingredient[];
  instructions: string[];
  tips: string[];
  mistakes: string[];
  nutrition: Nutrition;
  substitutes: Substitute[];
  sideDishes: string[];
  cuisine?: string;
  dietary?: string;
  isFavorite?: boolean;
  createdAt?: string;
  image?: string; // curated Unsplash query or random food theme based on title
}

export interface ChatMessage {
  role: "user" | "model";
  text: string;
  timestamp: string;
}

export interface DiscoveryRecommendation {
  title: string;
  description: string;
  cuisine: string;
  prepTime: string;
  cookTime: string;
  difficulty: string;
  keyIngredientsNeeded: string[];
  missingIngredients: string[];
}

export interface DiscoveryResult {
  bestMatch: string;
  recommendations: DiscoveryRecommendation[];
}

export interface MealPlanDay {
  day: string;
  breakfast: string;
  lunch: string;
  snack: string;
  dinner: string;
  calories: string;
}

export interface WeeklyMealPlan {
  title: string;
  notes: string;
  days: MealPlanDay[];
}
