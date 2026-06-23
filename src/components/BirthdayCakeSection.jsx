import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Float } from "@react-three/drei";
import confetti from "canvas-confetti";
import { CakeSlice, Sparkles, Music2, Volume2, VolumeX } from "lucide-react";
import StarfieldBackground from "./StarfieldBackground";

/* =========================================
   MAIN PAGE
   Mobile-first: every base (unprefixed) class targets a ~360–390px
   phone. sm:/lg: only ADD size, never establish it. Order in the DOM
   is the mobile reading order — no order-swap hacks needed.
========================================= */
export default function BirthdayCakeSection({ goToPage }) {
  const [blown, setBlown] = useState(false);
  const [showWishText, setShowWishText] = useState(false);
  const [musicOn, setMusicOn] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    if (blown) {
      const t = setTimeout(() => setShowWishText(true), 1200);
      return () => clearTimeout(t);
    }
  }, [blown]);

  const handlePlayMusic = async () => {
    try {
      if (!audioRef.current) return;
      if (!musicOn) {
        audioRef.current.volume = 0.55;
        await audioRef.current.play();
        setMusicOn(true);
      } else {
        audioRef.current.pause();
        setMusicOn(false);
      }
    } catch (err) {
      console.log("Audio play blocked until user interaction:", err);
    }
  };

  const handleBlowCandles = () => {
    if (blown) return;
    setBlown(true);

    if (audioRef.current && audioRef.current.paused) {
      audioRef.current.volume = 0.55;
      audioRef.current.play().catch(() => {});
      setMusicOn(true);
    }

    launchConfetti();
  };

  return (
    <section className="relative min-h-screen overflow-hidden bg-[#060109] py-10 sm:py-16 lg:py-20">
      <audio ref={audioRef} src="/birthday-song.mp3" loop />

      <StarfieldBackground>
        {/* BACKGROUND LAYERS — gold is the only glow color now; pink is reserved for the name only */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(246,210,122,0.07),transparent_34%),radial-gradient(circle_at_bottom,rgba(246,210,122,0.05),transparent_30%)]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[320px] h-[320px] sm:w-[480px] sm:h-[480px] lg:w-[620px] lg:h-[620px] rounded-full bg-[#f6d27a]/[0.06] blur-[120px] sm:blur-[150px] lg:blur-[180px]" />
        <div className="absolute bottom-[-80px] left-1/2 -translate-x-1/2 w-[280px] h-[280px] sm:w-[420px] sm:h-[420px] lg:w-[520px] lg:h-[520px] rounded-full bg-[#f6d27a]/[0.06] blur-[120px] sm:blur-[150px] lg:blur-[180px]" />

        {/* fine vignette so the corners read darker and richer, like a printed invitation card */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(0,0,0,0.45)_100%)]" />

        {/* a few quiet gold motes — restrained, not scattered confetti-of-stars */}
        {[...Array(7)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute hidden h-[3px] w-[3px] rounded-full bg-[#f6d27a] sm:block"
            initial={{ opacity: 0.15 }}
            animate={{ opacity: [0.15, 0.65, 0.15], y: [0, -10, 0] }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              delay: i * 0.6,
              ease: "easeInOut",
            }}
            style={{
              left: `${10 + ((i * 13) % 80)}%`,
              top: `${12 + ((i * 17) % 72)}%`,
              boxShadow: "0 0 8px rgba(246,210,122,0.8)",
            }}
          />
        ))}

        <div className="relative z-20 mx-auto flex min-h-screen max-w-6xl flex-col px-4 sm:px-6 lg:px-10">
          {/* TOP BAR */}
          <div className="flex items-center justify-between pt-1 sm:pt-4">
            <motion.div
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="inline-flex items-center gap-1.5 rounded-full border border-[#f6d27a]/[0.22] bg-white/[0.03] px-3 py-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-xl sm:gap-2 sm:px-4 sm:py-2"
            >
              <Sparkles
                size={12}
                className="shrink-0 text-[#f6d27a] sm:size-[14px]"
              />
              <span className="whitespace-nowrap text-[9px] uppercase tracking-[3px] text-[#f6d27a]/90 ubuntu-medium sm:text-[10px] sm:tracking-[4px] sm:text-xs">
                Chapter IV
              </span>
            </motion.div>

            <motion.button
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              onClick={handlePlayMusic}
              aria-label={musicOn ? "Pause music" : "Play music"}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#f6d27a]/[0.22] bg-white/[0.03] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-xl transition hover:scale-105 hover:border-[#f6d27a]/40 sm:h-12 sm:w-12"
            >
              {musicOn ? (
                <Volume2 className="text-[#f6d27a]" size={18} />
              ) : (
                <VolumeX className="text-[#f6d27a]/70" size={18} />
              )}
            </motion.button>
          </div>

          {/* MAIN CONTENT — mobile-first DOM order: text -> cake. No order-* swapping. */}
          <div className="flex flex-1 flex-col items-center gap-8 py-6 sm:gap-10 sm:py-8 lg:grid lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-12 lg:py-10">
            {/* TEXT SIDE */}
            <div className="flex w-full max-w-2xl flex-col items-center text-center lg:items-start lg:text-left">
              <motion.p
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.15 }}
                className="mb-3 flex items-center gap-2.5 text-[10px] uppercase tracking-[3px] text-[#cfa75e] ubuntu-medium sm:mb-4 sm:text-xs sm:tracking-[5px]"
              >
                <span className="h-[1px] w-5 bg-[#cfa75e]/50 sm:w-7" />
                A Day Written In Gold
                <span className="h-[1px] w-5 bg-[#cfa75e]/50 sm:w-7" />
              </motion.p>

              <motion.h1
                initial={{ opacity: 0, y: 35 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.25 }}
                className="cormorant text-[2.5rem] font-semibold leading-[1] text-[#fff2f7] sm:text-[3.6rem] sm:leading-[0.95] lg:text-[5.2rem]"
              >
                Happy Birthday,
                <span
                  className="mt-1 block italic text-[#ffe0ec] sm:mt-2"
                  style={{
                    textShadow:
                      "0 0 28px rgba(246,210,122,0.35), 0 0 60px rgba(255,143,198,0.15)",
                  }}
                >
                  Amayra
                </span>
              </motion.h1>

              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "140px" }}
                transition={{ duration: 1, delay: 0.55 }}
                className="relative mt-5 h-[2px] bg-gradient-to-r from-[#f6d27a] via-[#f6d27a] to-transparent sm:mt-7 sm:w-[180px] lg:from-[#f6d27a] lg:via-[#f6d27a]/60 lg:to-transparent"
              >
                <span className="absolute -left-1 -top-[3px] h-2 w-2 rounded-full bg-[#f6d27a] shadow-[0_0_10px_rgba(246,210,122,0.9)] lg:left-0" />
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.7 }}
                className="mt-5 max-w-xl text-[0.95rem] leading-7 text-[#e7d8df] sm:mt-7 sm:text-[1.08rem] sm:leading-8 lg:text-[1.15rem]"
              >
                Today isn't just another date — it's the day the world got a
                little softer, prettier, and a lot more magical because{" "}
                <span className="text-[#f6d27a]">you</span> were born.
              </motion.p>

              {/* SIGNATURE CARD — foil-stamped invitation treatment: double border + corner marks, no shimmer */}
              <motion.div
                initial={{ opacity: 0, y: 35 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.95, delay: 0.9 }}
                className="relative mt-6 w-full max-w-[540px] rounded-[18px] border border-[#f6d27a]/[0.28] bg-gradient-to-b from-white/[0.05] to-white/[0.02] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_20px_60px_-20px_rgba(0,0,0,0.6)] backdrop-blur-[24px] sm:mt-8 sm:rounded-[20px] sm:p-7"
              >
                {/* inner hairline, set back from the edge — the "foil stamp" frame */}
                <div className="pointer-events-none absolute inset-[6px] rounded-[13px] border border-[#f6d27a]/[0.18] sm:inset-[10px] sm:rounded-[15px]" />

                {/* corner marks */}
                {[
                  "top-2 left-2 border-t border-l sm:top-3 sm:left-3",
                  "top-2 right-2 border-t border-r sm:top-3 sm:right-3",
                  "bottom-2 left-2 border-b border-l sm:bottom-3 sm:left-3",
                  "bottom-2 right-2 border-b border-r sm:bottom-3 sm:right-3",
                ].map((pos, i) => (
                  <span
                    key={i}
                    className={`pointer-events-none absolute h-3 w-3 border-[#f6d27a]/60 sm:h-4 sm:w-4 ${pos}`}
                  />
                ))}

                <div className="relative z-10">
                  <div className="flex items-center justify-center gap-2 lg:justify-start">
                    <CakeSlice size={15} className="shrink-0 text-[#f6d27a]" />
                    <p className="text-[9px] uppercase tracking-[3px] text-[#cfa75e] ubuntu-medium sm:text-[10px] sm:tracking-[4px] sm:text-xs">
                      Make a wish
                    </p>
                  </div>

                  <p className="mt-3 cormorant text-[1.05rem] italic leading-[1.45] text-[#fff2f7] sm:mt-4 sm:text-[1.35rem] sm:leading-9 lg:text-[1.5rem]">
                    Hold the moment. Play the song. Then tap the button below to
                    blow out the candles and make this page come alive ✨
                  </p>
                </div>
              </motion.div>

              {/* ACTION BUTTONS — full width stack on phone, side-by-side from sm: up */}
              <motion.div
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 1.05 }}
                className="mt-6 flex w-full flex-col items-stretch gap-3 sm:mt-8 sm:flex-row sm:items-center sm:justify-center sm:gap-4 lg:justify-start"
              >
                <button
                  onClick={handleBlowCandles}
                  disabled={blown}
                  className={`group relative inline-flex w-full items-center justify-center gap-3 overflow-hidden rounded-full px-6 py-3.5 text-[0.9rem] tracking-[0.5px] transition duration-300 sm:w-auto sm:min-w-[230px] sm:px-7 sm:py-4 sm:text-[0.95rem] sm:tracking-[1px] ${
                    blown
                      ? "border border-[#f6d27a]/15 bg-[#f6d27a]/8 text-[#f0dca4]"
                      : "border border-[#f6d27a]/40 bg-gradient-to-b from-[#f6d27a]/25 to-[#f6d27a]/[0.08] text-[#fff2f7] shadow-[0_8px_24px_-8px_rgba(246,210,122,0.45)] hover:scale-[1.02] hover:shadow-[0_10px_30px_-6px_rgba(246,210,122,0.6)] active:scale-[0.99]"
                  }`}
                >
                  <span className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(circle_at_top,rgba(246,210,122,0.22),transparent_60%)] opacity-90" />
                  <span className="relative z-10 flex items-center gap-2.5 sm:gap-3">
                    <span className="h-2 w-2 shrink-0 rounded-full bg-[#f6d27a] shadow-[0_0_14px_rgba(246,210,122,0.95)] sm:h-2.5 sm:w-2.5" />
                    <span className="cormorant text-[1.05rem] italic sm:text-[1.2rem]">
                      {blown ? "Wish Made ✨" : "Blow The Candles"}
                    </span>
                  </span>
                </button>

                <button
                  onClick={handlePlayMusic}
                  className="inline-flex w-full items-center justify-center gap-3 rounded-full border border-[#f6d27a]/[0.18] bg-white/[0.03] px-6 py-3.5 text-[#f8d8e6] backdrop-blur-xl transition hover:scale-[1.02] hover:border-[#f6d27a]/35 active:scale-[0.99] sm:w-auto sm:min-w-[180px] sm:py-4"
                >
                  <Music2 size={17} className="shrink-0 text-[#f6d27a]" />
                  <span className="cormorant text-[1.05rem] italic sm:text-[1.15rem]">
                    {musicOn ? "Pause Song" : "Play Song"}
                  </span>
                </button>
              </motion.div>

              {/* WISH TEXT — same foil-frame language as the signature card above, for visual consistency */}
              <AnimatePresence>
                {showWishText && (
                  <motion.div
                    initial={{ opacity: 0, y: 24, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8 }}
                    className="mt-6 w-full max-w-[540px] sm:mt-8"
                  >
                    <div className="flex flex-col items-center lg:items-start">
                      <div className="flex items-center gap-2">
                        <span className="h-[1px] w-8 bg-gradient-to-r from-[#f6d27a] to-transparent sm:w-12" />
                        <Sparkles size={12} className="text-[#f6d27a]" />
                      </div>
                      <p className="relative mt-4 rounded-[16px] border border-[#f6d27a]/[0.25] bg-gradient-to-b from-[#f6d27a]/[0.07] to-transparent px-5 py-4 text-center cormorant text-[1.02rem] italic leading-[1.5] text-[#fff2f7] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-xl sm:mt-5 sm:rounded-[18px] sm:px-7 sm:py-5 sm:text-[1.35rem] sm:leading-[1.6] lg:text-left lg:text-[1.5rem]">
                        May this year bring you the kind of happiness that
                        stays, the kind of laughter that echoes, and the kind of
                        magic that feels like you 💛
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* 3D CAKE SIDE */}
            <motion.div
              initial={{ opacity: 0, y: 35, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 1, delay: 0.35 }}
              className="flex w-full max-w-[400px] flex-col items-center sm:max-w-[480px] lg:max-w-[560px]"
            >
              <div className="relative w-full overflow-hidden rounded-[26px] border border-[#f6d27a]/[0.22] bg-white/[0.03] shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_30px_80px_-20px_rgba(0,0,0,0.7)] backdrop-blur-[26px] sm:rounded-[32px]">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(246,210,122,0.05),transparent_60%)]" />
                <div className="pointer-events-none absolute inset-x-6 top-0 h-[1px] bg-gradient-to-r from-transparent via-[#f6d27a]/50 to-transparent" />

                <div className="relative z-10 h-[300px] w-full sm:h-[400px] lg:h-[480px]">
                  <Canvas camera={{ position: [0, 3.8, 8.5], fov: 42 }}>
                    <ambientLight intensity={1.15} />
                    <directionalLight
                      position={[5, 8, 5]}
                      intensity={1.8}
                      color="#fff4d6"
                    />
                    <pointLight
                      position={[-4, 5, 4]}
                      intensity={1.2}
                      color="#ffb3d8"
                    />
                    <pointLight
                      position={[0, 6, -4]}
                      intensity={0.8}
                      color="#f6d27a"
                    />

                    <Float
                      speed={1.7}
                      rotationIntensity={0.12}
                      floatIntensity={0.4}
                    >
                      <BirthdayCake3D blown={blown} />
                    </Float>

                    <OrbitControls
                      enableZoom={false}
                      enablePan={false}
                      minPolarAngle={Math.PI / 2.35}
                      maxPolarAngle={Math.PI / 2.05}
                      autoRotate
                      autoRotateSpeed={0.65}
                    />
                  </Canvas>
                </div>

                {/* bottom overlay — aligned with the foil-card language used above */}
                <div className="relative z-10 px-3.5 pb-3.5 sm:px-6 sm:pb-6">
                  <div className="rounded-[16px] border border-[#f6d27a]/[0.18] bg-black/25 px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] backdrop-blur-xl sm:rounded-[20px] sm:px-5 sm:py-4">
                    <div className="flex flex-col items-center justify-between gap-2.5 sm:flex-row sm:gap-3">
                      <div className="text-center sm:text-left">
                        <p className="text-[9px] uppercase tracking-[3px] text-[#cfa75e] ubuntu-medium sm:text-[10px] sm:tracking-[4px] sm:text-xs">
                          Birthday Ritual
                        </p>
                        <p className="mt-1.5 cormorant text-[0.95rem] italic leading-snug text-[#fff2f7] sm:mt-2 sm:text-[1.2rem] lg:text-[1.3rem]">
                          {blown
                            ? "The candles are out. The wish is yours now ✨"
                            : "Tap the button and blow out the candles 🎂"}
                        </p>
                      </div>

                      <div className="flex shrink-0 items-center gap-2">
                        {[1, 2, 3].map((i) => (
                          <span
                            key={i}
                            className={`h-2 w-2 rounded-full transition-colors duration-500 sm:h-2.5 sm:w-2.5 ${
                              blown
                                ? "bg-white/35"
                                : "bg-[#f6d27a] shadow-[0_0_14px_rgba(246,210,122,0.95)]"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {blown && (
                <motion.div
                  initial={{ opacity: 0, y: 25 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.35 }}
                  className="mt-6 w-full sm:mt-7 sm:w-auto"
                >
                  <button
                    onClick={() => goToPage && goToPage("hero")}
                    className="w-full rounded-full border border-[#f6d27a]/40 bg-gradient-to-b from-[#f6d27a]/20 to-[#f6d27a]/[0.06] px-7 py-3.5 text-[#fff2f7] shadow-[0_8px_24px_-8px_rgba(246,210,122,0.4)] backdrop-blur-xl transition hover:scale-[1.02] hover:shadow-[0_10px_30px_-6px_rgba(246,210,122,0.55)] active:scale-[0.99] sm:w-auto sm:px-8 sm:py-4"
                  >
                    <span className="cormorant text-[1.05rem] italic sm:text-[1.2rem]">
                      Continue the Night →
                    </span>
                  </button>
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      </StarfieldBackground>
    </section>
  );
}

/* =========================================
   3D CAKE MODEL — unchanged geometry, only the host card size changed
========================================= */
function BirthdayCake3D({ blown }) {
  const flameScale = blown ? 0 : 1;

  return (
    <group position={[0, -1.25, 0]}>
      <mesh position={[0, -1.4, 0]} receiveShadow>
        <cylinderGeometry args={[3.2, 3.35, 0.28, 64]} />
        <meshStandardMaterial
          color="#e7d6db"
          metalness={0.15}
          roughness={0.45}
        />
      </mesh>

      <mesh position={[0, -1.25, 0]}>
        <torusGeometry args={[2.55, 0.08, 16, 100]} />
        <meshStandardMaterial color="#d2bcc4" metalness={0.1} roughness={0.6} />
      </mesh>

      <mesh position={[0, -0.6, 0]} castShadow>
        <cylinderGeometry args={[2.45, 2.55, 1.15, 64]} />
        <meshStandardMaterial color="#ffd6e6" roughness={0.92} />
      </mesh>

      <mesh position={[0, -0.03, 0]}>
        <torusGeometry args={[2.2, 0.12, 18, 100]} />
        <meshStandardMaterial color="#fff5f8" roughness={0.9} />
      </mesh>

      <mesh position={[0, 0.5, 0]} castShadow>
        <cylinderGeometry args={[1.9, 2.0, 0.95, 64]} />
        <meshStandardMaterial color="#fff1c9" roughness={0.88} />
      </mesh>

      <mesh position={[0, 1.05, 0]}>
        <cylinderGeometry args={[1.68, 1.7, 0.2, 64]} />
        <meshStandardMaterial color="#fff8fb" roughness={0.82} />
      </mesh>

      {Array.from({ length: 10 }).map((_, i) => {
        const angle = (i / 10) * Math.PI * 2;
        const x = Math.cos(angle) * 1.45;
        const z = Math.sin(angle) * 1.45;
        return (
          <mesh key={i} position={[x, 1.18, z]} castShadow>
            <sphereGeometry args={[0.14, 24, 24]} />
            <meshStandardMaterial color="#fff5f8" roughness={0.88} />
          </mesh>
        );
      })}

      {Array.from({ length: 6 }).map((_, i) => {
        const angle = (i / 6) * Math.PI * 2 + 0.35;
        const x = Math.cos(angle) * 1.08;
        const z = Math.sin(angle) * 1.08;
        return (
          <mesh key={`berry-${i}`} position={[x, 1.21, z]}>
            <sphereGeometry args={[0.09, 20, 20]} />
            <meshStandardMaterial color="#ff7eb6" roughness={0.6} />
          </mesh>
        );
      })}

      <mesh position={[0, 1.25, 0]} rotation={[-0.18, 0, 0]}>
        <boxGeometry args={[1.25, 0.18, 0.8]} />
        <meshStandardMaterial
          color="#f6d27a"
          roughness={0.55}
          metalness={0.15}
        />
      </mesh>

      <Candle
        position={[-0.75, 1.48, -0.1]}
        blown={blown}
        flameScale={flameScale}
        color="#ff8ac0"
      />
      <Candle
        position={[0, 1.58, 0.08]}
        blown={blown}
        flameScale={flameScale}
        color="#f6d27a"
      />
      <Candle
        position={[0.75, 1.48, -0.06]}
        blown={blown}
        flameScale={flameScale}
        color="#ffc4d9"
      />
    </group>
  );
}

function Candle({ position, blown, flameScale, color = "#f6d27a" }) {
  return (
    <group position={position}>
      <mesh castShadow>
        <cylinderGeometry args={[0.1, 0.1, 0.75, 32]} />
        <meshStandardMaterial color={color} roughness={0.55} />
      </mesh>

      <mesh position={[0, 0.1, 0]}>
        <torusGeometry args={[0.103, 0.012, 10, 40]} />
        <meshStandardMaterial color="#fff7fb" roughness={0.45} />
      </mesh>
      <mesh position={[0, -0.12, 0]}>
        <torusGeometry args={[0.103, 0.012, 10, 40]} />
        <meshStandardMaterial color="#fff7fb" roughness={0.45} />
      </mesh>

      <mesh position={[0, 0.45, 0]}>
        <cylinderGeometry args={[0.01, 0.01, 0.08, 10]} />
        <meshStandardMaterial color="#2f1b14" />
      </mesh>

      <AnimateFlame blown={blown} scale={flameScale} />
    </group>
  );
}

function AnimateFlame({ blown, scale }) {
  const groupRef = useRef();
  const emberPositions = useMemo(
    () => [
      [-0.06, 0.68, 0],
      [0.04, 0.74, 0.03],
      [0.08, 0.7, -0.03],
      [-0.03, 0.78, -0.02],
    ],
    [],
  );

  useEffect(() => {
    let raf;
    let start;

    const loop = (t) => {
      if (!groupRef.current) return;
      if (!start) start = t;
      const elapsed = (t - start) / 1000;

      if (!blown) {
        groupRef.current.position.y = 0.52 + Math.sin(elapsed * 6) * 0.03;
        groupRef.current.rotation.z = Math.sin(elapsed * 4) * 0.08;
        groupRef.current.scale.setScalar(1 + Math.sin(elapsed * 7) * 0.06);
      }

      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [blown]);

  return (
    <group ref={groupRef} position={[0, 0.52, 0]} scale={scale}>
      {!blown && (
        <>
          <mesh>
            <sphereGeometry args={[0.08, 20, 20]} />
            <meshStandardMaterial
              color="#fff7c2"
              emissive="#ffdb63"
              emissiveIntensity={2.8}
            />
          </mesh>

          <mesh position={[0, 0.09, 0]} scale={[0.85, 1.45, 0.85]}>
            <sphereGeometry args={[0.08, 20, 20]} />
            <meshStandardMaterial
              color="#ff9f43"
              emissive="#ff9f43"
              emissiveIntensity={2.2}
            />
          </mesh>

          {emberPositions.map((pos, i) => (
            <motion.mesh
              key={i}
              position={pos}
              animate={{
                y: [pos[1], pos[1] + 0.08, pos[1]],
                opacity: [0.5, 1, 0.4],
              }}
              transition={{
                duration: 1.2 + i * 0.25,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <sphereGeometry args={[0.02, 12, 12]} />
              <meshStandardMaterial
                color="#ffd27f"
                emissive="#ffcf66"
                emissiveIntensity={2}
              />
            </motion.mesh>
          ))}
        </>
      )}
    </group>
  );
}

/* =========================================
   CONFETTI
========================================= */
function launchConfetti() {
  const duration = 2600;
  const animationEnd = Date.now() + duration;

  const defaults = {
    startVelocity: 28,
    spread: 360,
    ticks: 80,
    zIndex: 9999,
    colors: ["#f6d27a", "#e8b563", "#fff2f7", "#ffd6e6"],
  };

  const randomInRange = (min, max) => Math.random() * (max - min) + min;

  const interval = setInterval(() => {
    const timeLeft = animationEnd - Date.now();
    if (timeLeft <= 0) return clearInterval(interval);

    const particleCount = 32 * (timeLeft / duration);

    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.1, 0.3), y: -0.05 },
    });
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.7, 0.9), y: -0.05 },
    });
  }, 220);

  confetti({
    particleCount: 140,
    spread: 110,
    startVelocity: 38,
    zIndex: 9999,
    origin: { x: 0.5, y: 0.18 },
    colors: ["#f6d27a", "#e8b563", "#fff2f7", "#ffd6e6"],
  });
}
