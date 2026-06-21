import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Sparkles, Dumbbell, Bot, User, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Message {
  id: string;
  sender: 'coach' | 'athlete';
  text: string;
  timestamp: Date | string;
}

function isMessageWithinPolicy(message: string): boolean {
  const msg = message.toLowerCase().trim();
  
  if (msg.length < 2) return true;

  const allowedStems = [
    "hi", "hello", "hey", "coach", "greetings", "welcome", "help", "physique", "athlete", "athletic",
    "split", "routine", "workout", "program", "exercise", "schedule", "chest", "shoulder", "arm", "leg",
    "back", "push", "pull", "squat", "bench", "deadlift", "cardio", "training", "running", "lift", "gym",
    "hypertrophy", "rep", "set", "abs", "bicep", "tricep", "glute", "quad", "hamstring", "muscle", 
    "dumbbell", "barbell", "cable", "pulldown", "row", "press", "curl", "extension", "raise", "calf", 
    "calves", "deltoid", "delt", "pec", "lats", "nutrition", "diet", "eat", "food", "protein", "carb", 
    "fat", "macro", "calorie", "meal", "bulk", "cut", "weight", "bmi", "chicken", "salmon", "rice", 
    "oat", "caloric", "shake", "supp", "creatine", "vitamin", "egg", "mass", "nutritionist", "deficit", 
    "surplus", "water", "recover", "sleep", "sore", "rest", "hydrate", "hydration", "fluid", "stretch", 
    "soreness", "steps", "bodyweight", "height", "age", "bmr", "who are you", "what are you", "fitness",
    "bodybuilding", "metronome", "tracker", "analytics", "physical", "performance"
  ];

  const isMatch = allowedStems.some(stem => msg.includes(stem));
  if (!isMatch) {
    return false;
  }

  const bannedKeywords = [
    "javascript", "typescript", "python", "java", "coding", "programming", "code a", 
    "write a function", "write code", "react component", "mathematics", "calculus", "algebra", "geometry", 
    "solve equation", "essay", "poetry", "write a story", "write a poem", "write a song", "write an essay",
    "weather today", "news today", "hotel booking", "flight booking", "rent a car", "capital of", 
    "who wrote", "president of", "prime minister", "movie industry", "finance advice", "stock market", 
    "crypto coin", "bitcoin price", "investment tips"
  ];

  const hasBannedWord = bannedKeywords.some(keyword => msg.includes(keyword));
  if (hasBannedWord) {
    return false;
  }

  return true;
}

// Highly realistic, professional fallback response generator
// in cases where the backend server has connection drops or is unreachable.
function generateAestheticCoachResponse(message: string): string {
  if (!isMessageWithinPolicy(message)) {
    return "As your dedicated Aesthetic Athlete Coach, I focus exclusively on physical training, target nutrition, and athletic performance. For questions beyond bodybuilding, fitness, and recovery, please consult a generic AI assistant.";
  }

  const msg = message.toLowerCase();

  // 2. Training structures & splits
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
             "- **Seated Cable Lat Row (Neutral grip)**: 4 sets x 10-12 reps\n" +
             "- **Overhead Dumbbell Press**: 3 sets x 8-10 reps\n" +
             "- **Lateral Raises (Cable or Dumbbell)**: 4 sets x 15 reps\n" +
             "- **Incline Dumbbell Curl + Tricep Overhead Extension**: 3 sets x 12 reps\n\n" +
             "#### **Day 2: Lower Body & Core**\n" +
             "- **Barbell Back Squats**: 4 sets x 6-8 reps (Depth-focused control)\n" +
             "- **Romanian Deadlifts**: 3 sets x 8-10 reps (Hamstring/glute recruitment)\n" +
             "- **Leg Press (High & Wide feet)**: 3 sets x 10-12 reps\n" +
             "- **Hanging Leg Raises**: 3 sets x Failure\n\n" +
             "#### **Day 3: Active Recovery / Steady State Cardio**\n" +
             "- **Zone 2 Cardio (Incline Treadmill Walk)**: 30-45 mins\n\n" +
             "#### **Day 4: Upper Body (Volume Balanced)**\n" +
             "- **Weighted Pull-Ups or Lat Pulldown**: 4 sets x 8-10 reps\n" +
             "- **Flat Barbell Bench Press**: 3 sets x 8-10 reps\n" +
             "- **Hammer Curls + Tricep Rope Pushdowns**: 3 sets x 12-15 reps (Superset)\n\n" +
             "#### **Day 5: Lower Body & Posterior Chain**\n" +
             "- **Bulgarian Split Squats**: 3 sets x 10-12 reps per leg\n" +
             "- **Lying Leg Curls**: 3 sets x 12-15 reps\n\n" +
             "*Progressive Overload Rule: Log your weights! Aim to increase load or reps by 1-2% every micro-cycle.*";
    }

    if (msg.includes("chest") || msg.includes("push") || msg.includes("bench")) {
      return "### Chest & Push Day Hypertrophy Protocol\n\n" +
             "To carve aesthetic pectoral density and shoulder symmetry, focus on direct vertical and horizontal tension:\n\n" +
             "1. **Incline Barbell Bench Press**: 4 sets x 6-8 reps (Primary strength compound - targets clavicular head)\n" +
             "2. **Flat Dumbbell Press**: 3 sets x 8-10 reps (Decline chest stretch with convergent squeeze)\n" +
             "3. **Incline Dumbbell Flyes (30-degree incline)**: 3 sets x 12 reps (Focus on deep eccentric stretch)\n" +
             "4. **High-to-Low Cable Crossovers**: 3 sets x 15 reps (Targets lower pectorals)\n" +
             "5. **Overhead Dumbbell Press**: 3 sets x 8-10 reps (Deltoid compound)\n" +
             "6. **Rope Overhead Tricep Extension**: 3 sets x 12 reps\n\n" +
             "*Coach Tip: Do not ego-lift! Focus on the muscular connection, control the eccentric phase, and squeeze hard at peak contraction.*";
    }

    if (msg.includes("leg") || msg.includes("squat") || msg.includes("quad") || msg.includes("hamstring")) {
      return "### Leg Day Absolute Destruction Protocol\n\n" +
             "Carving an aesthetic lower body requires balanced quad-to-posterior ratios. Focus on range of motion and depth:\n\n" +
             "1. **Barbell Back Squats (A-Stance)**: 4 sets x 6-8 reps (Control the eccentric down to parallel)\n" +
             "2. **Romanian Deadlifts (RDLs)**: 3 sets x 8-10 reps (Hamstring/glute recruitment)\n" +
             "3. **Bulgarian Split Squats**: 3 sets x 10-12 reps per leg (Absolute quad builder)\n" +
             "4. **Unilateral Leg Extensions**: 3 sets x 12-15 reps (Concentrated quad squeeze, slow negative)\n" +
             "5. **Standing Calf Raises**: 4 sets x 15-20 reps (2-sec stretch at bottom)\n\n" +
             "*Coach Tip: Take 2-3 minutes of rest between compound squat sets. Recovery index starts during your training.*";
    }

    if (msg.includes("back") || msg.includes("pull") || msg.includes("deadlift") || msg.includes("row")) {
      return "### Back & Pull Day Athletic Protocol\n\n" +
             "A wide V-taper frame creates the ultimate aesthetic silhouette. Focus on proper shoulder blade retraction:\n\n" +
             "1. **Weighted Pull-ups or Lat Pulldowns**: 4 sets x 8-10 reps (Lats width focus)\n" +
             "2. **Bent Over Barbell Rows**: 3 sets x 8-10 reps (Thickens upper/mid back)\n" +
             "3. **Chest-Supported Dumbbell Rows**: 3 sets x 10-12 reps\n" +
             "4. **Straight Arm Cable Pullovers**: 3 sets x 12-15 reps (Long-head lat isolation)\n" +
             "5. **Incline Alternating Dumbbell Curls**: 3 sets x 10-12 reps\n" +
             "6. **Hammer Curls**: 3 sets x 12 reps\n\n" +
             "*Coach Tip: Pull with your elbows, not with your hands, to fully engage your lat muscles.*";
    }

    return "### The Aesthetic Athlete Workout Framework\n\n" +
           "Success in physical training depends on consistency and progressive load. Here is the golden baseline:\n\n" +
           "1. **Resistance Training**: Train 4-5 times a week, dedicating sets to specific muscle groups to allow 48-72 hours of recovery.\n" +
           "2. **Set Intensity**: Focus on 3-4 working sets per exercise with 0-2 RIR (Reps in Reserve).\n" +
           "3. **Form First**: Control the weight through full range of motion. Mind-muscle connection is the key to hypertrophy.\n\n" +
           "Tell me about your scheduling (e.g. 3, 4, 5-day Push/Pull/Legs option) and let's structure the set!";
  }

  // 3. Nutrition & Meal plans
  if (
    msg.includes("nutrition") || msg.includes("diet") || msg.includes("eat") || msg.includes("food") || msg.includes("protein") ||
    msg.includes("carb") || msg.includes("fat") || msg.includes("macro") || msg.includes("calorie") || msg.includes("meal") ||
    msg.includes("bulk") || msg.includes("cut")
  ) {
    if (msg.includes("bulk") || msg.includes("gain")) {
      return "### Clean Bulking Nutrition Architecture\n\n" +
             "To build premium lean mass without excessive fat storage, target a calculated surplus (+300 to +500 kcal):\n\n" +
             "#### **Your Target Macro Ratios**\n" +
             "- **Protein**: 2.0g per kg of bodyweight\n" +
             "- **Carbohydrates**: High complexity grains (jasmine rice, oats, sweet potatoes)\n" +
             "- **Fats**: Healthy lipids for hormonal optimization (avocados, olive oil)\n\n" +
             "#### **Ideal Bulking Meal Blueprint**\n" +
             "- **Meal 1**: 4 whole eggs + 100g rolled oats cooked with scoop of whey, berries, and honey.\n" +
             "- **Meal 2**: 150g grilled chicken + 250g jasmine rice + steamed asparagus.\n" +
             "- **Meal 3**: 1.5 scoops whey isolate + 1 large banana + 1 Rice Krispie treat (fast acting post-workout carbs).\n" +
             "- **Meal 4**: 180g lean steak + 250g baked sweet potato + spinach salad.\n\n" +
             "*Consistency Tip: Use our built-in Nutrition & Hydration tab here to track your daily goals!*";
    }

    if (msg.includes("cut") || msg.includes("lose") || msg.includes("fat")) {
      return "### Lean Shredding & Cutting Protocol\n\n" +
             "To peel back fat layers while locking in maximum muscle mass, establish an active calorie deficit (-300 to -500 kcal):\n\n" +
             "#### **Hormonal & Muscle Preservation Rules**\n" +
             "- **Protein Intake**: Elevate up to 2.2g per kg of bodyweight (prevents catabolism).\n" +
             "- **Hydration Balance**: Maintain high water intake (3.5L+ daily) to naturally suppress cravings.\n\n" +
             "#### **Nutrient-Dense Cutting Meal Blueprint**\n" +
             "- **Meal 1**: Scramble of 150g liquid egg whites + 1 whole egg, paired with 50g quick oats and spinach.\n" +
             "- **Meal 2**: 150g white fish (cod, tilapia) or chicken breast + 150g steamed broccoli + 100g cooked sweet potato.\n" +
             "- **Meal 3**: 150g lean turkey breast + 150g jasmine rice.\n" +
             "- **Meal 4**: 170g grilled salmon + massive cucumber-and-lettuce salad.\n\n" +
             "*Coach Tip: Track your weight checks consistently in the 'Current Weight' panel on our Overview Dashboard.*";
    }

    return "### Aesthetic Athlete Nutrition Ledger\n\n" +
           "Your body is a high-performance machine; treat your fuel intake as engineering. Here are the cardinal rules:\n\n" +
           "1. **Protein Consistency**: Consume protein every 3-4 hours (30-50g per meal) to maximize Muscle Protein Synthesis (MPS).\n" +
           "2. **Pre-Workout Fuel**: Consume high-glycemic carbohydrates 60-90 minutes before your workout to top off glycogen stores.\n" +
           "3. **Hydration**: Drink at least 3-4 liters of pure water daily. Muscular volume is 70%+ water!\n\n" +
           "Tell me: are you currently looking to Bulk (gain muscle), Cut (lose fat), or maintain a lean physique?";
  }

  // 4. Recovery & Supplements
  if (
    msg.includes("recover") || msg.includes("sleep") || msg.includes("sore") || msg.includes("rest") || msg.includes("water") ||
    msg.includes("hydrate") || msg.includes("stretch") || msg.includes("creatine") || msg.includes("supplement") || msg.includes("pre-workout")
  ) {
    if (msg.includes("supplement") || msg.includes("creatine")) {
      return "### Aesthetic Supplementation Protocol\n\n" +
             "Supplements exist to accelerate your training output. Focus exclusively on scientifically proven options:\n\n" +
             "1. **Creatine Monohydrate**: 5g daily, taken consistently at any hour to raise cellular ATP.\n" +
             "2. **Whey Isolate Protein**: Post-workout or between meals to easily satisfy your daily protein thresholds.\n" +
             "3. **Pre-Workout Compound**: Look for formula ingredients containing L-Citrulline (6-8g for pumps), Beta-Alanine (3.2g for endurance), and Caffeine (150-300mg).\n" +
             "4. **Vitamin D3 & Omega-3**: Crucial for natural joint recovery, general safety, and cardiovascular integrity.";
    }

    return "### Athlete Recovery & Sleep Optimization\n\n" +
           "Muscle hypertrophy occurs during rest, not during training. To build a premium physique, your recovery must match your hard work:\n\n" +
           "- **Sleep Targets**: Secure 7.5 to 8.5 hours of high-quality sleep. The majority of growth hormone discharges happen during deep stages.\n" +
           "- **Cell Hydration**: Active cells require water. Track your water input (aim for 3-4 liters daily) using our hydration tracker on the Overview tab.\n" +
           "- **Active Stretching**: Spend 10 minutes at night doing passive stretches. Focus on hip flexors and thoracic extension.";
  }

  // 5. General / Default response
  return "### Aesthetic Pro-Athlete Calibrated Counsel\n\n" +
         "To optimize your physical output:\n\n" +
         "1. **Continuous Progressive Overload**: If you bench pressed 80kg for 8 reps last week, aim for 80kg for 9 reps or 82.5kg for 8 reps today. Continuous effort leads to certain growth.\n" +
         "2. **Autoregulation Focus**: If you feel fatigue spikes or joint pain, downscale your set loads. Listen to your body and adjust dynamically.\n" +
         "3. **Mind-Muscle Connection**: Perfect your range of motion. Squeeze hard at peak contraction and control the eccentric downphase.\n\n" +
         "Tell me: are you currently looking to Bulk (gain muscle), Cut (lose fat), or maintain a lean physique? Let's dial in your training!";
}

// Custom, lightweight, fast, ultra-premium markdown renderer that formats headers, lists, and bold text.
function parseInlineElements(text: string): React.ReactNode[] | string {
  const regex = /\*\*(.*?)\*\*/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }
    parts.push(
      <strong key={match.index} className="font-extrabold text-emerald-400">
        {match[1]}
      </strong>
    );
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return parts.length > 0 ? parts : text;
}

function parseCustomMarkdown(text: string): React.ReactNode {
  const lines = text.split('\n');
  return (
    <div className="space-y-1 bg-transparent">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        
        // Headers starting with ### or ####
        if (trimmed.startsWith('### ')) {
          return (
            <h4 key={idx} className="text-[12px] font-black text-emerald-300 mt-2.5 mb-1.5 uppercase tracking-wider font-sans text-left border-b border-emerald-950/20 pb-0.5">
              {trimmed.substring(4)}
            </h4>
          );
        }
        if (trimmed.startsWith('#### ')) {
          return (
            <h5 key={idx} className="text-[11px] font-bold text-teal-400 mt-2 mb-1 uppercase tracking-wide font-sans text-left">
              {trimmed.substring(5)}
            </h5>
          );
        }

        // Unordered lists starting with "- "
        if (trimmed.startsWith('- ')) {
          return (
            <div key={idx} className="pl-4 relative text-[11px] text-neutral-300 leading-relaxed my-0.5 text-left">
              <span className="absolute left-0 text-emerald-500 font-bold">•</span>
              {parseInlineElements(trimmed.substring(2))}
            </div>
          );
        }

        // Ordered lists starting with a number e.g. "1. "
        const numMatch = trimmed.match(/^(\d+)\.\s(.*)$/);
        if (numMatch) {
          return (
            <div key={idx} className="pl-4 relative text-[11px] text-neutral-300 leading-relaxed my-0.5 text-left">
              <span className="absolute left-0 text-emerald-500 font-mono text-[10px]">{numMatch[1]}.</span>
              {parseInlineElements(numMatch[2])}
            </div>
          );
        }

        // Empty paragraphs
        if (trimmed === '') {
          return <div key={idx} className="h-1 bg-transparent" />;
        }

        // Plain line
        return (
          <p key={idx} className="text-[11px] text-neutral-250 leading-relaxed my-0.5 text-left">
            {parseInlineElements(line)}
          </p>
        );
      })}
    </div>
  );
}

const DEFAULT_WELCOME_TEXT = "Greetings, Athlete. I am your dedicated Aesthetic Athlete Coach. Ask me anything about workout plans, bodybuilding splits, nutritional protocols, or performance optimization. I focus exclusively on athletic excellence.";

export default function AestheticCoachChatbot({ user }: { user?: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [hasLoadedHistory, setHasLoadedHistory] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load message history for specific user when user context changes
  useEffect(() => {
    const storageKey = user?.id ? `athlete_chat_history_${user.id}` : 'athlete_chat_history_anonymous';
    const savedData = localStorage.getItem(storageKey);
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed);
        } else {
          setMessages([
            {
              id: 'welcome',
              sender: 'coach',
              text: DEFAULT_WELCOME_TEXT,
              timestamp: new Date().toISOString()
            }
          ]);
        }
      } catch (e) {
        setMessages([
          {
            id: 'welcome',
            sender: 'coach',
            text: DEFAULT_WELCOME_TEXT,
            timestamp: new Date().toISOString()
          }
        ]);
      }
    } else {
      setMessages([
        {
          id: 'welcome',
          sender: 'coach',
          text: DEFAULT_WELCOME_TEXT,
          timestamp: new Date().toISOString()
        }
      ]);
    }
    setHasLoadedHistory(true);
  }, [user]);

  // Persist messages of current user whenever they change
  useEffect(() => {
    if (!hasLoadedHistory) return;
    const storageKey = user?.id ? `athlete_chat_history_${user.id}` : 'athlete_chat_history_anonymous';
    localStorage.setItem(storageKey, JSON.stringify(messages));
  }, [messages, user, hasLoadedHistory]);

  // Typewriter effect state
  const phrases = [
    "Aesthetic Coach AI Active ✨",
    "Get Custom Splits ⚡",
    "Optimize Recovery 🧪",
    "Chat for Fitness Tips 💪"
  ];
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [typedText, setTypedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (isOpen) return;

    const currentPhrase = phrases[phraseIdx];
    let speed = isDeleting ? 40 : 80;

    if (!isDeleting && typedText === currentPhrase) {
      // Pause at full phrase
      const timeout = setTimeout(() => setIsDeleting(true), 2500);
      return () => clearTimeout(timeout);
    } else if (isDeleting && typedText === "") {
      setIsDeleting(false);
      setPhraseIdx((prev) => (prev + 1) % phrases.length);
      return;
    }

    const timeout = setTimeout(() => {
      setTypedText(
        isDeleting
          ? currentPhrase.substring(0, typedText.length - 1)
          : currentPhrase.substring(0, typedText.length + 1)
      );
    }, speed);

    return () => clearTimeout(timeout);
  }, [typedText, isDeleting, phraseIdx, isOpen]);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      setTimeout(scrollToBottom, 100);
    }
  }, [messages, isOpen]);

  const handleSend = async (textToSend?: string) => {
    const rawText = textToSend || inputValue;
    if (!rawText.trim() || loading) return;

    const userMsg: Message = {
      id: Math.random().toString(36).substring(7),
      sender: 'athlete',
      text: rawText.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputValue('');
    setLoading(true);

    const startTime = Date.now();
    const targetedResponseTimeMs = 6000;
    let responseText = "";

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        controller.abort();
      }, targetedResponseTimeMs);

      try {
        const response = await fetch('/api/coach-chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: controller.signal,
          body: JSON.stringify({
            message: rawText.trim(),
            history: messages.map(m => ({
              role: m.sender === 'coach' ? 'model' : 'user',
              text: m.text
            }))
          })
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error('Service communication failed');
        }

        const data = await response.json();
        responseText = data.reply || "I am experiencing structural communication gaps. Let's resume physical training.";
      } catch (err: any) {
        clearTimeout(timeoutId);
        console.warn("API was slow, timed out, or connection failed. Calling high-perf local fallback:", err);
        responseText = generateAestheticCoachResponse(rawText);
      }

      // Enforce EXACTLY 6 seconds total response time by checking elapsed duration
      const elapsed = Date.now() - startTime;
      const remainingDelay = targetedResponseTimeMs - elapsed;
      if (remainingDelay > 0) {
        await new Promise(resolve => setTimeout(resolve, remainingDelay));
      }

      const coachMsg: Message = {
        id: Math.random().toString(36).substring(7),
        sender: 'coach',
        text: responseText,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, coachMsg]);
    } catch (e) {
      // In case of any unhandled errors, guarantee we wait up to 6 seconds before finishing
      const elapsed = Date.now() - startTime;
      const remainingDelay = targetedResponseTimeMs - elapsed;
      if (remainingDelay > 0) {
        await new Promise(resolve => setTimeout(resolve, remainingDelay));
      }

      const coachMsg: Message = {
        id: Math.random().toString(36).substring(7),
        sender: 'coach',
        text: generateAestheticCoachResponse(rawText),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, coachMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickPrompt = (prompt: string) => {
    handleSend(prompt);
  };

  const clearChat = () => {
    const defaultMsg: Message = {
      id: 'welcome',
      sender: 'coach',
      text: DEFAULT_WELCOME_TEXT,
      timestamp: new Date().toISOString()
    };
    setMessages([defaultMsg]);
    const storageKey = user?.id ? `athlete_chat_history_${user.id}` : 'athlete_chat_history_anonymous';
    localStorage.setItem(storageKey, JSON.stringify([defaultMsg]));
  };

  return (
    <div className="fixed bottom-20 lg:bottom-6 right-4 sm:right-6 z-50 text-left bg-transparent">
      <AnimatePresence>
        {!isOpen && (
          <div className="flex items-center gap-3 bg-transparent select-none">
            {/* Elegant Pure Dark Black & Green attention-grabbing active typer badge */}
            <motion.div
              initial={{ opacity: 0, x: 20, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 10, scale: 0.9 }}
              transition={{ delay: 0.1, duration: 0.3 }}
              className="px-4 py-2 bg-[#000000] border border-emerald-950 rounded-2xl shadow-2xl shadow-emerald-950/20 backdrop-blur-xl flex items-center gap-2 max-w-[260px] cursor-pointer"
              onClick={() => setIsOpen(true)}
            >
              <div className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </div>
              <span className="text-[11px] font-mono text-emerald-400 font-bold tracking-tight uppercase">
                {typedText || "Aesthetic Coach AI"}
                <span className="animate-pulse ml-0.5 text-emerald-300">|</span>
              </span>
            </motion.div>

            <motion.button
              key="badge-trigger"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              type="button"
              onClick={() => setIsOpen(true)}
              className="flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-tr from-emerald-600 to-emerald-900 text-white shadow-xl shadow-emerald-900/30 hover:scale-105 transition active:scale-95 cursor-pointer relative group shrink-0 border border-emerald-800"
            >
              <div className="absolute inset-0 rounded-full bg-emerald-500 opacity-20 animate-ping" />
              <Dumbbell className="w-6 h-6 text-emerald-400 group-hover:rotate-12 transition-transform duration-300" />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
            </motion.button>
          </div>
        )}

        {isOpen && (
          <motion.div
            key="coach-chatbox"
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="w-[calc(100vw-32px)] sm:w-[400px] h-[450px] sm:h-[550px] bg-[#000000] border border-emerald-850/40 rounded-3xl shadow-2xl shadow-emerald-950/40 flex flex-col z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-[#052316] border-b border-emerald-950/80 px-4 sm:px-5 py-3 sm:py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-neutral-100 flex items-center gap-1.5 leading-none">
                    Aesthetic Coach AI
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
                  </h4>
                  <span className="text-[10px] text-emerald-500/80 font-mono">ATHLETIC EXCELLENCE SHELL</span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={clearChat}
                  title="Clear Conversation"
                  className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-emerald-950/35 transition cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-emerald-950/35 transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Conversation Window */}
            <div className="flex-1 overflow-y-auto px-4 sm:px-5 py-3 sm:py-4 space-y-3 sm:space-y-4 bg-[#000] custom-scrollbar flex flex-col">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex ${m.sender === 'athlete' ? 'justify-end' : 'justify-start'} bg-transparent`}
                >
                  <div className={`flex gap-2 max-w-[85%] sm:max-w-[82%] ${m.sender === 'athlete' ? 'flex-row-reverse' : 'flex-row'} bg-transparent`}>
                    <div className={`w-6.5 h-6.5 rounded-lg shrink-0 flex items-center justify-center text-[10px] uppercase font-bold font-mono ${
                      m.sender === 'athlete' 
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/40' 
                        : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    }`}>
                      {m.sender === 'athlete' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5 text-emerald-400" />}
                    </div>
                    <div className={`rounded-2xl px-3 sm:px-4 py-2 sm:py-3 text-xs leading-relaxed ${
                      m.sender === 'athlete'
                        ? 'bg-emerald-950/45 text-emerald-300 border border-emerald-900/55 shadow-sm rounded-tr-none text-right'
                        : 'bg-neutral-900/60 text-neutral-250 border border-emerald-950/40 shadow-inner rounded-tl-none text-left'
                    }`}>
                      {parseCustomMarkdown(m.text)}
                    </div>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start bg-transparent">
                  <div className="flex gap-2 bg-transparent">
                    <div className="w-6.5 h-6.5 rounded-lg shrink-0 flex items-center justify-center bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <Bot className="w-3.5 h-3.5 text-emerald-400" />
                    </div>
                    <div className="bg-neutral-900/60 rounded-2xl rounded-tl-none px-4 py-3 flex items-center gap-1 text-xs text-neutral-400 border border-emerald-950/40">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Suggestions / Bubbles */}
            {messages.length === 1 && (
              <div className="px-4 sm:px-5 pb-2.5 sm:pb-3 flex flex-wrap gap-1.5 bg-[#000]">
                {[
                  "Suggest a 4-day workout split",
                  "Suggest pre-workout meal",
                  "Explain Progressive Overload"
                ].map((suggest, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleQuickPrompt(suggest)}
                    className="px-3 py-1.5 text-[10px] text-emerald-300 bg-[#000] border border-emerald-950 hover:border-emerald-800 hover:text-emerald-400 rounded-xl transition duration-150 cursor-pointer text-left"
                  >
                    💡 {suggest}
                  </button>
                ))}
              </div>
            )}

            {/* Input Form */}
            <form
              onSubmit={(e) => { e.preventDefault(); handleSend(); }}
              className="p-3 sm:p-4 bg-emerald-950/10 border-t border-emerald-950/60 flex gap-1.5 sm:gap-2 items-center"
            >
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask your Coach anything on physical fitness..."
                className="flex-1 bg-black/80 border border-emerald-950 rounded-xl px-3 py-2 sm:px-3.5 sm:py-2.5 text-xs text-neutral-200 placeholder:text-emerald-700/65 focus:outline-none focus:border-emerald-700 transition shadow-inner"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || loading}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-700 hover:bg-emerald-600 disabled:bg-[#000000] disabled:text-neutral-750 text-white flex items-center justify-center transition active:scale-95 cursor-pointer shrink-0 shadow-lg border border-emerald-900/40"
              >
                <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
