import { useEffect, useRef } from "react";

function StarfieldBackground({
  className = "",
  children,
  count = 400,
  speed = 0.5,
  starColor = "#ffffff",
  twinkle = true,
}) {

  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {

    const canvas = canvasRef.current;
    const container = containerRef.current;

    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    let rect = container.getBoundingClientRect();

    let width = rect.width;
    let height = rect.height;

    canvas.width = width;
    canvas.height = height;

    let animationId;
    let tick = 0;

    const maxDepth = 1500;

    // CREATE STAR

    const createStar = (initialZ) => ({
      x: (Math.random() - 0.5) * width * 2,
      y: (Math.random() - 0.5) * height * 2,
      z: initialZ ?? Math.random() * maxDepth,
      twinkleSpeed: Math.random() * 0.02 + 0.01,
      twinkleOffset: Math.random() * Math.PI * 2,
    });

    const stars = Array.from(
      { length: count },
      () => createStar()
    );

    // RESIZE

    const handleResize = () => {

      rect = container.getBoundingClientRect();

      width = rect.width;
      height = rect.height;

      canvas.width = width;
      canvas.height = height;

    };

    const ro = new ResizeObserver(handleResize);

    ro.observe(container);

    // ANIMATION

    const animate = () => {

      tick++;

      ctx.fillStyle = "rgba(10,10,15,0.2)";
      ctx.fillRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;

      for (const star of stars) {

        star.z -= speed * 2;

        // RESET STAR

        if (star.z <= 0) {

          star.x = (Math.random() - 0.5) * width * 2;
          star.y = (Math.random() - 0.5) * height * 2;
          star.z = maxDepth;

        }

        // PROJECT

        const scale = 400 / star.z;

        const x = cx + star.x * scale;
        const y = cy + star.y * scale;

        // SKIP OFFSCREEN

        if (
          x < -10 ||
          x > width + 10 ||
          y < -10 ||
          y > height + 10
        ) continue;

        // SIZE

        const size = Math.max(
          0.5,
          (1 - star.z / maxDepth) * 3
        );

        // OPACITY

        let opacity =
          (1 - star.z / maxDepth) * 0.9 + 0.1;

        // TWINKLE

        if (
          twinkle &&
          star.twinkleSpeed > 0.015
        ) {

          opacity *=
            0.7 +
            0.3 *
            Math.sin(
              tick *
              star.twinkleSpeed +
              star.twinkleOffset
            );

        }

        // DRAW STAR

        ctx.beginPath();

        ctx.arc(
          x,
          y,
          size,
          0,
          Math.PI * 2
        );

        ctx.fillStyle = starColor;

        ctx.globalAlpha = opacity;

        ctx.fill();

        // STREAKS

        if (
          star.z < maxDepth * 0.3 &&
          speed > 0.3
        ) {

          const streakLength =
            (1 - star.z / maxDepth) *
            speed *
            8;

          const angle = Math.atan2(
            star.y,
            star.x
          );

          ctx.beginPath();

          ctx.moveTo(x, y);

          ctx.lineTo(
            x - Math.cos(angle) * streakLength,
            y - Math.sin(angle) * streakLength
          );

          ctx.strokeStyle = starColor;

          ctx.globalAlpha = opacity * 0.3;

          ctx.lineWidth = size * 0.5;

          ctx.stroke();

        }

      }

      ctx.globalAlpha = 1;

      animationId =
        requestAnimationFrame(animate);

    };

    // INITIAL BG

    ctx.fillStyle = "#0a0a0f";

    ctx.fillRect(0, 0, width, height);

    animationId =
      requestAnimationFrame(animate);

    return () => {

      cancelAnimationFrame(animationId);

      ro.disconnect();

    };

  }, [count, speed, starColor, twinkle]);

  return (

    <div
      ref={containerRef}
      className={`
      relative
      w-full
      min-h-screen
      bg-[#0a0a0f]
      overflow-hidden
      ${className}
      `}
    >

      {/* CANVAS */}

      <canvas
        ref={canvasRef}
        className="
        absolute
        inset-0
        w-full
        h-full
        "
      />

      {/* NEBULA GLOW */}

      <div
        className="
        pointer-events-none
        absolute
        inset-0
        opacity-30
        "
        style={{
          background: `
            radial-gradient(
              ellipse at 30% 40%,
              rgba(255, 0, 128, 0.15) 0%,
              transparent 50%
            ),

            radial-gradient(
              ellipse at 70% 60%,
              rgba(120, 0, 255, 0.12) 0%,
              transparent 50%
            )
          `,
        }}
      />

      {/* VIGNETTE */}

      <div
        className="
        pointer-events-none
        absolute
        inset-0
        "
        style={{
          background: `
            radial-gradient(
              ellipse at center,
              transparent 0%,
              transparent 40%,
              rgba(5,5,10,0.35) 100%
            )
          `,
        }}
      />

      {/* CONTENT */}

      {children && (

        <div
          className="
          relative
          z-10
          w-full
          "
        >

          {children}

        </div>

      )}

    </div>
  );
}

export default StarfieldBackground;