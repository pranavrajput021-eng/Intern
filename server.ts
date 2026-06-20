import express from "express";
import path from "path";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize server-side Gemini client safely
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "MOCK_KEY_FOR_DEV_WITHOUT_CRASHING_ON_STARTUP",
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// A highly realistic, high-quality, professional fallback response generator
// in cases where the Gemini API key is unconfigured, mock, or fails at runtime.
function generateAestheticCoachResponse(message: string): string {
  const msg = message.toLowerCase();

  // 1. Strictly block/decline non-fitness queries if they ask about coding, math, general help (as requested by systemic instructions)
  if (
    msg.includes("code") || msg.includes("programming") || msg.includes("javascript") || msg.includes("typescript") || msg.includes("python") || msg.includes("react") ||
    msg.includes("mathematics") || msg.includes("math") || msg.includes("equation") || msg.includes("solve") || msg.includes("essay") || msg.includes("literature") ||
    msg.includes("weather") || msg.includes("news") || msg.includes("hotel") || msg.includes("flight") || msg.includes("booking")
  ) {
    return "As your dedicated Aesthetic Athlete Coach, I focus exclusively on physical training, target nutrition, and athletic performance. For questions beyond bodybuilding, fitness, and recovery, please consult a generic AI assistant. Let's get back to optimizing your physique!";
  }

  // 2. Bodybuilding splits / routines / workout
  if (
    msg.includes("split") || msg.includes("routine") || msg.includes("workout") || msg.includes("program") || msg.includes("exercise") || msg.includes("schedule") ||
    msg.includes("chest") || msg.includes("shoulder") || msg.includes("arm") || msg.includes("leg") || msg.includes("back") || msg.includes("push") || msg.includes("pull") ||
    msg.includes("squat") || msg.includes("bench") || msg.includes("deadlift") || msg.includes("cardio")
  ) {
    if (msg.includes("split") || msg.includes("4-day") || msg.includes("4 day")) {
      return "### The Aesthetic Athlete Elite 4-Day Split\n\n" +
             "Optimize micro-cycle frequency and maximize hypertrophic tension with this structured 4-Day Upper/Lower split:\n\n" +
             "#### **Day 1: Upper Body (Hypertrophy Focused)**\n" +
             "- **Incline Dumbbell Bench Press**: 4 sets x 8-10 reps (3-sec eccentric phase)\n" +
             "- **Seated Cable Lat Row (Neutral grip)**: 4 sets x 10-12 reps (Focus on squeeze)\n" +
             "- **Overhead Dumbbell Press**: 3 sets x 8-10 reps\n" +
             "- **Lateral Raises (Cable or Dumbbell)**: 4 sets x 15 reps (Hypertrophy burn)\n" +
             "- **Incline Dumbbell Curl + Tricep Overhead Extension**: 3 sets x 12 reps (Superset)\n\n" +
             "#### **Day 2: Lower Body & Core**\n" +
             "- **Barbell Back Squats**: 4 sets x 6-8 reps (Depth-focused control)\n" +
             "- **Romanian Deadlifts**: 3 sets x 8-10 reps (Hamstring/glute recruitment)\n" +
             "- **Leg Press (High & Wide feet)**: 3 sets x 10-12 reps\n" +
             "- **Standing Calf Raises**: 4 sets x 15-20 reps (2-sec stretch at bottom)\n" +
             "- **Hanging Leg Raises**: 3 sets x Failure\n\n" +
             "#### **Day 3: Active Recovery / Steady State Cardio**\n" +
             "- **Zone 2 Cardio (Incline Treadmill Walk)**: 30-45 mins\n" +
             "- **Active Stretching & Foam Rolling**: Focus on hip mobility and thoracic extension\n\n" +
             "#### **Day 4: Upper Body (Volume Balanced)**\n" +
             "- **Weighted Pull-Ups or Lat Pulldown**: 4 sets x 8-10 reps\n" +
             "- **Flat Barbell Bench Press**: 3 sets x 8-10 reps\n" +
             "- **Chest Supported Dumbbell Row**: 3 sets x 10-12 reps\n" +
             "- **Rear Delt Pec Dec Flyes**: 4 sets x 15 reps\n" +
             "- **Hammer Curls + Tricep Rope Pushdowns**: 3 sets x 12-15 reps (Superset)\n\n" +
             "#### **Day 5: Lower Body & Posterior Chain**\n" +
             "- **Bulgarian Split Squats**: 3 sets x 10-12 reps per leg (Quad hypertrophy)\n" +
             "- **Lying Leg Curls**: 3 sets x 12-15 reps\n" +
             "- **Barbell Hip Thrusts**: 3 sets x 8-10 reps\n" +
             "- **Seated Calf Raises**: 4 sets x 12-15 reps\n\n" +
             "*Progressive Overload Rule: Log your weights! Aim to increase load or reps by 1-2% every micro-cycle.*";
    }

    if (msg.includes("chest") || msg.includes("push") || msg.includes("bench")) {
      return "### Chest & Push Day Hypertrophy Protocol\n\n" +
             "To carve aesthetic pectoral density and shoulder symmetry, focus on direct vertical and horizontal tension:\n\n" +
             "1. **Incline Barbell Bench Press**: 4 sets x 6-8 reps (Primary strength compound - targets clavicular head)\n" +
             "2. **Flat Dumbbell Press**: 3 sets x 8-10 reps (Decline chest stretch with convergent squeeze)\n" +
             "3. **Incline Dumbbell Flyes (30-degree incline)**: 3 sets x 12 reps (Focus on deep eccentric stretch)\n" +
             "4. **High-to-Low Cable Crossovers**: 3 sets x 15 reps (Targets lower pectorals, focus on squeeze)\n" +
             "5. **Overhead Dumbbell Press**: 3 sets x 8-10 reps (Deltoid compound)\n" +
             "6. **Decline Cable Lateral Raise**: 4 sets x 12-15 reps (Targets lateral deltoids)\n" +
             "7. **Rope Overhead Tricep Extension**: 3 sets x 12 reps\n\n" +
             "*Coach Tip: Do not ego-lift! Focus on the muscular connection, control the eccentric phase, and squeeze hard at peak contraction.*";
    }

    if (msg.includes("leg") || msg.includes("squat") || msg.includes("quad") || msg.includes("hamstring")) {
      return "### Leg Day Absolute Destruction Protocol\n\n" +
             "Carving an aesthetic lower body requires balanced quad-to-posterior ratios. Focus on range of motion and depth:\n\n" +
             "1. **Barbell Back Squats (A-Stance)**: 4 sets x 6-8 reps (Control the eccentric down to parallel or below)\n" +
             "2. **Romanian Deadlifts (RDLs)**: 3 sets x 8-10 reps (Focus on pushing hips back, feel hamstring stretch)\n" +
             "3. **Bulgarian Split Squats**: 3 sets x 10-12 reps per leg (Absolute quad builder - hold dumbbells)\n" +
             "4. **Unilateral Leg Extensions**: 3 sets x 12-15 reps (Concentrated quad squeeze, slow negative)\n" +
             "5. **Lying Leg Curls**: 3 sets x 10-12 reps (Hamstring isolation)\n" +
             "6. **Standing Calf Raises**: 4 sets x 15-20 reps (2-second hold at contraction, 2-second stretch at bottom)\n\n" +
             "*Coach Tip: Take 2-3 minutes of rest between compound squat sets. Recovery index starts during your training.*";
    }

    if (msg.includes("back") || msg.includes("pull") || msg.includes("deadlift") || msg.includes("row")) {
      return "### Back & Pull Day Athletic Protocol\n\n" +
             "A wide V-taper frame creates the ultimate aesthetic silhouette. Focus on proper shoulder blade retraction:\n\n" +
             "1. **Weighted Pull-ups or Lat Pulldowns**: 4 sets x 8-10 reps (Lats width focus - grip slightly wider than shoulders)\n" +
             "2. **Bent Over Barbell Rows**: 3 sets x 8-10 reps (Thickens upper/mid back - pull towards belly button)\n" +
             "3. **Chest-Supported Dumbbell Rows**: 3 sets x 10-12 reps (Eliminates momentum, pure rhomboid contraction)\n" +
             "4. **Straight Arm Cable Pullovers**: 3 sets x 12-15 reps (Excellent long-head lat isolation)\n" +
             "5. **Face Pulls with External Rotation**: 4 sets x 15 reps (Targets rear delts and rotator cuffs for joint safety)\n" +
             "6. **Incline Alternating Dumbbell Curls**: 3 sets x 10-12 reps (Maximum bicep stretch)\n" +
             "7. **Hammer Curls**: 3 sets x 12 reps (Targets brachialis and forearms)\n\n" +
             "*Coach Tip: Pull with your elbows, not with your hands, to fully engage your lat muscles and minimize bicep dominance.*";
    }

    return "### The Aesthetic Athlete Workout Framework\n\n" +
           "Success in physical training depends on consistency and progressive load. Here is the golden baseline:\n\n" +
           "1. **Resistance Training**: Train 4-5 times a week, dedicating sets to specific muscle groups to allow 48-72 hours of recovery before retraining.\n" +
           "2. **Set Intensity**: Focus on 3-4 working sets per exercise with 0-2 RIR (Reps in Reserve). Make every set count.\n" +
           "3. **Warm-up**: Spend 5-10 minutes warming up joints and doing light warm-up sets before diving into heavy compounds.\n" +
           "4. **Form First**: Control the weight through full range of motion. Mind-muscle connection is the key to hypertrophy.\n\n" +
           "What specific routine or split would you like me to custom-design for you? Tell me how many days you can train!";
  }

  // 3. Nutrition / Meals / Diet / Calories / Macros
  if (
    msg.includes("nutrition") || msg.includes("diet") || msg.includes("eat") || msg.includes("food") || msg.includes("protein") ||
    msg.includes("carb") || msg.includes("fat") || msg.includes("macro") || msg.includes("calorie") || msg.includes("meal") ||
    msg.includes("prep") || msg.includes("shake") || msg.includes("breakfast") || msg.includes("lunch") || msg.includes("dinner") ||
    msg.includes("bulk") || msg.includes("cut")
  ) {
    if (msg.includes("bulk") || msg.includes("gain")) {
      return "### Clean Bulking Nutrition Architecture\n\n" +
             "To build premium lean mass without excessive fat storage, target a calculated surplus (+300 to +500 kcal above maintenance):\n\n" +
             "#### **Your Target Macro Ratios**\n" +
             "- **Protein**: 2.0g per kg of bodyweight (approx. 30-35% of daily intake)\n" +
             "- **Carbohydrates**: High complexity grains and fuels (approx. 45-50% for glycogen stores)\n" +
             "- **Fats**: Healthy lipids for hormonal optimization (approx. 20-25% from clean sources)\n\n" +
             "#### **Coach's Recommended Bulking Foods**\n" +
             "- **Protein Sources**: Chicken breast, lean beef (93/7), liquid egg whites, wild-caught salmon, whey isolate.\n" +
             "- **Carbohydrate Sources**: Rolled oats, jasmine rice, sweet potatoes, quinoa, whole grain pasta.\n" +
             "- **Healthy Fats**: Avocados, raw almonds, extra virgin olive oil, natural peanut butter.\n\n" +
             "#### **Ideal Bulking Meal Blueprint**\n" +
             "- **Meal 1**: 4 whole eggs + 100g rolled oats cooked with scoop of whey, berries, and raw honey.\n" +
             "- **Meal 2 (Preworkout)**: 150g grilled chicken + 250g jasmine rice + steamed asparagus.\n" +
             "- **Meal 3 (Postworkout)**: 1.5 scoops whey isolate + 1 large banana + 1 Rice Krispie treat (fast acting carbs).\n" +
             "- **Meal 4**: 180g lean steak + 250g baked sweet potato + spinach salad with olive oil dressing.\n\n" +
             "*Consistency Tip: Use our built-in Nutrition & Hydration tab here to track your daily intake targets! Keep your macros clean.*";
    }

    if (msg.includes("cut") || msg.includes("diet") || msg.includes("lose") || msg.includes("fat")) {
      return "### Lean Shredding & Cutting Protocol\n\n" +
             "To peel back fat layers while locking in maximum muscle mass, establish an active calorie deficit (-300 to -500 kcal below maintenance):\n\n" +
             "#### **Hormonal & Muscle Preservation Rules**\n" +
             "- **Protein Intake**: Elevate up to 2.2g per kg of bodyweight (limits muscle catabolism during energy deficit).\n" +
             "- **Hydration Balance**: Maintain high water intake (3.5L+ daily) to naturally suppress appetite and filter cellular waste.\n" +
             "- **Thermogenic Support**: Integrate steady-state liss cardio to facilitate fatty-acid oxidation without spiking cortisol.\n\n" +
             "#### **Nutrient-Dense Cutting Meal Blueprint**\n" +
             "- **Meal 1**: Scramble of 150g liquid egg whites + 1 whole egg, paired with 50g quick oats and spinach.\n" +
             "- **Meal 2**: 150g white fish (cod, tilapia) or chicken breast + 150g steamed broccoli + 100g cooked sweet potato.\n" +
             "- **Meal 3 (Preworkout)**: 150g lean turkey breast + 150g jasmine rice + cucumber slices.\n" +
             "- **Meal 4**: 170g grilled salmon (great healthy fats) + massive cucumber-and-lettuce salad with lemon-vinegar dressing.\n\n" +
             "*Coach Tip: Track your weight checks consistently in the 'Current Weight' panel on our Overview Dashboard. Aim for a healthy fat reduction of 0.5kg per week.*";
    }

    return "### Aesthetic Athlete Nutrition Ledger\n\n" +
           "Your body is a high-performance machine; treat your fuel intake as engineering. Here are the cardinal rules:\n\n" +
           "1. **Protein Consistency**: Consume protein every 3-4 hours (30-50g per meal) to maximize Muscle Protein Synthesis (MPS).\n" +
           "2. **Pre-Workout Fuel**: Consume high-glycemic carbohydrates 60-90 minutes before your workout to top off glycogen stores for powerful training pumps.\n" +
           "3. **Hydration**: Drink at least 3-4 liters of pure water daily. Muscular volume is 70%+ water!\n" +
           "4. **Micronutrients**: Eat colorful leafy greens daily to ensure micronutrient absorption and optimal gut metabolic health.\n\n" +
           "Tell me: are you currently looking to Bulk (gain muscle), Cut (lose fat), or maintain a lean physique? I will calculate the macro goals for you!";
  }

  // 4. Recovery / Sleep / Supplements / Water
  if (
    msg.includes("recover") || msg.includes("sleep") || msg.includes("sore") || msg.includes("rest") || msg.includes("water") ||
    msg.includes("hydrate") || msg.includes("stretch") || msg.includes("creatine") || msg.includes("supplement") || msg.includes("pre-workout")
  ) {
    if (msg.includes("supplement") || msg.includes("creatine") || msg.includes("protein powder")) {
      return "### Aesthetic Supplementation Protocol\n\n" +
             "Supplements exist to accelerate your training output. Focus exclusively on scientifically proven options:\n\n" +
             "1. **Creatine Monohydrate**: 5g daily, taken consistently at any hour. Creatine expands muscular cell hydration, raises ATP stores, and increases strength. No loading phase necessary.\n" +
             "2. **Whey Isolate Protein**: Post-workout or between meals to easily satisfy your daily protein thresholds (fast absorption).\n" +
             "3. **Pre-Workout Compound**: Look for formula ingredients containing L-Citrulline (6-8g for nitric oxide nitric pumps), Beta-Alanine (3.2g for endurance tingling), and Caffeine (150-300mg for cognitive focus).\n" +
             "4. **Vitamin D3 & Omega-3 Fish Oils**: Crucial for natural joint recovery, cardiovascular integrity, and natural testosterone synthesis support.\n\n" +
             "*Coach Tip: Supplements are only 5% of your progress. Prioritize hard physical training and clean whole foods!*";
    }

    return "### Athlete Recovery & Sleep Optimization\n\n" +
           "Muscle hypertrophy occurs during rest, not during training. To build a premium physique, your recovery must match your hard work:\n\n" +
           "- **Sleep Targets**: Secure 7.5 to 8.5 hours of high-quality sleep. The majority of growth hormone discharges happen during deep stages.\n" +
           "- **Cell Hydration**: Active cells require water. Track your water input (aim for 3-4 liters daily) using our hydration tracker on the Overview tab.\n" +
           "- **Active Stretching**: Spend 10 minutes at night doing passive stretches. Focus on hip flexors, hamstrings, and pectoral stretching.\n" +
           "- **Deload Cycle**: Every 6-8 weeks of intense sessions, schedule a 'Deload week' reducing intensity and working volume by 50% to refresh joints and CNS.\n\n" +
           "Are you struggling with sore muscles, fatigue, or looking for a customized post-workout stretch plan?";
  }

  // 5. Welcome & Hello greetings
  if (msg.includes("hi") || msg.includes("hello") || msg.includes("hey") || msg.includes("coach") || msg.includes("greetings") || msg.includes("help")) {
    return "### Greetings, Athlete! Welcome to Your Elite Coach Portal.\n\n" +
           "I am your dedicated **Aesthetic Athlete Coach AI**. I am programmed to help you optimize every variable of your physique development, from precision training splits to macro nutritional fuel plans.\n\n" +
           "#### **How I can help you today:**\n" +
           "- 🏋️ **Workouts**: Design custom 3, 4, or 5-day splits (Push/Pull/Legs, Arnold split, Upper/Lower).\n" +
           "- 🥗 **Nutrition**: Build meal preps, custom caloric ratios, bulking budgets, and cutting protocols.\n" +
           "- 🧪 **Recovery**: Formulate optimal sleeping targets, muscle soreness routines, and science-backed supplementation outlines.\n\n" +
           "Tell me about your current **fitness goal** (e.g. bulking, lean cutting, increasing strength) so we can calibrate your regimen!";
  }

  // 6. Default fallback generic answer
  return "### Aesthetic Pro-Athlete Calibrated Counsel\n\n" +
         "That query lies near the core of our training philosophies. To optimize your physical output:\n\n" +
         "1. **Continuous Progressive Overload**: If you bench pressed 80kg for 8 reps last week, aim for 80kg for 9 reps or 82.5kg for 8 reps today. Continuous effort leads to certain growth.\n" +
         "2. **Autoregulation Focus**: If you feel fatigue spikes or joint pain, downscale your set loads. Listen to your body and adjust dynamically.\n" +
         "3. **Perfect Tracker Habits**: Continue updating your steps walked, water ounces consumed, and daily body weight markers on our Aesthetic Dashboard. Consistent logging is what defines elite athletes.\n\n" +
         "Tell me: can you clarify your goal or current daily training schedule? Let's dial in the perfect response for you!";
}

// API route first
app.post("/api/coach-chat", async (req, res) => {
  try {
    const { message, history } = req.body;
    
    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Message string is required." });
    }

    const isMockKey = !process.env.GEMINI_API_KEY || 
                      process.env.GEMINI_API_KEY === "MY_GEMINI_API_KEY" || 
                      process.env.GEMINI_API_KEY.includes("MOCK") || 
                      process.env.GEMINI_API_KEY.trim() === "";

    if (isMockKey) {
      const offlineReply = generateAestheticCoachResponse(message);
      return res.json({ reply: offlineReply });
    }

    const systemInstruction = 
      "You are the 'Aesthetic Athlete Coach AI', an elite bodybuilding coach, sports scientist, and performance nutritionist.\n\n" +
      "CRITICAL LIMITATION RULE:\n" +
      "1. You MUST ONLY discuss physical fitness, workout routines, gym exercises, bodybuilding splits, stretching, muscle hypertrophy, cardio routines, physical health, target nutrition, caloric counts, meal preps, hydration, sleep, and recovery.\n" +
      "2. If the user asks a question about general programming/coding, mathematics, software, writing essays, literature, booking travel, historic events not about sports/bodybuilding, news, weather, or other general assistant tasks, you MUST decline to answer.\n" +
      "   - Decline politely but firmly, saying something like: 'As your dedicated Aesthetic Athlete Coach, I focus exclusively on physical training, target nutrition, and athletic performance. For questions beyond bodybuilding, fitness, and recovery, please consult a generic AI assistant.'\n" +
      "3. Style your responses professionally, with a clean, motivational, aesthetic tone. Use bullet points for structured exercises and keep it highly visual and engaging.";

    // Structure previous conversation context to maintain memory
    let promptContext = "";
    if (history && Array.isArray(history)) {
      const limitedHistory = history.slice(-10);
      for (const h of limitedHistory) {
        if (h.role && h.text) {
          promptContext += `${h.role === "model" ? "Coach" : "Athlete"}: ${h.text}\n`;
        }
      }
    }
    promptContext += `Athlete: ${message}\nCoach:`;

    let reply = "";
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: promptContext,
        config: {
          systemInstruction,
          temperature: 0.7,
        }
      });
      reply = response.text || "Apologies, my physiological CPU experienced a metabolic delay. Let's restart our workout set.";
    } catch (genAiError: any) {
      console.warn("Gemini API call failed, falling back to smart local heuristic engine:", genAiError);
      reply = generateAestheticCoachResponse(message);
    }

    return res.json({ reply });

  } catch (err: any) {
    console.error("Coach AI assistant general error:", err);
    // Even if something else completely crashes, let's gracefully fall back to prevent chatbot downtime
    try {
      const { message } = req.body;
      const fallbackReply = generateAestheticCoachResponse(message || "");
      return res.json({ reply: fallbackReply });
    } catch (innerErr) {
      return res.status(500).json({ error: "Assistant process failed. Re-run set." });
    }
  }
});

// Vite middleware configuration for development
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
