import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import StarfieldBackground from "./StarfieldBackground";

const chats = [
  { sender: "you", text: "Happy Birthday, drama queen bhen 👑😂" },
  { sender: "her", text: "thank youuuu 😭" },
  { sender: "you", text: "Bhudhape ke nazdeek ho aap 😂" },
  { sender: "her", text: "chal hatt 💀" },
  { sender: "you", text: "waise meri party kaha hai?" },
  { sender: "her", text: "Bata ye to tu hi batayegi bhen 🫵 Mil jaani chahiye bata ra hun 😂" },
  { sender: "her", text: "Ye website banane mein kitna time laga hoga? 🤔" },
  { sender: "you", text: "Sahi bataun to, 3-4 din bas 😂" },
];

/* ── Ornamental SVG divider (reused from LetterSection) ── */
function OrnamentDivider() {
  return (
    <svg viewBox="0 0 320 18" className="w-full max-w-[240px] mx-auto" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="goldLineChat" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor="#f6d27a" stopOpacity="0" />
          <stop offset="35%"  stopColor="#f6d27a" stopOpacity="0.5" />
          <stop offset="50%"  stopColor="#f6d27a" stopOpacity="1" />
          <stop offset="65%"  stopColor="#f6d27a" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#f6d27a" stopOpacity="0" />
        </linearGradient>
      </defs>
      <line x1="0" y1="9" x2="128" y2="9" stroke="url(#goldLineChat)" strokeWidth="1.2" />
      <polygon points="160,2 168,9 160,16 152,9" fill="none" stroke="#f6d27a" strokeWidth="1.2" opacity="0.9" />
      <circle cx="160" cy="9" r="2" fill="#f6d27a" opacity="0.95" />
      <line x1="192" y1="9" x2="320" y2="9" stroke="url(#goldLineChat)" strokeWidth="1.2" />
    </svg>
  );
}

/* ── Typing dots indicator ── */
function TypingDots() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.92 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.88 }}
      className="mr-auto flex items-center gap-[5px] px-4 py-3 rounded-[22px] rounded-bl-[6px] border border-pink-300/15 bg-pink-500/[0.08] backdrop-blur-sm w-fit"
    >
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          animate={{ y: [0, -5, 0], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.18 }}
          className="w-[6px] h-[6px] rounded-full bg-[#f8d8e6]"
        />
      ))}
    </motion.div>
  );
}

/* ── HoldToNavigate Button (same as rest of site) ── */
function HoldToNavigateButton({ label, onComplete }) {
  const [holding, setHolding] = useState(false);
  const [progress, setProgress] = useState(0);
  const startTimeRef = useRef(null);
  const rafRef = useRef(null);
  const HOLD_DURATION = 2000;
  const RING_LEN = 560;

  const loop = (ts) => {
    if (!startTimeRef.current) startTimeRef.current = ts;
    const p = Math.min(((ts - startTimeRef.current) / HOLD_DURATION) * 100, 100);
    setProgress(p);
    if (p < 100) { rafRef.current = requestAnimationFrame(loop); }
    else { setHolding(false); onComplete?.(); }
  };
  const start = () => { setHolding(true); startTimeRef.current = null; rafRef.current = requestAnimationFrame(loop); };
  const end   = () => { setHolding(false); cancelAnimationFrame(rafRef.current); setProgress(0); };

  return (
    <motion.button
      onMouseDown={start} onMouseUp={end} onMouseLeave={end}
      onTouchStart={start} onTouchEnd={end} onTouchCancel={end}
      whileTap={{ scale: 0.97 }}
      className="group relative w-[230px] h-[74px] rounded-full overflow-hidden touch-none select-none"
    >
      <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 230 74">
        <rect x="2" y="2" rx="35" ry="35" width="226" height="70" fill="transparent" stroke="rgba(255,255,255,0.08)" strokeWidth="2" />
        <rect x="2" y="2" rx="35" ry="35" width="226" height="70" fill="transparent"
          stroke="#f6d27a" strokeWidth="2.5" strokeLinecap="round"
          strokeDasharray={RING_LEN}
          strokeDashoffset={RING_LEN - (RING_LEN * progress) / 100}
          className="drop-shadow-[0_0_12px_rgba(246,210,122,0.8)]"
        />
      </svg>
      <div className="absolute inset-[2px] rounded-full border border-white/[0.04] bg-white/[0.035] backdrop-blur-[22px] overflow-hidden">
        <div className="relative z-10 w-full h-full flex items-center justify-center gap-3">
          <motion.div
            animate={{ scale: holding ? [1,1.5,1] : 1, opacity: holding ? [0.4,1,0.4] : 0.6 }}
            transition={{ duration: holding ? 1.4 : 0.2, repeat: holding ? Infinity : 0 }}
            className="w-2.5 h-2.5 rounded-full bg-[#f6d27a]"
          />
          <div className="flex flex-col items-start">
            <span className="text-[0.6rem] uppercase tracking-[4px] text-[#c6b2b9] opacity-60 ubuntu-medium">Hold to open</span>
            <span className="text-[1.1rem] italic cormorant text-[#fff2f7] leading-none">
              {holding ? "Entering..." : label}
            </span>
          </div>
        </div>
      </div>
    </motion.button>
  );
}

/* ════════════════════════════════════════════
   MAIN COMPONENT
════════════════════════════════════════════ */
export default function ChatSection({ goToPage }) {
  const [visible, setVisible]   = useState([]);
  const [typing, setTyping]     = useState(false);
  const [done, setDone]         = useState(false);

  const indexRef = useRef(0);
  const timerRef = useRef(null);
  const bottomRef = useRef(null);

  const run = () => {
    if (indexRef.current >= chats.length) {
      clearInterval(timerRef.current);
      setTyping(false);
      setDone(true);
      return;
    }
    const msg = chats[indexRef.current];
    setTyping(true);
    const delay = msg.sender === "her" ? 1200 + Math.random() * 400 : 700 + Math.random() * 300;
    setTimeout(() => {
      setVisible((p) => [...p, msg]);
      setTyping(false);
      indexRef.current++;
    }, delay);
  };

  const startReplay = () => {
    clearInterval(timerRef.current);
    setVisible([]);
    setTyping(false);
    setDone(false);
    indexRef.current = 0;
    setTimeout(() => {
      timerRef.current = setInterval(run, 1800);
    }, 100);
  };

  useEffect(() => {
    timerRef.current = setInterval(run, 1800);
    return () => clearInterval(timerRef.current);
  }, []);

  return (
    <section className="relative min-h-screen bg-[#07010f] overflow-hidden">
      <StarfieldBackground>

        {/* ── GLOWS ── */}
        <div className="absolute top-[-180px] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-pink-500/10 blur-[160px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[-100px] right-[-60px] w-[380px] h-[380px] bg-[#f6d27a]/[0.06] blur-[140px] rounded-full pointer-events-none" />

        {/* ── FLOATING PARTICLES ── */}
        {[...Array(14)].map((_, i) => (
          <motion.div key={i}
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: "110vh", opacity: [0, 0.6, 0.6, 0], x: [0, Math.random() * 50 - 25] }}
            transition={{ duration: Math.random() * 5 + 5, delay: Math.random() * 4, repeat: Infinity, ease: "linear" }}
            className="absolute top-0 w-[5px] h-[10px] rounded-full bg-gradient-to-b from-pink-300 to-[#f6d27a]"
            style={{ left: `${Math.random() * 100}%` }}
          />
        ))}

        {/* ── MAIN CONTENT ── */}
        <div className="relative z-10 min-h-screen flex flex-col items-center px-4 pt-14 pb-20 sm:pt-20">

          {/* CHAPTER LABEL */}
          <motion.p
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            className="uppercase tracking-[8px] text-[#cfa75e] text-[0.6rem] ubuntu-medium mb-4 text-center"
          >
            Chapter III
          </motion.p>

          {/* HEADING */}
          <motion.div
            initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.9 }}
            className="text-center mb-3"
          >
            <h1 className="text-[2.8rem] sm:text-[4.2rem] cormorant font-medium text-[#fff2f7] leading-[1.05]">
              Late Night
            </h1>
            <h2 className="text-[2.5rem] sm:text-[3.8rem] italic cormorant text-[#f8d8e6] leading-[1.05]">
              Fragments
            </h2>
          </motion.div>

          {/* TOP ORNAMENT */}
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }} animate={{ opacity: 1, scaleX: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="w-full max-w-[240px] mb-3"
          >
            <OrnamentDivider />
          </motion.div>

          {/* SUBLABEL */}
          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}
            className="text-pink-200/50 tracking-[3px] uppercase text-[0.58rem] mb-10 text-center"
          >
            the conversations i'll never forget 🌙
          </motion.p>

          {/* ── CHAT CARD ── */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.9 }}
            className="relative w-full max-w-[92vw] sm:max-w-lg"
          >
            {/* CARD GLOW RING */}
            <div className="absolute -inset-[1px] rounded-[36px] bg-gradient-to-br from-pink-400/20 via-transparent to-[#f6d27a]/15 blur-[2px] pointer-events-none" />

            <div className="relative rounded-[34px] border border-white/[0.09] bg-white/[0.03] backdrop-blur-[30px] shadow-[0_12px_60px_rgba(0,0,0,0.5)] overflow-hidden">

              {/* SHIMMER */}
              <motion.div
                animate={{ x: ["-130%", "230%"] }}
                transition={{ duration: 5, repeat: Infinity, ease: "linear", delay: 3 }}
                className="absolute top-0 left-0 w-[60px] h-full bg-white/[0.04] blur-xl rotate-[15deg] pointer-events-none z-10"
              />

              {/* CARD INNER GLOW */}
              <div className="absolute inset-0 bg-gradient-to-br from-pink-500/[0.04] via-transparent to-[#d9a441]/[0.05] pointer-events-none" />

              {/* CHAT HEADER */}
              <div className="relative z-10 flex items-center gap-3 px-5 py-4 border-b border-white/[0.06]">
                {/* Avatar */}
                <div className="relative">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-pink-400 to-[#f6d27a] flex items-center justify-center text-[#07010f] text-sm font-bold shadow-[0_0_14px_rgba(246,210,122,0.4)]">
                    A
                  </div>
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#07010f] shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
                </div>
                <div className="flex-1">
                  <p className="text-[0.82rem] text-[#fff2f7] ubuntu-medium tracking-[0.5px]">Amayra 👑</p>
                  <p className="text-[0.58rem] text-[#b48e97]/60 tracking-[2px] uppercase">Online</p>
                </div>
                {/* decorative dots */}
                <div className="flex gap-1.5">
                  {["bg-[#f6d27a]/40","bg-pink-400/30","bg-white/20"].map((c,i)=>(
                    <div key={i} className={`w-2 h-2 rounded-full ${c}`} />
                  ))}
                </div>
              </div>

              {/* DATE CHIP */}
              <div className="relative z-10 flex justify-center mt-5 mb-3">
                <div className="px-4 py-1 rounded-full border border-white/[0.07] bg-white/[0.03] text-[#b48e97]/50 text-[0.58rem] tracking-[3px] uppercase">
                  June 25 · Her Birthday 🎂
                </div>
              </div>

              {/* MESSAGES */}
              <div className="relative z-10 flex flex-col gap-3 px-4 pb-5 min-h-[260px]">
                <AnimatePresence>
                  {visible.map((msg, i) => {
                    const isYou = msg.sender === "you";
                    return (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 12, scale: 0.94 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.35, ease: "easeOut" }}
                        className={`flex flex-col ${isYou ? "items-end" : "items-start"}`}
                      >
                        <div className={`
                          max-w-[78%] px-4 py-2.5 text-[0.88rem] leading-[1.55] text-white
                          ${isYou
                            ? "rounded-[20px] rounded-br-[5px] bg-[#f6d27a]/[0.12] border border-[#f6d27a]/[0.22] shadow-[0_2px_16px_rgba(246,210,122,0.08)]"
                            : "rounded-[20px] rounded-bl-[5px] bg-pink-500/[0.1] border border-pink-300/[0.18] shadow-[0_2px_16px_rgba(255,105,180,0.07)]"
                          }
                        `}>
                          {msg.text}
                        </div>
                        <span className={`text-[0.52rem] mt-1 tracking-[1px] text-[#b48e97]/35 ${isYou ? "mr-1" : "ml-1"}`}>
                          {isYou ? "You" : "Amayra"} · just now
                        </span>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>

                <AnimatePresence>
                  {typing && <TypingDots />}
                </AnimatePresence>

                <div ref={bottomRef} />
              </div>

              {/* CARD FOOTER */}
              <div className="relative z-10 border-t border-white/[0.06] px-4 py-3 flex items-center gap-3">
                <div className="flex-1 rounded-full border border-white/[0.07] bg-white/[0.03] px-4 py-2 text-[0.72rem] text-[#b48e97]/30 tracking-[1px]">
                  Type a message...
                </div>
                <div className="w-8 h-8 rounded-full bg-[#f6d27a]/10 border border-[#f6d27a]/20 flex items-center justify-center">
                  <span className="text-[#f6d27a] text-sm">↑</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* REPLAY BUTTON */}
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2 }}
            className="mt-7 flex justify-center"
          >
            <button
              onClick={startReplay}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/[0.1] bg-white/[0.04] backdrop-blur-md text-[#d6c5cb] text-[0.78rem] tracking-[2px] transition hover:bg-white/[0.08] active:scale-95"
            >
              <span>🔁</span>
              <span className="ubuntu-medium">Watch Replay</span>
            </button>
          </motion.div>

          {/* BOTTOM ORNAMENT */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}
            className="mt-8 w-full max-w-[200px]"
          >
            <OrnamentDivider />
          </motion.div>

          {/* BOTTOM QUOTE */}
          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8 }}
            className="mt-4 text-[#b48e97]/35 tracking-[4px] italic text-[0.65rem] cormorant text-center"
          >
            — some chats become memories —
          </motion.p>

          {/* HOLD TO NAVIGATE */}
          <motion.div
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.4, duration: 0.8 }}
            className="mt-10 flex justify-center"
          >
            <HoldToNavigateButton label="See the letter" onComplete={() => goToPage("letter")} />
          </motion.div>

        </div>
      </StarfieldBackground>
    </section>
  );
}