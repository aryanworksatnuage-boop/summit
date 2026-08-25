"use client";

import { KeyboardEvent, useEffect, useRef, useState } from "react";

const palettes = {
  violet: ["#8b7cff", "#c3baff", "#78dcca", "#f3a8c4", "#f6d477"],
  ember: ["#ff6b5f", "#ff9f43", "#ffd166", "#f76f8e", "#fff0c2"],
  ocean: ["#39c6d4", "#68a7ff", "#86efcf", "#b8c0ff", "#e0fbfc"],
  mono: ["#ffffff", "#d4d4d8", "#a1a1aa", "#71717a", "#e4e4e7"],
} as const;

const fonts = [
  ["Inter", "Inter, ui-sans-serif, system-ui, sans-serif"],
  ["System", "ui-sans-serif, system-ui, sans-serif"],
  ["Avenir", "Avenir, 'Avenir Next', sans-serif"],
  ["Helvetica", "Helvetica, Arial, sans-serif"],
  ["Georgia", "Georgia, serif"],
  ["Garamond", "Garamond, 'Times New Roman', serif"],
  ["Palatino", "Palatino, 'Book Antiqua', serif"],
  ["Courier", "'Courier New', monospace"],
  ["Trebuchet", "'Trebuchet MS', sans-serif"],
  ["Verdana", "Verdana, Geneva, sans-serif"],
  ["Times", "'Times New Roman', Times, serif"],
  ["Monospace", "ui-monospace, SFMono-Regular, Consolas, monospace"],
] as const;

type Palette = keyof typeof palettes;
type Settings = { palette: Palette; font: string; shake: boolean };
const defaults: Settings = { palette: "violet", font: fonts[0][1], shake: true };
const storageKey = "leaf-settings";

export default function Home() {
  const [thought, setThought] = useState("");
  const [sent, setSent] = useState(false);
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState<Settings>(defaults);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const confettiRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const composerRef = useRef<HTMLDivElement>(null);
  const settingsButtonRef = useRef<HTMLButtonElement>(null);
  const nextLetter = useRef(0);

  useEffect(() => {
    try {
      const saved = JSON.parse(sessionStorage.getItem(storageKey) || "null");
      if (saved && palettes[saved.palette as Palette] && fonts.some((font) => font[1] === saved.font)) {
        setSettings({ palette: saved.palette, font: saved.font, shake: Boolean(saved.shake) });
      }
    } catch { /* Ignore malformed session data. */ }
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    document.documentElement.style.setProperty("--font-app", settings.font);
    try { sessionStorage.setItem(storageKey, JSON.stringify(settings)); } catch { /* Storage may be unavailable. */ }
  }, [settings]);

  useEffect(() => {
    if (!open) return;
    const dialog = dialogRef.current;
    const focusable = dialog?.querySelectorAll<HTMLElement>("button, select, input");
    focusable?.[0]?.focus();
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") { setOpen(false); settingsButtonRef.current?.focus(); return; }
      if (event.key !== "Tab" || !focusable?.length) return;
      const first = focusable[0], last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  // Imperative, pooled DOM nodes keep rapid typing from causing React renders.
  const celebrate = (value: string) => {
    const layer = confettiRef.current;
    if (!layer) return;
    const index = nextLetter.current++;
    let letter = layer.children[index % 36] as HTMLSpanElement | undefined;
    if (!letter) { letter = document.createElement("span"); letter.className = "letter"; layer.appendChild(letter); }
    letter.textContent = value;
    letter.style.left = `${8 + Math.random() * 84}%`;
    letter.style.color = palettes[settings.palette][index % 5];
    letter.style.setProperty("--drift", `${-90 + Math.random() * 180}px`);
    letter.style.setProperty("--spin", `${-200 + Math.random() * 400}deg`);
    letter.classList.remove("flying");
    void letter.offsetWidth;
    letter.classList.add("flying");
  };

  const scream = () => {
    if (!thought.trim()) return;
    thought.trim().slice(0, 70).split("").forEach((letter, index) => window.setTimeout(() => celebrate(letter), index * 14));
    if (settings.shake && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const composer = composerRef.current;
      composer?.classList.remove("shaking"); void composer?.offsetWidth; composer?.classList.add("shaking");
    }
    setThought(""); setSent(true); window.setTimeout(() => setSent(false), 1800);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if ((event.metaKey || event.ctrlKey) && event.key === "Enter") { event.preventDefault(); scream(); return; }
    if (event.key === "Escape") { setThought(""); return; }
    if (event.key.length === 1 && !event.metaKey && !event.ctrlKey && !event.altKey) celebrate(event.key === " " ? "•" : event.key);
  };

  const update = (patch: Partial<Settings>) => setSettings((current) => ({ ...current, ...patch }));

  return <main>
    <div className="glow" aria-hidden="true" /><div className="confetti" ref={confettiRef} aria-hidden="true" />
    <nav>
      <a className="brand" href="#" aria-label="Leaf home"><span className="mark">L</span>leaf</a>
      <div className="nav-actions"><span className="status"><i /> private by design</span>
        <button ref={settingsButtonRef} className="settings-button" type="button" aria-label="Open settings" aria-haspopup="dialog" aria-expanded={open} onClick={() => setOpen((value) => !value)}>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 15.2a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4Zm7-3.2a7 7 0 0 0-.1-1l2-1.5-2-3.4-2.4 1a7.5 7.5 0 0 0-1.7-1L14.5 3h-5l-.3 3a7.5 7.5 0 0 0-1.7 1l-2.4-1-2 3.4 2 1.5a7 7 0 0 0 0 2.1l-2 1.5 2 3.4 2.4-1a7.5 7.5 0 0 0 1.7 1l.3 3h5l.3-3a7.5 7.5 0 0 0 1.7-1l2.4 1 2-3.4-2-1.5a7 7 0 0 0 .1-1Z" /></svg>
        </button>
        {open && <><button className="settings-scrim" aria-label="Close settings" onClick={() => setOpen(false)} /><div className="settings-panel" ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="settings-title">
          <div className="settings-heading"><div><span>Preferences</span><h2 id="settings-title">Make it yours</h2></div><button className="close" onClick={() => setOpen(false)} aria-label="Close settings">×</button></div>
          <label>Letter palette<select value={settings.palette} onChange={(e) => update({ palette: e.target.value as Palette })}>{Object.keys(palettes).map((palette) => <option key={palette} value={palette}>{palette[0].toUpperCase() + palette.slice(1)}</option>)}</select></label>
          <div className="palette-preview" aria-hidden="true">{palettes[settings.palette].map((color) => <i key={color} style={{ background: color }} />)}</div>
          <label>App font<select value={settings.font} onChange={(e) => update({ font: e.target.value })}>{fonts.map(([name, value]) => <option key={name} value={value}>{name}</option>)}</select></label>
          <label className="toggle-row"><span><b>Release shake</b><small>Shake the composer when you scream</small></span><input type="checkbox" checked={settings.shake} onChange={(e) => update({ shake: e.target.checked })} /><i aria-hidden="true" /></label>
          <p>Saved for this browser session.</p>
        </div></>}
      </div>
    </nav>
    <section className="hero"><div className="eyebrow">A quiet space for loud thoughts</div><h1>Scream into<br /><em>the void.</em></h1><p className="intro">No feed. No likes. No one listening.<br />Just you and whatever needs to come out.</p>
      <div className="composer" ref={composerRef} onAnimationEnd={() => composerRef.current?.classList.remove("shaking")}><label htmlFor="thought">What&apos;s loud in your head?</label><textarea id="thought" ref={inputRef} value={thought} maxLength={280} onChange={(e) => setThought(e.target.value)} onKeyDown={handleKeyDown} placeholder="Type it out..." aria-describedby="composer-help" />
        <div className="composer-footer" id="composer-help"><span>{thought.length}<small>/280</small></span><div className="actions"><span className="hint"><kbd>esc</kbd> clear</span><button type="button" onClick={scream} disabled={!thought.trim()}>{sent ? "Released" : "Scream"}<span><kbd>⌘</kbd><kbd>↵</kbd></span></button></div></div>
      </div><p className={`release ${sent ? "visible" : ""}`} role="status">Gone. Take a breath.</p>
    </section><footer><span>Nothing is saved.</span><span>Made for messy minds.</span></footer>
  </main>;
}
