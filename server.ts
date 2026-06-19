import express from "express";
import path from "path";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Initialize Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// Endpoint: AI Recipe Generator
app.post("/api/generate-recipe", async (req, res) => {
  const { recipeName, ingredients, cuisine, dietary, lang } = req.body;
  const isTelugu = lang === "te";

  try {
    const prompt = `
      Create a detailed, mouth-watering recipe based on:
      - Recipe Name / Main Dish Theme: ${recipeName || "Surprise Me Chef Splendid"}
      - Ingredients available: ${ingredients || "any available"}
      - Cuisine style: ${cuisine || "any/global"}
      - Dietary requirements / Preferences: ${dietary || "none"}

      Provide accurate preparation time, cooking time, difficulty level, and ingredients list with tags (e.g., "required", "optional", "garnish"). Generate helpful numbered instructions, chef tips, mistakes to avoid, nutrition facts, ingredient alternatives, and recommend side dishes.
    `;

    const systemInstruction = "You are an elite gourmet chef and visual food blogger. Generate high-quality, practical recipes that are accurate, deliciouly detailed, and structured." + 
      (isTelugu 
        ? "\n\nCRITICAL: The user has selected Telugu written with the English alphabet (Latin phonetic script, NO Telugu Unicode script characters). You MUST write all generated text fields (titles, descriptions, ingredient names, instructions, tips, mistakes, substitutes, recommended dish names) in Telugu language written/spelled phonetically using regular English letters! Do NOT use any native Telugu script characters. For example, write titles like 'Danyala podi' or 'Chinthapandu pulihora', and instructions like: '1. Sanna mukkalu ga cut chesina ullipayalu vesi bangaru rangulo vacche varaku baga veyinchandi', '2. Konchem uppu, karam podi konchem veyandi', '3. Gurneesu ga kottimeera chimmandi'. This rule is absolute and applies to every single field."
        : "");

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: "Highly attractive and appetizing recipe title" },
            description: { type: Type.STRING, description: "A brief, appetizing 2-sentence description highlighting the flavor profile" },
            prepTime: { type: Type.STRING, description: "Preparation time, e.g., '15 mins'" },
            cookTime: { type: Type.STRING, description: "Cooking time, e.g., '25 mins'" },
            difficulty: { type: Type.STRING, description: "Difficulty level, e.g., 'Easy', 'Medium', 'Hard'" },
            servings: { type: Type.STRING, description: "Recommended servings, e.g., '2-3 servings'" },
            ingredients: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING, description: "Name of the ingredient" },
                  quantity: { type: Type.STRING, description: "Quantity with unit (e.g., '1 cup', '2 tbsp')" },
                  tag: { type: Type.STRING, description: "Tag like 'Main Direct', 'Seasoning', 'Optional', 'Garnish'" }
                },
                required: ["name", "quantity"]
              }
            },
            instructions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Numbered visual steps, e.g., '1. Sift the flour...', '2. Heat the skillet...'"
            },
            tips: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Professional chef secrets to elevate the flavor"
            },
            mistakes: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Common beginner mistakes to avoid for this exact dish"
            },
            nutrition: {
              type: Type.OBJECT,
              properties: {
                calories: { type: Type.STRING, description: "e.g., '320 kcal'" },
                protein: { type: Type.STRING, description: "e.g., '12g'" },
                carbs: { type: Type.STRING, description: "e.g., '40g'" },
                fats: { type: Type.STRING, description: "e.g., '8g'" }
              },
              required: ["calories", "protein", "carbs", "fats"]
            },
            substitutes: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  original: { type: Type.STRING, description: "Original ingredient to replace" },
                  substitute: { type: Type.STRING, description: "Substituted ingredient suggestion" },
                  reason: { type: Type.STRING, description: "Brief culinary reason / ratio adjustment" }
                }
              }
            },
            sideDishes: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Recommended mocktails, breads, or sides to complete the platter experience"
            }
          },
          required: [
            "title",
            "description",
            "prepTime",
            "cookTime",
            "difficulty",
            "servings",
            "ingredients",
            "instructions",
            "tips",
            "mistakes",
            "nutrition",
            "substitutes",
            "sideDishes"
          ]
        }
      }
    });

    const parsedData = JSON.parse(response.text || "{}");
    res.json(parsedData);
  } catch (error: any) {
    console.error("Recipe generation error:", error);
    res.status(500).json({ error: error.message || "Failed to generate recipe" });
  }
});

// Endpoint: AI Ingredient-Based Recipe Discovery
app.post("/api/discover-recipes", async (req, res) => {
  const { ingredients, lang } = req.body;
  const isTelugu = lang === "te";

  try {
    const prompt = `
      A user opened their fridge and pantry and has: ${ingredients}.
      Suggest 3-4 excellent, diverse, cookable dishes they can make.
      Recommend a single 'bestMatch' dish that utilizes these ingredients most optimally.
    `;

    const systemInstruction = "You are a creative and waste-friendly culinary planner. Suggest simple, exciting, and realistic recipes based strictly or mostly on the ingredients provided." +
      (isTelugu 
        ? "\n\nCRITICAL: The user has selected Telugu written with the English alphabet (Latin phonetic script, NO Telugu Unicode script characters). You MUST write all recommended titles, descriptions, cuisines, missing ingredients, and match labels entirely in Telugu language written/spelled phonetically using regular English letters! Do NOT use any native Telugu script characters. Example description: 'Eedi chala ruchiga unde simple vantakam, mee pantry ingredients thoni cheyyocchu'."
        : "");

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            bestMatch: { type: Type.STRING, description: "Name of the single best dish they can make easily right now" },
            recommendations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING, description: "Dish Title" },
                  description: { type: Type.STRING, description: "A highly clear 1-sentence sales pitch for the dish" },
                  cuisine: { type: Type.STRING, description: "Style of cuisine, e.g. Indian, Italian" },
                  prepTime: { type: Type.STRING, description: "e.g., '10 mins'" },
                  cookTime: { type: Type.STRING, description: "e.g., '15 mins'" },
                  difficulty: { type: Type.STRING, description: "Easy, Medium, or Hard" },
                  keyIngredientsNeeded: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Basic ingredients user already has to use" },
                  missingIngredients: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Pantry essentials they might need to add, or empty if none" }
                },
                required: ["title", "description", "prepTime", "cuisine", "difficulty", "keyIngredientsNeeded"]
              }
            }
          },
          required: ["bestMatch", "recommendations"]
        }
      }
    });

    const parsedData = JSON.parse(response.text || "{}");
    res.json(parsedData);
  } catch (error: any) {
    console.error("Discovery error:", error);
    res.status(500).json({ error: error.message || "Failed to discover recipes" });
  }
});

// Endpoint: Conversational AI Cooking Assistant Chatbot
app.post("/api/chat", async (req, res) => {
  const { message, history, lang } = req.body;
  const isTelugu = lang === "te";

  try {
    const formattedHistory = (history || []).map((msg: any) => ({
      role: msg.role === "user" ? "user" as const : "model" as const,
      parts: [{ text: msg.text }]
    }));

    const systemInstruction = `
      You are the "AI Chef Assistant," a floating culinary expert inside the "AI Recipe Book" app.
      - Be warm, helpful, charming, and highly concise (keep responses to 1-3 short paragraphs).
      - Answer culinary queries accurately (e.g., biryani methods, ingredients to cook with, substitutes for eggs, high temperature tricks, spice reductions).
      - Suggest quick kitchen hacks.
      - Do not output markdown lists that are too extensive; prioritize high quality and clarity.
    ` + 
    (isTelugu 
      ? "\n\nCRITICAL: The user has selected Telugu written with the English alphabet (Latin phonetic script, NO Telugu Unicode script characters). You MUST respond entirely in simple and friendly Telugu language using regular English letters (Latin script)! Do NOT use any native Telugu script characters. For example, use words like 'Sare, nenu chepthaanu!', 'Ullipayalu veyinchandi', 'karam ekkuva aithe konchem perugu ledha neyya veyandi'. Match this Telugu-compiled tone perfectly."
      : "");

    const chatInstance = ai.chats.create({
      model: "gemini-2.5-flash",
      config: {
        systemInstruction
      },
      history: formattedHistory
    });

    const result = await chatInstance.sendMessage({ message });
    res.json({ text: result.text });
  } catch (error: any) {
    console.error("Chatbot error:", error);
    res.status(500).json({ error: error.message || "Failed to process chat message" });
  }
});

// Endpoint: AI Weekly Meal Planner
app.post("/api/generate-meal-plan", async (req, res) => {
  const { dietGoal, calories, preferences, lang } = req.body;
  const isTelugu = lang === "te";

  try {
    const prompt = `
      Create a customized 7-day meal plan based on:
      - Diet Goal: ${dietGoal || "healthy balanced"}
      - Daily Calorie Target: ${calories || "2000"} kcal
      - Diet Preferences/Allergies/Avoidance: ${preferences || "none"}

      Include 7 days (Monday through Sunday) with healthy, practical suggestions for breakfast, lunch, a snack, and dinner. Estimate total calories per day. Add helper notes with chef advice.
    `;

    const systemInstruction = "You are an expert nutritionist and meal prep chef. Suggest practical, highly appetite-appealing and healthy meal preps." +
      (isTelugu 
        ? "\n\nCRITICAL: The user has selected Telugu written with the English alphabet (Latin phonetic script, NO Telugu Unicode script characters). You MUST write the meal plan title, notes, and breakfast/lunch/snack/dinner descriptions inside the meal plan entirely in Telugu language written/spelled phonetically using regular English letters! Do NOT use any native Telugu script characters. Example description: 'Tiffinu ki Ragi idli thinandi ledha pesarattu cheyyandi'."
        : "");

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: "Elegant title of the meal plan" },
            notes: { type: Type.STRING, description: "Practical nutritional or chef advice for prep work" },
            days: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  day: { type: Type.STRING, description: "Day of the week, e.g. 'Monday'" },
                  breakfast: { type: Type.STRING, description: "Breakfast option" },
                  lunch: { type: Type.STRING, description: "Lunch option" },
                  snack: { type: Type.STRING, description: "Snack option" },
                  dinner: { type: Type.STRING, description: "Dinner option" },
                  calories: { type: Type.STRING, description: "Total estimated calories, e.g., '1950 kcal'" }
                },
                required: ["day", "breakfast", "lunch", "snack", "dinner", "calories"]
              }
            }
          },
          required: ["title", "notes", "days"]
        }
      }
    });

    const parsedData = JSON.parse(response.text || "{}");
    res.json(parsedData);
  } catch (error: any) {
    console.error("Meal planner error:", error);
    res.status(500).json({ error: error.message || "Failed to generate meal plan" });
  }
});

// Setup Vite dev server or static distribution folder
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting server in DEVELOPMENT mode with Vite Middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting server in PRODUCTION mode with static file delivery...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`AI Recipe Book Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
