import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Sparkles, Dumbbell, Bot, User, Trash2, Download } from 'lucide-react';
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
    "bodybuilding", "metronome", "tracker", "analytics", "physical", "performance", "progressive", "overload"
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
function generateAestheticCoachResponse(message: string, userProfile?: any): string {
  if (!isMessageWithinPolicy(message)) {
    return "As your dedicated Aesthetic Athlete Coach, I focus exclusively on physical training, target nutrition, and athletic performance. For questions beyond bodybuilding, fitness, and recovery, please consult a generic AI assistant.";
  }

  const msg = message.toLowerCase();

  // Extract user parameters for inline personalization
  const name = userProfile?.name || "Athlete";
  const goal = userProfile?.fitness_goal || "sculpt a lean, aesthetic physique";
  const weight = userProfile?.weight ? Number(userProfile.weight) : 75;
  const height = userProfile?.height ? Number(userProfile.height) : 178;
  const level = userProfile?.fitness_level || "Intermediate";

  // 2. Training structures & splits
  if (
    msg.includes("split") || msg.includes("routine") || msg.includes("workout") || msg.includes("program") || msg.includes("exercise") || msg.includes("schedule") ||
    msg.includes("chest") || msg.includes("shoulder") || msg.includes("arm") || msg.includes("leg") || msg.includes("back") || msg.includes("push") || msg.includes("pull") ||
    msg.includes("squat") || msg.includes("bench") || msg.includes("deadlift") || msg.includes("cardio")
  ) {
    if (msg.includes("split") || msg.includes("4-day") || msg.includes("4 day")) {
      return `### The Aesthetic Athlete Elite 4-Day Split for ${name}\n\n` +
             `Optimize micro-cycle frequency and maximize hypertrophic tension with this structured 4-Day Upper/Lower split, calibrated for your **${level}** level and goal of **${goal}**:\n\n` +
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
             `*Progressive Overload Rule for ${name}: Log your weights! Aim to increase load or reps by 1-2% every micro-cycle.*`;
    }

    if (msg.includes("chest") || msg.includes("push") || msg.includes("bench")) {
      return `### Chest & Push Day Hypertrophy Protocol for ${name}\n\n` +
             `To carve aesthetic pectoral density and shoulder symmetry, focus on direct vertical and horizontal tension. Configured for your ${weight} kg frame:\n\n` +
             "1. **Incline Barbell Bench Press**: 4 sets x 6-8 reps (Primary strength compound - targets clavicular head)\n" +
             "2. **Flat Dumbbell Press**: 3 sets x 8-10 reps (Decline chest stretch with convergent squeeze)\n" +
             "3. **Incline Dumbbell Flyes (30-degree incline)**: 3 sets x 12 reps (Focus on deep eccentric stretch)\n" +
             "4. **High-to-Low Cable Crossovers**: 3 sets x 15 reps (Targets lower pectorals)\n" +
             "5. **Overhead Dumbbell Press**: 3 sets x 8-10 reps (Deltoid compound)\n" +
             "6. **Rope Overhead Tricep Extension**: 3 sets x 12 reps\n\n" +
             "*Coach Tip: Do not ego-lift! Focus on the muscular connection, control the eccentric phase, and squeeze hard at peak contraction.*";
    }

    if (msg.includes("leg") || msg.includes("squat") || msg.includes("quad") || msg.includes("hamstring")) {
      return `### Leg Day Absolute Destruction Protocol for ${name}\n\n` +
             `Carving an aesthetic lower body requires balanced quad-to-posterior ratios. Focus on range of motion and depth. Recommended for your **${level}** track:\n\n` +
             "1. **Barbell Back Squats (A-Stance)**: 4 sets x 6-8 reps (Control the eccentric down to parallel)\n" +
             "2. **Romanian Deadlifts (RDLs)**: 3 sets x 8-10 reps (Hamstring/glute recruitment)\n" +
             "3. **Bulgarian Split Squats**: 3 sets x 10-12 reps per leg (Absolute quad builder)\n" +
             "4. **Unilateral Leg Extensions**: 3 sets x 12-15 reps (Concentrated quad squeeze, slow negative)\n" +
             "5. **Standing Calf Raises**: 4 sets x 15-20 reps (2-sec stretch at bottom)\n\n" +
             "*Coach Tip: Take 2-3 minutes of rest between compound squat sets. Recovery index starts during your training.*";
    }

    if (msg.includes("back") || msg.includes("pull") || msg.includes("deadlift") || msg.includes("row")) {
      return `### Back & Pull Day Athletic Protocol for ${name}\n\n` +
             `A wide V-taper frame creates the ultimate aesthetic silhouette. Focus on proper shoulder blade retraction. Best for your goal of **${goal}**:\n\n` +
             "1. **Weighted Pull-ups or Lat Pulldowns**: 4 sets x 8-10 reps (Lats width focus)\n" +
             "2. **Bent Over Barbell Rows**: 3 sets x 8-10 reps (Thickens upper/mid back)\n" +
             "3. **Chest-Supported Dumbbell Rows**: 3 sets x 10-12 reps\n" +
             "4. **Straight Arm Cable Pullovers**: 3 sets x 12-15 reps (Long-head lat isolation)\n" +
             "5. **Incline Alternating Dumbbell Curls**: 3 sets x 10-12 reps\n" +
             "6. **Hammer Curls**: 3 sets x 12 reps\n\n" +
             "*Coach Tip: Pull with your elbows, not with your hands, to fully engage your lat muscles.*";
    }

    return `### The Aesthetic Athlete Workout Framework for ${name}\n\n` +
           "Success in physical training depends on consistency and progressive load. Here is the golden baseline:\n\n" +
           "1. **Resistance Training**: Train 4-5 times a week, dedicating sets to specific muscle groups to allow 48-72 hours of recovery.\n" +
           "2. **Set Intensity**: Focus on 3-4 working sets per exercise with 0-2 RIR (Reps in Reserve).\n" +
           "3. **Form First**: Control the weight through full range of motion. Mind-muscle connection is the key to hypertrophy.\n\n" +
           `What specific routine or split would you like me to custom-design for you, ${name}? Tell me how many days you can train!`;
  }

  // 3. Nutrition & Meal plans
  if (
    msg.includes("nutrition") || msg.includes("diet") || msg.includes("eat") || msg.includes("food") || msg.includes("protein") ||
    msg.includes("carb") || msg.includes("fat") || msg.includes("macro") || msg.includes("calorie") || msg.includes("meal") ||
    msg.includes("bulk") || msg.includes("cut")
  ) {
    if (msg.includes("bulk") || msg.includes("gain")) {
      return `### Clean Bulking Nutrition Architecture for ${name}\n\n` +
             `To build premium lean mass without excessive fat storage, target a calculated surplus (+300 to +500 kcal):\n\n` +
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
      return `### Lean Shredding & Cutting Protocol for ${name}\n\n` +
             `To peel back fat layers while locking in maximum muscle mass, establish an active calorie deficit (-300 to -500 kcal):\n\n` +
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

    return `### Aesthetic Athlete Nutrition Ledger for ${name}\n\n` +
           "Your body is a high-performance machine; treat your fuel intake as engineering. Here are the cardinal rules:\n\n" +
           "1. **Protein Consistency**: Consume protein every 3-4 hours (30-50g per meal) to maximize Muscle Protein Synthesis (MPS).\n" +
           "2. **Pre-Workout Fuel**: Consume high-glycemic carbohydrates 60-90 minutes before your workout to top off glycogen stores.\n" +
           "3. **Hydration**: Drink at least 3-4 liters of pure water daily. Muscular volume is 70%+ water!\n\n" +
           `Tell me: are you currently looking to Bulk (gain muscle), Cut (lose fat), or maintain a lean physique, ${name}?`;
  }

  // 4. Recovery & Supplements
  if (
    msg.includes("recover") || msg.includes("sleep") || msg.includes("sore") || msg.includes("rest") || msg.includes("water") ||
    msg.includes("hydrate") || msg.includes("stretch") || msg.includes("creatine") || msg.includes("supplement") || msg.includes("pre-workout")
  ) {
    if (msg.includes("supplement") || msg.includes("creatine")) {
      return `### Aesthetic Supplementation Protocol for ${name}\n\n` +
             "Supplements exist to accelerate your training output. Focus exclusively on scientifically proven options:\n\n" +
             "1. **Creatine Monohydrate**: 5g daily, taken consistently at any hour to raise cellular ATP.\n" +
             "2. **Whey Isolate Protein**: Post-workout or between meals to easily satisfy your daily protein thresholds.\n" +
             "3. **Pre-Workout Compound**: Look for formula ingredients containing L-Citrulline (6-8g for pumps), Beta-Alanine (3.2g for endurance), and Caffeine (150-300mg).\n" +
             "4. **Vitamin D3 & Omega-3**: Crucial for natural joint recovery, general safety, and cardiovascular integrity.";
    }

    return `### Athlete Recovery & Sleep Optimization for ${name}\n\n` +
           "Muscle hypertrophy occurs during rest, not during training. To build a premium physique, your recovery must match your hard work:\n\n" +
           "- **Sleep Targets**: Secure 7.5 to 8.5 hours of high-quality sleep. The majority of growth hormone discharges happen during deep stages.\n" +
           "- **Cell Hydration**: Active cells require water. Track your water input (aim for 3-4 liters daily) using our hydration tracker on the Overview tab.\n" +
           "- **Active Stretching**: Spend 10 minutes at night doing passive stretches. Focus on hip flexors and thoracic extension.";
  }

  // 5. General / Default response
  return `### Aesthetic Pro-Athlete Calibrated Counsel for ${name}\n\n` +
         "To optimize your physical output:\n\n" +
         "1. **Continuous Progressive Overload**: If you bench pressed 80kg for 8 reps last week, aim for 80kg for 9 reps or 82.5kg for 8 reps today. Continuous effort leads to certain growth.\n" +
         "2. **Autoregulation Focus**: If you feel fatigue spikes or joint pain, downscale your set loads. Listen to your body and adjust dynamically.\n" +
         "3. **Mind-Muscle Connection**: Perfect your range of motion. Squeeze hard at peak contraction and control the eccentric downphase.\n\n" +
         `Tell me, ${name}: are you currently looking to Bulk (gain muscle), Cut (lose fat), or maintain a lean physique? Let's dial in your training!`;
}

// Custom, lightweight, fast, ultra-premium markdown renderer that formats headers, lists, italics, and bold text.
function parseInlineElements(text: string): React.ReactNode[] | string {
  // Matches both bold (***, **) and italics (*, _) tokens beautifully
  const regex = /(\*\*\*|__\*|\*\*_|\*\*|\*|_)(.*?)\1/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }
    const token = match[1];
    const content = match[2];

    if (token === '***' || token === '__*') {
      parts.push(
        <strong key={match.index} className="font-extrabold text-emerald-400 italic">
          {content}
        </strong>
      );
    } else if (token === '**' || token === '__') {
      parts.push(
        <strong key={match.index} className="font-extrabold text-emerald-400">
          {content}
        </strong>
      );
    } else if (token === '*' || token === '_') {
      parts.push(
        <span key={match.index} className="italic text-teal-300">
          {content}
        </span>
      );
    }
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

        // Blockquotes starting with "> " or ">"
        if (trimmed.startsWith('>')) {
          const content = trimmed.startsWith('> ') ? trimmed.substring(2) : trimmed.substring(1);
          return (
            <div key={idx} className="border-l-2 border-emerald-500 bg-emerald-950/20 pl-2.5 py-1 text-[11px] text-neutral-350 italic text-left my-1">
              {parseInlineElements(content)}
            </div>
          );
        }

        // Unordered lists starting with "- ", "* " or "• "
        if (trimmed.startsWith('- ') || trimmed.startsWith('* ') || trimmed.startsWith('• ')) {
          const content = trimmed.substring(2);
          return (
            <div key={idx} className="pl-4 relative text-[11px] text-neutral-350 leading-relaxed my-0.5 text-left">
              <span className="absolute left-1 text-emerald-500 font-bold">•</span>
              {parseInlineElements(content)}
            </div>
          );
        }

        // Ordered lists starting with a number e.g. "1. "
        const numMatch = trimmed.match(/^(\d+)\.\s(.*)$/);
        if (numMatch) {
          return (
            <div key={idx} className="pl-4 relative text-[11px] text-neutral-350 leading-relaxed my-0.5 text-left">
              <span className="absolute left-0 text-emerald-500 font-mono text-[10px]">{numMatch[1]}.</span>
              {parseInlineElements(numMatch[2])}
            </div>
          );
        }

        // Highlight custom "Coach Tip" or "Progressive Overload Rule" if the line has it:
        if (trimmed.includes("Coach Tip:") || trimmed.includes("Progressive Overload Rule:")) {
          return (
            <div key={idx} className="mt-2 p-2 bg-emerald-950/30 border border-emerald-900/40 rounded-xl text-[11px] text-emerald-300 font-sans text-left shadow-sm">
              {parseInlineElements(line)}
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
  const [showPromptTray, setShowPromptTray] = useState(false);
  const [activePromptCat, setActivePromptCat] = useState("🏋️ Splits");
  const [loadingPhase, setLoadingPhase] = useState("Calibrating metrics...");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [isLightMode, setIsLightMode] = useState(false);

  useEffect(() => {
    setIsLightMode(document.documentElement.classList.contains('light'));
    const observer = new MutationObserver(() => {
      setIsLightMode(document.documentElement.classList.contains('light'));
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });
    return () => observer.disconnect();
  }, []);

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

  // Handle premium coaching load-phases progress carousel
  useEffect(() => {
    if (!loading) return;
    const phases = [
      "Analyzing baseline body metrics...",
      "Calibrating hypertrophic splits...",
      "Structuring safe nutrient pathways...",
      "Matching performance guidelines...",
      "Polishing elite biomechanical loops..."
    ];
    let idx = 0;
    setLoadingPhase(phases[0]);
    const interval = setInterval(() => {
      idx = (idx + 1) % phases.length;
      setLoadingPhase(phases[idx]);
    }, 1250);
    return () => clearInterval(interval);
  }, [loading]);

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
            })),
            userProfile: user
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
        responseText = generateAestheticCoachResponse(rawText, user);
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
        text: generateAestheticCoachResponse(rawText, user),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, coachMsg]);
    } finally {
      setLoading(false);
    }
  };

  const categoryPrompts: Record<string, string[]> = {
    "🏋️ Splits": [
    "Suggest a 4-day workout split",
    "Arnold Split vs Push Pull Legs - which is better?",
    "Design an upper body hypertrophy routine",
    "I need a 3-day full body athlete routine"
  ],
  "🥗 Nutrition": [
    "Suggest pre-workout meal for mass",
    "How to clean bulk on a budget?",
    "Calculate optimal cutting macros for my weight",
    "What is the golden rule for post-workout carbs?"
  ],
  "🧪 Strategy": [
    "Tips for faster recovery & muscle soreness",
    "How much water should I drink for hydration?",
    "Explain correct form for barbell deadlifts",
    "When is it time to take a deload week?"
  ]
};

  const handleQuickPrompt = (prompt: string) => {
    handleSend(prompt);
  };

  const downloadTranscript = () => {
    if (messages.length <= 1) return;
    const profileHeader = user ? `# Athlete Profile Context\n- Name: ${user.name || 'Athlete'}\n- Fitness Goal: ${user.fitness_goal || 'N/A'}\n- Primary Weight: ${user.weight ? user.weight + ' kg' : 'N/A'}\n- Level: ${user.fitness_level || 'Intermediate'}\n\n` : "";
    const text = `${profileHeader}# Aesthetic Athlete AI Coach Session Transcript\nGenerated on: ${new Date().toLocaleDateString()}\n\n---\n\n` + messages
      .map(m => `### ${m.sender === 'athlete' ? 'Athlete' : '🏋️ Elite Coach AI'}:\n${m.text}\n\n`)
      .join('---\n\n');
    
    const blob = new Blob([text], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `aesthetic_athlete_coach_guide_${user?.id || 'anonymous'}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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
              className={`px-4 py-2 border rounded-2xl shadow-xl backdrop-blur-xl flex items-center gap-2 max-w-[260px] cursor-pointer ${
                isLightMode 
                  ? 'bg-white border-slate-200 text-slate-800 shadow-slate-200/50' 
                  : 'bg-[#000000] border-emerald-950 text-emerald-400 shadow-emerald-950/20'
              }`}
              onClick={() => setIsOpen(true)}
            >
              <div className="relative flex h-2 w-2">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isLightMode ? 'bg-emerald-500' : 'bg-emerald-400'}`}></span>
                <span className={`relative inline-flex rounded-full h-2 w-2 ${isLightMode ? 'bg-emerald-600' : 'bg-emerald-500'}`}></span>
              </div>
              <span className={`text-[11px] font-mono font-bold tracking-tight uppercase ${isLightMode ? 'text-emerald-700' : 'text-emerald-400'}`}>
                {typedText || "Aesthetic Coach AI"}
                <span className={`animate-pulse ml-0.5 ${isLightMode ? 'text-emerald-650' : 'text-emerald-300'}`}>|</span>
              </span>
            </motion.div>

            <motion.button
              key="badge-trigger"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              type="button"
              onClick={() => setIsOpen(true)}
              className={`flex items-center justify-center w-14 h-14 rounded-full shadow-xl hover:scale-105 transition active:scale-95 cursor-pointer relative group shrink-0 border p-[1.5px] ${
                isLightMode 
                  ? 'bg-gradient-to-tr from-emerald-450 to-sky-500 border-emerald-400 text-white shadow-emerald-500/35' 
                  : 'bg-gradient-to-tr from-emerald-500 to-sky-500 border-emerald-800 text-white shadow-emerald-900/30'
              }`}
            >
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-500/20 to-sky-500/20 blur-sm pointer-events-none group-hover:opacity-100 transition-all duration-300 animate-pulse" />
              <div className={`absolute inset-0 rounded-full opacity-20 animate-ping bg-gradient-to-r from-emerald-500 to-sky-500`} />
              <div className={`w-full h-full rounded-full flex items-center justify-center relative z-10 ${
                isLightMode ? 'bg-white' : 'bg-[#0a0a0d]'
              }`}>
                <Dumbbell className={`w-6 h-6 group-hover:rotate-12 transition-transform duration-300 ${isLightMode ? 'text-emerald-600' : 'text-neutral-105 group-hover:text-sky-400'}`} />
              </div>
              <span className="absolute -top-1 -right-1 flex h-3 w-3 z-25">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isLightMode ? 'bg-emerald-500' : 'bg-emerald-400'}`}></span>
                <span className={`relative inline-flex rounded-full h-3 w-3 ${isLightMode ? 'bg-emerald-600' : 'bg-emerald-500'}`}></span>
              </span>
            </motion.button>
          </div>
        )}

        {isOpen && (
          <motion.div
            key="coach-chatbox"
            id="coach-chatbox"
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className={`w-[calc(100vw-32px)] sm:w-[420px] h-[480px] sm:h-[570px] border rounded-3xl shadow-2xl flex flex-col z-50 overflow-hidden ${
              isLightMode 
                ? 'bg-white border-slate-250 shadow-slate-350/30 text-slate-800' 
                : 'bg-[#000000] border-emerald-850/40 shadow-emerald-950/40'
            }`}
          >
            {/* Header */}
            <div id="coach-chat-header" className={`border-b px-4 sm:px-5 py-3 sm:py-4 flex items-center justify-between ${
              isLightMode 
                ? 'bg-gradient-to-r from-emerald-50/80 to-teal-50/20 border-slate-100' 
                : 'bg-[#052316] border-emerald-950/80'
            }`}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl border p-[1px] bg-gradient-to-tr from-emerald-500 to-sky-500 shadow-sm shrink-0">
                  <div className={`w-full h-full rounded-[10px] flex items-center justify-center ${
                    isLightMode ? 'bg-white' : 'bg-[#0a0a0d]'
                  }`}>
                    <Dumbbell className={`w-4 h-4 ${isLightMode ? 'text-emerald-600' : 'text-neutral-100'}`} />
                  </div>
                </div>
                <div>
                  <h4 className={`text-sm font-black flex items-center gap-1.5 leading-none font-sans ${
                    isLightMode ? 'text-slate-900' : 'text-neutral-100'
                  }`}>
                    Aesthetic Coach AI
                    <span className={`w-1.5 h-1.5 rounded-full animate-pulse inline-block ${isLightMode ? 'bg-emerald-600' : 'bg-emerald-400'}`} />
                  </h4>
                  <span className={`text-[10px] font-mono tracking-tight uppercase ${isLightMode ? 'text-emerald-700/90' : 'text-emerald-500/80'}`}>ATHLETIC EXCELLENCE SHELL</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                {messages.length > 1 && (
                  <button
                    type="button"
                    onClick={downloadTranscript}
                    title="Export Coaching Guide (.md)"
                    className={`p-1.5 rounded-lg transition cursor-pointer ${
                      isLightMode 
                        ? 'text-slate-500 hover:text-emerald-700 hover:bg-slate-100' 
                        : 'text-neutral-400 hover:text-emerald-450 hover:bg-emerald-950/35'
                    }`}
                  >
                    <Download className="w-4 h-4" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={clearChat}
                  title="Clear Conversation"
                  className={`p-1.5 rounded-lg transition cursor-pointer ${
                    isLightMode 
                      ? 'text-slate-500 hover:text-rose-600 hover:bg-slate-100' 
                      : 'text-neutral-400 hover:text-rose-450 hover:bg-emerald-950/35'
                  }`}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className={`p-1.5 rounded-lg transition cursor-pointer ${
                    isLightMode 
                      ? 'text-slate-500 hover:text-slate-800 hover:bg-slate-100' 
                      : 'text-neutral-400 hover:text-white hover:bg-emerald-950/35'
                  }`}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Conversation Window */}
            <div id="coach-chat-messages-scroll" className={`flex-1 overflow-y-auto px-4 sm:px-5 py-3 sm:py-4 space-y-3 sm:space-y-4 custom-scrollbar flex flex-col ${
              isLightMode ? 'bg-slate-50/50' : 'bg-[#000000]'
            }`}>
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex ${m.sender === 'athlete' ? 'justify-end' : 'justify-start'} bg-transparent`}
                >
                  <div className={`flex gap-2 max-w-[85%] sm:max-w-[82%] ${m.sender === 'athlete' ? 'flex-row-reverse' : 'flex-row'} bg-transparent`}>
                    <div className={`w-6.5 h-6.5 rounded-lg shrink-0 flex items-center justify-center text-[10px] uppercase font-bold font-mono ${
                       m.sender === 'athlete' 
                         ? (isLightMode 
                             ? 'bg-emerald-550/10 text-emerald-700 border border-emerald-250/20' 
                             : 'bg-emerald-950 text-emerald-300 border border-emerald-800/40')
                         : (isLightMode 
                             ? 'bg-gradient-to-tr from-emerald-500/10 to-sky-500/10 text-emerald-700 border border-emerald-500/25' 
                             : 'bg-gradient-to-tr from-emerald-500/10 to-sky-500/10 text-emerald-400 border border-emerald-500/30')
                    }`}>
                      {m.sender === 'athlete' ? <User className="w-3.5 h-3.5" /> : <Dumbbell className={`w-3.5 h-3.5 ${isLightMode ? 'text-emerald-650' : 'text-emerald-400'}`} />}
                    </div>
                    <div className={`rounded-2xl px-3 sm:px-4 py-2 sm:py-3 text-xs leading-relaxed ${
                      m.sender === 'athlete'
                        ? (isLightMode 
                            ? 'bg-emerald-500/10 text-emerald-905 border border-emerald-500/20 shadow-sm rounded-tr-none text-right' 
                            : 'bg-emerald-950/45 text-emerald-300 border border-emerald-900/55 shadow-sm rounded-tr-none text-right')
                        : (isLightMode 
                            ? 'bg-white text-slate-800 border border-slate-200/70 shadow-sm rounded-tl-none text-left' 
                            : 'bg-neutral-900/60 text-neutral-250 border border-emerald-950/40 shadow-inner rounded-tl-none text-left')
                    }`}>
                      {parseCustomMarkdown(m.text)}
                    </div>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start bg-transparent">
                  <div className="flex gap-2 bg-transparent w-full">
                    <div className={`w-6.5 h-6.5 rounded-lg shrink-0 flex items-center justify-center ${
                      isLightMode 
                        ? 'bg-gradient-to-tr from-emerald-500/10 to-sky-500/10 text-emerald-750 border border-emerald-500/25' 
                        : 'bg-gradient-to-tr from-emerald-500/10 to-sky-500/10 text-emerald-450 border border-emerald-500/30'
                    }`}>
                      <Dumbbell className={`w-3.5 h-3.5 ${isLightMode ? 'text-emerald-650' : 'text-emerald-400'}`} />
                    </div>
                    <div className={`flex-1 rounded-2xl rounded-tl-none px-4 py-3 flex flex-col gap-1.5 text-xs ${
                      isLightMode 
                        ? 'bg-white text-slate-700 border border-slate-200/70' 
                        : 'bg-neutral-900/60 text-neutral-400 border border-emerald-950/40'
                    }`}>
                      <div className="flex items-center gap-1">
                        <span className={`w-1.5 h-1.5 rounded-full animate-bounce ${isLightMode ? 'bg-emerald-500' : 'bg-emerald-400'}`} style={{ animationDelay: '0ms' }} />
                        <span className={`w-1.5 h-1.5 rounded-full animate-bounce ${isLightMode ? 'bg-emerald-500' : 'bg-emerald-400'}`} style={{ animationDelay: '150ms' }} />
                        <span className={`w-1.5 h-1.5 rounded-full animate-bounce ${isLightMode ? 'bg-emerald-500' : 'bg-emerald-400'}`} style={{ animationDelay: '300ms' }} />
                      </div>
                      <span className={`text-[10px] font-mono tracking-wide animate-pulse ${
                        isLightMode ? 'text-emerald-700' : 'text-emerald-400/90'
                      }`}>
                        Coach is {loadingPhase}
                      </span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Suggestions Quick Toggler */}
            <div className={`px-4 py-2 border-t flex items-center justify-between text-[10px] ${
              isLightMode 
                ? 'bg-slate-100 border-slate-200 text-slate-650' 
                : 'bg-emerald-950/5 border-emerald-950/40 text-emerald-500/80'
            }`}>
              <span className={isLightMode ? 'text-slate-600 font-mono font-semibold' : 'text-emerald-500/80 font-mono'}>Suggested Athlete Queries:</span>
              <button 
                type="button"
                onClick={() => setShowPromptTray(!showPromptTray)}
                className={`font-bold uppercase flex items-center gap-1 transition cursor-pointer ${
                  isLightMode 
                    ? 'text-emerald-700 hover:text-emerald-800' 
                    : 'text-emerald-400 hover:text-emerald-300'
                }`}
              >
                {showPromptTray ? "Hide Ideas ✕" : "Browse Coaching Prompts 💡"}
              </button>
            </div>

            {/* Always-accessible classified Prompts Tray */}
            {showPromptTray && (
              <div className={`border-t p-3 max-h-[145px] overflow-y-auto space-y-2 text-left ${
                isLightMode 
                  ? 'bg-white border-slate-200' 
                  : 'bg-[#020202] border-emerald-950/40'
              }`}>
                <div className={`flex gap-1.5 border-b pb-1.5 overflow-x-auto scrollbar-none shrink-0 border-slate-100 ${
                  isLightMode ? 'border-slate-100' : 'border-emerald-950/20'
                }`}>
                  {Object.keys(categoryPrompts).map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setActivePromptCat(cat)}
                      className={`px-2 py-0.5 rounded-md text-[9px] font-mono tracking-tight cursor-pointer shrink-0 transition ${
                        activePromptCat === cat 
                          ? (isLightMode 
                              ? "bg-emerald-600 text-white border border-emerald-500/20" 
                              : "bg-emerald-800 text-white border border-emerald-600/40")
                          : (isLightMode 
                              ? "bg-slate-50 text-slate-650 border border-slate-200 hover:text-slate-800"
                              : "bg-neutral-900/60 text-neutral-400 border border-transparent hover:text-neutral-200")
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
                <div className="flex flex-col gap-1">
                  {categoryPrompts[activePromptCat]?.map((p, pIdx) => (
                    <button
                      key={pIdx}
                      type="button"
                      onClick={() => {
                        handleQuickPrompt(p);
                        setShowPromptTray(false);
                      }}
                      className={`text-[10px] text-left p-1 rounded truncate transition cursor-pointer ${
                        isLightMode 
                          ? 'text-slate-700 hover:text-emerald-700 hover:bg-emerald-50' 
                          : 'text-emerald-300 hover:text-emerald-200 hover:bg-emerald-950/20'
                      }`}
                    >
                      💡 {p}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Form */}
            <form
              id="coach-chat-form"
              onSubmit={(e) => { e.preventDefault(); handleSend(); }}
              className={`p-3 sm:p-4 border-t flex gap-1.5 sm:gap-2 items-center ${
                isLightMode 
                  ? 'bg-white border-slate-200' 
                  : 'bg-emerald-950/10 border-emerald-950/60'
              }`}
            >
              <input
                id="coach-chat-input-field"
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask your Coach split ideas, calories, recovery..."
                className={`flex-1 rounded-xl px-3 py-2 sm:px-3.5 sm:py-2.5 text-xs transition shadow-inner font-sans ${
                  isLightMode 
                    ? 'bg-slate-50 border border-slate-200 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white' 
                    : 'bg-black/80 border border-emerald-950/60 text-neutral-250 placeholder:text-emerald-700/65 focus:outline-none focus:border-emerald-750'
                }`}
                disabled={loading}
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || loading}
                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center transition active:scale-95 cursor-pointer shrink-0 shadow-lg ${
                  isLightMode 
                    ? 'bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-100 disabled:text-slate-400 text-white border border-emerald-600/10' 
                    : 'bg-emerald-700 hover:bg-emerald-600 disabled:bg-[#000000] disabled:text-neutral-750 text-white border border-emerald-900/40'
                }`}
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
