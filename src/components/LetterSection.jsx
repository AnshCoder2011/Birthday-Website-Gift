import { useEffect, useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import StarfieldBackground from "./StarfieldBackground";

const fullText = `Pyaari Bhen JI 🤣,

Likhna shuru kar raha hoon ye letter aur sabse pehla thought yehi hai — kaise ek normal classmate dheere dheere itni control wali real jaisi Bhen  ban gayi?, yaad hai kese 7th mein Bhaii bana nahi ki wow kya yr kya drawing hai, mere bhi bana de pure time tere aur puri class ke diagram hi bana raha hota tha 🤣 ab to bach jata hun 👍kisi ko pta nahi chalni chahiye meri retired skill 😜

7th mein jitni baat hoti thi ab khair nahi hopati, 8th mein jaate hi naye dost jo ban gaye ji aapke 🫣, Exam mein bhi pass krwana bhul gyi mujhe 😭 khud Top maar deti hai 😂, Birthday Wish tak nahi kiya mujhe aaj tak 😭 pata nahi mera bday yaad bhi hai ki nahi 😭 wo to mein abhi test lelunga dekhti ja tu 😁, 

Har saal 12 baje jag ke msg/website bhejta hun ek baar bhi nahi bhula 😂 Par kuch logo ko shayd bhulne ki bimari hai haha, just kidding yrr..

Jo bhi Ho party to chahiye, kuch to tax lagega website ka 😁😂

Anyway, jokes apart — kabhi socha nahi tha ki ek random classmate itni important ban jaayegi ki uska birthday celebrate karne ke liye main poori website banani Padegi. Par tu deserve karti hai.
Happy Birthday, Amayra. Stay weird, Stay as whatever you are. 💛

Tera Bhai,

Ansh`;

function HoldToNavigateButton({ label, onComplete }) {
  const [holding, setHolding] = useState(false);
  const [progress, setProgress] = useState(0);
  const startRef = useRef(null);
  const rafRef = useRef(null);
  const TOTAL = 548,
    DURATION = 2000;

  const loop = useCallback(
    (ts) => {
      if (!startRef.current) startRef.current = ts;
      const p = Math.min((ts - startRef.current) / DURATION, 1);
      setProgress(p * 100);
      if (p < 1) {
        rafRef.current = requestAnimationFrame(loop);
      } else {
        setHolding(false);
        onComplete?.();
      }
    },
    [onComplete],
  );

  const start = () => {
    setHolding(true);
    startRef.current = null;
    rafRef.current = requestAnimationFrame(loop);
  };
  const end = () => {
    setHolding(false);
    cancelAnimationFrame(rafRef.current);
    setProgress(0);
  };

  return (
    <motion.button
      onMouseDown={start}
      onMouseUp={end}
      onMouseLeave={end}
      onTouchStart={start}
      onTouchEnd={end}
      onTouchCancel={end}
      whileTap={{ scale: 0.97 }}
      className="relative w-[230px] h-[72px] rounded-full overflow-hidden select-none touch-none"
      style={{ background: "none", border: "none", cursor: "pointer" }}
    >
      <svg
        className="absolute inset-0 w-full h-full -rotate-90"
        viewBox="0 0 230 72"
      >
        <rect
          x="2"
          y="2"
          rx="34"
          ry="34"
          width="226"
          height="68"
          fill="transparent"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="1.5"
        />
        <rect
          x="2"
          y="2"
          rx="34"
          ry="34"
          width="226"
          height="68"
          fill="transparent"
          stroke="#f6d27a"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray={TOTAL}
          strokeDashoffset={TOTAL - (TOTAL * progress) / 100}
          style={{
            filter: "drop-shadow(0 0 5px rgba(246,210,122,0.7))",
            transition: "none",
          }}
        />
      </svg>
      <div
        className="absolute inset-[2px] rounded-full flex items-center justify-center gap-3"
        style={{
          background: "rgba(255,255,255,0.035)",
          backdropFilter: "blur(22px)",
          border: "1px solid rgba(255,255,255,0.04)",
        }}
      >
        <motion.div
          className="w-2.5 h-2.5 rounded-full bg-[#f6d27a]"
          animate={{
            scale: holding ? [1, 1.6, 1] : 1,
            opacity: holding ? [0.6, 1, 0.6] : 0.7,
          }}
          transition={{ duration: 1.2, repeat: holding ? Infinity : 0 }}
          style={{ boxShadow: holding ? "0 0 10px #f6d27a" : "none" }}
        />
        <div className="flex flex-col items-start">
          <span className="text-[9px] uppercase tracking-[5px] text-[#c6b2b9] opacity-60">
            Hold to open
          </span>
          <span className="cormorant text-[1.1rem] italic text-[#fff2f7] leading-none">
            {holding ? "Entering…" : label}
          </span>
        </div>
      </div>
    </motion.button>
  );
}

/* ── Ornamental SVG divider ── */
function OrnamentDivider() {
  return (
    <svg
      viewBox="0 0 320 18"
      className="w-full max-w-[320px] mx-auto my-1"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="goldLine" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#f6d27a" stopOpacity="0" />
          <stop offset="30%" stopColor="#f6d27a" stopOpacity="0.6" />
          <stop offset="50%" stopColor="#f6d27a" stopOpacity="1" />
          <stop offset="70%" stopColor="#f6d27a" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#f6d27a" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* left arm */}
      <line
        x1="0"
        y1="9"
        x2="128"
        y2="9"
        stroke="url(#goldLine)"
        strokeWidth="1.2"
      />
      {/* center diamond */}
      <polygon
        points="160,2 168,9 160,16 152,9"
        fill="none"
        stroke="#f6d27a"
        strokeWidth="1.2"
        opacity="0.9"
      />
      {/* inner dot */}
      <circle cx="160" cy="9" r="2" fill="#f6d27a" opacity="0.95" />
      {/* right arm */}
      <line
        x1="192"
        y1="9"
        x2="320"
        y2="9"
        stroke="url(#goldLine)"
        strokeWidth="1.2"
      />
    </svg>
  );
}

export default function LetterSection({ goToPage }) {
  const [text, setText] = useState("");
  const [index, setIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);

  const startTyping = () => {
    setText("");
    setIndex(0);
    setIsTyping(true);
  };

  useEffect(() => {
    startTyping();
  }, []);

  useEffect(() => {
    if (!isTyping) return;
    if (index >= fullText.length) {
      setIsTyping(false);
      return;
    }
    const timeout = setTimeout(() => {
      setText((prev) => prev + fullText[index]);
      setIndex((prev) => prev + 1);
    }, 30);
    return () => clearTimeout(timeout);
  }, [index, isTyping]);

  return (
    <section className="relative min-h-screen bg-[#07010f] overflow-hidden">
      <StarfieldBackground>
        {/* GLOWS */}
        <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-pink-500/10 blur-[160px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[-150px] right-[-80px] w-[400px] h-[400px] bg-yellow-300/[0.07] blur-[160px] rounded-full pointer-events-none" />

        {/* FLOATING PARTICLES */}
        {[...Array(16)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ y: -60, opacity: 0 }}
            animate={{
              y: "110vh",
              opacity: [0, 0.65, 0.65, 0],
              x: [0, Math.random() * 60 - 30],
            }}
            transition={{
              duration: Math.random() * 5 + 5,
              delay: Math.random() * 4,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute top-0 w-[5px] h-[11px] rounded-full bg-gradient-to-b from-pink-300 to-[#f6d27a]"
            style={{ left: `${Math.random() * 100}%` }}
          />
        ))}

        {/* MAIN CONTENT */}
        <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-16 sm:py-20">
          {/* CHAPTER LABEL */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="uppercase tracking-[8px] text-[#cfa75e] text-[0.6rem] ubuntu-medium mb-4 text-center"
          >
            Chapter IV
          </motion.p>

          {/* HEADING */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 1 }}
            className="text-center mb-2"
          >
            <h1 className="text-[2.8rem] sm:text-[4.2rem] italic cormorant font-medium text-[#fff2f7] leading-[1.05]">
              A Letter
            </h1>
            <h2 className="text-[2.4rem] sm:text-[3.6rem] italic cormorant text-[#f8d8e6] leading-[1.05]">
              From the Heart
            </h2>
          </motion.div>

          {/* TOP ORNAMENT */}
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ delay: 0.9, duration: 0.9 }}
            className="w-full max-w-[280px] mb-6"
          >
            <OrnamentDivider />
          </motion.div>

          {/* SUBLABEL */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-pink-200/60 tracking-[3px] uppercase text-[0.6rem] mb-8 text-center"
          >
            Written with love, just for you 💮
          </motion.p>

          {/* LETTER CARD */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 28 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="relative w-full max-w-[92vw] sm:max-w-xl rounded-[28px] sm:rounded-[32px] border border-white/[0.08] bg-white/[0.04] backdrop-blur-[28px] shadow-[0_8px_60px_rgba(0,0,0,0.45)] px-5 py-7 sm:p-10 overflow-hidden"
          >
            {/* CARD GLOW */}
            <div className="absolute inset-0 bg-gradient-to-br from-pink-400/[0.05] via-transparent to-[#d9a441]/[0.06] rounded-[32px] pointer-events-none" />

            {/* SHIMMER */}
            <motion.div
              animate={{ x: ["-130%", "230%"] }}
              transition={{
                duration: 4.5,
                repeat: Infinity,
                ease: "linear",
                delay: 2.5,
              }}
              className="absolute top-0 left-0 w-[70px] h-full bg-white/[0.05] blur-2xl rotate-[18deg] pointer-events-none"
            />

            {/* CORNER STARS */}
            <span className="absolute top-4 right-5 text-[#f6d27a]/25 text-xl select-none">
              ✦
            </span>
            <span className="absolute bottom-4 left-5 text-[#f6d27a]/15 text-lg select-none">
              ✦
            </span>

            {/* BADGE */}
            <div className="relative z-10 flex items-center gap-2 mb-5">
              <div className="w-[7px] h-[7px] rounded-full bg-[#f6d27a] shadow-[0_0_8px_rgba(246,210,122,0.9)]" />
              <p className="text-[0.55rem] tracking-[5px] text-[#cfa75e] uppercase ubuntu-medium">
                💌 Personal Letter
              </p>
            </div>

            {/* ── LETTER TEXT ── */}
            <div className="relative z-10 font-['Cormorant_Garamond',serif] text-[1.05rem] sm:text-[1.12rem] leading-[1.95rem] whitespace-pre-wrap">
              {/* "Dearest " normal + "Didi" golden big */}
              {text.length > 0 && (
                <>
                  {/* First line special render */}
                  {(() => {
                    const firstLineEnd = fullText.indexOf("\n");
                    const firstLine = "Pyaari bhen JI 🤣,";
                    const typed = text;

                    if (typed.length <= firstLine.length) {
                      // still typing first line
                      const dearestPart = typed.slice(0, 8); // "Dearest "
                      const didiPart = typed.slice(8); // partial "Didi,"
                      return (
                        <p className="mb-0 leading-[2.2rem]">
                          <span className="text-[#f0e0e8] text-[1.05rem] sm:text-[1.1rem]">
                            {dearestPart}
                          </span>
                          <span
                            className="text-[#f6d27a] font-semibold"
                            style={{ fontSize: "clamp(1.35rem, 5vw, 1.65rem)" }}
                          >
                            {didiPart}
                          </span>
                          <span className="animate-pulse text-[#f6d27a]">
                            |
                          </span>
                        </p>
                      );
                    }

                    // first line fully typed, render rest normally
                    const rest = typed.slice(firstLine.length);
                    return (
                      <>
                        <p className="mb-0 leading-[2.2rem]">
                          <span className="text-[#f0e0e8] text-[1.05rem] sm:text-[1.1rem]">
                            Pyaari{" "}
                          </span>
                          <span
                            className="text-[#f6d27a] font-semibold"
                            style={{ fontSize: "clamp(1.35rem, 5vw, 1.65rem)" }}
                          >
                            Bhen JI
                          </span>
                          <span className="text-[#f0e0e8]">,</span>
                        </p>
                        <span className="text-[#e8d4dc]">{rest}</span>
                        {isTyping && (
                          <span className="animate-pulse text-[#f6d27a]">
                            |
                          </span>
                        )}
                      </>
                    );
                  })()}
                </>
              )}
            </div>

            {/* BOTTOM ORNAMENT inside card */}
            {!isTyping && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="relative z-10 mt-6"
              >
                <OrnamentDivider />
              </motion.div>
            )}

            {/* REPLAY BUTTON */}
            {!isTyping && (
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                onClick={startTyping}
                className="relative z-10 mt-5 px-6 py-2.5 rounded-full border border-[#f6d27a]/20 bg-[#f6d27a]/[0.07] text-[#f6d27a] text-[0.8rem] tracking-[2px] transition hover:bg-[#f6d27a]/[0.15] active:scale-95"
              >
                ✍️ Read again slowly
              </motion.button>
            )}
          </motion.div>

          {/* BOTTOM ORNAMENT outside card */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="mt-6 w-full max-w-[220px]"
          >
            <OrnamentDivider />
          </motion.div>

          {/* BOTTOM QUOTE */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
            className="mt-5 text-[#b48e97]/35 tracking-[4px] italic text-[0.7rem] sm:text-xs cormorant text-center"
          >
            — some feelings are too big for words —
          </motion.p>

          {/* GLOW DOT */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 2.5, duration: 1 }}
            className="mt-7 w-[10px] h-[10px] rounded-full bg-[#f6d27a] shadow-[0_0_18px_rgba(246,210,122,0.9),0_0_50px_rgba(246,210,122,0.4)]"
          />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="mt-16 flex mb-8 justify-center"
        >
          <HoldToNavigateButton
            label="Birthday Surprise"
            onComplete={() => goToPage("birthdayLock")}
          />
        </motion.div>
      </StarfieldBackground>
    </section>
  );
}
