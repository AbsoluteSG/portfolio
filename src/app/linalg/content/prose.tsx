/** Typography for chapter bodies. Server components: no state, no hooks. */

export const H = ({ children }: { children: React.ReactNode }) => (
  <h2 className="la-display mt-12 mb-4 text-2xl md:text-3xl">{children}</h2>
);

/** An inline mathematical expression, set in the serif face. */
export const M = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <span className={`la-m ${className ?? ""}`}>{children}</span>
);

/** A display equation, centred, on its own line. */
export const Eq = ({ children, note }: { children: React.ReactNode; note?: React.ReactNode }) => (
  <div className="la-display-eq">
    <div className="la-m">{children}</div>
    {note && <p className="la-display-eq-note">{note}</p>}
  </div>
);

/** The idea worth carrying to the next chapter. */
export const Key = ({ children }: { children: React.ReactNode }) => (
  <aside className="la-key">
    <p className="la-eyebrow">The idea</p>
    <div className="mt-2">{children}</div>
  </aside>
);

/** An aside for a caveat, a name, or a piece of history. */
export const Note = ({ label = "Note", children }: { label?: string; children: React.ReactNode }) => (
  <aside className="la-note">
    <span className="la-note-label">{label}</span>
    <div>{children}</div>
  </aside>
);

/** Points at the interactive above the prose. */
export const Try = ({ children }: { children: React.ReactNode }) => (
  <aside className="la-try">
    <p className="la-eyebrow">On the stage above</p>
    <div className="mt-2">{children}</div>
  </aside>
);

export const Steps = ({ children }: { children: React.ReactNode }) => <ol className="la-steps">{children}</ol>;
export const Bullets = ({ children }: { children: React.ReactNode }) => <ul className="la-bullets">{children}</ul>;

/** A small inline vertical fraction, matching the stages. */
export const F = ({ n, d }: { n: React.ReactNode; d: React.ReactNode }) => (
  <span className="la-inline-frac">
    <span className="la-frac-stack"><span>{n}</span><span>{d}</span></span>
  </span>
);

/** A bracketed matrix or column vector, from rows of plain content. */
export const Mx = ({ rows }: { rows: React.ReactNode[][] }) => (
  <span className="la-mx">
    <span className="la-mx-bracket" aria-hidden />
    <span className="la-mx-grid" style={{ gridTemplateColumns: `repeat(${rows[0].length}, auto)` }}>
      {rows.flatMap((row, r) => row.map((cell, c) => <span key={`${r}-${c}`} className="la-mx-cell">{cell}</span>))}
    </span>
    <span className="la-mx-bracket la-mx-bracket-r" aria-hidden />
  </span>
);

/* ── Worked problem-solving ── */

/** A worked example: the problem, then every step, then the answer. */
export const Example = ({ title, children }: { title: React.ReactNode; children: React.ReactNode }) => (
  <section className="la-ex">
    <p className="la-ex-title">{title}</p>
    {children}
  </section>
);

/** The problem statement, set apart at the top of an example. */
export const Given = ({ children }: { children: React.ReactNode }) => <div className="la-ex-given">{children}</div>;

/** One step of a solution: what you do, why, and the result. */
export const Step = ({ do: label, children }: { do: React.ReactNode; children: React.ReactNode }) => (
  <div className="la-ex-step">
    <p className="la-ex-step-label">{label}</p>
    <div className="la-ex-step-body">{children}</div>
  </div>
);

/** The row operation being performed, e.g. R₂ → R₂ − 2R₁. */
export const Op = ({ children }: { children: React.ReactNode }) => <span className="la-op">{children}</span>;

/** The result line of an example. */
export const Answer = ({ children }: { children: React.ReactNode }) => (
  <div className="la-ex-answer">
    <span className="la-ex-answer-label">Answer</span>
    <div>{children}</div>
  </div>
);

/** The recipe: the steps to follow on any problem of this type. */
export const Method = ({ title = "The method", children }: { title?: string; children: React.ReactNode }) => (
  <section className="la-method">
    <p className="la-eyebrow">{title}</p>
    <ol className="la-method-steps">{children}</ol>
  </section>
);

/** Mistakes that cost marks. */
export const Pitfall = ({ children }: { children: React.ReactNode }) => (
  <aside className="la-pitfall">
    <span className="la-pitfall-label">Where marks get lost</span>
    <div>{children}</div>
  </aside>
);

/** A row of matrices with arrows between them, for showing a reduction in one line. */
export const Chain = ({ children }: { children: React.ReactNode }) => <div className="la-chain">{children}</div>;

/** The arrow between two stages of a reduction, optionally labelled with the operation. */
export const To = ({ label }: { label?: React.ReactNode }) => (
  <span className="la-to">
    <span className="la-to-arrow">→</span>
    {label && <span className="la-to-label">{label}</span>}
  </span>
);
