import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { Sparkles, Cake, Heart, Play, Quote, Music2 } from "lucide-react";

import StarfieldBackground from "./components/StarfieldBackground";
import MemoriesSection from "./components/MemoriesSection";
import ChatSection from "./components/ChatSection";
import LetterSection from "./components/LetterSection";
import BirthdayLockScreen from "./components/BirthdayLockScreen";
import BirthdayCakeSection from "./components/BirthdayCakeSection";

function App() {
  // Use a string state to cleanly handle multi-page navigation across all components
  const [currentPage, setCurrentPage] = useState("loader");

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage("hero");
    }, 5200);

    return () => clearTimeout(timer);
  }, []);

  // Standardized dynamic router function that components can use
  const goToPage = (pageName, subPageId = null) => {
    setCurrentPage(pageName);
    if (subPageId !== null) {
      console.log(`Navigating to sub-section: ${subPageId}`);
      // If you need to store the subPage ID (like memory index 1), you can add a separate state for it here.
    }
  };

  return (
    <main className="bg-[#07010f] text-white overflow-x-hidden">
      <AnimatePresence mode="wait">
        {currentPage === "loader" && <Loader onSkip={() => goToPage("hero")} />}

        {currentPage === "hero" && (
          <Hero onHoldComplete={() => goToPage("universe")} />
        )}

        {currentPage === "universe" && <Universe goToPage={goToPage} />}
        {currentPage === "chat" && (
          <ChatSection key="chat" goToPage={goToPage} />
        )}

        {currentPage === "memories" && (
          <MemoriesSection key="memories" goToPage={goToPage} />
        )}

        {currentPage === "letter" && (
          <LetterSection key="letter" goToPage={goToPage} />
        )}

        {currentPage === "birthdayLock" && (
          <BirthdayLockScreen
            key="birthdayLock"
            correctDay={24}
            correctMonth={2}
            recipientName="Amayra"
            onUnlock={() => goToPage("birthdayCake")}
          />
        )}

        {currentPage === "birthdayCake" && (
          <BirthdayCakeSection key="birthdayCake" goToPage={goToPage} />
        )}
      </AnimatePresence>
    </main>
  );
}

/* =========================================
    LOADER
========================================= */
function Loader({ onSkip }) {
  const lines = [
    "Close your eyes...",
    "Take a deep breath...",
    "This was made just for you",
    "💛",
  ];

  return (
    <motion.section
      key="loader"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.2 }}
      className="fixed inset-0 z-50 overflow-hidden bg-[#07010f]"
    >
      <StarfieldBackground>
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-pink-500/10 blur-[180px]" />

        <button className="absolute top-5 right-5 w-14 h-14 rounded-full border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl flex items-center justify-center">
          <Music2 className="text-[#cfa75e]" size={22} />
        </button>

        <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col gap-3">
          {[1, 2, 3, 4, 5].map((dot, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0.2 }}
              animate={{
                opacity: index === 0 ? 1 : 0.3,
                scale: index === 0 ? 1.2 : 1,
              }}
              transition={{ duration: 1 }}
              className={`rounded-full border border-pink-300/20 ${
                index === 0 ? "w-3 h-3 bg-pink-400" : "w-2 h-2 bg-pink-400/20"
              }`}
            />
          ))}
        </div>

        <div className="relative z-10 h-screen flex flex-col items-center justify-center px-6 text-center">
          <div className="space-y-6">
            {lines.map((line, index) => (
              <motion.h1
                key={index}
                initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{
                  delay: index * 1,
                  duration: 1.2,
                  ease: "easeOut",
                }}
                className={`cormorant italic font-medium tracking-[0.5px] text-[#f7e8eb] drop-shadow-[0_0_25px_rgba(255,255,255,0.08)] ${
                  index === 2
                    ? "text-[2rem] sm:text-[4.8rem]"
                    : "text-[2rem] sm:text-[4rem]"
                }`}
              >
                {line}
              </motion.h1>
            ))}
          </div>

          <div className="mt-16 w-[220px] h-[2px] bg-white/10 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 5, ease: "easeInOut" }}
              className="h-full bg-gradient-to-r from-pink-400 via-[#d9a441] to-[#f7d278] shadow-[0_0_20px_rgba(255,180,120,0.7)]"
            />
          </div>

          <button
            onClick={onSkip}
            className="absolute bottom-8 right-8 px-6 py-3 rounded-full border border-white/[0.08] bg-white/[0.02] text-[#bca8af] text-sm tracking-[3px] lowercase backdrop-blur-xl"
          >
            skip →
          </button>
        </div>
      </StarfieldBackground>
    </motion.section>
  );
}

/* =========================================
    HERO
========================================= */
function Hero({ onHoldComplete }) {
  const text = "Every moment with you feels a little more magical ✨";
  const [displayedText, setDisplayedText] = useState("");
  const [holding, setHolding] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);

  const PROGRESS_RING_LENGTH = 560;
  const HOLD_DURATION = 2000;
  const startTimeRef = useRef(null);
  const animationFrameRef = useRef(null);

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setDisplayedText(text.slice(0, index));
      index++;
      if (index > text.length) clearInterval(interval);
    }, 52);
    return () => clearInterval(interval);
  }, []);

  const handleHoldLoop = (timestamp) => {
    if (!startTimeRef.current) startTimeRef.current = timestamp;
    const elapsed = timestamp - startTimeRef.current;
    const progress = Math.min((elapsed / HOLD_DURATION) * 100, 100);
    setHoldProgress(progress);
    if (progress < 100) {
      animationFrameRef.current = requestAnimationFrame(handleHoldLoop);
    } else {
      setHolding(false);
      if (onHoldComplete) onHoldComplete();
    }
  };

  const startHold = () => {
    setHolding(true);
    startTimeRef.current = null;
    animationFrameRef.current = requestAnimationFrame(handleHoldLoop);
  };

  const endHold = () => {
    setHolding(false);
    cancelAnimationFrame(animationFrameRef.current);
    setHoldProgress(0);
  };

  return (
    <motion.section
      key="hero"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 1 }}
      className="relative min-h-screen overflow-hidden bg-[#07010f]"
    >
      <StarfieldBackground>
        {/* ── BIG AMBIENT GLOWS ── */}
        <div className="absolute top-[-220px] left-1/2 -translate-x-1/2 w-[900px] h-[900px] rounded-full bg-pink-500/[0.08] blur-[180px] pointer-events-none" />
        <div className="absolute bottom-[-100px] left-[-100px] w-[500px] h-[500px] rounded-full bg-[#f6d27a]/[0.05] blur-[160px] pointer-events-none" />
        <div className="absolute top-[30%] right-[-80px] w-[350px] h-[350px] rounded-full bg-pink-400/[0.06] blur-[140px] pointer-events-none" />

        {/* ── FLOATING CONFETTI PARTICLES ── */}
        {[...Array(28)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ y: -100, opacity: 0, rotate: 0 }}
            animate={{
              y: "120vh",
              opacity: [0, 0.85, 0.85, 0],
              rotate: 360,
              x: [0, Math.random() * 80 - 40],
            }}
            transition={{
              duration: Math.random() * 4 + 5,
              delay: Math.random() * 3,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute top-0 w-[6px] h-[12px] rounded-full bg-gradient-to-b from-pink-300 to-[#f6d27a]"
            style={{ left: `${Math.random() * 100}%` }}
          />
        ))}

        {/* ── MUSIC BUTTON ── */}
        <button className="fixed top-5 right-5 z-30 w-12 h-12 rounded-full border border-white/[0.08] bg-white/[0.03] backdrop-blur-[20px] flex items-center justify-center">
          <Play className="text-[#f6d27a]/70 ml-0.5" size={18} fill="#f6d27a" />
        </button>

        {/* ── MAIN CONTENT ── */}
        <div className="relative z-10 min-h-screen flex flex-col items-center px-4">
          {/* AVATAR */}
          <motion.div
            initial={{ opacity: 0, scale: 0.6, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1.1, ease: "easeOut" }}
            className="relative mt-12 sm:mt-14"
          >
            {/* outer pulse rings */}
            <motion.div
              animate={{ scale: [1, 1.12, 1], opacity: [0.15, 0.3, 0.15] }}
              transition={{ duration: 3.5, repeat: Infinity }}
              className="absolute inset-[-28px] rounded-full border border-pink-300/20"
            />
            <motion.div
              animate={{ scale: [1, 1.08, 1], opacity: [0.2, 0.4, 0.2] }}
              transition={{ duration: 3.5, repeat: Infinity, delay: 0.5 }}
              className="absolute inset-[-14px] rounded-full border border-[#f6d27a]/15"
            />
            {/* gradient ring */}
            <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-full p-[4px] bg-gradient-to-br from-pink-300 via-pink-500 to-[#f6d27a] shadow-[0_0_70px_rgba(255,105,180,0.4),0_0_140px_rgba(246,210,122,0.15)]">
              <img
                src="/her.png"
                alt=""
                className="w-full h-full rounded-full object-cover border-[4px] border-[#07010f]"
              />
            </div>
            {/* birthday badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.9, type: "spring", stiffness: 200 }}
              className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full border border-[#f6d27a]/30 bg-[#07010f]/80 backdrop-blur-md text-[#f6d27a] text-[0.58rem] tracking-[3px] uppercase ubuntu-medium whitespace-nowrap shadow-[0_0_20px_rgba(246,210,122,0.2)]"
            >
              🎂 June 25
            </motion.div>
          </motion.div>

          {/* HAPPY BIRTHDAY LABEL */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-10 flex items-center gap-3"
          >
            <Sparkles size={13} fill="#cfa75e" className="text-[#cfa75e]" />
            <p className="text-[0.7rem] text-[#cfa75e] tracking-[5px] uppercase ubuntu-medium">
              Happy Birthday
            </p>
            <Sparkles size={13} fill="#cfa75e" className="text-[#cfa75e]" />
          </motion.div>

          {/* NAME */}
          <motion.h1
            initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ delay: 0.65, duration: 0.9 }}
            className="mt-1 text-[3.8rem] sm:text-[5.2rem] leading-none italic font-semibold text-[#fff2f7] cormorant tracking-[-1px]"
            style={{ textShadow: "0 0 80px rgba(255,200,220,0.25)" }}
          >
            Amayra
          </motion.h1>

          {/* TYPEWRITER QUOTE */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.85 }}
            className="mt-5 flex items-center gap-2 max-w-[320px] sm:max-w-[400px] text-center justify-center"
          >
            <Quote className="text-[#cfa75e]/35 shrink-0" size={13} />
            <p className="text-[#d6c5cb] text-[0.92rem] sm:text-[1rem] italic cormorant tracking-[0.3px] leading-relaxed">
              {displayedText}
              <span className="animate-pulse text-[#f6d27a]">|</span>
            </p>
            <Quote
              className="text-[#cfa75e]/35 rotate-180 shrink-0"
              size={13}
            />
          </motion.div>

          {/* GOLD DIVIDER LINE */}
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: "180px", opacity: 1 }}
            transition={{ delay: 1.1, duration: 0.8 }}
            className="mt-6 h-[1px] bg-gradient-to-r from-transparent via-[#cfa75e] to-transparent"
          />

          {/* MAIN QUOTE CARD */}
          <motion.div
            initial={{ opacity: 0, y: 36 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.9 }}
            className="mt-8 w-full max-w-[340px] sm:max-w-[380px] rounded-[32px] border border-white/[0.07] bg-white/[0.03] backdrop-blur-[28px] shadow-[0_8px_50px_rgba(0,0,0,0.35)] px-6 py-6 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-pink-400/[0.06] via-transparent to-[#d9a441]/[0.07] rounded-[32px]" />
            {/* shimmer */}
            <motion.div
              animate={{ x: ["-130%", "230%"] }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "linear",
                delay: 2,
              }}
              className="absolute top-0 left-0 w-[70px] h-full bg-white/[0.05] blur-xl rotate-[18deg] pointer-events-none"
            />
            <div className="relative z-10 flex items-center justify-center gap-3 text-center">
              <Quote className="text-[#cfa75e]/30 shrink-0" size={14} />
              <p className="text-[#d8c7ce] text-[0.95rem] sm:text-[1rem] leading-[1.85rem] tracking-[0.3px] italic cormorant">
                Today the world got a little more beautiful — because you were
                born 🌸
              </p>
              <Quote
                className="text-[#cfa75e]/30 rotate-180 shrink-0"
                size={14}
              />
            </div>
          </motion.div>

          {/* STATS ROW */}
          <motion.div
            initial={{ opacity: 0, y: 36 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.25 }}
            className="mt-6 grid grid-cols-3 gap-3 w-full max-w-[340px] sm:max-w-[380px]"
          >
            {/* stat 1 */}
            <div className="relative rounded-[24px] border border-white/[0.07] bg-white/[0.03] backdrop-blur-[20px] px-2 py-5 flex flex-col items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-[#f6d27a]/[0.05] to-transparent rounded-[24px]" />
              <h3
                className="relative z-10 text-[2.1rem] text-[#f6d27a] font-semibold cormorant leading-none"
                style={{ textShadow: "0 0 30px rgba(246,210,122,0.5)" }}
              >
                15
              </h3>
              <p className="relative z-10 text-[#cbbdc2]/60 text-[10px] mt-1.5 text-center leading-tight">
                years of
                <br />
                magic ✨
              </p>
            </div>

            {/* stat 2 — center (featured) */}
            <div className="relative rounded-[24px] border border-[#f6d27a]/20 bg-[#f6d27a]/[0.05] backdrop-blur-[20px] px-2 py-5 flex flex-col items-center justify-center overflow-hidden shadow-[0_0_30px_rgba(246,210,122,0.08)]">
              <div className="absolute inset-0 bg-gradient-to-b from-[#f6d27a]/[0.08] to-transparent rounded-[24px]" />
              <Cake
                className="relative z-10 text-[#f6d27a]"
                size={22}
                style={{ filter: "drop-shadow(0 0 8px rgba(246,210,122,0.7))" }}
              />
              <p className="relative z-10 mt-2.5 text-[0.85rem] tracking-[1px] text-[#f6d27a]/80 cormorant italic">
                June 25
              </p>
            </div>

            {/* stat 3 */}
            <div className="relative rounded-[24px] border border-white/[0.07] bg-white/[0.03] backdrop-blur-[20px] px-2 py-5 flex flex-col items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-pink-400/[0.05] to-transparent rounded-[24px]" />
              <h3
                className="relative z-10 text-[2.1rem] text-[#f6d27a] font-semibold cormorant leading-none"
                style={{ textShadow: "0 0 30px rgba(246,210,122,0.5)" }}
              >
                ∞
              </h3>
              <p className="relative z-10 text-[#cbbdc2]/60 text-[10px] mt-1.5 flex items-center justify-center gap-1">
                loved{" "}
                <Heart size={9} fill="#f6d27a" className="text-[#f6d27a]" />
              </p>
            </div>
          </motion.div>

          {/* SCROLL HINT */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.6 }}
            className="mt-10 text-[#b48e97]/35 tracking-[5px] italic text-[0.62rem] cormorant"
          >
            — a glimpse of what's inside —
          </motion.p>

          {/* HOLD BUTTON */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.2, duration: 1 }}
            className="mt-10 mb-12 flex flex-col items-center gap-4"
          >
            {/* subtle hint text above button */}
            <motion.p
              animate={{ opacity: [0.3, 0.7, 0.3] }}
              transition={{ duration: 2.5, repeat: Infinity }}
              className="text-[#b48e97]/40 text-[0.58rem] tracking-[4px] uppercase"
            >
              hold to begin
            </motion.p>

            <motion.button
              onMouseDown={startHold}
              onMouseUp={endHold}
              onMouseLeave={endHold}
              onTouchStart={startHold}
              onTouchEnd={endHold}
              onTouchCancel={endHold}
              whileTap={{ scale: 0.97 }}
              className="group relative w-[220px] h-[70px] rounded-full overflow-hidden touch-none select-none"
            >
              {/* glow behind button */}
              <motion.div
                animate={{
                  opacity: holding ? [0.4, 0.9, 0.4] : [0.1, 0.25, 0.1],
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="absolute inset-0 rounded-full bg-[#f6d27a]/20 blur-xl pointer-events-none"
              />

              <svg
                className="absolute inset-0 w-full h-full -rotate-90"
                viewBox="0 0 220 70"
              >
                <rect
                  x="2"
                  y="2"
                  rx="33"
                  ry="33"
                  width="216"
                  height="66"
                  fill="transparent"
                  stroke="rgba(255,255,255,0.06)"
                  strokeWidth="1.5"
                />
                <rect
                  x="2"
                  y="2"
                  rx="33"
                  ry="33"
                  width="216"
                  height="66"
                  fill="transparent"
                  stroke="#f6d27a"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeDasharray={PROGRESS_RING_LENGTH}
                  strokeDashoffset={
                    PROGRESS_RING_LENGTH -
                    (PROGRESS_RING_LENGTH * holdProgress) / 100
                  }
                  style={{
                    filter: "drop-shadow(0 0 6px rgba(246,210,122,0.8))",
                  }}
                />
              </svg>

              <div className="absolute inset-[2px] rounded-full border border-white/[0.05] bg-white/[0.04] backdrop-blur-[24px] overflow-hidden">
                {/* inner shimmer on hold */}
                {holding && (
                  <motion.div
                    animate={{ x: ["-100%", "200%"] }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="absolute top-0 left-0 w-[50px] h-full bg-white/[0.08] blur-md rotate-[15deg]"
                  />
                )}
                <div className="relative z-10 w-full h-full flex items-center justify-center gap-3">
                  <motion.div
                    animate={{
                      scale: holding ? [1, 1.6, 1] : [1, 1.15, 1],
                      opacity: holding ? [0.5, 1, 0.5] : [0.5, 0.8, 0.5],
                    }}
                    transition={{
                      duration: holding ? 1.2 : 2,
                      repeat: Infinity,
                    }}
                    className="w-2 h-2 rounded-full bg-[#f6d27a]"
                    style={{ boxShadow: "0 0 10px rgba(246,210,122,0.9)" }}
                  />
                  <div className="flex flex-col items-start">
                    <span className="text-[0.55rem] uppercase tracking-[4px] text-[#c6b2b9]/50 ubuntu-medium">
                      {holding ? "almost there" : "press and hold"}
                    </span>
                    <span className="text-[1.05rem] italic cormorant text-[#fff2f7] leading-tight">
                      {holding ? "Keep holding..." : "Enter..."}
                    </span>
                  </div>
                </div>
              </div>
            </motion.button>
          </motion.div>
        </div>
      </StarfieldBackground>
    </motion.section>
  );
}

/* =========================================
    UNIVERSE PAGE (INTEGRATED WITH YOUR REAL UI)
========================================= */
function Universe({ goToPage }) {
  return (
    <motion.section
      key="universe"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 1.2 }}
      className="relative min-h-screen overflow-hidden bg-[#07010f] outline-none select-none"
    >
      <StarfieldBackground>
        {/* BACKGROUND */}
        <div className="absolute inset-0 bg-gradient-to-b from-pink-500/10 via-[#0c0714] to-[#07010f]" />

        {/* BIG GLOW */}
        <motion.div
          animate={{
            scale: [1, 1.08, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
          }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] h-[420px] rounded-full bg-pink-500/10 blur-[120px]"
        />

        {/* STARS */}
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              opacity: [0.2, 1, 0.2],
            }}
            transition={{
              duration: 2 + Math.random() * 3,
              repeat: Infinity,
            }}
            className="absolute w-[2px] h-[2px] rounded-full bg-white"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}

        {/* FLOATING BLUR CIRCLES */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -20, 0],
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
            }}
            className="absolute rounded-full border border-pink-300/10 bg-white/[0.03] backdrop-blur-xl"
            style={{
              width: `${60 + i * 20}px`,
              height: `${60 + i * 20}px`,
              left: `${i * 18}%`,
              top: `${15 + i * 12}%`,
            }}
          />
        ))}

        {/* MAIN CONTENT */}
        <div className="relative z-20 min-h-[100dvh] flex flex-col items-center justify-center text-center">
          {/* TOP LABEL */}
          <motion.p
            initial={{
              opacity: 0,
              y: 15,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.2,
            }}
            className="uppercase tracking-[6px] text-[#cfa75e] text-[0.62rem] ubuntu-medium"
          >
            her universe
          </motion.p>

          {/* MAIN HEADING */}
          <motion.h1
            initial={{
              opacity: 0,
              y: 30,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.5,
              duration: 1,
            }}
            className="mt-5 text-[3rem] leading-[3.2rem] sm:text-[5rem] sm:leading-[5rem] italic cormorant font-medium text-[#fff2f7]"
          >
            Some Souls
            <br />
            Feel Like Magic
          </motion.h1>

          {/* LINE */}
          <motion.div
            initial={{
              width: 0,
              opacity: 0,
            }}
            animate={{
              width: "160px",
              opacity: 1,
            }}
            transition={{
              delay: 1,
              duration: 1,
            }}
            className="mt-7 h-[1px] bg-gradient-to-r from-transparent via-[#d9a441] to-transparent"
          />

          {/* GLASS CARD */}
          <motion.div
            initial={{
              opacity: 0,
              y: 40,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 1.2,
              duration: 1,
            }}
            className="mt-10 w-full max-w-[340px] rounded-[30px] border border-white/[0.08] bg-white/[0.04] backdrop-blur-[26px] shadow-[0_8px_50px_rgba(0,0,0,0.35)] p-6 relative overflow-hidden"
          >
            {/* INNER GLOW */}
            <div className="absolute inset-0 bg-gradient-to-br from-pink-400/[0.05] via-transparent to-[#d9a441]/[0.06]" />

            {/* SHIMMER */}
            <motion.div
              animate={{
                x: ["-120%", "220%"],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear",
              }}
              className="absolute top-0 left-0 w-[100px] h-full bg-white/10 blur-2xl rotate-[18deg]"
            />

            {/* CARD CONTENT */}
            <div className="relative z-10">
              <p className="text-[1.2rem] leading-[2.1rem] italic cormorant text-[#f7e8eb]">
                “Some people enter your life quietly...
                <br />
                and suddenly everything feels softer,
                <br />
                warmer, and beautifully different.”
              </p>

              {/* FOOTER */}
              <div className="mt-7 flex items-center justify-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#f6d27a] shadow-[0_0_12px_rgba(246,210,122,0.8)]" />
                <p className="text-[#c8b8be] tracking-[4px] text-[10px] uppercase">
                  forever energy
                </p>
              </div>
            </div>
          </motion.div>

          {/* HOLD ACTION NAVIGATION BUTTON */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.8 }}
            className="mt-12 flex justify-center z-30"
          >
            <HoldToNavigateButton
              label="Memories"
              onComplete={() => goToPage("memories")}
            />
          </motion.div>

          {/* BOTTOM TEXT */}
          <motion.p
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            transition={{
              delay: 1.8,
            }}
            className="mt-10 text-[#b48e97]/50 tracking-[4px] text-[10px] italic text-center"
          >
            — every star tonight feels closer —
          </motion.p>
        </div>
      </StarfieldBackground>
    </motion.section>
  );
}

/* =========================================
    REUSABLE COMPONENT: HOLD TO NAVIGATE BUTTON
    (Created to power the Universe -> Memory transition)
========================================= */
function HoldToNavigateButton({ label, onComplete }) {
  const [holding, setHolding] = useState(false);
  const [progress, setProgress] = useState(0);
  const startTimeRef = useRef(null);
  const animationFrameRef = useRef(null);

  const HOLD_DURATION = 2000;
  const PROGRESS_RING_LENGTH = 560;

  const handleHoldLoop = (timestamp) => {
    if (!startTimeRef.current) startTimeRef.current = timestamp;
    const elapsed = timestamp - startTimeRef.current;
    const currentProgress = Math.min((elapsed / HOLD_DURATION) * 100, 100);

    setProgress(currentProgress);

    if (currentProgress < 100) {
      animationFrameRef.current = requestAnimationFrame(handleHoldLoop);
    } else {
      setHolding(false);
      if (onComplete) onComplete();
    }
  };

  const startHold = () => {
    setHolding(true);
    startTimeRef.current = null;
    animationFrameRef.current = requestAnimationFrame(handleHoldLoop);
  };

  const endHold = () => {
    setHolding(false);
    cancelAnimationFrame(animationFrameRef.current);
    setProgress(0);
  };

  return (
    <motion.button
      onMouseDown={startHold}
      onMouseUp={endHold}
      onMouseLeave={endHold}
      onTouchStart={startHold}
      onTouchEnd={endHold}
      onTouchCancel={endHold}
      whileTap={{ scale: 0.97 }}
      className="group relative w-[230px] h-[74px] rounded-full overflow-hidden touch-none select-none"
    >
      <svg
        className="absolute inset-0 w-full h-full -rotate-90"
        viewBox="0 0 230 74"
      >
        <rect
          x="2"
          y="2"
          rx="35"
          ry="35"
          width="226"
          height="70"
          fill="transparent"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="2"
        />
        <rect
          x="2"
          y="2"
          rx="35"
          ry="35"
          width="226"
          height="70"
          fill="transparent"
          stroke="#f6d27a"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray={PROGRESS_RING_LENGTH}
          strokeDashoffset={
            PROGRESS_RING_LENGTH - (PROGRESS_RING_LENGTH * progress) / 100
          }
          className="drop-shadow-[0_0_12px_rgba(246,210,122,0.8)]"
        />
      </svg>

      <div className="absolute inset-[2px] rounded-full border border-white/[0.04] bg-white/[0.035] backdrop-blur-[22px] overflow-hidden">
        <div className="relative z-10 w-full h-full flex items-center justify-center gap-3">
          <motion.div
            animate={{
              scale: holding ? [1, 1.5, 1] : 1,
              opacity: holding ? [0.4, 1, 0.4] : 0.6,
            }}
            transition={{
              duration: holding ? 1.4 : 0.2,
              repeat: holding ? Infinity : 0,
            }}
            className="w-2.5 h-2.5 rounded-full bg-[#f6d27a]"
          />
          <div className="flex flex-col items-start">
            <span className="text-[0.6rem] uppercase tracking-[4px] text-[#c6b2b9] opacity-60 ubuntu-medium">
              Hold to open
            </span>
            <span className="text-[1.1rem] italic cormorant text-[#fff2f7] leading-none">
              {holding ? "Entering..." : label}
            </span>
          </div>
        </div>
      </div>
    </motion.button>
  );
}

export default App;
