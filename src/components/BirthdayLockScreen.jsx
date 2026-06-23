import { forwardRef, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, LockOpen, Sparkles } from "lucide-react";
import StarfieldBackground from "./StarfieldBackground";

/* =========================================
   BIRTHDAY LOCK SCREEN
   Sits between the Letter Section's "hold to reveal" button and
   BirthdayCakeSection. She must enter the correct DD/MM. On a match,
   plays a short unlock animation, then calls onUnlock() so the
   parent can swap in <BirthdayCakeSection />.

   Visual language matches BirthdayCakeSection: #060109 void bg,
   gold-only glow, foil-stamped card frame — same site, same system.
========================================= */
export default function BirthdayLockScreen({
  correctDay,    // number, e.g. 14
  correctMonth,  // number, e.g. 3
  onUnlock,      // called once, after the unlock animation finishes
  recipientName = "Amayra",
}) {
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [status, setStatus] = useState("idle"); // idle | error | success
  const [attempts, setAttempts] = useState(0);

  const dayRef = useRef(null);
  const monthRef = useRef(null);

  useEffect(() => {
    dayRef.current?.focus();
  }, []);

  const sanitize = (val, max) => {
    const digits = val.replace(/\D/g, "").slice(0, 2);
    if (digits.length === 2 && Number(digits) > max) return digits[0];
    return digits;
  };

  const handleDayChange = (e) => {
    const v = sanitize(e.target.value, 31);
    setDay(v);
    setStatus("idle");
    if (v.length === 2) monthRef.current?.focus();
  };

  const handleMonthChange = (e) => {
    const v = sanitize(e.target.value, 12);
    setMonth(v);
    setStatus("idle");
  };

  const handleMonthKeyDown = (e) => {
    if (e.key === "Backspace" && month === "") {
      dayRef.current?.focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (status === "success") return;

    const d = Number(day);
    const m = Number(month);

    if (!day || !month) {
      triggerError();
      return;
    }

    if (d === correctDay && m === correctMonth) {
      setStatus("success");
      // small pause to let the lock-opening animation play before handing off
      setTimeout(() => {
        onUnlock && onUnlock();
      }, 1450);
    } else {
      triggerError();
    }
  };

  const triggerError = () => {
    setStatus("error");
    setAttempts((a) => a + 1);
    setTimeout(() => setStatus("idle"), 600);
  };

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#060109] px-4 py-10 sm:px-6">
      <StarfieldBackground>
        {/* BACKGROUND LAYERS — same gold-only system as the cake section */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(246,210,122,0.07),transparent_34%),radial-gradient(circle_at_bottom,rgba(246,210,122,0.05),transparent_30%)]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[320px] h-[320px] sm:w-[480px] sm:h-[480px] rounded-full bg-[#f6d27a]/[0.06] blur-[120px] sm:blur-[150px]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(0,0,0,0.45)_100%)]" />

        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute hidden h-[3px] w-[3px] rounded-full bg-[#f6d27a] sm:block"
            initial={{ opacity: 0.15 }}
            animate={{ opacity: [0.15, 0.65, 0.15], y: [0, -10, 0] }}
            transition={{ duration: 4 + i, repeat: Infinity, delay: i * 0.6, ease: "easeInOut" }}
            style={{
              left: `${12 + ((i * 15) % 76)}%`,
              top: `${14 + ((i * 19) % 70)}%`,
              boxShadow: "0 0 8px rgba(246,210,122,0.8)",
            }}
          />
        ))}

        <div className="relative z-20 flex w-full flex-col items-center">
          <AnimatePresence mode="wait">
            {status !== "success" ? (
              <motion.div
                key="lock-form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16, transition: { duration: 0.4 } }}
                className="w-full max-w-[420px]"
              >
                <motion.div
                  animate={
                    status === "error"
                      ? { x: [0, -10, 10, -8, 8, -4, 4, 0] }
                      : { x: 0 }
                  }
                  transition={{ duration: 0.45 }}
                  className="relative rounded-[20px] border border-[#f6d27a]/[0.28] bg-gradient-to-b from-white/[0.05] to-white/[0.02] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_20px_60px_-20px_rgba(0,0,0,0.6)] backdrop-blur-[24px] sm:p-8"
                >
                  {/* foil inner frame, same language as the cake section's signature card */}
                  <div className="pointer-events-none absolute inset-[8px] rounded-[15px] border border-[#f6d27a]/[0.18] sm:inset-[10px] sm:rounded-[17px]" />
                  {[
                    "top-2.5 left-2.5 border-t border-l sm:top-3 sm:left-3",
                    "top-2.5 right-2.5 border-t border-r sm:top-3 sm:right-3",
                    "bottom-2.5 left-2.5 border-b border-l sm:bottom-3 sm:left-3",
                    "bottom-2.5 right-2.5 border-b border-r sm:bottom-3 sm:right-3",
                  ].map((pos, i) => (
                    <span
                      key={i}
                      className={`pointer-events-none absolute h-3.5 w-3.5 border-[#f6d27a]/60 ${pos}`}
                    />
                  ))}

                  <div className="relative z-10 flex flex-col items-center text-center">
                    {/* lock icon — closed, with a soft gold ring */}
                    <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[#f6d27a]/30 bg-[#f6d27a]/[0.08] shadow-[0_0_24px_-4px_rgba(246,210,122,0.4)] sm:h-16 sm:w-16">
                      <Lock size={22} className="text-[#f6d27a] sm:size-[26px]" strokeWidth={1.6} />
                    </div>

                    <p className="mt-4 text-[9px] uppercase tracking-[3px] text-[#cfa75e] ubuntu-medium sm:mt-5 sm:text-[10px] sm:tracking-[4px]">
                      Sealed Until A Certain Day
                    </p>

                    <h2 className="mt-3 cormorant text-[1.6rem] italic leading-tight text-[#fff2f7] sm:mt-4 sm:text-[2rem]">
                      Before you see the cake, {recipientName}...
                    </h2>

                    <p className="mt-3 max-w-[320px] text-[0.85rem] leading-6 text-[#e7d8df]/80 sm:mt-4 sm:text-[0.92rem]">
                      Only someone who knows me well could open this.
                      Enter the date that started it all.
                    </p>

                    <form
                      onSubmit={handleSubmit}
                      className="mt-7 flex w-full flex-col items-center gap-5 sm:mt-8"
                    >
                      <div className="flex items-center gap-3">
                        <DateBox
                          ref={dayRef}
                          value={day}
                          onChange={handleDayChange}
                          placeholder="DD"
                          status={status}
                        />
                        <span className="cormorant text-[1.8rem] italic text-[#f6d27a]/60 sm:text-[2.1rem]">
                          /
                        </span>
                        <DateBox
                          ref={monthRef}
                          value={month}
                          onChange={handleMonthChange}
                          onKeyDown={handleMonthKeyDown}
                          placeholder="MM"
                          status={status}
                        />
                      </div>

                      <button
                        type="submit"
                        className="group relative inline-flex w-full items-center justify-center gap-2.5 overflow-hidden rounded-full border border-[#f6d27a]/40 bg-gradient-to-b from-[#f6d27a]/25 to-[#f6d27a]/[0.08] px-6 py-3.5 text-[#fff2f7] shadow-[0_8px_24px_-8px_rgba(246,210,122,0.45)] transition duration-300 hover:scale-[1.02] hover:shadow-[0_10px_30px_-6px_rgba(246,210,122,0.6)] active:scale-[0.99] sm:w-auto sm:px-9"
                      >
                        <span className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(circle_at_top,rgba(246,210,122,0.22),transparent_60%)] opacity-90" />
                        <Sparkles size={15} className="relative z-10 shrink-0 text-[#f6d27a]" />
                        <span className="relative z-10 cormorant text-[1.05rem] italic sm:text-[1.1rem]">
                          Unlock
                        </span>
                      </button>

                      <AnimatePresence>
                        {status === "error" && (
                          <motion.p
                            initial={{ opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="text-[0.8rem] italic text-[#f8d8e6]/70"
                          >
                            {attempts >= 3
                              ? "Still locked — think back to that day together."
                              : "That's not quite the date. Try again."}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </form>
                  </div>
                </motion.div>
              </motion.div>
            ) : (
              <motion.div
                key="lock-success"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center text-center"
              >
                <motion.div
                  initial={{ scale: 1 }}
                  animate={{ scale: [1, 1.15, 1] }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="flex h-16 w-16 items-center justify-center rounded-full border border-[#f6d27a]/40 bg-[#f6d27a]/[0.1] shadow-[0_0_40px_-4px_rgba(246,210,122,0.6)]"
                >
                  <motion.div
                    initial={{ rotate: -8 }}
                    animate={{ rotate: 12 }}
                    transition={{ duration: 0.5, ease: "backOut" }}
                  >
                    <LockOpen size={26} className="text-[#f6d27a]" strokeWidth={1.6} />
                  </motion.div>
                </motion.div>

                <motion.p
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25, duration: 0.6 }}
                  className="mt-5 cormorant text-[1.4rem] italic text-[#fff2f7] sm:text-[1.7rem]"
                >
                  It's unlocked ✨
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </StarfieldBackground>
    </section>
  );
}

/* Single digit-pair input box, styled like the rest of the foil system */
const DateBox = forwardRef(function DateBox(
  { value, onChange, onKeyDown, placeholder, status },
  ref
) {
  return (
    <input
      ref={ref}
      type="text"
      inputMode="numeric"
      autoComplete="off"
      maxLength={2}
      value={value}
      onChange={onChange}
      onKeyDown={onKeyDown}
      placeholder={placeholder}
      className={`h-16 w-16 rounded-[14px] border bg-white/[0.03] text-center cormorant text-[1.8rem] italic text-[#fff2f7] outline-none backdrop-blur-xl transition-colors duration-300 placeholder:text-[#fff2f7]/20 focus:border-[#f6d27a]/60 sm:h-[72px] sm:w-[72px] sm:text-[2rem] ${
        status === "error"
          ? "border-[#f8d8e6]/50"
          : "border-[#f6d27a]/[0.25]"
      }`}
    />
  );
});