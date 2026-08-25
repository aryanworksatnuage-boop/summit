"use client";

import { KeyboardEvent, useEffect, useRef, useState } from "react";

type Letter = {
  id: number;
  value: string;
  x: number;
  drift: number;
  spin: number;
  color: string;
};

const colors = ["#8b7cff", "#c3baff", "#78dcca", "#f3a8c4", "#f6d477"];

export default function Home() {
  const [thought, setThought] = useState("");
  const [letters, setLetters] = useState<Letter[]>([]);
  const [sent, setSent] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const nextId = useRef(0);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const celebrate = (value: string) => {
    const id = nextId.current++;
    const letter: Letter = {
      id,
      value,
      x: 8 + Math.random() * 84,
      drift: -90 + Math.random() * 180,
      spin: -200 + Math.random() * 400,
      color: colors[id % colors.length],
    };

    setLetters((current) => [...current.slice(-34), letter]);
    window.setTimeout(() => {
      setLetters((current) => current.filter((item) => item.id !== id));
    }, 1500);
  };

  const scream = () => {
    if (!thought.trim()) return;
    thought
      .trim()
      .slice(0, 70)
      .split("")
      .forEach((letter, index) => window.setTimeout(() => celebrate(letter), index * 14));
    setThought("");
    setSent(true);
    window.setTimeout(() => setSent(false), 1800);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
      event.preventDefault();
      scream();
      return;
    }
    if (event.key === "Escape") {
      setThought("");
      return;
    }
    if (event.key.length === 1 && !event.metaKey && !event.ctrlKey && !event.altKey) {
      celebrate(event.key === " " ? "•" : event.key);
    }
  };

  return (
    <main>
      <div className="glow" aria-hidden="true" />
      <div className="confetti" aria-hidden="true">
        {letters.map((letter) => (
          <span
            className="letter"
            key={letter.id}
            style={{
              left: `${letter.x}%`,
              color: letter.color,
              "--drift": `${letter.drift}px`,
              "--spin": `${letter.spin}deg`,
            } as React.CSSProperties}
          >
            {letter.value}
          </span>
        ))}
      </div>

      <nav>
        <a className="brand" href="#" aria-label="Leaf home">
          <span className="mark">L</span>
          leaf
        </a>
        <span className="status"><i /> private by design</span>
      </nav>

      <section className="hero">
        <div className="eyebrow">A quiet space for loud thoughts</div>
        <h1>Scream into<br /><em>the void.</em></h1>
        <p className="intro">No feed. No likes. No one listening.<br />Just you and whatever needs to come out.</p>

        <div className="composer">
          <label htmlFor="thought">What&apos;s loud in your head?</label>
          <textarea
            id="thought"
            ref={inputRef}
            value={thought}
            maxLength={280}
            onChange={(event) => setThought(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type it out..."
            aria-describedby="composer-help"
          />
          <div className="composer-footer" id="composer-help">
            <span>{thought.length}<small>/280</small></span>
            <div className="actions">
              <span className="hint"><kbd>esc</kbd> clear</span>
              <button type="button" onClick={scream} disabled={!thought.trim()}>
                {sent ? "Released" : "Scream"}
                <span><kbd>⌘</kbd><kbd>↵</kbd></span>
              </button>
            </div>
          </div>
        </div>
        <p className={`release ${sent ? "visible" : ""}`} role="status">Gone. Take a breath.</p>
      </section>

      <footer><span>Nothing is saved.</span><span>Made for messy minds.</span></footer>
    </main>
  );
}
