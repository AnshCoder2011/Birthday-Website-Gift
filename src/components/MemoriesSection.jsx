import { useState, useEffect, useRef, useCallback } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
} from "framer-motion";

/* ─── DATA ────────────────────────────────────────────────────── */
const memories = [
  {
    id: 1,
    icon: "🌸",
    title: "Remember the First Meet?",
    text: "It was August, I'm not sure, It was your first day in the school of 7th grade when joined. I was happy to see a new classmate in our school but didn't thought it could turn to a sibling relation. 😂",
  },
  {
    id: 2,
    icon: "🎭",
    title: "First Conversation b/w Us?",
    text: "I'm not sure you remember this or not, but I think as you know I all time incharge of board decor (Of course I left now) I was pasting Bday slips then I asked your bday you said 25th feb, I thought Wow.",
  },
  {
    id: 3,
    icon: "🫶",
    title: "What was the day you became my Bhen?",
    text: "Yeah it was the day of picnic to Rangmanch Farms, we six were Sitting front and back, You, Arohi and Angel & Me, Shaurya, Snehil(but afterwards Vijayant came) 😂 and you know the next all moments, what all happened, haha, many secrets opened, and suddenly vijayant teasing and you said me first time as Bhaii. It's a memorable moment yeap.",
  },
  {
    id: 4,
    icon: "🌙",
    title: "The day I shared my Crush! but you betrayed 😔",
    text: "Yeap it was november I guess, I told you and Diya about my crush when you were really insisting me to tell, But WHEN I ASKED you never told, that's not fair at all !! I tell me secrets but you - Noo!, Ok just kidding.",
  },
  {
    id: 5,
    icon: "⭐",
    title: "The Last day! of beautiful 7th!",
    text: "Yeap the last day was in the jan, we all the classmates and friends exchanged the signs, papers notes and all, I and many wrote many ntoes in your pencil box, One I remember - Will meet in IIT B, like what the hell 😂 Currenly at stage of academics I am, I really don't think that I will be getting even NIT 😔, But you're a brilliant Student keep it up and Achieve your dreams. \n Ab saare Yaadein mein hi bataun kya you also share girl. Waise mujhe ab kuch khaas yaad nahi aara! 😜 ",
  },
];

/* ─── STAR-FIELD CANVAS ───────────────────────────────────────── */
function StarfieldCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let raf;
    let stars = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      stars = Array.from({ length: 140 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.3 + 0.2,
        a: Math.random(),
        speed: Math.random() * 0.004 + 0.001,
        phase: Math.random() * Math.PI * 2,
      }));
    };

    const draw = (t) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach((s) => {
        const a = s.a * (0.4 + 0.6 * Math.sin(t * s.speed * 0.001 + s.phase));
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(246,210,122,${a})`;
        ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener("resize", resize);
    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}

/* ─── MOUSE PARALLAX GLOW ─────────────────────────────────────── */
function ParallaxGlow() {
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);
  const sx = useSpring(x, { damping: 30, stiffness: 60 });
  const sy = useSpring(y, { damping: 30, stiffness: 60 });

  useEffect(() => {
    const move = (e) => {
      x.set(e.clientX / window.innerWidth);
      y.set(e.clientY / window.innerHeight);
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [x, y]);

  return (
    <motion.div
      className="fixed pointer-events-none"
      style={{
        width: 600,
        height: 600,
        borderRadius: "50%",
        background:
          "radial-gradient(circle, rgba(236,72,153,0.07), transparent 70%)",
        left: sx ? undefined : "50%",
        top: sy ? undefined : "30%",
        x: sx ? sx.get() * window.innerWidth - 300 : 0,
        y: sy ? sy.get() * window.innerHeight - 300 : 0,
        zIndex: 0,
      }}
    />
  );
}

/* ─── CONFETTI ────────────────────────────────────────────────── */
function launchConfetti() {
  const emojis = ["✦", "🌸", "⭐", "🌙", "💖", "✨", "🎉", "💫"];
  Array.from({ length: 40 }).forEach((_, i) => {
    setTimeout(() => {
      const el = document.createElement("div");
      el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      Object.assign(el.style, {
        position: "fixed",
        left: Math.random() * 100 + "vw",
        top: "-24px",
        fontSize: Math.random() * 10 + 12 + "px",
        zIndex: 99999,
        pointerEvents: "none",
        animation: `confettiFall ${Math.random() * 2 + 2.5}s linear forwards`,
        animationDelay: Math.random() * 0.6 + "s",
      });
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 5000);
    }, i * 55);
  });

  /* inject keyframes once */
  if (!document.getElementById("confetti-kf")) {
    const s = document.createElement("style");
    s.id = "confetti-kf";
    s.textContent = `@keyframes confettiFall{0%{opacity:1;transform:translateY(0) rotate(0deg)}100%{opacity:0;transform:translateY(105vh) rotate(720deg)}}`;
    document.head.appendChild(s);
  }
}

/* ─── STAR NODE ───────────────────────────────────────────────── */
function StarNode({ memory, discovered, onClick }) {
  return (
    <motion.button
      onClick={() => onClick(memory)}
      whileHover={{ scale: 1.15 }}
      whileTap={{ scale: 0.88 }}
      className="relative flex flex-col items-center gap-2 bg-transparent border-none cursor-pointer outline-none focus:outline-none"
      aria-label={discovered ? memory.title : "Hidden memory — tap to reveal"}
    >
      {/* pulse rings */}
      {!discovered && (
        <>
          <motion.div
            className="absolute rounded-full border pointer-events-none"
            style={{
              width: 50,
              height: 50,
              top: "50%",
              left: "50%",
              x: "-50%",
              y: "-50%",
              borderColor: "rgba(246,210,122,0.35)",
            }}
            animate={{ scale: [1, 2.2], opacity: [0.4, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeOut" }}
          />
          <motion.div
            className="absolute rounded-full border pointer-events-none"
            style={{
              width: 50,
              height: 50,
              top: "50%",
              left: "50%",
              x: "-50%",
              y: "-50%",
              borderColor: "rgba(246,210,122,0.2)",
            }}
            animate={{ scale: [1, 2.2], opacity: [0.3, 0] }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeOut",
              delay: 0.85,
            }}
          />
        </>
      )}
      {discovered && (
        <motion.div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: 50,
            height: 50,
            top: "50%",
            left: "50%",
            x: "-50%",
            y: "-50%",
            background:
              "radial-gradient(circle, rgba(255,255,255,0.2), transparent)",
          }}
          animate={{ scale: [1, 1.8], opacity: [0.6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
        />
      )}

      {/* the star */}
      <span
        className="text-[2rem] leading-none select-none relative z-10"
        style={{
          filter: discovered
            ? "drop-shadow(0 0 6px #fff) drop-shadow(0 0 20px #fff) drop-shadow(0 0 40px rgba(255,255,255,0.5))"
            : "drop-shadow(0 0 5px #f6d27a) drop-shadow(0 0 14px #f6d27a)",
          color: discovered ? "#fff" : "#f6d27a",
        }}
      >
        ✦
      </span>

      {/* label */}
      <span
        className="text-[11px] max-w-[78px] text-center leading-tight select-none"
        style={{
          fontFamily: "'Cormorant Garamond',serif",
          fontStyle: "italic",
          color: discovered
            ? "rgba(255,255,255,0.72)"
            : "rgba(246,210,122,0.38)",
        }}
      >
        {discovered
          ? memory.title.split(" ").slice(0, 3).join(" ") + "…"
          : "???"}
      </span>
    </motion.button>
  );
}

/* ─── MEMORY MODAL ────────────────────────────────────────────── */
function MemoryModal({ memory, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-[9999] flex items-end justify-center px-4 pb-6"
      style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(18px)" }}
    >
      <motion.div
        initial={{ y: 60, scale: 0.93, opacity: 0 }}
        animate={{ y: 0, scale: 1, opacity: 1 }}
        exit={{ y: 40, scale: 0.94, opacity: 0 }}
        transition={{
          duration: 0.42,
          type: "spring",
          stiffness: 220,
          damping: 26,
        }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm rounded-[28px] overflow-hidden"
        style={{
          background: "rgba(12,4,22,0.92)",
          border: "1px solid rgba(246,210,122,0.22)",
          backdropFilter: "blur(40px)",
        }}
      >
        {/* top gradient bar */}
        <div
          style={{
            height: 3,
            background:
              "linear-gradient(to right,transparent,#f6d27a 30%,#f8d8e6 60%,#f6d27a 80%,transparent)",
          }}
        />

        <div className="relative p-6">
          {/* inner glow */}
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-52 h-52 rounded-full pointer-events-none"
            style={{
              background:
                "radial-gradient(circle, rgba(246,210,122,0.07), transparent)",
              filter: "blur(40px)",
            }}
          />

          {/* badge */}
          <div className="flex items-center gap-3 mb-5 relative">
            <div
              className="w-10 h-10 rounded-[14px] flex items-center justify-center text-lg flex-shrink-0"
              style={{
                background: "rgba(246,210,122,0.1)",
                border: "1px solid rgba(246,210,122,0.2)",
              }}
            >
              {memory.icon}
            </div>
            <span className="text-[10px] text-[#f6d27a] uppercase tracking-[5px] font-medium">
              Memory Unlocked
            </span>
          </div>

          <h3 className="cormorant text-[1.75rem] font-semibold text-white leading-tight relative">
            {memory.title}
          </h3>
          <div
            className="mt-3 mb-5 w-11 h-[1px]"
            style={{
              background:
                "linear-gradient(to right,rgba(246,210,122,0.8),transparent)",
            }}
          />
          <p className="text-sm text-[#ecdde4] leading-[1.9] relative">
            {memory.text}
          </p>

          <button
            onClick={onClose}
            className="mt-6 w-full py-3.5 rounded-full text-[#f6d27a] text-[13px] tracking-wide transition-all duration-200 active:scale-95"
            style={{
              background: "rgba(246,210,122,0.07)",
              border: "1px solid rgba(246,210,122,0.18)",
            }}
          >
            ✦ &nbsp; Close Memory
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── HOLD-TO-NAVIGATE BUTTON ─────────────────────────────────── */
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

/* ─── MAIN COMPONENT ──────────────────────────────────────────── */
export default function MemoriesSection({ goToPage }) {
  const [active, setActive] = useState(null);
  const [discovered, setDiscovered] = useState(new Set());
  const allFound = discovered.size === memories.length;

  const openMemory = (memory) => {
    setActive(memory);
    if (!discovered.has(memory.id)) {
      const next = new Set(discovered);
      next.add(memory.id);
      setDiscovered(next);
      if (next.size === memories.length) setTimeout(launchConfetti, 500);
    }
  };

  return (
    <section className="relative min-h-screen overflow-hidden bg-[#07010f] py-24">
      <StarfieldCanvas />

      {/* ambient blobs */}
      <div className="fixed pointer-events-none" style={{ zIndex: 0 }}>
        <div
          className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[520px] h-[520px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(236,72,153,0.06), transparent 70%)",
          }}
        />
        <div
          className="absolute bottom-0 right-[-80px] w-[360px] h-[360px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(246,210,122,0.05), transparent 70%)",
          }}
        />
        <div
          className="absolute top-[40%] left-[-80px] w-[280px] h-[280px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(139,92,246,0.06), transparent 70%)",
          }}
        />
      </div>

      <div className="relative z-20 max-w-md mx-auto px-6">
        {/* ── HEADING ── */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.85 }}
          className="text-center"
        >
          <span className="block text-[#f6d27a] text-[10px] tracking-[10px] uppercase font-medium mb-5 opacity-80">
            Chapter II
          </span>
          <h2>
            <span
              className="cormorant block text-[3.6rem] font-bold text-white leading-none"
              style={{ textShadow: "0 0 60px rgba(246,210,122,0.12)" }}
            >
              Constellation
            </span>
            <span
              className="cormorant block text-[3.6rem] italic text-[#f8d8e6] leading-none mt-1"
              style={{ textShadow: "0 0 60px rgba(248,216,230,0.15)" }}
            >
              of Memories
            </span>
          </h2>
          {/* decorative rule */}
          <div className="flex items-center justify-center gap-2 mt-4">
            <div
              className="h-[1px] w-10"
              style={{
                background:
                  "linear-gradient(to right,transparent,rgba(246,210,122,0.5))",
              }}
            />
            <div className="w-[5px] h-[5px] rounded-full bg-[#f6d27a] opacity-70" />
            <div className="h-[1px] w-16 bg-[rgba(246,210,122,0.5)]" />
            <div className="w-[5px] h-[5px] rounded-full bg-[#f6d27a] opacity-70" />
            <div
              className="h-[1px] w-10"
              style={{
                background:
                  "linear-gradient(to left,transparent,rgba(246,210,122,0.5))",
              }}
            />
          </div>
        </motion.div>

        {/* ── COUNTER + HINT PILLS ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.35 }}
          className="flex flex-col items-center gap-3 mt-8"
        >
          <div
            className="flex items-center gap-2 px-5 py-2.5 rounded-full text-[#ecdde4] text-[13px]"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.1)",
              backdropFilter: "blur(20px)",
            }}
          >
            Memories Unlocked:
            <motion.span
              key={discovered.size}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 400 }}
              className="text-[#f6d27a] font-semibold ml-1"
            >
              {discovered.size}/{memories.length}
            </motion.span>
            {allFound && (
              <motion.span
                initial={{ opacity: 0, x: 6 }}
                animate={{ opacity: 1, x: 0 }}
                className="ml-1 text-[#f6d27a]"
              >
                ✨
              </motion.span>
            )}
          </div>

          <div
            className="flex items-center gap-2.5 px-5 py-2.5 rounded-full text-[#f6d27a] text-[12px] tracking-wide"
            style={{
              border: "1px solid rgba(246,210,122,0.2)",
              background: "rgba(246,210,122,0.05)",
            }}
          >
            <motion.span
              animate={{ rotate: [0, 20, -20, 0], scale: [1, 1.2, 1] }}
              transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 2 }}
            >
              ✦
            </motion.span>
            Tap the stars to unlock memories
            <motion.span
              animate={{ rotate: [0, -20, 20, 0], scale: [1, 1.2, 1] }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                repeatDelay: 2,
                delay: 0.4,
              }}
            >
              ✦
            </motion.span>
          </div>
        </motion.div>

        {/* ── CONSTELLATION ── */}
        <div
          className="relative mt-24"
          style={{ height: memories.length * 165 + 40 }}
        >
          {/* glow line */}
          <div
            className="absolute left-1/2 top-0 bottom-0 -translate-x-1/2"
            style={{
              width: 1,
              background:
                "linear-gradient(to bottom,transparent,rgba(246,210,122,0.3) 15%,rgba(246,210,122,0.3) 85%,transparent)",
            }}
          />
          <div
            className="absolute left-1/2 top-0 bottom-0 -translate-x-1/2"
            style={{
              width: 3,
              background:
                "linear-gradient(to bottom,transparent,rgba(246,210,122,0.07) 15%,rgba(246,210,122,0.07) 85%,transparent)",
              filter: "blur(3px)",
            }}
          />

          {memories.map((mem, i) => {
            const left = i % 2 === 0;
            const isDisc = discovered.has(mem.id);
            const topPx = i * 165;

            return (
              <motion.div
                key={mem.id}
                initial={{ opacity: 0, scale: 0, rotate: -30 }}
                whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                viewport={{ once: true }}
                transition={{
                  delay: i * 0.15,
                  duration: 0.7,
                  type: "spring",
                  stiffness: 160,
                }}
                className={`absolute flex items-flex-start ${left ? "left-6" : "right-6"}`}
                style={{ top: topPx }}
              >
                {/* dot on center line */}
                <div
                  className="absolute"
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    background: "#07010f",
                    border: "1px solid rgba(246,210,122,0.5)",
                    top: 18,
                    left: left ? "calc(100% + 55px)" : "auto",
                    right: !left ? "calc(100% + 55px)" : "auto",
                  }}
                />

                {/* connector */}
                <div
                  className="absolute"
                  style={{
                    height: 1,
                    width: 58,
                    top: 21,
                    left: left ? "100%" : "auto",
                    right: !left ? "100%" : "auto",
                    background: isDisc
                      ? "linear-gradient(to right, rgba(255,255,255,0.4), rgba(246,210,122,0.15))"
                      : "linear-gradient(to right, rgba(246,210,122,0.18), rgba(246,210,122,0.05))",
                    transform: left ? "none" : "scaleX(-1)",
                  }}
                />

                <StarNode
                  memory={mem}
                  discovered={isDisc}
                  onClick={openMemory}
                />
              </motion.div>
            );
          })}
        </div>

        {/* ── ALL FOUND ── */}
        <AnimatePresence>
          {allFound && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mt-10 flex flex-col items-center gap-6"
            >
              <div
                className="w-full rounded-3xl p-6 text-center"
                style={{
                  border: "1px solid rgba(246,210,122,0.2)",
                  background: "rgba(246,210,122,0.04)",
                  backdropFilter: "blur(20px)",
                }}
              >
                <div className="text-[2rem] mb-3">🌙</div>
                <p className="cormorant text-xl italic text-white">
                  Every memory found.
                </p>
                <p className="cormorant text-lg italic text-[#f8d8e6] mt-1">
                  The sky feels a little brighter now.
                </p>
              </div>
              <HoldToNavigateButton
                label="Chat Section"
                onComplete={() => goToPage?.("chat")}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* bottom quote */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="cormorant text-center text-[13px] italic mt-14 mb-4"
          style={{ color: "rgba(246,210,122,0.45)" }}
        >
          The best memories are the ones still waiting to happen ✨
        </motion.p>
      </div>

      {/* ── MODAL ── */}
      <AnimatePresence>
        {active && (
          <MemoryModal memory={active} onClose={() => setActive(null)} />
        )}
      </AnimatePresence>
    </section>
  );
}
