import { useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import "./App.scss";
import bgMusic from "./assets/Toy Story - You've Got a Friend in Me (Instrumental) [ustrOyrmLOA].mp3";
import fondoNubesImg from "./assets/decoration/FONDO DE NUBES.svg";
import pisoMaderaImg from "./assets/decoration/PISO DE MADERA.webp";
import afficheImg from "./assets/decoration/AFICHE.webp";
import sheriffMasonImg from "./assets/decoration/EL SHERIFF MASON.svg";
import estrellaImg from "./assets/decoration/ESTRELLA.svg";
import buzzImg from "./assets/characters/BUZZ.webp";
import alienImg from "./assets/characters/ALIEN.webp";
import woodyImg from "./assets/characters/WOODY.webp";
import jessieImg from "./assets/characters/JESSIE.webp";
import rexImg from "./assets/characters/REX.webp";
import hammImg from "./assets/characters/HAMM.webp";
import slinkyImg from "./assets/characters/SLINKY.webp";
import srPapaImg from "./assets/characters/SR CARA DE PAPA.webp";
import tiroImg from "./assets/characters/TIRO AL BLANCO.webp";

function App() {
  const { t } = useTranslation();
  const [scrollProgress, setScrollProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      // Calculate how far down we've scrolled (0 to 1)
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const maxScroll = documentHeight - windowHeight;
      const currentScroll = window.scrollY;

      const progress = Math.min(Math.max(currentScroll / maxScroll, 0), 1);
      setScrollProgress(progress);

      // Update audio volume and try to play if stopped
      if (audioRef.current) {
        // Fade volume from 0 to 0.5 max based on progress
        audioRef.current.volume = progress * 0.5;

        if (progress > 0) {
          if (audioRef.current.paused) {
            audioRef.current.play().catch(() => {
              // Browser might block autoplay without explicit click interaction first
            });
          }
        } else {
          // Pause entirely when the door is fully closed
          if (!audioRef.current.paused) {
            audioRef.current.pause();
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    // Attempt to start playing at volume 0 immediately (browsers may require interaction first)
    if (audioRef.current) {
      audioRef.current.volume = 0;
      audioRef.current.play().catch(() => {});
    }

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const doorOpenProgress = Math.min(scrollProgress * 1.5, 1);
  const zoomProgress = Math.max(0, (scrollProgress - 0.6) * 2.5);

  // 9 fixed slots around the screen border.
  // Corners slide in diagonally; sides slide in straight.
  // peek = how much of the character (%) stays visible at rest.
  // rotate = degrees (positive = clockwise).
  const CHARACTERS = [
    {
      src: woodyImg,
      pos: "top-center",
      size: 255,
      peek: 45,
      delay: 0,
      rotate: 180,
    },
    {
      src: buzzImg,
      pos: "right-lower",
      size: 330,
      peek: 40,
      delay: 0.1,
      rotate: -90,
    },
    {
      src: tiroImg,
      pos: "left-upper",
      size: 188,
      peek: 50,
      delay: 0.22,
      rotate: 90,
    },
    {
      src: slinkyImg,
      pos: "left-lower",
      size: 225,
      peek: 52,
      delay: 0.2,
      rotate: 90,
    },
    {
      src: jessieImg,
      pos: "right-upper",
      size: 250,
      peek: 42,
      delay: 0.08,
      rotate: -90,
    },
    {
      src: srPapaImg,
      pos: "top-left",
      size: 180,
      peek: 60,
      delay: 0.28,
      rotate: 140,
    },
    {
      src: alienImg,
      pos: "bottom-right",
      size: 205,
      peek: 60,
      delay: 0.25,
      rotate: 320,
    },
    {
      src: rexImg,
      pos: "bottom-left",
      size: 245,
      peek: 50,
      delay: 0.12,
      rotate: -320,
    },
    {
      src: hammImg,
      pos: "top-right",
      size: 215,
      peek: 60,
      delay: 0.16,
      rotate: 200,
    },
  ] as const;

  type CharPos = (typeof CHARACTERS)[number]["pos"];

  const getCharStyle = (
    pos: CharPos,
    size: number,
    peek: number,
    delay: number,
    rotate: number,
  ): React.CSSProperties => {
    const p = Math.max(0, Math.min(1, zoomProgress * 2.5 - delay));
    const rot = rotate !== 0 ? ` rotate(${rotate}deg)` : "";
    // size is expressed as px at a 1440px reference viewport.
    // Converting to vw keeps the character proportional to the screen,
    // so peek% looks the same regardless of device size.
    const b: React.CSSProperties = { width: `${(size / 1440) * 100}vw` };
    // Corners: diagonal slide — both axes move simultaneously
    // Sides:   straight slide — single axis
    switch (pos) {
      case "top-left":
        return {
          ...b,
          top: 0,
          left: 0,
          transform: `translate(${-100 + p * peek}%, ${-100 + p * peek}%)${rot}`,
        };
      case "top-center":
        return {
          ...b,
          top: 0,
          left: "50%",
          transform: `translate(-50%, ${-100 + p * peek}%)${rot}`,
        };
      case "top-right":
        return {
          ...b,
          top: 0,
          right: 0,
          transform: `translate(${100 - p * peek}%, ${-100 + p * peek}%)${rot}`,
        };
      case "left-upper":
        return {
          ...b,
          top: "22%",
          left: 0,
          transform: `translateX(${-100 + p * peek}%)${rot}`,
        };
      case "left-lower":
        return {
          ...b,
          top: "62%",
          left: 0,
          transform: `translateX(${-100 + p * peek}%)${rot}`,
        };
      case "right-upper":
        return {
          ...b,
          top: "22%",
          right: 0,
          transform: `translateX(${100 - p * peek}%)${rot}`,
        };
      case "right-lower":
        return {
          ...b,
          top: "62%",
          right: 0,
          transform: `translateX(${100 - p * peek}%)${rot}`,
        };
      case "bottom-left":
        return {
          ...b,
          bottom: 0,
          left: 0,
          transform: `translate(${-100 + p * peek}%, ${100 - p * peek}%)${rot}`,
        };
      case "bottom-right":
        return {
          ...b,
          bottom: 0,
          right: 0,
          transform: `translate(${100 - p * peek}%, ${100 - p * peek}%)${rot}`,
        };
    }
  };

  const handleDoorClick = () => {
    // Explicitly try to play on click to unlock audio context in browsers
    if (audioRef.current && audioRef.current.paused) {
      audioRef.current.play().catch(() => {});
    }
    // Automatically open the invitation by scrolling to the bottom
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "smooth",
    });
  };

  // April 26, 2026 — party starts 4 PM CEST (San Fernando, Cádiz — UTC+2)
  // Cake & singing at 7 PM CEST — both displayed in the viewer's local timezone
  const startTime = new Date("2026-04-26T16:00:00+02:00");

  const formatOptions: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  };

  const localStart = startTime.toLocaleTimeString([], formatOptions);
  const cakeTime = new Date("2026-04-26T19:00:00+02:00");
  const localCake = cakeTime.toLocaleTimeString([], formatOptions);

  const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
  const dayName = cap(
    startTime.toLocaleDateString(undefined, { weekday: "long" }),
  );
  const dayNumber = startTime.toLocaleDateString(undefined, { day: "numeric" });
  const monthName = cap(
    startTime.toLocaleDateString(undefined, { month: "long" }),
  );

  return (
    <div className="birthday-app">
      {/*
        This empty div creates the artificial scroll height.
        We use it to drive the scroll animation while the actual content stays fixed.
      */}
      <div className="scroll-track" />

      {/* Hidden audio element */}
      <audio ref={audioRef} src={bgMusic} loop preload="auto" />

      {/* The visible UI container, fixed position */}
      <div className="fixed-container">
        {/* The Invitation Content (behind the door) */}
        <div
          className="invitation-content"
          style={{
            opacity: doorOpenProgress,
            transform: `scale(${0.9 + scrollProgress * 0.1})`,
          }}
        >
          {/* Invitation room background: clouds wall */}
          <img src={fondoNubesImg} alt="" className="room-bg" />
          {/* Invitation room floor: wooden planks */}
          <img src={pisoMaderaImg} alt="" className="room-floor" />

          <div className="card">
            <img src={afficheImg} alt="" className="card-bg" />
            <img
              src={sheriffMasonImg}
              alt={t("subtitle")}
              className="card-title"
            />

            <p className="message">
              {t("message")
                .split("\n")
                .map((line, i, arr) => (
                  <span key={i}>
                    {line}
                    {i < arr.length - 1 && <br />}
                  </span>
                ))}
            </p>

            <div className="details">
              {/* Date banner: day ── star(date/month) ── time */}
              <div className="date-banner">
                <span className="date-day">{dayName}</span>
                <div className="date-star-wrap">
                  <img src={estrellaImg} alt="" className="date-star-img" />
                  <div className="date-star-text">
                    <span className="date-number">{dayNumber}</span>
                    <span className="date-month">{monthName}</span>
                  </div>
                </div>
                <span className="date-time">{localStart}</span>
              </div>

              <div className="location">
                <p className="cake-note">
                  🎂 {t("cake_note", { time: localCake })}
                </p>
                <p className="location-name">
                  <span className="location-pin">📍</span>
                  {t("location_name")}
                </p>
                {t("location_address")
                  .split("\n")
                  .map((line, i) => (
                    <p key={i} className="location-address">
                      {line}
                    </p>
                  ))}
              </div>
            </div>

            <div className="actions">
              <a
                href={`https://wa.me/34614822042?text=${encodeURIComponent(t("rsvp_message"))}`}
                target="_blank"
                rel="noopener noreferrer"
                className="rsvp-btn"
              >
                {t("rsvp")}
              </a>
              <a
                href="https://meet.google.com/oja-hndh-sff"
                target="_blank"
                rel="noopener noreferrer"
                className="meet-btn"
              >
                {t("meet")}
              </a>
            </div>
          </div>
        </div>

        {/* The 3D Room and Door */}
        <div
          className="room-scene"
          style={{
            transform: `scale(${1 + zoomProgress * 10})`,
            opacity: 1 - Math.max(0, zoomProgress),
          }}
        >
          {/* Scroll down indicator when door is closed */}
          <div
            className="scroll-indicator"
            style={{ opacity: 1 - scrollProgress * 5 }}
          >
            <p>{t("scroll_hint")}</p>
            <div className="arrow">↓</div>
          </div>

          <div
            className="door-frame"
            onClick={handleDoorClick}
            style={{ pointerEvents: zoomProgress > 0 ? "none" : "auto" }}
          >
            {/* The single white door */}
            <div
              className="door"
              style={{
                // Open inwards (negative rotation) up to -110 degrees
                transform: `rotateY(${-110 * doorOpenProgress}deg)`,
              }}
            >
              <div className="door-panel"></div>
              <div className="door-panel"></div>
              <div className="door-handle"></div>
            </div>
          </div>
        </div>

        {/* Toy Story characters peeking from the screen edges */}
        <div className="characters-layer">
          {CHARACTERS.map((char, i) => {
            const charProgress = Math.max(
              0,
              Math.min(1, zoomProgress * 2.5 - char.delay),
            );
            return (
              <div
                key={i}
                className="char-wrapper"
                style={getCharStyle(
                  char.pos,
                  char.size,
                  char.peek,
                  char.delay,
                  char.rotate,
                )}
              >
                <img
                  src={char.src}
                  alt=""
                  className="character"
                  style={{
                    animationDelay: `${char.delay * 3}s`,
                    animationPlayState: charProgress > 0 ? "running" : "paused",
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default App;
